package com.api.nature_harvest_backend.services.orderdetails;

import com.api.nature_harvest_backend.dtos.order.OrderDetailDto;
import com.api.nature_harvest_backend.exceptions.DataNotFoundException;
import com.api.nature_harvest_backend.models.Order;
import com.api.nature_harvest_backend.models.OrderDetail;
import com.api.nature_harvest_backend.repositories.OrderDetailRepository;
import com.api.nature_harvest_backend.repositories.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderDetailService implements IOrderDetailService {
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;

    @Override
    public List<OrderDetail> getByOrderId(String orderId) throws Exception {
        Order order = orderRepository.findById(orderId).orElseThrow(() ->
                new DataNotFoundException("Cannot find order with id: " + orderId));

        List<OrderDetail> orderDetails = orderDetailRepository.findAllByOrder(order);
        return orderDetails;
    }

    @Override
    public OrderDetail createOrderDetail(OrderDetailDto newOrderDetail) throws Exception {
        return null;
    }

    @Override
    public OrderDetail getOrderDetail(Long id) throws DataNotFoundException {
        return null;
    }

    @Override
    public OrderDetail updateOrderDetail(Long id, OrderDetailDto newOrderDetailData) throws DataNotFoundException {
        return null;
    }

    @Override
    public void deleteById(Long id) {

    }

}
