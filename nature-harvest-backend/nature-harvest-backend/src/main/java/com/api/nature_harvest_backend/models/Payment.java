package com.api.nature_harvest_backend.models;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class Payment {
    public static final String PAID = "paid";
    public static final String UNPAID = "unpaid";
    public static final String VNPAY = "VNPAY";
    public static final String MOMO = "MOMO";

}
