package com.api.nature_harvest_backend.repositories;

import com.api.nature_harvest_backend.models.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByProductId(Long id) throws Exception;

    Rating findByProductIdAndUserId(Long productId, String userId);
}