package com.api.nature_harvest_backend.responses.product;

import com.api.nature_harvest_backend.models.Category;
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
    private int originalPrice;
    private int officialPrice;
    private String thumbnail;
    private String description;
    private String slug;
    private int quantity;
    private int discount;
    private int purchases;
    private BigDecimal averageRating;
    private Category category;
    private Long subCategoryId;
    private int totalPages;

    public static ProductResponse fromProduct(Product product) {
        ProductResponse productResponse = ProductResponse.builder()
                .id(product.getId())
                .title(product.getTitle())
                .originalPrice(product.getOriginalPrice())
                .officialPrice(product.getOfficialPrice())
                .thumbnail(product.getThumbnail())
                .description(product.getDescription())
                .slug(product.getSlug())
                .quantity(product.getQuantity())
                .discount(product.getDiscount())
                .purchases(product.getPurchases())
                .averageRating(product.getAverageRating())
                .category(product.getCategory())
                .subCategoryId(product.getSubcategory().getId())
                .build();
        return productResponse;
    }
}
