package com.api.nature_harvest_backend.services.order;

import com.api.nature_harvest_backend.dtos.order.OrderDto;
import com.fasterxml.jackson.core.JsonProcessingException;

public interface IOrderRedisService {
    OrderDto getOrder(String orderId) throws JsonProcessingException;

    void saveOrder(OrderDto orderDto) throws JsonProcessingException;

    void clear();
}
