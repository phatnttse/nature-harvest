package com.api.nature_harvest_backend.repositories;

import com.api.nature_harvest_backend.models.Order;
import com.api.nature_harvest_backend.models.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
}
