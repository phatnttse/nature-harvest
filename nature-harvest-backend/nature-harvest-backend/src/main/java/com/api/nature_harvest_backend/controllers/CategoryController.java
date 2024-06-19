package com.api.nature_harvest_backend.controllers;

import com.api.nature_harvest_backend.dtos.CategoryDto;
import com.api.nature_harvest_backend.dtos.CategoryWithSubcategoriesDto;
import com.api.nature_harvest_backend.models.Category;
import com.api.nature_harvest_backend.models.SubCategory;
import com.api.nature_harvest_backend.responses.category.CategoryProductCountResponse;
import com.api.nature_harvest_backend.responses.category.CategoryResponse;
import com.api.nature_harvest_backend.responses.category.UpdateCategoryResponse;
import com.api.nature_harvest_backend.services.category.ICategoryRedisService;
import com.api.nature_harvest_backend.services.category.ICategoryService;
import com.api.nature_harvest_backend.services.subcategory.ISubCategoryRedisService;
import com.api.nature_harvest_backend.services.subcategory.ISubCategoryService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("${api.prefix}/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final ICategoryService categoryService;
    private final ISubCategoryService subCategoryService;
    private final ICategoryRedisService categoryRedisService;
    private final ISubCategoryRedisService subCategoryRedisService;


    @PostMapping("")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<CategoryResponse> createCategory(
            @Valid @RequestBody CategoryDto categoryDto,
            BindingResult result) {
        if (result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();

            return ResponseEntity.badRequest().body(CategoryResponse.builder()
                    .message("Create new category fail")
                    .errors(errorMessages)
                    .build());
        }
        Category category = categoryService.createCategory(categoryDto);
        return ResponseEntity.ok(CategoryResponse.builder()
                .message("Create new category successfully")
                .category(category)
                .build());
    }

    //Hiện tất cả các categories
    @GetMapping("")
    public ResponseEntity<List<Category>> getCategories() throws JsonProcessingException {
        List<Category> categories = categoryRedisService.getAllCategories();
        if (categories == null) {
            categories = categoryService.getAllCategories();
            categoryRedisService.saveAllCategories(categories);
        }
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/with-subcategories")
    public ResponseEntity<List<CategoryWithSubcategoriesDto>> getAllCategoriesWithSubcategories() throws Exception {
        List<Category> categories = categoryRedisService.getAllCategories();
        if (categories == null) {
            categories = categoryService.getAllCategories();
            categoryRedisService.saveAllCategories(categories);
        }
        List<CategoryWithSubcategoriesDto> categoriesWithSubcategories = new ArrayList<>();

        for (Category category : categories) {
            List<SubCategory> subcategories = subCategoryRedisService.getAllSubCategoriesByCategory(category.getId());
            if (subcategories == null) {
                subcategories = subCategoryService.getSubCategoriesByCategory(category.getId());
                subCategoryRedisService.saveAllSubCategoriesByCategory(subcategories, category.getId());
            }
            CategoryWithSubcategoriesDto categoryWithSubcategories = new CategoryWithSubcategoriesDto(
                    category.getId(),
                    category.getName(),
                    subcategories
            );
            categoriesWithSubcategories.add(categoryWithSubcategories);
        }
        return ResponseEntity.ok(categoriesWithSubcategories);
    }


    @GetMapping("product-counts")
    public ResponseEntity<List<CategoryProductCountResponse>> getCategoryProductCount() {
        List<CategoryProductCountResponse> categories = categoryService.getCategoryProductCounts();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(
            @PathVariable("id") Long categoryId
    ) {
        try {
            Category existingCategory = categoryService.getCategoryById(categoryId);
            return ResponseEntity.ok(existingCategory);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<UpdateCategoryResponse> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryDto categoryDTO
    ) {
        UpdateCategoryResponse updateCategoryResponse = new UpdateCategoryResponse();
        categoryService.updateCategory(id, categoryDTO);
        updateCategoryResponse.setMessage("UPDATE CATEGORY SUCCESSFULLY");
        return ResponseEntity.ok(updateCategoryResponse);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.ok("");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

}
