package com.api.nature_harvest_backend.responses.coupon;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CouponCalculationResponse {
    private Integer discountAmount;
    private int status;
    private String message;
}
