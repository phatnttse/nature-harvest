package com.api.nature_harvest_backend.responses.cart;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartListResponse {
    List<CartResponse> cart;
}
