package com.api.nature_harvest_backend.dtos.order;

import jakarta.validation.constraints.Min;
import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderDetailDto {
    @Min(value = 1, message = "Order's ID must be > 0")
    private Long orderId;

    @Min(value = 1, message = "Product's ID must be > 0")
    private Long productId;

    @Min(value = 0, message = "Product's ID must be >= 0")
    private Float price;

    @Min(value = 1, message = "quantity must be >= 1")
    private int quantity;

}
