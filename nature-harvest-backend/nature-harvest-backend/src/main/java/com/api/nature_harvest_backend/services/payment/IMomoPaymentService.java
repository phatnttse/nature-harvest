package com.api.nature_harvest_backend.services.payment;

public interface IMomoPaymentService {
    void makeSignature(String accessKey, String secretKey) throws Exception;
    String getLink(String paymentUrl) throws Exception;
}
