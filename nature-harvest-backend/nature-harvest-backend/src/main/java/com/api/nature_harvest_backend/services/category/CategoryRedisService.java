package com.api.nature_harvest_backend.services.category;

import com.api.nature_harvest_backend.models.Category;
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
public class CategoryRedisService implements ICategoryRedisService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper redisObjectMapper;

    @Value("${spring.data.redis.use-redis-cache}")
    private boolean useRedisCache;

    public String getKeyFrom() {
        String key = String.format("all_categories");
        return key;
    }

    @Override
    public List<Category> getAllCategories() throws JsonProcessingException {
        if (useRedisCache == false) {
            return null;
        }
        String key = this.getKeyFrom();
        String json = (String) redisTemplate.opsForValue().get(key);
        List<Category> categoryResponses =
                json != null ?
                        redisObjectMapper.readValue(json, new TypeReference<List<Category>>() {
                        })
                        : null;
        return categoryResponses;
    }

    @Override
    public void clear() {
        redisTemplate.getConnectionFactory().getConnection().flushAll();
    }

    @Override
    public void saveAllCategories(List<Category> categoryResponses) throws JsonProcessingException {
        String key = this.getKeyFrom();
        String json = redisObjectMapper.writeValueAsString(categoryResponses);
        redisTemplate.opsForValue().set(key, json);
    }
}
