package com.api.nature_harvest_backend.configurations;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "momo")
@Getter
@Setter
public class MomoConfig {
    private String partnerCode;
    private String returnUrl;
    private String ipnUrl;
    private String accessKey;
    private String secretKey;
    private String paymentUrl;
}