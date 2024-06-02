package com.api.nature_harvest_backend.responses.category;

import com.api.nature_harvest_backend.models.Category;
import lombok.*;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryResponse {
    private String message;
    private List<String> errors;
    private Category category;
}