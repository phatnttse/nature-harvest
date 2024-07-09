package com.api.nature_harvest_backend.dtos.product;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductDto {

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Name must be between 3 and 200 characters")
    private String title;

    @Min(value = 1000, message = "Price must be greater than or equal to 1000")
    private int price;

    @Min(value = 0, message = "Quantity must be greater than or equal to 0")
    private int quantity;

    @Min(value = 0, message = "Discount must be greater than or equal to 0")
    private int discount;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Images is required")
    private List<String> images;

    @NotNull
    private Long categoryId;

    @NotNull
    private Long subcategoryId;
}