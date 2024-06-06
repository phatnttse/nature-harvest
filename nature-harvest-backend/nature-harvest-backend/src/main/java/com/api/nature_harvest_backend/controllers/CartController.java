package com.api.nature_harvest_backend.controllers;

import com.api.nature_harvest_backend.dtos.CartDto;
import com.api.nature_harvest_backend.models.Cart;
import com.api.nature_harvest_backend.responses.cart.CartListResponse;
import com.api.nature_harvest_backend.responses.cart.CartResponse;
import com.api.nature_harvest_backend.responses.cart.CartSizeResponse;
import com.api.nature_harvest_backend.services.cart.ICartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/cart")
@RequiredArgsConstructor
public class CartController {
    private final ICartService cartService;

    @GetMapping("")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<CartListResponse> getCart(@RequestHeader("Authorization") String token) {
        try {
            List<Cart> cart = cartService.getCartByUserId(token);
            return ResponseEntity.ok(CartListResponse.builder()
                    .cart(CartResponse.fromCart(cart))
                    .build());
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }

    }

    @PostMapping("add")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<CartListResponse> addProductToCart(
            @RequestBody CartDto cartDto) {
        try {
            List<Cart> cart = cartService.addProductToCart(cartDto);
            return ResponseEntity.ok(CartListResponse.builder()
                    .cart(CartResponse.fromCart(cart))
                    .build());
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("remove")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<CartListResponse> removeProductToCart(
            @RequestBody CartDto cartDto) {
        try {
            List<Cart> cart = cartService.removeProductToCart(cartDto);
            return ResponseEntity.ok(CartListResponse.builder()
                    .cart(CartResponse.fromCart(cart))
                    .build());
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    @PostMapping("update-quantity")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<CartListResponse> updateQuantity(
            @RequestBody CartDto cartDto) {
        try {
            List<Cart> cart = cartService.updateQuantity(cartDto);
            return ResponseEntity.ok(CartListResponse.builder()
                    .cart(CartResponse.fromCart(cart))
                    .build());
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    @GetMapping("/cart-size")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<CartSizeResponse> getTotalQuantity(@RequestHeader("Authorization") String token) {
        try {
            Integer cartSize = cartService.getCartSizeByUserId(token);
            return ResponseEntity.ok(CartSizeResponse.builder()
                    .cartSize(cartSize)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
