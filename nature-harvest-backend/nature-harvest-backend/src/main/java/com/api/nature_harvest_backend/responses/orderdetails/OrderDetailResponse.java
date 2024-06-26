package com.api.nature_harvest_backend.responses.orderdetails;

import com.api.nature_harvest_backend.models.OrderDetail;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDetailResponse {
    private String productId;
    private String productName;
    private int quantity;
    private int price;
    private String thumbnail;
    private boolean reviewed;

    public static OrderDetailResponse fromOrderDetail(OrderDetail orderDetail) {
        return OrderDetailResponse.builder()
                .productId(orderDetail.getProduct().getId().toString())
                .productName(orderDetail.getProduct().getTitle())
                .quantity(orderDetail.getQuantity())
                .price(orderDetail.getProduct().getOfficialPrice())
                .thumbnail(orderDetail.getProduct().getThumbnail())
                .reviewed(orderDetail.isReviewed())
                .build();
    }

    public static List<OrderDetailResponse> fromOrderDetails(List<OrderDetail> orderDetails) {
        return orderDetails.stream().map(OrderDetailResponse::fromOrderDetail).collect(Collectors.toList());
    }
}
