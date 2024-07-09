package com.api.nature_harvest_backend.responses.coupon;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CouponResponse {
    private Long id;
    private String code;
    private String discountType;
    private String description;
    private String attribute;
    private String operator;
    private String value;
    private int discountAmount;
    private String startDate;
    private String endDate;
}
