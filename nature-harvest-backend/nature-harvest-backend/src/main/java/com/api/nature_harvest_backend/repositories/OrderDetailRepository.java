package com.api.nature_harvest_backend.repositories;

import com.api.nature_harvest_backend.models.Order;
import com.api.nature_harvest_backend.models.OrderDetail;
import com.api.nature_harvest_backend.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    List<OrderDetail> findAllByOrder(Order order) throws Exception;

    OrderDetail findByOrderAndProduct(Order order, Product product);

    boolean existsByOrderIdAndProductId(String orderId, Long productId);

    @Query("SELECT CASE WHEN COUNT(od) > 0 THEN TRUE ELSE FALSE END " +
            "FROM OrderDetail od " +
            "WHERE od.order.id = :orderId " +
            "AND od.reviewed = FALSE")
    boolean existsUnreviewedOrderDetailsByOrderId(@Param("orderId") String orderId);
}
