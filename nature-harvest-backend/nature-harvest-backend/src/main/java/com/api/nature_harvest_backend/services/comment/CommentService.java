package com.api.nature_harvest_backend.services.comment;

import com.api.nature_harvest_backend.dtos.CommentDto;
import com.api.nature_harvest_backend.exceptions.DataNotFoundException;
import com.api.nature_harvest_backend.models.*;
import com.api.nature_harvest_backend.repositories.*;
import com.api.nature_harvest_backend.responses.comment.CommentResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
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

    @Override
    @Transactional
    public Comment insertComment(CommentDto commentDto, User user) throws Exception {
        Product product = productRepository.findById(commentDto.getProductId()).orElse(null);
        Order order = orderRepository.findById(commentDto.getOrderId()).orElse(null);
        OrderDetail orderDetail = orderDetailRepository.findByOrderAndProduct(order, product);

        if (user == null || product == null || order == null || orderDetail == null) {
            throw new IllegalArgumentException("User or product or order or orderDetails not found");
        }
        if (!order.getStatus().equals(OrderStatus.SUCCESSFUL_DELIVERY)) {
            throw new Exception("Order not completed");
        }

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
        updateProductAverageRating(product);

        Comment newComment = Comment.builder()
                .user(user)
                .product(product)
                .content(commentDto.getContent())
                .starRating(commentDto.getStarRating())
                .picture(commentDto.getPicture())
                .build();

        if (commentDto.getPicture() != null && !commentDto.getPicture().isEmpty()) {
            newComment.setPicture(commentDto.getPicture());
            newComment.setHavePicture(true);
        }

        orderDetail.setReviewed(true);
        // Check if all order details are reviewed
        boolean allOrderDetailsReviewed = !orderDetailRepository.existsUnreviewedOrderDetailsByOrderId(order.getId());
        // Update order's reviewed status if all order details are reviewed
        if (allOrderDetailsReviewed) {
            order.setReviewed(true);
            orderRepository.save(order);
        }

        return commentRepository.save(newComment);
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
    public Page<CommentResponse> getCommentsByUserAndProduct(String userId, Long productId, PageRequest pageRequest) {
        Page<Comment> commentsPage;
        commentsPage = commentRepository.findByUserIdAndProductId(userId, productId, pageRequest);
        return commentsPage.map(CommentResponse::fromComment);
    }

    @Override
    public List<CommentResponse> getCommentsByProduct(Long productId) {
        List<Comment> comments = commentRepository.findByProductId(productId);
        return comments.stream()
                .map(comment -> CommentResponse.fromComment(comment))
                .collect(Collectors.toList());
    }

}
