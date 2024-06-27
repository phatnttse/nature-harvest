package com.api.nature_harvest_backend.models;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class OrderStatus {
    public static final String PENDING = "pending";
    public static final String CONFIRMED = "confirmed";
    public static final String PICKED_UP = "picked_up";
    public static final String ON_THE_WAY = "on_the_way";
    public static final String SUCCESSFUL_DELIVERY = "successful_delivery";
    public static final String CANCELLED = "cancelled";
}
