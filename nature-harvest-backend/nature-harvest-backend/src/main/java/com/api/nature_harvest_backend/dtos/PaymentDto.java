package com.api.nature_harvest_backend.dtos;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentDto {
    private long amount;
    private String bankCode;
    private String language;
    private OrderDto oder;
}
