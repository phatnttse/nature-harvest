package com.api.nature_harvest_backend.dtos.order;

import lombok.*;

import java.io.Serializable;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderDto implements Serializable {
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
