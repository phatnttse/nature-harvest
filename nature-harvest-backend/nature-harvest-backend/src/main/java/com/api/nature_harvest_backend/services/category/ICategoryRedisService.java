package com.api.nature_harvest_backend.services.category;

import com.api.nature_harvest_backend.models.Category;
import com.api.nature_harvest_backend.responses.category.CategoryProductCountResponse;
import com.fasterxml.jackson.core.JsonProcessingException;

import java.util.List;

public interface ICategoryRedisService {
    void clear();

    List<Category> getAllCategories() throws JsonProcessingException;

    List<CategoryProductCountResponse> getCategoryProductCount() throws JsonProcessingException;

    void saveAllCategories(List<Category> categoryResponses) throws JsonProcessingException;

    void saveCategoryProductCount(List<CategoryProductCountResponse> categoryResponses) throws JsonProcessingException;

}
