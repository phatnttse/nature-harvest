package com.api.nature_harvest_backend.services.payment;

import com.api.nature_harvest_backend.responses.payment.MomoPaymentResponse;
import com.api.nature_harvest_backend.utils.HashUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

public class MomoPaymentService {
    private String partnerCode;
    private String requestId;
    private long amount;
    private String orderId;
    private String orderInfo;
    private String redirectUrl;
    private String ipnUrl;
    private String requestType;
    private String extraData;
    private String lang;
    private String signature;

    public MomoPaymentService(String partnerCode, String requestId, long amount, String orderId, String orderInfo, String redirectUrl, String ipnUrl, String requestType, String extraData, String lang) {
        this.partnerCode = partnerCode;
        this.requestId = requestId;
        this.amount = amount;
        this.orderId = orderId;
        this.orderInfo = orderInfo;
        this.redirectUrl = redirectUrl;
        this.ipnUrl = ipnUrl;
        this.requestType = requestType;
        this.extraData = extraData;
        this.lang = lang != null ? lang : "vi";
    }

    public void makeSignature(String accessKey, String secretKey) throws Exception {
        String rawHash = "accessKey=" + accessKey +
                "&amount=" + this.amount +
                "&extraData=" + this.extraData +
                "&ipnUrl=" + this.ipnUrl +
                "&orderId=" + this.orderId +
                "&orderInfo=" + this.orderInfo +
                "&partnerCode=" + this.partnerCode +
                "&redirectUrl=" + this.redirectUrl +
                "&requestId=" + this.requestId +
                "&requestType=" + this.requestType;
        this.signature = HashUtils.hmacSHA256(rawHash, secretKey);
    }

    public String getLink(String paymentUrl) throws Exception {
        RestTemplate restTemplate = new RestTemplate();
        ObjectMapper mapper = new ObjectMapper();
        mapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
        mapper.configure(SerializationFeature.INDENT_OUTPUT, true);

        Map<String, Object> requestDataMap = new HashMap<>();
        requestDataMap.put("partnerCode", partnerCode);
        requestDataMap.put("partnerName", "Test");
        requestDataMap.put("storeId", "Nature's Harvest");
        requestDataMap.put("autoCapture", false);
        requestDataMap.put("requestId", requestId);
        requestDataMap.put("amount", amount);
        requestDataMap.put("orderId", orderId);
        requestDataMap.put("orderInfo", orderInfo);
        requestDataMap.put("redirectUrl", redirectUrl);
        requestDataMap.put("ipnUrl", ipnUrl);
        requestDataMap.put("requestType", requestType);
        requestDataMap.put("extraData", extraData);
        requestDataMap.put("lang", lang);
        requestDataMap.put("signature", signature);

        // Chuyển đổi dữ liệu yêu cầu thành chuỗi JSON
        String requestData = mapper.writeValueAsString(requestDataMap);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");
        HttpEntity<String> request = new HttpEntity<>(requestData, headers);

        ResponseEntity<String> response = restTemplate.exchange(paymentUrl, HttpMethod.POST, request, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            MomoPaymentResponse responseData = mapper.readValue(response.getBody(), MomoPaymentResponse.class);
            if ("0".equals(responseData.getResultCode())) {
                return responseData.getPayUrl();
            } else {
                throw new RuntimeException("Error creating payment link: " + responseData.getMessage());
            }
        } else {
            throw new RuntimeException("Error creating payment link: " + response.getStatusCode().toString());
        }
    }
}
