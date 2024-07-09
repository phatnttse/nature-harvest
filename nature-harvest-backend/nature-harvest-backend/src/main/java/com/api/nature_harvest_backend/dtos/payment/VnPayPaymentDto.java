package com.api.nature_harvest_backend.dtos.payment;

import com.api.nature_harvest_backend.dtos.order.OrderDto;
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
