package com.api.nature_harvest_backend.services.product;

import com.api.nature_harvest_backend.responses.product.ProductResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductRedisService implements IProductRedisService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper redisObjectMapper;

    @Value("${spring.data.redis.use-redis-cache}")
    private boolean useRedisCache;

    private String getKeyFrom(String keyword,
                              Long categoryId,
                              Long subcategoryId,
                              Long minPrice,
                              Long maxPrice,
                              PageRequest pageRequest) {
        int pageNumber = pageRequest.getPageNumber();
        int pageSize = pageRequest.getPageSize();
        Sort sort = pageRequest.getSort();
        // Lấy thông tin sắp xếp của tất cả các trường
        StringBuilder sortBuilder = new StringBuilder();
        for (Sort.Order order : sort) {
            sortBuilder.append(order.getProperty()).append("_").append(order.getDirection()).append("_");
        }
        String sortKey = sortBuilder.toString();
        // Tạo key cho redis
        String key = String.format("all_products:%s:%d:%d:%d:%d:%d:%d:%s",
                keyword, categoryId, subcategoryId, minPrice, maxPrice, pageNumber, pageSize, sortKey);
        return key;
    }


    @Override
    public List<ProductResponse> getAllProducts(String keyword,
                                                Long categoryId,
                                                Long subcategoryId,
                                                Long minPrice,
                                                Long maxPrice,
                                                PageRequest pageRequest) throws JsonProcessingException {

        if (useRedisCache == false) {
            return null;
        }
        String key = this.getKeyFrom(keyword, categoryId, subcategoryId, minPrice, maxPrice, pageRequest);
        String json = (String) redisTemplate.opsForValue().get(key);
        List<ProductResponse> productResponses =
                json != null ?
                        redisObjectMapper.readValue(json, new TypeReference<List<ProductResponse>>() {
                        })
                        : null;
        return productResponses;
    }

    @Override
    public void clear() {
        redisTemplate.getConnectionFactory().getConnection().flushAll();
    }

    @Override
    //save to Redis
    public void saveAllProducts(List<ProductResponse> productResponses,
                                String keyword,
                                Long categoryId,
                                Long subcategoryId,
                                Long minPrice,
                                Long maxPrice,
                                PageRequest pageRequest) throws JsonProcessingException {
        String key = this.getKeyFrom(keyword, categoryId, subcategoryId, minPrice, maxPrice, pageRequest);
        String json = redisObjectMapper.writeValueAsString(productResponses);
        redisTemplate.opsForValue().set(key, json);
    }
}
