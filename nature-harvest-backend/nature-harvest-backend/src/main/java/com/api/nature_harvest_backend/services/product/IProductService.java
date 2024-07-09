package com.api.nature_harvest_backend.services.product;

import com.api.nature_harvest_backend.dtos.product.ProductDto;
import com.api.nature_harvest_backend.exceptions.DataNotFoundException;
import com.api.nature_harvest_backend.models.Product;
import com.api.nature_harvest_backend.models.ProductImage;
import com.api.nature_harvest_backend.responses.product.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public interface IProductService {
    Product createProduct(ProductDto productDto) throws Exception;

    Product getProductById(long id) throws Exception;

    public Page<ProductResponse> getAllProducts(String keyword,
                                                Long categoryId,
                                                Long subcategoryId,
                                                String categorySlug,
                                                String subcategorySlug,
                                                Long minPrice,
                                                Long maxPrice,
                                                PageRequest pageRequest);

    Product updateProduct(long id, ProductDto productDto) throws Exception;

    boolean deleteProduct(long id) throws DataNotFoundException;

    boolean existsByName(String name);

    List<Product> findProductsByIds(List<Long> productIds);

    void createProductImage(
            Product product,
            List<String> urls) throws Exception;

    List<ProductImage> updateProductImage(
            Long productId,
            List<String> urls) throws Exception;

    Page<ProductResponse> getProductByPriceRange(Double minPrice, Double maxPrice, PageRequest pageRequest);

    Product getProductBySlug(String slug) throws Exception;
}
