package com.api.nature_harvest_backend.repositories;

import com.api.nature_harvest_backend.models.Category;
import com.api.nature_harvest_backend.responses.category.CategoryProductCountResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Query("SELECT new com.api.nature_harvest_backend.responses.category.CategoryProductCountResponse(" +
            "c.id, c.name, c.thumbnail, c.slug, COUNT(p)) " +
            "FROM Category c LEFT JOIN Product p ON p.category.id = c.id " +
            "WHERE c.active = true " +  // chỉ lấy các category có active bằng true
            "AND p.category.active = true " +  // chỉ lấy các product có active bằng true
            "GROUP BY c.id, c.name")
    List<CategoryProductCountResponse> findCategoryProductCounts();

    @Query("SELECT c FROM Category c WHERE c.active = true")
    List<Category> findAllActive();

}
