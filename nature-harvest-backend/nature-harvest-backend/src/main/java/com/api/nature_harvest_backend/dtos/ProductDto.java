package com.api.nature_harvest_backend.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import jakarta.validation.constraints.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductDto {

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Name must be between 3 and 200 characters")
    private String title;

    @Min(value = 0, message = "Price must be greater than or equal to 0")
    @Max(value = 10000000, message = "Price must be less than or equal to 10,000,000")
    private int price;

    @Min(value = 0, message = "Quantity must be greater than or equal to 0")
    private int quantity;

    private String description;
    private String thumbnail;
    private Long categoryId;
    private Long subcategoryId;
}