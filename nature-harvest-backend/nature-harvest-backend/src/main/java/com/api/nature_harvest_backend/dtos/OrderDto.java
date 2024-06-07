package com.api.nature_harvest_backend.dtos;

import lombok.*;

import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderDto {
    private String userId;
    private String email;
    private String name;
    private String phone;
    private String deliveryAddress;
    private String note;
    private String paymentMethod;
    private int amount;
    private List<CartDto> cartItems;

}
