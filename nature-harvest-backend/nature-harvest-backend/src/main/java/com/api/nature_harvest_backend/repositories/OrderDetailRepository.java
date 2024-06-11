package com.api.nature_harvest_backend.repositories;

import com.api.nature_harvest_backend.models.Order;
import com.api.nature_harvest_backend.models.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    List<OrderDetail> findAllByOrder(Order order) throws Exception;
}
