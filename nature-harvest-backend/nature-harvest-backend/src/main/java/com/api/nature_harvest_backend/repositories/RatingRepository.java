package com.api.nature_harvest_backend.repositories;

import com.api.nature_harvest_backend.models.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    // Các phương thức tùy chỉnh khác có thể được thêm ở đây nếu cần
}