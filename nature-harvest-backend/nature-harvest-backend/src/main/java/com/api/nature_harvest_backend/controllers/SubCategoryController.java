package com.api.nature_harvest_backend.controllers;

import com.api.nature_harvest_backend.dtos.category.SubCategoryDto;
import com.api.nature_harvest_backend.models.SubCategory;
import com.api.nature_harvest_backend.responses.base.BaseResponse;
import com.api.nature_harvest_backend.services.subcategory.ISubCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/subcategories")
@RequiredArgsConstructor
public class SubCategoryController {
    private final ISubCategoryService subCategoryService;

    @PostMapping("")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<BaseResponse> createSubCategory(
            @Valid @RequestBody SubCategoryDto subCategoryDto,
            BindingResult result) throws Exception {
        if (result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();

            return ResponseEntity.badRequest().body(BaseResponse.builder()
                    .message(errorMessages.toString())
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        }
        try {

            SubCategory subCategory = subCategoryService.createSubCategory(subCategoryDto);
            return ResponseEntity.ok(BaseResponse.builder()
                    .message("Create subcategory successfully")
                    .status(HttpStatus.OK.value())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(BaseResponse.builder()
                    .message(e.getMessage())
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        }

    }

    @GetMapping("/{id}")
    public ResponseEntity<SubCategory> getSubCategoryById(
            @PathVariable("id") Long subcategoryId
    ) {
        try {
            SubCategory subCategory = subCategoryService.getSubCategoryById(subcategoryId);
            return ResponseEntity.ok(subCategory);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<SubCategory>> getSubCategoryByCategory(
            @PathVariable("categoryId") Long categoryId
    ) {
        try {
            List<SubCategory> subCategories = subCategoryService.getSubCategoriesByCategory(categoryId);
            return ResponseEntity.ok(subCategories);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<BaseResponse> updateSubCategory(
            @PathVariable Long id,
            @Valid @RequestBody SubCategoryDto subCategoryDto
    ) {
        try {
            subCategoryService.updateSubCategory(id, subCategoryDto);
            return ResponseEntity.ok(BaseResponse.builder()
                    .message("Update subcategory successfully")
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
    public ResponseEntity<BaseResponse> deleteSubCategory(
            @PathVariable Long id
    ) {
        try {
            subCategoryService.deleteSubCategory(id);
            return ResponseEntity.ok(BaseResponse.builder()
                    .message("Delete subcategory successfully")
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
