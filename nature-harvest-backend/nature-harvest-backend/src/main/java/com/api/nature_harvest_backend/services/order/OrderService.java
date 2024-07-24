package com.api.nature_harvest_backend.services.order;

import com.api.nature_harvest_backend.dtos.order.HandleOrderDto;
import com.api.nature_harvest_backend.dtos.order.OrderDto;
import com.api.nature_harvest_backend.exceptions.DataNotFoundException;
import com.api.nature_harvest_backend.models.*;
import com.api.nature_harvest_backend.repositories.*;
import com.api.nature_harvest_backend.responses.order.OrderAndOrderDetailsResponse;
import com.api.nature_harvest_backend.responses.order.OrderResponse;
import com.api.nature_harvest_backend.responses.orderdetails.OrderDetailResponse;
import com.api.nature_harvest_backend.utils.HashUtils;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.*;
import org.springframework.security.core.context.SecurityContextHolder;
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
        order.setId("Vit-" + HashUtils.getRandomNumber(8));
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        if (orderDto.getPaymentMethod().equals(Payment.VNPAY) | orderDto.getPaymentMethod().equals(Payment.MOMO)) {
            order.setPaymentStatus(Payment.PAID);
        } else {
            order.setPaymentStatus(Payment.UNPAID);
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
    public OrderAndOrderDetailsResponse getOrderById(String id) throws Exception {
        Order order = orderRepository.findById(id).orElseThrow(() ->
                new DataNotFoundException("Cannot find order with id: " + id));
        OrderResponse orderResponse = OrderResponse.fromOrder(order);
        List<OrderDetailResponse> orderDetailResponses = OrderDetailResponse.fromOrderDetails(orderDetailRepository.findAllByOrder(order));
        return OrderAndOrderDetailsResponse.builder()
                .order(orderResponse)
                .orderDetails(orderDetailResponses)
                .build();
    }

    @Override
    @Transactional
    public OrderAndOrderDetailsResponse updateOrder(String id, OrderDto orderDto) throws Exception {
        Order order = orderRepository.findById(id).orElseThrow(() ->
                new DataNotFoundException("Cannot find order with id: " + id));
        User existingUser = userRepository.findById(
                orderDto.getUserId()).orElseThrow(() ->
                new DataNotFoundException("Cannot find user with id: " + id));
        String existingEmail = order.getEmail();
        String existingPaymentMethod = order.getPaymentMethod();
        // Tạo một luồng bảng ánh xạ riêng để kiểm soát việc ánh xạ
        modelMapper.typeMap(OrderDto.class, Order.class)
                .addMappings(mapper -> mapper.skip(Order::setId));
        // Cập nhật các trường của đơn hàng từ orderDTO
        modelMapper.map(orderDto, order);
        // Restore existing values if null in DTO
        if (orderDto.getEmail() == null) {
            order.setEmail(existingEmail);
        }
        if (orderDto.getPaymentMethod() == null) {
            order.setPaymentMethod(existingPaymentMethod);
        }
        orderRepository.save(order);
        OrderResponse orderResponse = OrderResponse.fromOrder(order);
        List<OrderDetailResponse> orderDetailResponses = OrderDetailResponse.fromOrderDetails(orderDetailRepository.findAllByOrder(order));
        return OrderAndOrderDetailsResponse.builder()
                .order(orderResponse)
                .orderDetails(orderDetailResponses)
                .build();
    }

    @Override
    @Transactional
    public void deleteOrder(String id) throws DataNotFoundException {
        Order order = orderRepository.findById(id).orElseThrow(() -> new DataNotFoundException("Cannot find order with id: " + id));
        order.setActive(false);
        orderRepository.save(order);
    }

    @Override
    public List<OrderAndOrderDetailsResponse> getOrdersByUserId(String userId) throws Exception {
        User user = userRepository
                .findById(userId)
                .orElseThrow(() -> new DataNotFoundException("Cannot find user with id: " + userId));
        List<Order> orders = orderRepository.findByUserAndReviewed(user, false);
        List<OrderAndOrderDetailsResponse> orderAndOrderDetailsResponses = new ArrayList<>();
        for (Order order : orders) {
            List<OrderDetail> orderDetails = orderDetailRepository.findAllByOrder(order);
            OrderResponse orderResponse = OrderResponse.fromOrder(order);
            List<OrderDetailResponse> orderDetailResponses = OrderDetailResponse.fromOrderDetails(orderDetails);
            OrderAndOrderDetailsResponse response = OrderAndOrderDetailsResponse.builder()
                    .order(orderResponse)
                    .orderDetails(orderDetailResponses)
                    .build();
            orderAndOrderDetailsResponses.add(response);
        }
        return orderAndOrderDetailsResponses;
    }

    @Override
    public Page<Order> getOrdersByKeyword(String keyword, Pageable pageable) {
        return orderRepository.findByKeyword(keyword, pageable);
    }

    @Override
    @Transactional
    public OrderAndOrderDetailsResponse handleOrder(HandleOrderDto handleOrderDto) throws Exception {
        Order order = orderRepository.findById(handleOrderDto.getOrderId()).orElseThrow(() ->
                new DataNotFoundException("Cannot find order with id: " + handleOrderDto.getOrderId()));
        order.setStatus(handleOrderDto.getStatus().toLowerCase());
        orderRepository.save(order);
        OrderResponse orderResponse = OrderResponse.fromOrder(order);
        List<OrderDetailResponse> orderDetailResponses = OrderDetailResponse.fromOrderDetails(orderDetailRepository.findAllByOrder(order));
        return OrderAndOrderDetailsResponse.builder()
                .order(orderResponse)
                .orderDetails(orderDetailResponses)
                .build();
    }

    @Override
    public Page<OrderAndOrderDetailsResponse> getOrdersByStatus(String status, Pageable pageable) throws Exception {
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Page<Order> orders = orderRepository.findByUserAndStatus(loggedInUser, status, pageable);
        List<OrderAndOrderDetailsResponse> orderAndOrderDetailsResponses = new ArrayList<>();
        for (Order order : orders) {
            List<OrderDetail> orderDetails = orderDetailRepository.findAllByOrder(order);
            OrderResponse orderResponse = OrderResponse.fromOrder(order);
            List<OrderDetailResponse> orderDetailResponses = OrderDetailResponse.fromOrderDetails(orderDetails);
            OrderAndOrderDetailsResponse response = OrderAndOrderDetailsResponse.builder()
                    .order(orderResponse)
                    .orderDetails(orderDetailResponses)
                    .build();
            orderAndOrderDetailsResponses.add(response);
        }
        return new PageImpl<>(orderAndOrderDetailsResponses, pageable, orders.getTotalElements());
    }

    @Override
    public long countByUserAndStatus(String status) {
        User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return orderRepository.countByUserAndStatus(loggedInUser, status);
    }

    @Override
    public Page<OrderAndOrderDetailsResponse> cancelOrder(String id) throws Exception {
        Order order = orderRepository.findById(id).orElseThrow(() ->
                new DataNotFoundException("Cannot find order with id: " + id));
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
        PageRequest pageRequest = PageRequest.of(
                0, 3,
                Sort.by("orderDate").ascending());
        return getOrdersByStatus(OrderStatus.PENDING, pageRequest);
    }
}
