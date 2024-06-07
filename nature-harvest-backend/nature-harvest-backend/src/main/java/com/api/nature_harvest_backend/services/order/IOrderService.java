package com.api.nature_harvest_backend.services.order;

import com.api.nature_harvest_backend.dtos.OrderDto;
import com.api.nature_harvest_backend.exceptions.DataNotFoundException;
import com.api.nature_harvest_backend.models.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.text.SimpleDateFormat;
import java.util.List;

public interface IOrderService {
    Order createOrder(OrderDto orderDto) throws Exception;
    Order getOrder(String id);
    Order updateOrder(String id, OrderDto orderDto) throws DataNotFoundException;
    void deleteOrder(String id);
    List<Order> findByUserId(String userId);
    Page<Order> getOrdersByKeyword(String keyword, Pageable pageable);
    String generateOrderInfo(OrderDto orderDto);
    Order createOrderWithToken(String token) throws Exception;
}
