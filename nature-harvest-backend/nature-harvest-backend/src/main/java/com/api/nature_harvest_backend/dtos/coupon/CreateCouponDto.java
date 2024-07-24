package com.api.nature_harvest_backend.dtos.coupon;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateCouponDto {
    @NotNull(message = "Coupon code is required")
    private String code;

    @NotNull(message = "Discount type is required")
    private String discountType;

    @NotNull(message = "Description is required")
    private String description;

    @NotNull(message = "Attribute is required")
    private String attribute;

    @NotNull(message = "Operator is required")
    private String operator;

    @NotNull(message = "Value is required")
    private String value;

    @NotNull(message = "Discount amount is required")
    private int discountAmount;

    private LocalDate startDate;

    private LocalDate endDate;
}
