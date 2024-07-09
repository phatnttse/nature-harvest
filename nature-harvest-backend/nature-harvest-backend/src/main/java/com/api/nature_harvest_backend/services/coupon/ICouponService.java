package com.api.nature_harvest_backend.services.coupon;

import com.api.nature_harvest_backend.dtos.coupon.CreateCouponDto;
import com.api.nature_harvest_backend.dtos.coupon.UpdateCouponDto;
import com.api.nature_harvest_backend.responses.coupon.CouponResponse;

import java.util.List;

public interface ICouponService {
    int calculateCouponValue(String couponCode, int totalAmount);

    CouponResponse createCoupon(CreateCouponDto createCouponDto);

    CouponResponse updateCoupon(Long id, UpdateCouponDto updateCouponDto);

    void deleteCoupon(Long id);

    List<CouponResponse> getAllCoupons();

    CouponResponse getCouponById(Long id);


}
