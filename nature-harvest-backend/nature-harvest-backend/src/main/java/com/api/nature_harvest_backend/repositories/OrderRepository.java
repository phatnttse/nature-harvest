package com.api.nature_harvest_backend.repositories;

import com.api.nature_harvest_backend.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    // Các phương thức tùy chỉnh khác có thể được thêm ở đây nếu cần
}