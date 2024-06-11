package com.api.nature_harvest_backend.responses.payment;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MomoPaymentResponse {
    @JsonProperty("partnerCode")
    private String partnerCode;

    @JsonProperty("requestId")
    private String requestId;

    @JsonProperty("orderId")
    private String orderId;

    @JsonProperty("amount")
    private long amount;

    @JsonProperty("responseTime")
    private long responseTime;

    @JsonProperty("message")
    private String message;

    @JsonProperty("resultCode")
    private String resultCode;

    @JsonProperty("payUrl")
    private String payUrl;

    @JsonProperty("deeplink")
    private String deeplink;

    @JsonProperty("qrCodeUrl")
    private String qrCodeUrl;

    @JsonProperty("applink")
    private String applink;

    @JsonProperty("deeplinkMiniApp")
    private String deeplinkMiniApp;

    @JsonProperty("signature")
    private String signature;

}
