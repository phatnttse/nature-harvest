package com.api.nature_harvest_backend.services.subcategory;

import com.api.nature_harvest_backend.dtos.category.SubCategoryDto;
import com.api.nature_harvest_backend.exceptions.DataNotFoundException;
import com.api.nature_harvest_backend.models.Category;
import com.api.nature_harvest_backend.models.SubCategory;
import com.api.nature_harvest_backend.repositories.CategoryRepository;
import com.api.nature_harvest_backend.repositories.SubCategoryRepository;
import com.api.nature_harvest_backend.utils.StringUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubCategoryService implements ISubCategoryService {
    private final SubCategoryRepository subcategoryRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public SubCategory createSubCategory(SubCategoryDto subCategoryDto) throws DataNotFoundException {
        Category existingCategory = categoryRepository
                .findById(subCategoryDto.getCategoryId())
                .orElseThrow(() ->
                        new DataNotFoundException(
                                "Cannot find category with id: " + subCategoryDto.getCategoryId()));

        SubCategory newSubCategory = SubCategory
                .builder()
                .name(subCategoryDto.getName())
                .slug(StringUtils.toSlug(subCategoryDto.getName()))
                .category(existingCategory)
                .active(true)
                .build();
        return subcategoryRepository.save(newSubCategory);
    }

    @Override
    public SubCategory getSubCategoryById(long id) throws DataNotFoundException {
        return subcategoryRepository.findById(id).orElseThrow(() -> new DataNotFoundException("Subcategory Not Found"));
    }

    @Override
    public List<SubCategory> getSubCategoriesByCategory(long categoryId) throws DataNotFoundException {
        Category existingCategory = categoryRepository
                .findById(categoryId)
                .orElseThrow(() ->
                        new DataNotFoundException(
                                "Cannot find category with id: " + categoryId));
        return subcategoryRepository.findByCategoryAndActive(existingCategory, true);
    }

    @Override
    public void updateSubCategory(long subcategoryId, SubCategoryDto subCategoryDto) throws DataNotFoundException {
        SubCategory subCategory = getSubCategoryById(subcategoryId);

        if (subCategoryDto.getName() != null) {
            subCategory.setName(subCategoryDto.getName());
        }
        if (subCategoryDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(subCategoryDto.getCategoryId()).orElseThrow(() -> new DataNotFoundException("Category not found"));
            subCategory.setCategory(category);
        }
        subcategoryRepository.save(subCategory);
    }

    @Override
    public void deleteSubCategory(long id) throws Exception {
        SubCategory subCategory = getSubCategoryById(id);
        subCategory.setActive(false);
        subcategoryRepository.save(subCategory);
    }
}
