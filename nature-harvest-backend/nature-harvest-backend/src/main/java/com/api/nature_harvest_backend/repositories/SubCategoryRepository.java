package com.api.nature_harvest_backend.repositories;

import com.api.nature_harvest_backend.models.Category;
import com.api.nature_harvest_backend.models.SubCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SubCategoryRepository extends JpaRepository<SubCategory, Long> {
    List<SubCategory> findByCategoryAndActive(Category category, boolean active);


    @Query("SELECT sc FROM SubCategory sc WHERE sc.active = true")
    List<SubCategory> findAllActive();
}
