package com.api.nature_harvest_backend.dtos.category;

import com.api.nature_harvest_backend.models.SubCategory;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryWithSubcategoriesDto {
    private Long id;
    private String name;
    private String thumbnail;
    private String slug;
    private List<SubCategory> subcategories;
}
