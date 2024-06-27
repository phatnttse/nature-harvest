package com.api.nature_harvest_backend.repositories;

import com.api.nature_harvest_backend.models.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByUserIdAndProductId(@Param("userId") String userId,
                                           @Param("productId") Long productId,
                                           Pageable pageable);

    List<Comment> findByProductId(@Param("productId") Long productId);
}
