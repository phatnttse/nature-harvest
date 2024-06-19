package com.api.nature_harvest_backend.services.product;

import com.api.nature_harvest_backend.dtos.ProductDto;
import com.api.nature_harvest_backend.exceptions.DataNotFoundException;
import com.api.nature_harvest_backend.exceptions.InvalidParamException;
import com.api.nature_harvest_backend.models.Category;
import com.api.nature_harvest_backend.models.Product;
import com.api.nature_harvest_backend.models.ProductImage;
import com.api.nature_harvest_backend.repositories.CategoryRepository;
import com.api.nature_harvest_backend.repositories.ProductImageRepository;
import com.api.nature_harvest_backend.repositories.ProductRepository;
import com.api.nature_harvest_backend.responses.product.ProductResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService implements IProductService {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    @Override
    @Transactional
    public Product createProduct(ProductDto productDto) throws DataNotFoundException {
        Category existingCategory = categoryRepository
                .findById(productDto.getCategoryId())
                .orElseThrow(() ->
                        new DataNotFoundException(
                                "Cannot find category with id: " + productDto.getCategoryId()));
        Product newProduct = Product.builder()
                .title(productDto.getTitle())
                .originalPrice(productDto.getPrice())
                .officialPrice(productDto.getPrice() - (productDto.getPrice() * productDto.getDiscount() / 100))
                .quantity(productDto.getQuantity())
                .description(productDto.getDescription())
                .thumbnail(productDto.getThumbnail())
                .category(existingCategory)
                .averageRating(BigDecimal.ZERO)
                .active(true)
                .build();
        return productRepository.save(newProduct);
    }

    @Override
    public Product getProductById(long productId) throws DataNotFoundException {
        Optional<Product> optionalProduct = productRepository.getDetailProduct(productId);

        if (optionalProduct.isPresent()) {
            if (!optionalProduct.get().isActive()) throw new DataNotFoundException("Product not found");
            return optionalProduct.get();
        }
        throw new DataNotFoundException("Cannot find product with id =" + productId);
    }

    @Override
    public List<Product> findProductsByIds(List<Long> productIds) {
        return productRepository.findProductsByIds(productIds);
    }

    @Override
    @Transactional
    public List<ProductImage> createProductImage(Long productId, List<String> urls) throws Exception {

        Product existingProduct = getProductById(productId);
        List<ProductImage> productImages = new ArrayList<>();
        for (String url : urls) {
            ProductImage newProductImage = ProductImage.builder()
                    .product(existingProduct)
                    .imageUrl(url)
                    .build();
            //Ko cho insert quá 5 ảnh cho 1 sản phẩm
            int size = productImageRepository.findByProductId(productId).size();
            if (size >= ProductImage.MAXIMUM_IMAGES_PER_PRODUCT) {
                throw new InvalidParamException(
                        "Number of images must be <= "
                                + ProductImage.MAXIMUM_IMAGES_PER_PRODUCT);
            }
            if (existingProduct.getThumbnail() == null) {
                existingProduct.setThumbnail(newProductImage.getImageUrl());
                productRepository.save(existingProduct);
            }

            productImages.add(productImageRepository.save(newProductImage));
        }
        return productImages;

    }

    @Override
    public Page<ProductResponse> getProductByPriceRange(Double minPrice, Double maxPrice, PageRequest pageRequest) {
        Page<Product> productsPage;
        productsPage = productRepository.findProductsByPriceRange(minPrice, maxPrice, pageRequest);
        return productsPage.map(ProductResponse::fromProduct);
    }

    @Override
    public Page<ProductResponse> getAllProducts(String keyword,
                                                Long categoryId,
                                                Long subcategoryId,
                                                Long minPrice,
                                                Long maxPrice,
                                                PageRequest pageRequest) {
        // Lấy danh sách sản phẩm theo trang (page), giới hạn (limit), và categoryId (nếu có)
        Page<Product> productsPage;
        productsPage = productRepository.searchProducts(categoryId, subcategoryId, keyword, minPrice, maxPrice, pageRequest);
        return productsPage.map(ProductResponse::fromProduct);
    }

    @Override
    @Transactional
    public Product updateProduct(
            long id,
            ProductDto productDto
    )
            throws Exception {
        Product existingProduct = getProductById(id);
        if (existingProduct != null) {
            Category existingCategory = categoryRepository
                    .findById(productDto.getCategoryId())
                    .orElseThrow(() ->
                            new DataNotFoundException(
                                    "Cannot find category with id: " + productDto.getCategoryId()));

            if (productDto.getTitle() != null && !productDto.getTitle().isEmpty()) {
                existingProduct.setTitle(productDto.getTitle());
            }
            if (productDto.getQuantity() >= 0) {
                existingProduct.setQuantity(productDto.getQuantity());
            }
            if (productDto.getPrice() >= 0) {
                existingProduct.setOriginalPrice(productDto.getPrice());
                existingProduct.setOfficialPrice(productDto.getPrice() - (productDto.getPrice() * productDto.getDiscount() / 100));
            }
            if (productDto.getDiscount() >= 0) {
                existingProduct.setOfficialPrice(productDto.getPrice() - (productDto.getPrice() * productDto.getDiscount() / 100));
            }
            if (productDto.getDescription() != null &&
                    !productDto.getDescription().isEmpty()) {
                existingProduct.setDescription(productDto.getDescription());
            }

            existingProduct.setCategory(existingCategory);

            return productRepository.save(existingProduct);
        }
        return null;
    }

    @Override
    @Transactional
    public void deleteProduct(long id) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        optionalProduct.ifPresent(productRepository::delete);
    }

    @Override
    public boolean existsByName(String title) {
        return productRepository.existsByTitle(title);
    }

}
