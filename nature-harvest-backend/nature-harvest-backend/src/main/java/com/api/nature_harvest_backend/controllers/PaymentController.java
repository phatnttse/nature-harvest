package com.api.nature_harvest_backend.controllers;

import com.api.nature_harvest_backend.configurations.MomoConfig;
import com.api.nature_harvest_backend.configurations.VnpayConfig;
import com.api.nature_harvest_backend.dtos.cart.CartDto;
import com.api.nature_harvest_backend.dtos.order.OrderDto;
import com.api.nature_harvest_backend.dtos.payment.MomoPaymentDto;
import com.api.nature_harvest_backend.dtos.payment.VnPayPaymentDto;
import com.api.nature_harvest_backend.models.Order;
import com.api.nature_harvest_backend.services.cart.ICartService;
import com.api.nature_harvest_backend.services.order.IOrderService;
import com.api.nature_harvest_backend.services.payment.MomoPaymentService;
import com.api.nature_harvest_backend.utils.HashUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("${api.prefix}/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final IOrderService orderService;
    private final ICartService cartService;
    private final VnpayConfig vnpayConfig;
    private final MomoConfig momoConfig;

    @PostMapping("/vnpay-pay")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<String> createPayment(@Valid @RequestBody VnPayPaymentDto vnPayPaymentDto) throws UnsupportedEncodingException {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";
        int amount = vnPayPaymentDto.getOrder().getAmount() * 100;
        String bankCode = vnPayPaymentDto.getBankCode();

        String vnp_TxnRef = vnpayConfig.getRandomNumber(8);
        String vnp_IpAddr = "127.0.0.1";

        String vnp_TmnCode = vnpayConfig.getVnp_TmnCode();

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

        String locate = vnPayPaymentDto.getLanguage();
        if (locate != null && !locate.isEmpty()) {
            vnp_Params.put("vnp_Locale", locate);
        } else {
            vnp_Params.put("vnp_Locale", "vn");
        }

        vnp_Params.put("vnp_ReturnUrl", vnpayConfig.getVnp_ReturnUrl()
                + "?userId=" + vnPayPaymentDto.getOrder().getUserId()
                + "&email=" + vnPayPaymentDto.getOrder().getEmail()
                + "&name=" + URLEncoder.encode(vnPayPaymentDto.getOrder().getName(), StandardCharsets.UTF_8.toString())
                + "&phone=" + vnPayPaymentDto.getOrder().getPhone()
                + "&deliveryAddress=" + URLEncoder.encode(vnPayPaymentDto.getOrder().getDeliveryAddress(), StandardCharsets.UTF_8.toString())
                + "&note=" + URLEncoder.encode(vnPayPaymentDto.getOrder().getNote(), StandardCharsets.UTF_8.toString())
                + "&paymentMethod=" + vnPayPaymentDto.getOrder().getPaymentMethod()
        );
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
        String vnp_SecureHash = vnpayConfig.hmacSHA512(vnpayConfig.getSecretKey(), hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = vnpayConfig.getVnp_PayUrl() + "?" + queryUrl;

        return ResponseEntity.ok(paymentUrl);
    }

    @GetMapping("vnpay-callback")
    public void paymentCallback(@RequestParam Map<String, String> queryParams, HttpServletResponse response) throws Exception {
        try {
            String vnp_ResponseCode = queryParams.get("vnp_ResponseCode");
            String userId = queryParams.get("userId");
            String orderId = queryParams.get("vnp_TxnRef");
            String email = queryParams.get("email");
            String name = queryParams.get("name");
            String phone = queryParams.get("phone");
            String deliveryAddress = queryParams.get("deliveryAddress");
            String note = queryParams.get("note");
            int amount = Integer.parseInt(queryParams.get("vnp_Amount"));
            String paymentMethod = queryParams.get("paymentMethod");
            OrderDto orderDto = OrderDto.builder()
                    .id("Vit-" + orderId)
                    .userId(userId)
                    .email(email)
                    .name(name)
                    .phone(phone)
                    .deliveryAddress(deliveryAddress)
                    .note(note)
                    .amount(amount)
                    .paymentMethod(paymentMethod)
                    .build();
            if (orderDto != null) {
                if ("00".equals(vnp_ResponseCode)) {
                    Order newOrder = orderService.createOrder(orderDto);
                    CartDto cartDto = CartDto.builder().userId(newOrder.getUser().getId()).build();
                    cartService.clearCart(cartDto);
                    response.sendRedirect("http://localhost:4200/order-success/" + newOrder.getId());
                } else {
                    response.sendRedirect("http://localhost:4200/order");
                }
            }
        } catch (Exception e) {
            response.sendRedirect("http://localhost:4200/order");
            System.out.println(e.getMessage());
        }
    }

    @PostMapping("/momo-pay")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<String> createMomoPaymentLink(@Valid @RequestBody MomoPaymentDto momoPaymentDto) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            String jsonString = mapper.writeValueAsString(momoPaymentDto.getOrder());
            String extraData = Base64.getEncoder().encodeToString(jsonString.getBytes());

            MomoPaymentService momoPaymentRequest = new MomoPaymentService(
                    momoConfig.getPartnerCode(),
                    UUID.randomUUID().toString(),
                    momoPaymentDto.getOrder().getAmount(),
                    "Vit-" + HashUtils.getRandomNumber(8),
                    "Thanh toán qua ví MoMo",
                    momoConfig.getReturnUrl(),
                    momoConfig.getIpnUrl(),
                    momoPaymentDto.getRequestType(),
                    extraData,
                    momoPaymentDto.getLang()
            );
            momoPaymentRequest.makeSignature(momoConfig.getAccessKey(), momoConfig.getSecretKey());
            String paymentUrl = momoConfig.getPaymentUrl();
            String paymentLink = momoPaymentRequest.getLink(paymentUrl);

            return ResponseEntity.ok(paymentLink);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating payment link: " + e.getMessage());
        }
    }

    @GetMapping("/momo-return")
    public void momoReturn(@RequestParam Map<String, String> queryParams, HttpServletResponse response) throws IOException {
        try {
            String resultCode = queryParams.get("resultCode");
            if ("0".equals(resultCode)) {
                String base64ExtraData = queryParams.get("extraData");
                byte[] decodedBytes = Base64.getDecoder().decode(base64ExtraData);
                String jsonString = new String(decodedBytes, StandardCharsets.UTF_8);

                // Chuyển đổi chuỗi JSON thành đối tượng OrderDto
                ObjectMapper mapper = new ObjectMapper();
                OrderDto orderDto = mapper.readValue(jsonString, OrderDto.class);
                Order newOrder = orderService.createOrder(orderDto);
                CartDto cartDto = CartDto.builder().userId(newOrder.getUser().getId()).build();
                cartService.clearCart(cartDto);
                response.sendRedirect("http://localhost:4200/order-success/" + newOrder.getId());
            } else {
                response.sendRedirect("http://localhost:4200/order");
            }

        } catch (Exception e) {
            response.sendRedirect("http://localhost:4200/order");
            System.out.println(e.getMessage());
        }

    }


}
