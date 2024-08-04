package com.api.nature_harvest_backend.controllers;

import com.api.nature_harvest_backend.dtos.order.HandleOrderDto;
import com.api.nature_harvest_backend.dtos.order.OrderDto;
import com.api.nature_harvest_backend.models.Order;
import com.api.nature_harvest_backend.models.OrderStatus;
import com.api.nature_harvest_backend.responses.base.BaseResponse;
import com.api.nature_harvest_backend.responses.order.OrderAndOrderDetailsResponse;
import com.api.nature_harvest_backend.responses.order.OrderListResponse;
import com.api.nature_harvest_backend.responses.order.OrderResponse;
import com.api.nature_harvest_backend.responses.order.OrderTrackingResponse;
import com.api.nature_harvest_backend.services.order.IOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/orders")
@RequiredArgsConstructor
public class OrderController {
    private final IOrderService orderService;
//    private final KafkaTemplate<String, Object> kafkaTemplate;

    @PostMapping("")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody OrderDto orderDto,
            BindingResult result
    ) {
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .toList();
                return ResponseEntity.badRequest().body(null);
            }
            Order order = orderService.createOrder(orderDto);
//            this.kafkaTemplate.send("create-a-order", order);
//            this.kafkaTemplate.setMessageConverter(new OrderMessageConverter());
            return ResponseEntity.ok(OrderResponse.fromOrder(order));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<List<OrderAndOrderDetailsResponse>> getOrderByUser(@Valid @PathVariable("userId") String userId) {
        try {
            List<OrderAndOrderDetailsResponse> orderAndOrderDetailsResponses = orderService.getOrdersByUserId(userId);
            return ResponseEntity.ok(orderAndOrderDetailsResponses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<OrderAndOrderDetailsResponse> getOrderById(@Valid @PathVariable("id") String orderId) {
        try {
            return ResponseEntity.ok(orderService.getOrderById(orderId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/status")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<OrderTrackingResponse> getOrderByStatus(
            @RequestParam("status") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int limit
    ) {
        PageRequest pageRequest = PageRequest.of(
                page, limit,
                Sort.by("orderDate").ascending()
        );
        try {
            Page<OrderAndOrderDetailsResponse> orderPage = orderService.getOrdersByStatus(status, pageRequest);
            long totalPending = orderService.countByUserAndStatus(OrderStatus.PENDING);
            long totalConfirmed = orderService.countByUserAndStatus(OrderStatus.CONFIRMED);
            long totalPickedUp = orderService.countByUserAndStatus(OrderStatus.PICKED_UP);
            long totalOnTheWay = orderService.countByUserAndStatus(OrderStatus.ON_THE_WAY);
            long totalSuccessDelivery = orderService.countByUserAndStatus(OrderStatus.SUCCESSFUL_DELIVERY);
            long totalRefused = orderService.countByUserAndStatus(OrderStatus.REFUSED);
            long totalCanceled = orderService.countByUserAndStatus(OrderStatus.CANCELLED);
            return ResponseEntity.ok(OrderTrackingResponse.builder()
                    .orders(orderPage.getContent())
                    .totalPages(orderPage.getTotalPages())
                    .totalPending(totalPending)
                    .totalConfirmed(totalConfirmed)
                    .totalPickedUp(totalPickedUp)
                    .totalOnTheWay(totalOnTheWay)
                    .totalSuccessDelivery(totalSuccessDelivery)
                    .totalRefused(totalRefused)
                    .totalCanceled(totalCanceled)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<OrderAndOrderDetailsResponse> updateOrder(
            @Valid @PathVariable String id,
            @Valid @RequestBody OrderDto orderDto) {

        try {
            return ResponseEntity.ok(orderService.updateOrder(id, orderDto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<BaseResponse> deleteOrder(@Valid @PathVariable String id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.ok(BaseResponse.builder()
                    .message("Order deleted successfully")
                    .status(HttpStatus.OK.value())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(BaseResponse.builder()
                    .message(e.getMessage())
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        }
    }

    @GetMapping("")
    public ResponseEntity<OrderListResponse> getOrdersByKeyword(
            @RequestParam(defaultValue = "", required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int limit
    ) {
        PageRequest pageRequest = PageRequest.of(
                page, limit,
                Sort.by("orderDate").descending()
        );
        Page<OrderResponse> orderPage = orderService
                .getOrdersByKeyword(keyword, pageRequest)
                .map(OrderResponse::fromOrder);

        int totalPages = orderPage.getTotalPages();
        List<OrderResponse> orderResponses = orderPage.getContent();
        return ResponseEntity.ok(OrderListResponse
                .builder()
                .orders(orderResponses)
                .totalPages(totalPages)
                .build());
    }

    @PatchMapping("/handle")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<OrderAndOrderDetailsResponse> handleOrder(@Valid @RequestBody HandleOrderDto handleOrderDto) {
        try {
            return ResponseEntity.ok().body(orderService.handleOrder(handleOrderDto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PatchMapping("/cancel/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<OrderTrackingResponse> cancelOrder(@Valid @PathVariable String id) {
        try {
            Page<OrderAndOrderDetailsResponse> orderPage = orderService.cancelOrder(id);
            long totalPending = orderService.countByUserAndStatus(OrderStatus.PENDING);
            long totalConfirmed = orderService.countByUserAndStatus(OrderStatus.CONFIRMED);
            long totalPickedUp = orderService.countByUserAndStatus(OrderStatus.PICKED_UP);
            long totalOnTheWay = orderService.countByUserAndStatus(OrderStatus.ON_THE_WAY);
            long totalSuccessDelivery = orderService.countByUserAndStatus(OrderStatus.SUCCESSFUL_DELIVERY);
            long totalRefused = orderService.countByUserAndStatus(OrderStatus.REFUSED);
            long totalCanceled = orderService.countByUserAndStatus(OrderStatus.CANCELLED);
            return ResponseEntity.ok(OrderTrackingResponse.builder()
                    .orders(orderPage.getContent())
                    .totalPages(orderPage.getTotalPages())
                    .totalPending(totalPending)
                    .totalConfirmed(totalConfirmed)
                    .totalPickedUp(totalPickedUp)
                    .totalOnTheWay(totalOnTheWay)
                    .totalSuccessDelivery(totalSuccessDelivery)
                    .totalRefused(totalRefused)
                    .totalCanceled(totalCanceled)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
