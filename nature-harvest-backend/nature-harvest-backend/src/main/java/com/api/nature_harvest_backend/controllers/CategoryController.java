package com.api.nature_harvest_backend.controllers;

import com.api.nature_harvest_backend.dtos.category.CategoryDto;
import com.api.nature_harvest_backend.dtos.category.CategoryWithSubcategoriesDto;
import com.api.nature_harvest_backend.models.Category;
import com.api.nature_harvest_backend.models.SubCategory;
import com.api.nature_harvest_backend.responses.base.BaseResponse;
import com.api.nature_harvest_backend.responses.category.CategoryProductCountResponse;
import com.api.nature_harvest_backend.services.category.ICategoryRedisService;
import com.api.nature_harvest_backend.services.category.ICategoryService;
import com.api.nature_harvest_backend.services.subcategory.ISubCategoryRedisService;
import com.api.nature_harvest_backend.services.subcategory.ISubCategoryService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<BaseResponse> createCategory(
            @Valid @RequestBody CategoryDto categoryDto,
            BindingResult result) {
        if (result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();

            return ResponseEntity.badRequest().body(BaseResponse.builder()
                    .message("Create new category fail")
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        }
        categoryService.createCategory(categoryDto);
        return ResponseEntity.ok(BaseResponse.builder()
                .message("Create new category successfully")
                .status(HttpStatus.OK.value())
                .build());
    }

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
                    category.getThumbnail(),
                    category.getSlug(),
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
    @PreAuthorize("hasRole('ROLE_ADMIN')")
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
    public ResponseEntity<BaseResponse> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryDto categoryDTO
    ) {
        try {
            categoryService.updateCategory(id, categoryDTO);
            return ResponseEntity.ok(BaseResponse.builder()
                    .message("Update category successfully")
                    .status(HttpStatus.OK.value())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(BaseResponse.builder()
                    .message(e.getMessage())
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        }

    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<BaseResponse> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.ok(BaseResponse.builder()
                    .message("Delete category successfully")
                    .status(HttpStatus.OK.value())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(BaseResponse.builder()
                    .message(e.getMessage())
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        }
    }
}
