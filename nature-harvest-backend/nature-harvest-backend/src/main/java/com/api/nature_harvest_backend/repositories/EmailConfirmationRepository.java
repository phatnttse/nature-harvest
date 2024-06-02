package com.api.nature_harvest_backend.repositories;

import com.api.nature_harvest_backend.models.Category;
import com.api.nature_harvest_backend.models.EmailConfirmation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailConfirmationRepository extends JpaRepository<EmailConfirmation, Long> {
    EmailConfirmation findByToken(String token);
    String deleteByToken(String token);
}
