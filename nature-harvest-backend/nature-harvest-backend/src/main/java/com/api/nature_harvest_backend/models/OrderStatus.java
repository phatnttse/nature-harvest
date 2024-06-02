package com.api.nature_harvest_backend.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_status")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "status_id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;
}
