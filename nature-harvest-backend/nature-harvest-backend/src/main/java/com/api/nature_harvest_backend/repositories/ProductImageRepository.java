package com.api.nature_harvest_backend.repositories;


import com.api.nature_harvest_backend.models.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findByProductId(Long productId);
}
