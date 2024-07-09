package com.api.nature_harvest_backend.dtos.order;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class HandleOrderDto {
    @NotNull(message = "Order ID is required")
    private String orderId;

    @NotNull(message = "Status is required")
    private String status;
}
