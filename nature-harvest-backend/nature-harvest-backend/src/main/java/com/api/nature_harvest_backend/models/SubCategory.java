package com.api.nature_harvest_backend.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "subcategories")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "subcategory_id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

}
