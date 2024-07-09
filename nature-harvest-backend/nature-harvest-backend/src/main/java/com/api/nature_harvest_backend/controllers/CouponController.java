package com.api.nature_harvest_backend.controllers;

import com.api.nature_harvest_backend.dtos.coupon.CreateCouponDto;
import com.api.nature_harvest_backend.dtos.coupon.UpdateCouponDto;
import com.api.nature_harvest_backend.responses.base.BaseResponse;
import com.api.nature_harvest_backend.responses.coupon.CouponCalculationResponse;
import com.api.nature_harvest_backend.responses.coupon.CouponResponse;
import com.api.nature_harvest_backend.services.coupon.ICouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/coupons")
@RequiredArgsConstructor
public class CouponController {
    private final ICouponService couponService;

    @GetMapping("/calculate")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<CouponCalculationResponse> calculateCouponValue(
            @RequestParam String couponCode,
            @RequestParam int totalAmount
    ) {
        try {
            int discountAmount = couponService.calculateCouponValue(couponCode, totalAmount);
            return ResponseEntity.ok(CouponCalculationResponse.builder()
                    .discountAmount(discountAmount)
                    .message("Coupon applied successfully")
                    .build());
        } catch (Exception e) {
            if (e.getMessage().equals("Coupon not found"))
                return ResponseEntity.badRequest().body(CouponCalculationResponse.builder()
                        .discountAmount(null)
                        .status(HttpStatus.NOT_FOUND.value())
                        .message(e.getMessage())
                        .build());

            if (e.getMessage().equals("Coupon is invalid"))
                return ResponseEntity.badRequest().body(CouponCalculationResponse.builder()
                        .discountAmount(null)
                        .status(HttpStatus.BAD_REQUEST.value())
                        .message(e.getMessage())
                        .build());

            return ResponseEntity.badRequest().body(CouponCalculationResponse.builder()
                    .discountAmount(null)
                    .message(e.getMessage())
                    .build());
        }
    }

    @PostMapping("")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<CouponResponse> createCoupon(
            @Valid @RequestBody CreateCouponDto couponDto,
            BindingResult result
    ) {
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .toList();
                return ResponseEntity.badRequest().body(null);
            }
            CouponResponse newCoupon = couponService.createCoupon(couponDto);
            return ResponseEntity.ok(newCoupon);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<List<CouponResponse>> getAllCoupons() {
        try {
            List<CouponResponse> coupons = couponService.getAllCoupons();
            return ResponseEntity.ok(coupons);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<CouponResponse> getCouponById(@PathVariable("id") Long id) {
        try {
            CouponResponse coupon = couponService.getCouponById(id);
            return ResponseEntity.ok(coupon);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<CouponResponse> updateCoupon(
            @Valid @PathVariable Long id,
            @RequestBody UpdateCouponDto couponDto
    ) {
        try {
            CouponResponse updatedCoupon = couponService.updateCoupon(id, couponDto);
            return ResponseEntity.ok(updatedCoupon);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<BaseResponse> deleteCoupon(@PathVariable Long id) {
        try {
            couponService.deleteCoupon(id);
            return ResponseEntity.ok(BaseResponse.builder()
                    .message("Coupon deleted successfully")
                    .status(HttpStatus.OK.value())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(BaseResponse
                    .builder()
                    .message(e.getMessage())
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        }
    }
}
