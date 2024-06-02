package com.api.nature_harvest_backend.responses.product;

import com.api.nature_harvest_backend.models.Product;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductResponse {
    private Long id;
    private String title;
    private int price;
    private String thumbnail;
    private String description;
    private int quantity;
    private int discount;
    private int purchases;
    private BigDecimal averageRating;
    private Long categoryId;
//    private Long subCategoryId;
    private int totalPages;
    public static ProductResponse fromProduct(Product product) {
        ProductResponse productResponse = ProductResponse.builder()
                .id(product.getId())
                .title(product.getTitle())
                .price(product.getPrice())
                .thumbnail(product.getThumbnail())
                .description(product.getDescription())
                .quantity(product.getQuantity())
                .discount(product.getDiscount())
                .purchases(product.getPurchases())
                .averageRating(product.getAverageRating())
                .categoryId(product.getCategory().getId())
//                .subCategoryId(product.getSubcategory().getId())
                .build();
        return productResponse;
    }
}
