package com.api.nature_harvest_backend.controllers;

import com.api.nature_harvest_backend.models.OrderDetail;
import com.api.nature_harvest_backend.responses.orderdetails.OrderDetailResponse;
import com.api.nature_harvest_backend.services.orderdetails.IOrderDetailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/order-details")
@RequiredArgsConstructor
public class OrderDetailController {
    private final IOrderDetailService orderDetailService;

    @GetMapping("/order/{orderId}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<?> getOrders(@Valid @PathVariable("orderId") String orderId) {
        try {
            List<OrderDetail> orderDetails = orderDetailService.getByOrderId(orderId);
            return ResponseEntity.ok(OrderDetailResponse.fromOrderDetails(orderDetails));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
