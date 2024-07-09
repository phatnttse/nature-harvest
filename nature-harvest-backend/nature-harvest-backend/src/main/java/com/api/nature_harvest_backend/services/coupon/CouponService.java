package com.api.nature_harvest_backend.services.coupon;

import com.api.nature_harvest_backend.dtos.coupon.CreateCouponDto;
import com.api.nature_harvest_backend.dtos.coupon.UpdateCouponDto;
import com.api.nature_harvest_backend.models.Coupon;
import com.api.nature_harvest_backend.repositories.CouponRepository;
import com.api.nature_harvest_backend.responses.coupon.CouponResponse;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
public class CouponService implements ICouponService {
    private final CouponRepository couponRepository;
    private final ModelMapper modelMapper;

    @Override
    public int calculateCouponValue(String couponCode, int totalAmount) {
        Coupon coupon = couponRepository.findByCodeAndActiveTrue(couponCode)
                .orElseThrow(() -> new IllegalArgumentException("Coupon not found"));
        int discount = calculateDiscount(coupon, totalAmount);
        return (totalAmount - discount);
    }

    @Override
    @Transactional
    public CouponResponse createCoupon(CreateCouponDto createCouponDto) {
        Coupon existingCoupon = couponRepository.findByCodeAndActiveTrue(createCouponDto.getCode()).orElse(null);
        if (existingCoupon != null) {
            throw new IllegalArgumentException("Coupon already exists");
        }
        if (!createCouponDto.getDiscountType().equalsIgnoreCase(Coupon.DISCOUNT_TYPE_FIXED) && !createCouponDto.getDiscountType().equalsIgnoreCase(Coupon.DISCOUNT_TYPE_PERCENTAGE)) {
            throw new IllegalArgumentException("Invalid discount type");
        }
        Coupon coupon = Coupon.builder()
                .code(createCouponDto.getCode())
                .description(createCouponDto.getDescription())
                .discountType(createCouponDto.getDiscountType().toLowerCase())
                .attribute(createCouponDto.getAttribute())
                .operator(createCouponDto.getOperator())
                .value(createCouponDto.getValue())
                .discountAmount(createCouponDto.getDiscountAmount())
                .active(true)
                .build();
        if (createCouponDto.getStartDate() != null) {
            coupon.setStartDate(java.time.LocalDate.parse(createCouponDto.getStartDate()));
        }
        if (createCouponDto.getEndDate() != null) {
            coupon.setEndDate(java.time.LocalDate.parse(createCouponDto.getEndDate()));
        }
        couponRepository.save(coupon);
        return modelMapper.map(coupon, CouponResponse.class);
    }

    @Override
    @Transactional
    public CouponResponse updateCoupon(Long id, UpdateCouponDto updateCouponDto) {
        Coupon existingCoupon = couponRepository.findByIdAndActiveTrue(id).orElseThrow(() -> new IllegalArgumentException("Coupon not found"));
        if (updateCouponDto.getCode() != null) {
            existingCoupon.setCode(updateCouponDto.getCode());
        }
        if (updateCouponDto.getDescription() != null) {
            existingCoupon.setDescription(updateCouponDto.getDescription());
        }
        if (updateCouponDto.getValue() != null) {
            existingCoupon.setValue(updateCouponDto.getValue());
        }
        if (updateCouponDto.getDiscountAmount() > 0) {
            existingCoupon.setDiscountAmount(updateCouponDto.getDiscountAmount());
        }
        if (updateCouponDto.getStartDate() != null) {
            existingCoupon.setStartDate(java.time.LocalDate.parse(updateCouponDto.getStartDate()));
        }
        if (updateCouponDto.getEndDate() != null) {
            existingCoupon.setEndDate(java.time.LocalDate.parse(updateCouponDto.getEndDate()));
        }
        Coupon updatedCoupon = couponRepository.save(existingCoupon);
        return modelMapper.map(updatedCoupon, CouponResponse.class);
    }

    @Override
    @Transactional
    public void deleteCoupon(Long id) {
        Coupon existingCoupon = couponRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Coupon not found"));
        if (!existingCoupon.isActive()) {
            throw new IllegalArgumentException("Coupon is already inactive");
        }
        existingCoupon.setActive(false);
        couponRepository.save(existingCoupon);
    }

    @Override
    public List<CouponResponse> getAllCoupons() {
        List<Coupon> coupons = couponRepository.findByActiveTrue();
        return coupons.stream()
                .map(coupon -> modelMapper.map(coupon, CouponResponse.class))
                .toList();
    }

    @Override
    public CouponResponse getCouponById(Long id) {
        Coupon coupon = couponRepository.findByIdAndActiveTrue(id).orElseThrow(() -> new IllegalArgumentException("Coupon not found"));
        return modelMapper.map(coupon, CouponResponse.class);
    }

    private int calculateDiscount(Coupon coupon, int totalAmount) {
        int discount = 0;
        String attribute = coupon.getAttribute();
        String operator = coupon.getOperator();
        int value = Integer.parseInt(coupon.getValue());
        int discountAmount = coupon.getDiscountAmount();
        if (attribute.equalsIgnoreCase("minimum_amount")) {
            if (coupon.getDiscountType().equalsIgnoreCase(Coupon.DISCOUNT_TYPE_PERCENTAGE)) {
                if (operator.equalsIgnoreCase(">=") && totalAmount >= value) {
                    discount += totalAmount * discountAmount / 100;
                } else {
                    throw new IllegalArgumentException("Coupon is invalid");
                }
            } else if (coupon.getDiscountType().equalsIgnoreCase(Coupon.DISCOUNT_TYPE_FIXED)) {
                if (operator.equalsIgnoreCase(">=") && totalAmount >= value) {
                    discount = discountAmount;
                } else {
                    throw new IllegalArgumentException("Coupon is invalid");
                }
            }
        } else if (attribute.equalsIgnoreCase("applicable_date")) {
            if (operator.equalsIgnoreCase("BETWEEN")) {
                if (java.time.LocalDate.now().isAfter(coupon.getStartDate()) && java.time.LocalDate.now().isBefore(coupon.getEndDate())) {
                    if (coupon.getDiscountType().equalsIgnoreCase(Coupon.DISCOUNT_TYPE_PERCENTAGE)) {
                        discount += totalAmount * discountAmount / 100;
                    } else if (coupon.getDiscountType().equalsIgnoreCase(Coupon.DISCOUNT_TYPE_FIXED)) {
                        discount = discountAmount;
                    }
                } else {
                    throw new IllegalArgumentException("Coupon is invalid");
                }
            }
        }
        return discount;
    }
}
