package com.api.nature_harvest_backend.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentDto {
    @NotNull(message = "ProductId is required")
    private Long productId;

    @NotNull(message = "OrderId is required")
    private String orderId;

    @NotNull
    @Min(value = 1, message = "Star rating must be greater than or equal to 1")
    @Max(value = 5, message = "Star rating must be less than or equal to 5")
    private int starRating;

    @NotNull(message = "Content is required")
    private String content;
}
