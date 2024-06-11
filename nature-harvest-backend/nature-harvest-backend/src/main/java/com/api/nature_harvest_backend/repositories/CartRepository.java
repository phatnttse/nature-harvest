package com.api.nature_harvest_backend.repositories;

import com.api.nature_harvest_backend.models.Cart;
import com.api.nature_harvest_backend.models.Product;
import com.api.nature_harvest_backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUser(User user) throws Exception;
    Optional<Cart> findByUserAndProduct(User user, Product product) throws Exception;
    void deleteByUserAndProduct(User user, Product product) throws Exception;
    @Query("SELECT SUM(c.quantity) FROM Cart c WHERE c.user = :user")
    Integer findCartSizeByUser(User user) throws Exception;
    void deleteAllByUser(User user) throws Exception;

}
