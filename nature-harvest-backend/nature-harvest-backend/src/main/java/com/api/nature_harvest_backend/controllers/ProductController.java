package com.api.nature_harvest_backend.controllers;

import com.api.nature_harvest_backend.dtos.product.ProductDto;
import com.api.nature_harvest_backend.dtos.product.ProductImageDto;
import com.api.nature_harvest_backend.models.Product;
import com.api.nature_harvest_backend.models.ProductImage;
import com.api.nature_harvest_backend.responses.base.BaseResponse;
import com.api.nature_harvest_backend.responses.product.ProductDetailResponse;
import com.api.nature_harvest_backend.responses.product.ProductListResponse;
import com.api.nature_harvest_backend.responses.product.ProductResponse;
import com.api.nature_harvest_backend.services.product.IProductRedisService;
import com.api.nature_harvest_backend.services.product.IProductService;
import com.fasterxml.jackson.core.JsonProcessingException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("${api.prefix}/products")
@RequiredArgsConstructor
public class ProductController {
    private final IProductService productService;
    private final IProductRedisService productRedisService;
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);

    @PostMapping("")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody ProductDto productDto,
            BindingResult result
    ) {
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .toList();
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
            Product newProduct = productService.createProduct(productDto);
            return ResponseEntity.ok(ProductResponse.fromProduct(newProduct));
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("")
    public ResponseEntity<ProductListResponse> getProducts(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0", name = "categoryId") Long categoryId,
            @RequestParam(defaultValue = "0", name = "subcategoryId") Long subcategoryId,
            @RequestParam(defaultValue = "", name = "categorySlug") String categorySlug,
            @RequestParam(defaultValue = "", name = "subcategorySlug") String subcategorySlug,
            @RequestParam(defaultValue = "id", name = "sortBy") String sortBy,
            @RequestParam(defaultValue = "ascending", name = "arrange") String arrange,
            @RequestParam(defaultValue = "0") Long minPrice,
            @RequestParam(defaultValue = "10000000") Long maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int limit
    ) throws JsonProcessingException {
        int totalPages = 0;
        //productRedisService.clear();

        PageRequest pageRequest;

        if (arrange.equals("descending")) {
            pageRequest = PageRequest.of(
                    page, limit,
                    Sort.by(sortBy).descending()
            );
        } else {
            pageRequest = PageRequest.of(
                    page, limit,
                    Sort.by(sortBy).ascending()
            );
        }
        List<ProductResponse> productResponses = productRedisService
                .getAllProducts(keyword, categoryId,
                        subcategoryId,
                        categorySlug,
                        subcategorySlug,
                        minPrice,
                        maxPrice,
                        pageRequest);
        if (productResponses != null) {
            totalPages = productResponses.get(0).getTotalPages();
        }
        if (productResponses == null) {
            Page<ProductResponse> productPage = productService
                    .getAllProducts(keyword, categoryId,
                            subcategoryId,
                            categorySlug,
                            subcategorySlug,
                            minPrice,
                            maxPrice,
                            pageRequest);

            totalPages = productPage.getTotalPages();
            productResponses = productPage.getContent();
            // Bổ sung totalPages vào các đối tượng ProductResponse
            for (ProductResponse product : productResponses) {
                product.setTotalPages(totalPages);
            }
            productRedisService.saveAllProducts(
                    productResponses,
                    keyword,
                    categoryId,
                    subcategoryId,
                    categorySlug,
                    subcategorySlug,
                    minPrice,
                    maxPrice,
                    pageRequest
            );
        }
        Page<ProductResponse> productPage = productService
                .getAllProducts(keyword, categoryId,
                        subcategoryId,
                        categorySlug,
                        subcategorySlug,
                        minPrice,
                        maxPrice,
                        pageRequest);

        return ResponseEntity.ok(ProductListResponse
                .builder()
                .products(productResponses)
                .totalPages(totalPages)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailResponse> getProductById(
            @PathVariable("id") Long productId
    ) {
        try {
            Product existingProduct = productService.getProductById(productId);
            return ResponseEntity.ok(ProductDetailResponse.fromProductDetail(existingProduct));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ProductDetailResponse> getProductBySlug(
            @PathVariable("slug") String slug
    ) {
        try {
            Product existingProduct = productService.getProductBySlug(slug);
            return ResponseEntity.ok(ProductDetailResponse.fromProductDetail(existingProduct));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }

    }

    @PostMapping("/update-images/{id}")
    public ResponseEntity<List<ProductImage>> updateProductImage(
            @PathVariable("id") Long productId,
            @RequestBody ProductImageDto productImageDto) {
        try {
            List<ProductImage> productImages = productService.updateProductImage(productId, productImageDto.getUrls());
            return ResponseEntity.ok(productImages);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }

    }

    @GetMapping("/by-ids")
    public ResponseEntity<?> getProductsByIds(@RequestParam("ids") String ids) {
        //eg: 1,3,5,7
        try {
            // Tách chuỗi ids thành một mảng các số nguyên
            List<Long> productIds = Arrays.stream(ids.split(","))
                    .map(Long::parseLong)
                    .collect(Collectors.toList());
            List<Product> products = productService.findProductsByIds(productIds);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Operation(security = {@SecurityRequirement(name = "bearer-key")})
    public ResponseEntity<BaseResponse> deleteProduct(@PathVariable long id) {
        try {
            if (productService.deleteProduct(id)) {
                return ResponseEntity.ok().body(BaseResponse.builder()
                        .message("Delete product successfully")
                        .status(HttpStatus.OK.value())
                        .build());
            } else {
                return ResponseEntity.ok().body(BaseResponse.builder()
                        .message("Delete product fail")
                        .status(HttpStatus.BAD_REQUEST.value())
                        .build());
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(BaseResponse.builder()
                    .message(e.getMessage())
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Operation(security = {@SecurityRequirement(name = "bearer-key")})
    public ResponseEntity<ProductDetailResponse> updateProduct(
            @PathVariable long id,
            @RequestBody ProductDto productDto) {
        try {
            Product updatedProduct = productService.updateProduct(id, productDto);
            return ResponseEntity.ok(ProductDetailResponse.fromProductDetail(updatedProduct));
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/filter-by-price")
    public ResponseEntity<ProductListResponse> getProductByPriceRange(
            @RequestParam Double minPrice,
            @RequestParam Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int limit) {
        try {
            int totalPages = 0;
            PageRequest pageRequest = PageRequest.of(
                    page, limit,
                    Sort.by("officialPrice").ascending()
            );
            Page<ProductResponse> productPage = productService.getProductByPriceRange(minPrice, maxPrice, pageRequest);
            totalPages = productPage.getTotalPages();
            List<ProductResponse> productResponses = productPage.getContent();

            for (ProductResponse product : productResponses) {
                product.setTotalPages(totalPages);
            }
            return ResponseEntity.ok(ProductListResponse
                    .builder()
                    .products(productResponses)
                    .totalPages(totalPages)
                    .build());
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

}
