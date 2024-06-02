package com.api.nature_harvest_backend.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "request_cancellations")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderCancellationRequest extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    private String reason;

    @Column(name = "request_status", nullable = false)
    private boolean requestStatus;

}
