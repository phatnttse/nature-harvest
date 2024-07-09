package com.api.nature_harvest_backend.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;


@Entity
@Table(name = "coupons")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Coupon extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "discount_type", nullable = false)
    private String discountType;

    @Column(name = "description", columnDefinition = "LONGTEXT", nullable = false)
    private String description;

    @Column(name = "attribute", nullable = false)
    private String attribute;

    @Column(name = "operator", nullable = false)
    private String operator;

    @Column(name = "value", nullable = false)
    private String value;

    @Column(name = "discount_amount", nullable = false)
    private int discountAmount;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "active", nullable = false)
    private boolean active;

    public static String DISCOUNT_TYPE_PERCENTAGE = "percentage";
    public static String DISCOUNT_TYPE_FIXED = "fixed";
}
