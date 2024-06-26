package com.api.nature_harvest_backend.dtos;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VnPayPaymentDto {
    private String bankCode;
    private String language;
    private OrderDto order;
}
