package com.api.nature_harvest_backend.responses.order;

import com.api.nature_harvest_backend.responses.orderdetails.OrderDetailResponse;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderAndOrderDetailsResponse {
    private String id;
    private String userId;
    private String email;
    private String name;
    private String phone;
    private String deliveryAddress;
    private String note;
    private String status;
    private String paymentStatus;
    private String paymentMethod;
    private LocalDate orderDate;
    private LocalDate deliveryDate;
    private int amount;
    private List<OrderDetailResponse> orderDetails;
}
