package com.api.nature_harvest_backend.services.comment;

import com.api.nature_harvest_backend.dtos.CommentDto;
import com.api.nature_harvest_backend.exceptions.DataNotFoundException;
import com.api.nature_harvest_backend.exceptions.InvalidParamException;
import com.api.nature_harvest_backend.models.*;
import com.api.nature_harvest_backend.repositories.*;
import com.api.nature_harvest_backend.responses.comment.CommentListResponse;
import com.api.nature_harvest_backend.responses.comment.CommentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class CommentService implements ICommentService {
    private final CommentRepository commentRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final RatingRepository ratingRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final CommentPictureRepository commentPictureRepository;

    @Override
    @Transactional
    public Comment insertComment(CommentDto commentDto, User user) throws Exception {
        // Validate and fetch required entities
        Product product = productRepository.findById(commentDto.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        Order order = orderRepository.findById(commentDto.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        OrderDetail orderDetail = orderDetailRepository.findByOrderAndProduct(order, product);

        if (user == null || orderDetail == null) {
            throw new IllegalArgumentException("User or order details not found");
        }

        if (!order.getStatus().equals(OrderStatus.SUCCESSFUL_DELIVERY)) {
            throw new Exception("Order not completed");
        }

        // Handle existing rating
        Rating existingRating = ratingRepository.findByProductIdAndUserId(product.getId(), user.getId());
        if (existingRating != null) {
            existingRating.setRating(commentDto.getStarRating());
            existingRating.setUpdatedAt(LocalDateTime.now());
            ratingRepository.save(existingRating);
        } else {
            Rating rating = Rating.builder()
                    .rating(commentDto.getStarRating())
                    .product(product)
                    .user(user)
                    .build();
            ratingRepository.save(rating);
        }

        // Update product average rating
        updateProductAverageRating(product);

        // Create and save new comment
        Comment newComment = Comment.builder()
                .user(user)
                .product(product)
                .content(commentDto.getContent())
                .starRating(commentDto.getStarRating())
                .hasPicture(commentDto.getPictures() != null && !commentDto.getPictures().isEmpty())
                .build();

        Comment savedComment = commentRepository.save(newComment);

        // Handle comment pictures
        if (newComment.isHasPicture()) {
            List<CommentPicture> commentPictures = new ArrayList<>();
            for (String picture : commentDto.getPictures()) {
                if (commentPictures.size() >= CommentPicture.MAXIMUM_IMAGES_PER_COMMENT) {
                    throw new InvalidParamException("Number of pictures must be <= " + CommentPicture.MAXIMUM_IMAGES_PER_COMMENT);
                }
                CommentPicture commentPicture = CommentPicture.builder()
                        .comment(savedComment)
                        .pictureUrl(picture)
                        .build();
                commentPictures.add(commentPicture);
            }
            commentPictureRepository.saveAll(commentPictures);
        }

        orderDetail.setReviewed(true);

        boolean allOrderDetailsReviewed = orderDetailRepository.allOrderDetailsReviewed(order.getId());
        if (allOrderDetailsReviewed) {
            order.setReviewed(true);
            orderRepository.save(order);
        }
        return savedComment;
    }


    private void updateProductAverageRating(Product product) throws Exception {
        List<Rating> ratings = ratingRepository.findByProductId(product.getId());
        double averageRating = ratings.stream()
                .mapToInt(Rating::getRating)
                .average()
                .orElse(0.0);

        product.setAverageRating(BigDecimal.valueOf(averageRating).setScale(1, RoundingMode.HALF_UP));
        productRepository.save(product);
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }

    @Override
    @Transactional
    public Comment updateComment(Long id, User user, CommentDto commentDto) throws DataNotFoundException {
        Comment existingComment = commentRepository.findById(id)
                .orElseThrow(() -> new DataNotFoundException("Comment not found"));
        existingComment.setContent(commentDto.getContent());
        return commentRepository.save(existingComment);
    }

    @Override
    public CommentListResponse getFilteredComments(Long productId, Integer starRating, Boolean hasImage, PageRequest pageRequest) {
        Page<Comment> commentsPage;

        if (starRating != null) {
            if (hasImage == null) {
                commentsPage = commentRepository.findByProductIdAndStarRating(productId, starRating, pageRequest);
            } else {
                commentsPage = commentRepository.findByProductIdAndStarRatingAndHasPicture(productId, starRating, hasImage, pageRequest);
            }
        } else {
            if (hasImage == null) {
                commentsPage = commentRepository.findByProductId(productId, pageRequest);
            } else {
                commentsPage = commentRepository.findByProductIdAndHasPicture(productId, hasImage, pageRequest);
            }
        }

        List<CommentResponse> commentResponses = commentsPage.getContent()
                .stream()
                .map(CommentResponse::fromComment)
                .collect(Collectors.toList());

        long totalReviews = commentRepository.countByProductId(productId);
        long fiveStarReviews = commentRepository.countByProductIdAndStarRating(productId, 5);
        long fourStarReviews = commentRepository.countByProductIdAndStarRating(productId, 4);
        long threeStarReviews = commentRepository.countByProductIdAndStarRating(productId, 3);
        long twoStarReviews = commentRepository.countByProductIdAndStarRating(productId, 2);
        long oneStarReviews = commentRepository.countByProductIdAndStarRating(productId, 1);
        long imageReviews = commentRepository.countByProductIdAndHasPicture(productId, true);

        return CommentListResponse.builder()
                .comments(commentResponses)
                .totalPages(commentsPage.getTotalPages())
                .totalReviews(totalReviews)
                .fiveStarReviews(fiveStarReviews)
                .fourStarReviews(fourStarReviews)
                .threeStarReviews(threeStarReviews)
                .twoStarReviews(twoStarReviews)
                .oneStarReviews(oneStarReviews)
                .imageReviews(imageReviews)
                .build();
    }


    @Override
    public CommentListResponse getComments(Long productId, PageRequest pageRequest) {
        Page<Comment> commentsPage = commentRepository.findByProductId(productId, pageRequest);
        List<CommentResponse> commentResponses = commentsPage.getContent()
                .stream()
                .map(CommentResponse::fromComment)
                .collect(Collectors.toList());

        long totalReviews = commentRepository.countByProductId(productId);
        long fiveStarReviews = commentRepository.countByProductIdAndStarRating(productId, 5);
        long fourStarReviews = commentRepository.countByProductIdAndStarRating(productId, 4);
        long threeStarReviews = commentRepository.countByProductIdAndStarRating(productId, 3);
        long twoStarReviews = commentRepository.countByProductIdAndStarRating(productId, 2);
        long oneStarReviews = commentRepository.countByProductIdAndStarRating(productId, 1);
        long imageReviews = commentRepository.countByProductIdAndHasPicture(productId, true);

        return CommentListResponse.builder()
                .comments(commentResponses)
                .totalPages(commentsPage.getTotalPages())
                .totalReviews(totalReviews)
                .fiveStarReviews(fiveStarReviews)
                .fourStarReviews(fourStarReviews)
                .threeStarReviews(threeStarReviews)
                .twoStarReviews(twoStarReviews)
                .oneStarReviews(oneStarReviews)
                .imageReviews(imageReviews)
                .build();
    }


}
