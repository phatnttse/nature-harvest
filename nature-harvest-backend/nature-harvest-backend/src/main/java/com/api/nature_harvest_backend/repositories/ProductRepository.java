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
            "AND (:subcategoryId IS NULL OR :subcategoryId = 0 OR p.subcategory.id = :subcategoryId) " +
            "AND (:categorySlug IS NULL OR :categorySlug = '' OR p.category.slug = :categorySlug) " +
            "AND (:subcategorySlug IS NULL OR :subcategorySlug = '' OR p.subcategory.slug = :subcategorySlug) " +
            "AND (:keyword IS NULL OR :keyword = '' OR p.title LIKE %:keyword%) " +
            "AND (p.officialPrice >= :minPrice AND p.officialPrice <= :maxPrice) " +
            "AND p.active = true")
    Page<Product> searchProducts(@Param("categoryId") Long categoryId,
                                 @Param("subcategoryId") Long subcategoryId,
                                 @Param("categorySlug") String categorySlug,
                                 @Param("subcategorySlug") String subcategorySlug,
                                 @Param("keyword") String keyword,
                                 @Param("minPrice") Long minPrice,
                                 @Param("maxPrice") Long maxPrice,
                                 Pageable pageable);

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.productImages WHERE p.id = :productId")
    Optional<Product> getDetailProduct(@Param("productId") Long productId);

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.productImages WHERE p.slug = :slug")
    Optional<Product> getDetailProductBySlug(@Param("slug") String slug);

    @Query("SELECT p FROM Product p WHERE p.id IN :productIds")
    List<Product> findProductsByIds(@Param("productIds") List<Long> productIds);

    @Query("SELECT p FROM Product p WHERE p.officialPrice >= :minPrice AND p.officialPrice <= :maxPrice")
    Page<Product> findProductsByPriceRange(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice, Pageable pageable);

}
