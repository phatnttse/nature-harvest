package com.api.nature_harvest_backend.dtos.order;

import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UpdateOrderDto {
    private String userId;
    private String name;
    private String phone;
    private String deliveryAddress;
    private String note;
    private int amount;
}
