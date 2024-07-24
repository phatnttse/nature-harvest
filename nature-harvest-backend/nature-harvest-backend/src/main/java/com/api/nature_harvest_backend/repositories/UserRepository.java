package com.api.nature_harvest_backend.repositories;

import com.api.nature_harvest_backend.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

    List<User> findByEmailAndEmailVerified(String email, boolean emailVerified) throws Exception;

    Optional<User> findByGoogleId(String googleId) throws Exception;

    @Query("SELECT o FROM User o WHERE o.active = true AND (:keyword IS NULL OR :keyword = '' OR " +
            "o.name LIKE %:keyword% " +
            "OR o.address LIKE %:keyword% " +
            "OR o.phone LIKE %:keyword%) " +
            "AND LOWER(o.role.name) = 'user'")
    Page<User> findAll(@Param("keyword") String keyword, Pageable pageable);
}
