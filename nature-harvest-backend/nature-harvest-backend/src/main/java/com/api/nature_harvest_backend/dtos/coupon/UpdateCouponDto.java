package com.api.nature_harvest_backend.dtos.coupon;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateCouponDto {
    @NotNull(message = "Coupon code is required")
    private String code;

    @NotNull(message = "Description is required")
    private String description;

    @NotNull(message = "Value is required")
    private String value;

    @NotNull(message = "Discount amount is required")
    private int discountAmount;

    private String startDate;

    private String endDate;
}
