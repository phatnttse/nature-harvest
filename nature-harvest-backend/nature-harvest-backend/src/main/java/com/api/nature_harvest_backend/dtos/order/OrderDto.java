package com.api.nature_harvest_backend.dtos.order;

import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderDto {
    private String id;
    private String userId;
    private String email;
    private String name;
    private String phone;
    private String deliveryAddress;
    private String note;
    private String paymentMethod;
    private int amount;
}
