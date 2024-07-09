package com.api.nature_harvest_backend.repositories;

import com.api.nature_harvest_backend.models.Order;
import com.api.nature_harvest_backend.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByUser(User user);

    @Query("SELECT o FROM Order o WHERE o.user = :user AND o.reviewed = :reviewed AND o.active = true")
    List<Order> findByUserAndReviewed(@Param("user") User user, @Param("reviewed") boolean reviewed);

    @Query("SELECT o FROM Order o WHERE o.active = true AND (:keyword IS NULL OR :keyword = '' OR " +
            "o.name LIKE %:keyword% " +
            "OR o.deliveryAddress LIKE %:keyword% " +
            "OR o.note LIKE %:keyword% " +
            "OR o.email LIKE %:keyword%)")
    Page<Order> findByKeyword(@Param("keyword") String keyword, Pageable pageable);
}