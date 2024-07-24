package com.api.nature_harvest_backend.models;

import com.api.nature_harvest_backend.listener.CategoryListener;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categories")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EntityListeners(CategoryListener.class)
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long id;

    private String thumbnail;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(name = "name", nullable = false)
    private String name;

    private boolean active;
}
