package com.api.nature_harvest_backend.models;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;


@Entity
@Table(name = "products")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
//@EntityListeners(ProductListener.class)
public class Product extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

//    @ManyToOne
//    @JoinColumn(name = "subcategory_id")
//    private SubCategory subcategory;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "price", nullable = false)
    private int price;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    private int discount;

    @Column(name = "average_rating", precision = 2, scale = 1)
    private BigDecimal averageRating;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Rating> ratings;

    @Column(name = "thumbnail", nullable = false)
    private String thumbnail;

    @Column(name = "description", columnDefinition = "LONGTEXT")
    private String description;

    private int purchases;

    private boolean active;

    @OneToMany(mappedBy = "product",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY)
    private List<ProductImage> productImages;

}
