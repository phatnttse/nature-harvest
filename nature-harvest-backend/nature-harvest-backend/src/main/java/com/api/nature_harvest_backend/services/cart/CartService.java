package com.api.nature_harvest_backend.services.cart;

import com.api.nature_harvest_backend.components.JwtTokenUtils;
import com.api.nature_harvest_backend.dtos.cart.CartDto;
import com.api.nature_harvest_backend.exceptions.DataNotFoundException;
import com.api.nature_harvest_backend.models.Cart;
import com.api.nature_harvest_backend.models.Product;
import com.api.nature_harvest_backend.models.User;
import com.api.nature_harvest_backend.repositories.CartRepository;
import com.api.nature_harvest_backend.repositories.ProductRepository;
import com.api.nature_harvest_backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService implements ICartService {
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final JwtTokenUtils jwtTokenUtils;

    @Override
    public List<Cart> getCartByUserId(String token) throws Exception {
        String extractedToken = token.substring(7);
        String userId = jwtTokenUtils.extractUserId(extractedToken);
        User user = userRepository.findById(userId).orElseThrow(() -> new DataNotFoundException("User not found"));
        List<Cart> cartItems = cartRepository.findByUser(user);
        return cartItems;
    }

    @Override
    @Transactional
    public List<Cart> addProductToCart(CartDto cartDto) throws Exception {
        User user = userRepository.findById(cartDto.getUserId()).orElseThrow(() -> new DataNotFoundException("User not found"));
        Product product = productRepository.findById(cartDto.getProductId()).orElseThrow(() -> new DataNotFoundException("Product not found"));
        Optional<Cart> cart = cartRepository.findByUserAndProduct(user, product);

        if (cart.isPresent()) {
            cart.get().setQuantity(cart.get().getQuantity() + cartDto.getQuantity());
            cartRepository.save(cart.get());
        } else {
            Cart newCartItem = Cart.builder()
                    .user(user)
                    .product(product)
                    .quantity(cartDto.getQuantity())
                    .build();
            cartRepository.save(newCartItem);
        }

        List<Cart> cartItems = cartRepository.findByUser(user);
        return cartItems;
    }

    @Override
    @Transactional
    public List<Cart> removeProductToCart(CartDto cartDto) throws Exception {
        User user = userRepository.findById(cartDto.getUserId()).orElseThrow(() -> new DataNotFoundException("User not found"));
        Product product = productRepository.findById(cartDto.getProductId()).orElseThrow(() -> new DataNotFoundException("Product not found"));
        cartRepository.deleteByUserAndProduct(user, product);
        List<Cart> cartItems = cartRepository.findByUser(user);
        return cartItems;
    }

    @Override
    @Transactional
    public List<Cart> updateQuantity(CartDto cartDto) throws Exception {
        User user = userRepository.findById(cartDto.getUserId()).orElseThrow(() -> new DataNotFoundException("User not found"));
        Product product = productRepository.findById(cartDto.getProductId()).orElseThrow(() -> new DataNotFoundException("Product not found"));
        Optional<Cart> cart = cartRepository.findByUserAndProduct(user, product);
        if (cart.isPresent()) {
            if (cartDto.getQuantity() == 0) {
                cartRepository.deleteByUserAndProduct(user, product);
            } else {
                cart.get().setQuantity(cartDto.getQuantity());
                cartRepository.save(cart.get());
            }
        }
        List<Cart> cartItems = cartRepository.findByUser(user);
        return cartItems;
    }

    @Override
    public Integer getCartSizeByUserId(String token) throws Exception {
        String extractedToken = token.substring(7);
        String userId = jwtTokenUtils.extractUserId(extractedToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new DataNotFoundException("User not found"));
        return cartRepository.findCartSizeByUser(user);
    }

    @Override
    @Transactional
    public void clearCart(CartDto cartDto) throws Exception {
        User user = userRepository.findById(cartDto.getUserId()).orElseThrow(() -> new DataNotFoundException("User not found"));
        cartRepository.deleteAllByUser(user);
    }
}
