package com.api.nature_harvest_backend.models;

import lombok.*;

@Getter
@Setter
@Builder
public class PaymentStatus {
    public static final String PAID = "paid";
    public static final String UNPAID = "unpaid";
}
