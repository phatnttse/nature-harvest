package com.api.nature_harvest_backend.responses.order;

import com.api.nature_harvest_backend.models.Order;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderResponse {
    private String id;
    private String userId;
    private String email;
    private String name;
    private String phone;
    private String deliveryAddress;
    private String note;
    private String status;
    private String paymentStatus;
    private String paymentMethod;
    private LocalDate orderDate;
    private LocalDate deliveryDate;
    private int amount;
    private boolean reviewed;

    public static OrderResponse fromOrder(Order order) {
        return OrderResponse
                .builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .name(order.getName())
                .phone(order.getPhone())
                .email(order.getEmail())
                .deliveryAddress(order.getDeliveryAddress())
                .note(order.getNote())
                .status(order.getStatus())
                .amount(order.getAmount())
                .paymentStatus(order.getPaymentStatus())
                .paymentMethod(order.getPaymentMethod())
                .orderDate(order.getOrderDate())
                .paymentMethod(order.getPaymentMethod())
                .deliveryDate(order.getDeliveryDate())
                .reviewed(order.isReviewed())
                .build();
    }

    public static List<OrderResponse> fromOrderList(List<Order> orderList) {
        return orderList.stream().map(order -> {
            return OrderResponse.builder()
                    .id(order.getId())
                    .userId(order.getUser().getId())
                    .name(order.getName())
                    .phone(order.getPhone())
                    .email(order.getEmail())
                    .deliveryAddress(order.getDeliveryAddress())
                    .note(order.getNote())
                    .status(order.getStatus())
                    .amount(order.getAmount())
                    .paymentStatus(order.getPaymentStatus())
                    .paymentMethod(order.getPaymentMethod())
                    .orderDate(order.getOrderDate())
                    .paymentMethod(order.getPaymentMethod())
                    .deliveryDate(order.getDeliveryDate())
                    .build();
        }).collect(Collectors.toList());
    }
}
