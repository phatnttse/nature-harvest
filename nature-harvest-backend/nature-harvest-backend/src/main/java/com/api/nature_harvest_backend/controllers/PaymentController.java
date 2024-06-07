package com.api.nature_harvest_backend.controllers;

import com.api.nature_harvest_backend.configurations.VnpayConfig;
import com.api.nature_harvest_backend.dtos.PaymentDto;
import com.api.nature_harvest_backend.models.Order;
import com.api.nature_harvest_backend.services.order.IOrderService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final IOrderService orderService;

    @PostMapping("/create_payment")
    public String createPayment(@Valid @RequestBody PaymentDto paymentDto) throws UnsupportedEncodingException {

        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";
        long amount = paymentDto.getAmount() * 100;
        String bankCode = paymentDto.getBankCode();

        String vnp_TxnRef = VnpayConfig.getRandomNumber(8);
        String vnp_IpAddr = "127.0.0.1";

        String vnp_TmnCode = VnpayConfig.vnp_TmnCode;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");

        if (bankCode != null && !bankCode.isEmpty()) {
            vnp_Params.put("vnp_BankCode", bankCode);
        }
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", orderType);

        String locate = paymentDto.getLanguage();
        if (locate != null && !locate.isEmpty()) {
            vnp_Params.put("vnp_Locale", locate);
        } else {
            vnp_Params.put("vnp_Locale", "vn");
        }

        String token = orderService.generateOrderInfo(paymentDto.getOder());

        vnp_Params.put("vnp_ReturnUrl", VnpayConfig.vnp_ReturnUrl + "?token=" + token);

        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                //Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VnpayConfig.hmacSHA512(VnpayConfig.secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = VnpayConfig.vnp_PayUrl + "?" + queryUrl;

        return paymentUrl;
    }

    @GetMapping("callback")
    public void paymentCallback(@RequestParam Map<String, String> queryParams, HttpServletResponse response) throws Exception {
        try {
            String vnp_ResponseCode = queryParams.get("vnp_ResponseCode");
            String token = queryParams.get("token");
//            String orderId = queryParams.get("vnp_TxnRef");
//            String transactionDate = queryParams.get("vnp_PayDate");
//            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");

            if (token != null && !token.isEmpty()) {
                if ("00".equals(vnp_ResponseCode)) {
                    Order newOrder = orderService.createOrderWithToken(token);
                    response.sendRedirect("http://localhost:4200");
                } else {
                    response.sendRedirect("http://localhost:4200/fail");
                }
            }

        } catch (Exception e) {
            response.sendRedirect("http://localhost:4200/fail");
            System.out.println(e.getMessage());
        }
    }
}
