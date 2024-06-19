package com.api.nature_harvest_backend.services.subcategory;

import com.api.nature_harvest_backend.models.SubCategory;
import com.fasterxml.jackson.core.JsonProcessingException;

import java.util.List;

public interface ISubCategoryRedisService {
    void clear();

    List<SubCategory> getAllSubCategoriesByCategory(Long categoryId) throws JsonProcessingException;

    void saveAllSubCategoriesByCategory(List<SubCategory> subcategoryResponses, Long categoryId) throws JsonProcessingException;
}
