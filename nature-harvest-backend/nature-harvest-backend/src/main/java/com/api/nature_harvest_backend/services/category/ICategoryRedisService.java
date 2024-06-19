package com.api.nature_harvest_backend.services.category;

import com.api.nature_harvest_backend.models.Category;
import com.fasterxml.jackson.core.JsonProcessingException;

import java.util.List;

public interface ICategoryRedisService {
    void clear();

    List<Category> getAllCategories() throws JsonProcessingException;

    void saveAllCategories(List<Category> categoryResponses) throws JsonProcessingException;

}
