package com.api.nature_harvest_backend.services.cart;

import com.api.nature_harvest_backend.dtos.CartDto;
import com.api.nature_harvest_backend.models.Cart;

import java.util.List;

public interface ICartService {
    List<Cart> getCartByUserId(String token) throws Exception;
    List<Cart> addProductToCart(CartDto cartDto) throws Exception;
    List<Cart> removeProductToCart(CartDto cartDto) throws Exception;
    List<Cart> updateQuantity(CartDto cartDto) throws Exception;
    Integer getCartSizeByUserId(String token) throws Exception;
    void  clearCart(CartDto cartDto) throws Exception;

}
