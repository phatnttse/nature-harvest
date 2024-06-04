package com.api.nature_harvest_backend.responses.product;

import com.api.nature_harvest_backend.models.Category;
import com.api.nature_harvest_backend.models.Product;
import com.api.nature_harvest_backend.models.ProductImage;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductDetailResponse {
    private Long id;
    private String title;
    private int price;
    private String thumbnail;
    private String description;
    private int quantity;
    private int discount;
    private int purchases;
    private BigDecimal averageRating;
    private Category category;
    private List<ProductImage> productImages;

    public static ProductDetailResponse fromProductDetail(Product product) {
        ProductDetailResponse productDetailResponse = ProductDetailResponse.builder()
                .id(product.getId())
                .title(product.getTitle())
                .price(product.getPrice())
                .thumbnail(product.getThumbnail())
                .description(product.getDescription())
                .quantity(product.getQuantity())
                .discount(product.getDiscount())
                .purchases(product.getPurchases())
                .averageRating(product.getAverageRating())
                .category(product.getCategory())
                .productImages(product.getProductImages())
                .build();
        return productDetailResponse;
    }
}
