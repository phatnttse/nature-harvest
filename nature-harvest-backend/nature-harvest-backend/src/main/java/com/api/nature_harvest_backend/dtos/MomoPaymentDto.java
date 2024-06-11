package com.api.nature_harvest_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MomoPaymentDto {
    private String requestType;
    private String lang;
    private OrderDto order;
}
