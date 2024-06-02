package com.api.nature_harvest_backend.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "orders")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private String id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "delivery_address", nullable = false)
    private String deliveryAddress;

    @Column(name = "note", columnDefinition = "LONGTEXT")
    private String note;

    @ManyToOne
    @JoinColumn(name = "previous_status", nullable = false)
    private OrderStatus previousStatus;

    @ManyToOne
    @JoinColumn(name = "current_status", nullable = false)
    private OrderStatus currentStatus;

    @Column(name = "payment_status", nullable = false)
    private boolean paymentStatus;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    @Column(name = "order_date", nullable = false, updatable = false)
    private LocalDateTime orderDate;

    @Column(name = "delivery_date")
    private LocalDateTime deliveryDate;

    @Column(name = "amount", nullable = false)
    private int amount;

    private boolean active;


}
