package com.api.nature_harvest_backend.controllers;

import com.api.nature_harvest_backend.dtos.SubCategoryDto;
import com.api.nature_harvest_backend.models.SubCategory;
import com.api.nature_harvest_backend.responses.subcategory.SubCategoryResponse;
import com.api.nature_harvest_backend.responses.subcategory.UpdateSubCategoryResponse;
import com.api.nature_harvest_backend.services.subcategory.ISubCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<SubCategoryResponse> createSubCategory(
            @Valid @RequestBody SubCategoryDto subCategoryDto,
            BindingResult result) throws Exception {
        if (result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();

            return ResponseEntity.badRequest().body(SubCategoryResponse.builder()
                    .message("Create new subcategory fail")
                    .errors(errorMessages)
                    .build());
        }
        SubCategory subCategory = subCategoryService.createSubCategory(subCategoryDto);
        return ResponseEntity.ok(SubCategoryResponse.builder()
                .message("Create new subcategory successfully")
                .subcategory(subCategory)
                .build());
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
    public ResponseEntity<UpdateSubCategoryResponse> updateSubCategory(
            @PathVariable Long id,
            @Valid @RequestBody SubCategoryDto subCategoryDto
    ) {
        try {
            UpdateSubCategoryResponse updateSubCategoryResponse = new UpdateSubCategoryResponse();
            subCategoryService.updateSubCategory(id, subCategoryDto);
            updateSubCategoryResponse.setMessage("UPDATE CATEGORY SUCCESSFULLY");
            return ResponseEntity.ok(updateSubCategoryResponse);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(UpdateSubCategoryResponse.builder()
                    .message(e.getMessage())
                    .build());
        }

    }

}
