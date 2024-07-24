package com.api.nature_harvest_backend.services.order;

import com.api.nature_harvest_backend.dtos.order.OrderDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderRedisService implements IOrderRedisService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper redisObjectMapper;

    @Value("${spring.data.redis.use-redis-cache}")
    private boolean useRedisCache;

    private String getKeyFrom(String orderId) {
        return String.format("order:%s", orderId);
    }

    @Override
    public OrderDto getOrder(String orderId) throws JsonProcessingException {
        if (!useRedisCache) {
            return null;
        }
        String key = this.getKeyFrom(orderId);
        String json = (String) redisTemplate.opsForValue().get(key);
        return json != null ? redisObjectMapper.readValue(json, OrderDto.class) : null;
    }

    @Override
    public void saveOrder(OrderDto orderDto) throws JsonProcessingException {
        if (!useRedisCache) {
            return;
        }
        String key = this.getKeyFrom(orderDto.getId());
        String json = redisObjectMapper.writeValueAsString(orderDto);
        redisTemplate.opsForValue().set(key, json);
    }

    @Override
    public void clear() {
        redisTemplate.getConnectionFactory().getConnection().flushAll();
    }
}
