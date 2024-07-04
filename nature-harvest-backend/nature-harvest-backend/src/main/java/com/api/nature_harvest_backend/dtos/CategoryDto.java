package com.api.nature_harvest_backend.dtos;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDto {
    @NotEmpty(message = "Category's name cannot be empty")
    private String name;

    private String thumbnail;
}
