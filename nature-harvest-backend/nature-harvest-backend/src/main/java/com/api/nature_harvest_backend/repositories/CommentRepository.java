package com.api.nature_harvest_backend.repositories;

import com.api.nature_harvest_backend.models.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByProductId(Long productId, Pageable pageable);

    Page<Comment> findByProductIdAndStarRating(Long productId, int starRating, Pageable pageable);

    Page<Comment> findByProductIdAndHasPicture(Long productId, boolean hasImage, Pageable pageable);

    Page<Comment> findByProductIdAndStarRatingAndHasPicture(Long productId, int starRating, boolean hasPicture, Pageable pageable);

    long countByProductId(Long productId);

    long countById(Long commentId);

    long countByProductIdAndStarRating(Long productId, int starRating);

    long countByProductIdAndHasPicture(Long productId, boolean hasPicture);


}
