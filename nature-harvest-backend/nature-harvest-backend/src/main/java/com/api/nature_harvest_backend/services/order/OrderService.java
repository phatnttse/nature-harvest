package com.api.nature_harvest_backend.services.order;

import com.api.nature_harvest_backend.dtos.OrderDto;
import com.api.nature_harvest_backend.exceptions.DataNotFoundException;
import com.api.nature_harvest_backend.models.*;
import com.api.nature_harvest_backend.repositories.*;
import com.api.nature_harvest_backend.utils.HashUtils;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService {
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final ModelMapper modelMapper;
    private final CartRepository cartRepository;

    @Override
    @Transactional
    public Order createOrder(OrderDto orderDto) throws Exception {
        User user = userRepository
                .findById(orderDto.getUserId())
                .orElseThrow(() -> new DataNotFoundException("Cannot find user with id: " + orderDto.getUserId()));

        modelMapper.typeMap(OrderDto.class, Order.class)
                .addMappings(mapper -> mapper.skip(Order::setId));

        Order order = new Order();
        modelMapper.map(orderDto, order);
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        if (orderDto.getPaymentMethod().equals(Payment.VNPAY) | orderDto.getPaymentMethod().equals(Payment.MOMO)) {
            order.setPaymentStatus(Payment.PAID);
            order.setId(orderDto.getId());
        } else {
            order.setPaymentStatus(Payment.UNPAID);
            order.setId("Vit-" + HashUtils.getRandomNumber(8));
        }
        order.setDeliveryDate(LocalDate.now().plusDays(3));
        order.setActive(true);
        order.setOrderDate(LocalDate.now());
        orderRepository.save(order);

        List<Cart> cartItems = cartRepository.findByUser(user);

        List<OrderDetail> orderDetails = new ArrayList<>();
        for (Cart cartItem : cartItems) {
            // Tạo một đối tượng OrderDetail từ CartItemDTO
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setOrder(order);

            // Lấy thông tin sản phẩm từ cartItemDTO
            Long productId = cartItem.getProduct().getId();
            int quantity = cartItem.getQuantity();

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
    public Order getOrder(String id) throws Exception {
        Order order = orderRepository.findById(id).orElseThrow(() ->
                new DataNotFoundException("Cannot find order with id: " + id));
        return order;
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
        if (order != null) {
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
