package com.api.nature_harvest_backend.responses.cart;

import com.api.nature_harvest_backend.models.Cart;
import com.api.nature_harvest_backend.models.Product;
import com.api.nature_harvest_backend.responses.product.ProductResponse;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartResponse {
    private Long id;
    private String userId;
    private ProductResponse product;
    private int quantity;

    public static List<CartResponse> fromCart(List<Cart> cartList) {
        return cartList.stream().map(cart -> {
            return CartResponse.builder()
                  .id(cart.getId())
                  .userId(cart.getUser().getId())
                  .product(ProductResponse.fromProduct(cart.getProduct()))
                  .quantity(cart.getQuantity())
                  .build();
        }).collect(Collectors.toList());
    }
}
