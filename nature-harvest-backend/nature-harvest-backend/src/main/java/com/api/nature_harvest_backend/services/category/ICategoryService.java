package com.api.nature_harvest_backend.services.category;

import com.api.nature_harvest_backend.dtos.CategoryDto;
import com.api.nature_harvest_backend.models.Category;
import com.api.nature_harvest_backend.responses.category.CategoryProductCountResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ICategoryService {
    Category createCategory(CategoryDto category);
    Category getCategoryById(long id);
    List<Category> getAllCategories();
    Category updateCategory(long categoryId, CategoryDto category);
    Category deleteCategory(long id) throws Exception;
    List<CategoryProductCountResponse> getCategoryProductCounts();
}
