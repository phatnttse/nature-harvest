package com.api.nature_harvest_backend.dtos;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDto {
    @NotEmpty(message = "Category's name cannot be empty")
    private String name;
}
