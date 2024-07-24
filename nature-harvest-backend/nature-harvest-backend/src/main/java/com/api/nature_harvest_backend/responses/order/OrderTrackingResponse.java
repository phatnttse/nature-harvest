package com.api.nature_harvest_backend.responses.order;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderTrackingResponse {
    private List<OrderAndOrderDetailsResponse> orders;
    private int totalPages;
    private long totalPending;
    private long totalConfirmed;
    private long totalPickedUp;
    private long totalOnTheWay;
    private long totalSuccessDelivery;
    private long totalRefused;
    private long totalCanceled;
}
