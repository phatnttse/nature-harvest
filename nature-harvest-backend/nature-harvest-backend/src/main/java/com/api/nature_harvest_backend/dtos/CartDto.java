package com.api.nature_harvest_backend.dtos;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartDto {
    private String userId;
    private Long productId;
    private int quantity;
}
