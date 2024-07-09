package com.api.nature_harvest_backend.dtos.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SubCategoryDto {
    @NotBlank
    private String name;

    @NotNull
    private Long categoryId;
}
