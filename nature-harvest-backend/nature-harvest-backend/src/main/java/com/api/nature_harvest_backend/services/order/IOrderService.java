package com.api.nature_harvest_backend.services.order;

import com.api.nature_harvest_backend.dtos.order.HandleOrderDto;
import com.api.nature_harvest_backend.dtos.order.OrderDto;
import com.api.nature_harvest_backend.exceptions.DataNotFoundException;
import com.api.nature_harvest_backend.models.Order;
import com.api.nature_harvest_backend.responses.order.OrderAndOrderDetailsResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IOrderService {
    Order createOrder(OrderDto orderDto) throws Exception;

    OrderAndOrderDetailsResponse getOrderById(String id) throws Exception;

    OrderAndOrderDetailsResponse updateOrder(String id, OrderDto orderDto) throws Exception;

    void deleteOrder(String id) throws DataNotFoundException;

    List<OrderAndOrderDetailsResponse> getOrdersByUserId(String userId) throws Exception;

    Page<Order> getOrdersByKeyword(String keyword, Pageable pageable);

    OrderAndOrderDetailsResponse handleOrder(HandleOrderDto handleOrderDto) throws Exception;
}
