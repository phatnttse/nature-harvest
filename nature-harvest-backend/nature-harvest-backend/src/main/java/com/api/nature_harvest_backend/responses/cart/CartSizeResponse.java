package com.api.nature_harvest_backend.responses.cart;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartSizeResponse {
    private Integer cartSize;
}