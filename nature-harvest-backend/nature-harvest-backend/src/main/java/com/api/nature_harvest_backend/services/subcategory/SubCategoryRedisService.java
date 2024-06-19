package com.api.nature_harvest_backend.services.subcategory;

import com.api.nature_harvest_backend.models.SubCategory;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubCategoryRedisService implements ISubCategoryRedisService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper redisObjectMapper;
    @Value("${spring.data.redis.use-redis-cache}")
    private boolean useRedisCache;

    public String getKeyFrom(Long categoryId) {
        String key = String.format("all_subcategories:%d", categoryId);
        return key;
    }

    @Override
    public List<SubCategory> getAllSubCategoriesByCategory(Long categoryId) throws JsonProcessingException {
        if (useRedisCache == false) {
            return null;
        }
        String key = this.getKeyFrom(categoryId);
        String json = (String) redisTemplate.opsForValue().get(key);
        List<SubCategory> subcategoryResponses =
                json != null ?
                        redisObjectMapper.readValue(json, new TypeReference<List<SubCategory>>() {
                        })
                        : null;
        return subcategoryResponses;
    }

    @Override
    public void clear() {
        redisTemplate.getConnectionFactory().getConnection().flushAll();
    }

    @Override
    public void saveAllSubCategoriesByCategory(List<SubCategory> subcategoryResponses, Long categoryId) throws JsonProcessingException {
        String key = this.getKeyFrom(categoryId);
        String json = redisObjectMapper.writeValueAsString(subcategoryResponses);
        redisTemplate.opsForValue().set(key, json);
    }
}
