package com.api.nature_harvest_backend.services.category;

import com.api.nature_harvest_backend.dtos.category.CategoryDto;
import com.api.nature_harvest_backend.models.Category;
import com.api.nature_harvest_backend.responses.category.CategoryProductCountResponse;

import java.util.List;

public interface ICategoryService {
    Category createCategory(CategoryDto category);

    Category getCategoryById(long id);

    List<Category> getAllCategories();

    void updateCategory(long categoryId, CategoryDto category);

    void deleteCategory(long id) throws Exception;

    List<CategoryProductCountResponse> getCategoryProductCounts();
}
