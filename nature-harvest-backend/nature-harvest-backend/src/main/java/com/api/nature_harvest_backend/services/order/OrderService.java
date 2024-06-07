package com.api.nature_harvest_backend.services.order;

import com.api.nature_harvest_backend.components.JwtTokenUtils;
import com.api.nature_harvest_backend.dtos.CartDto;
import com.api.nature_harvest_backend.dtos.OrderDto;
import com.api.nature_harvest_backend.exceptions.DataNotFoundException;
import com.api.nature_harvest_backend.models.*;
import com.api.nature_harvest_backend.repositories.OrderDetailRepository;
import com.api.nature_harvest_backend.repositories.OrderRepository;
import com.api.nature_harvest_backend.repositories.ProductRepository;
import com.api.nature_harvest_backend.repositories.UserRepository;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService {
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final ModelMapper modelMapper;
    private final JwtTokenUtils jwtTokenUtils;

    @Override
    @Transactional
    public Order createOrder(OrderDto orderDto) throws Exception {
        User user = userRepository
                .findById(orderDto.getUserId())
                .orElseThrow(() -> new DataNotFoundException("Cannot find user with id: "+ orderDto.getUserId()));

        modelMapper.typeMap(OrderDto.class, Order.class)
                .addMappings(mapper -> mapper.skip(Order::setId));

        Order order = new Order();
        modelMapper.map(orderDto, order);
        order.setId(UUID.randomUUID().toString());
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        order.setPaymentStatus(PaymentStatus.UNPAID);
        order.setDeliveryDate(LocalDate.now().plusDays(3));
        order.setActive(true);
        orderRepository.save(order);

        List<OrderDetail> orderDetails = new ArrayList<>();
        for (CartDto cartItemDTO : orderDto.getCartItems()) {
            // Tạo một đối tượng OrderDetail từ CartItemDTO
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(order);

            // Lấy thông tin sản phẩm từ cartItemDTO
            Long productId = cartItemDTO.getProductId();
            int quantity = cartItemDTO.getQuantity();

            // Tìm thông tin sản phẩm từ cơ sở dữ liệu (hoặc sử dụng cache nếu cần)
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new DataNotFoundException("Product not found with id: " + productId));

            // Đặt thông tin cho OrderDetail
            orderDetail.setProduct(product);
            orderDetail.setQuantity(quantity);
            orderDetails.add(orderDetail);
        }
        orderDetailRepository.saveAll(orderDetails);
        return order;
    }

    @Override
    public String generateOrderInfo(OrderDto orderDto) {
        Map<String, Object> orderInfo = new HashMap<>();
        orderInfo.put("userId", orderDto.getUserId());
        orderInfo.put("email", orderDto.getEmail());
        orderInfo.put("name", orderDto.getName());
        orderInfo.put("phone", orderDto.getPhone());
        orderInfo.put("deliveryAddress", orderDto.getDeliveryAddress());
        orderInfo.put("note", orderDto.getNote());
        orderInfo.put("amount", orderDto.getAmount());
        orderInfo.put("cartItems", orderDto.getCartItems());

        return jwtTokenUtils.generateOrderToken(orderInfo);
    }
    @Override
    @Transactional
    public Order createOrderWithToken(String token) throws Exception {
        Claims claims = jwtTokenUtils.extractAllClaims(token);
        String userId = claims.get("userId").toString();
        List<CartDto> cartItems = ( List<CartDto>) claims.get("cartItems");
        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new DataNotFoundException("Cannot find user with id: "+ userId));

        Order order = Order.builder()
                .id(UUID.randomUUID().toString())
                .user(user)
                .email(claims.get("email").toString())
                .name(claims.get("name").toString())
                .phone(claims.get("phone").toString())
                .deliveryAddress(claims.get("deliveryAddress").toString())
                .note(claims.get("note").toString())
                .amount((int)claims.get("amount"))
                .paymentMethod("vnpay")
                .paymentStatus(PaymentStatus.PAID)
                .status(OrderStatus.PENDING)
                .deliveryDate(LocalDate.now().plusDays(3))
                .active(true)
                .build();
        orderRepository.save(order);

        List<OrderDetail> orderDetails = new ArrayList<>();
        for (CartDto cartItemDTO : cartItems) {
            // Tạo một đối tượng OrderDetail từ CartItemDTO
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(order);

            Long productId = cartItemDTO.getProductId();
            int quantity = cartItemDTO.getQuantity();

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new DataNotFoundException("Product not found with id: " + productId));

            orderDetail.setProduct(product);
            orderDetail.setQuantity(quantity);
            orderDetails.add(orderDetail);
        }
        orderDetailRepository.saveAll(orderDetails);
        return order;
    }

    @Override
    public Order getOrder(String id) {
        Order selectedOrder = orderRepository.findById(id).orElse(null);
        return selectedOrder;
    }

    @Override
    @Transactional
    public Order updateOrder(String id, OrderDto orderDto) throws DataNotFoundException {
        Order order = orderRepository.findById(id).orElseThrow(() ->
                new DataNotFoundException("Cannot find order with id: " + id));
        User existingUser = userRepository.findById(
                orderDto.getUserId()).orElseThrow(() ->
                new DataNotFoundException("Cannot find user with id: " + id));
        // Tạo một luồng bảng ánh xạ riêng để kiểm soát việc ánh xạ
        modelMapper.typeMap(OrderDto.class, Order.class)
                .addMappings(mapper -> mapper.skip(Order::setId));
        // Cập nhật các trường của đơn hàng từ orderDTO
        modelMapper.map(orderDto, order);
        order.setUser(existingUser);
        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public void deleteOrder(String id) {
        Order order = orderRepository.findById(id).orElse(null);
        if(order != null) {
            order.setActive(false);
            orderRepository.save(order);
        }
    }

    @Override
    public List<Order> findByUserId(String userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public Page<Order> getOrdersByKeyword(String keyword, Pageable pageable) {
        return orderRepository.findByKeyword(keyword, pageable);
    }
}
