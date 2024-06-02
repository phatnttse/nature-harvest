package com.api.nature_harvest_backend.repositories;

import com.api.nature_harvest_backend.models.Category;
import com.api.nature_harvest_backend.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByTitle(String title);
    Page<Product> findAll(Pageable pageable);//phân trang
    List<Product> findByCategory(Category category);
    @Query("SELECT p FROM Product p WHERE " +
            "(:categoryId IS NULL OR :categoryId = 0 OR p.category.id = :categoryId) " +
//            "AND (:subcategoryId IS NULL OR :subcategoryId = 0 OR p.subcategory.id = :subcategoryId) " +
            "AND (:keyword IS NULL OR :keyword = '' OR p.title LIKE %:keyword% OR p.description LIKE %:keyword%) " +
            "AND p.active = true")
    Page<Product> searchProducts(@Param("categoryId") Long categoryId,
//                                 @Param("subcategoryId") Long subcategoryId,
                                 @Param("keyword") String keyword,
                                 Pageable pageable);
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.productImages WHERE p.id = :productId")
    Optional<Product> getDetailProduct(@Param("productId") Long productId);

    @Query("SELECT p FROM Product p WHERE p.id IN :productIds")
    List<Product> findProductsByIds(@Param("productIds") List<Long> productIds);

}
