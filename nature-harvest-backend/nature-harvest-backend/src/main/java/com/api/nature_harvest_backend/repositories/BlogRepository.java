package com.api.nature_harvest_backend.repositories;

import com.api.nature_harvest_backend.exceptions.DataNotFoundException;
import com.api.nature_harvest_backend.models.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BlogRepository extends JpaRepository<Blog, Long> {
    Page<Blog> findByActiveTrue(Pageable pageable);

    List<Blog> findByTags(String tags);

    Optional<Blog> findBySlug(String slug) throws DataNotFoundException;
}
