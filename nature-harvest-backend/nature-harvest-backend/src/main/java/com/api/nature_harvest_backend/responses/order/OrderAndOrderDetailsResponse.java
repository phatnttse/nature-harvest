package com.api.nature_harvest_backend.responses.order;

import com.api.nature_harvest_backend.responses.orderdetails.OrderDetailResponse;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderAndOrderDetailsResponse {
    private OrderResponse order;
    private List<OrderDetailResponse> orderDetails;
}
