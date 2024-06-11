package com.api.nature_harvest_backend.dtos;

import java.util.List;
import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderWithDetailsDto {
    private String userId;
    private String email;
    private String name;
    private String phone;
    private String deliveryAddress;
    private String note;
    private String paymentMethod;
    private int amount;
    private List<OrderDetailDto> orderDetails;
}
