package com.api.nature_harvest_backend.repositories;

import com.api.nature_harvest_backend.models.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupon, Long> {
    Optional<Coupon> findByCodeAndActiveTrue(String couponCode);

    Optional<Coupon> findByIdAndActiveTrue(Long id);

    List<Coupon> findByActiveTrue();
}
