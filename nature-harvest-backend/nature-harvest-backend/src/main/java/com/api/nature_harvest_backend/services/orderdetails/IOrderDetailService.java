package com.api.nature_harvest_backend.services.orderdetails;

import com.api.nature_harvest_backend.dtos.order.OrderDetailDto;
import com.api.nature_harvest_backend.exceptions.DataNotFoundException;
import com.api.nature_harvest_backend.models.OrderDetail;

import java.util.List;

public interface IOrderDetailService {
    OrderDetail createOrderDetail(OrderDetailDto newOrderDetail) throws Exception;

    OrderDetail getOrderDetail(Long id) throws DataNotFoundException;

    OrderDetail updateOrderDetail(Long id, OrderDetailDto newOrderDetailData)
            throws DataNotFoundException;

    void deleteById(Long id);

    List<OrderDetail> getByOrderId(String orderId) throws Exception;
}
