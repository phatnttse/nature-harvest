package com.api.nature_harvest_backend.repositories;

import com.api.nature_harvest_backend.models.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    // Các phương thức tùy chỉnh khác có thể được thêm ở đây nếu cần
}
