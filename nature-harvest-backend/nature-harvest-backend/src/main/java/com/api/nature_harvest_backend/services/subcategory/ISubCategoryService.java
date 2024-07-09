package com.api.nature_harvest_backend.services.subcategory;

import com.api.nature_harvest_backend.dtos.category.SubCategoryDto;
import com.api.nature_harvest_backend.models.SubCategory;

import java.util.List;

public interface ISubCategoryService {
    SubCategory createSubCategory(SubCategoryDto subCategoryDto) throws Exception;

    SubCategory getSubCategoryById(long id) throws Exception;

    List<SubCategory> getSubCategoriesByCategory(long categoryId) throws Exception;

    void updateSubCategory(long subcategoryId, SubCategoryDto subCategoryDto) throws Exception;

    void deleteSubCategory(long id) throws Exception;
}
