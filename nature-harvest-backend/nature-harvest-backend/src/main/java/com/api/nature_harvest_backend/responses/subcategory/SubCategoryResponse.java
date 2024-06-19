package com.api.nature_harvest_backend.responses.subcategory;

import com.api.nature_harvest_backend.models.SubCategory;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubCategoryResponse {
    private String message;
    private List<String> errors;
    private SubCategory subcategory;
}
