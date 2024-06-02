package com.api.nature_harvest_backend.repositories;

import com.api.nature_harvest_backend.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(String name) throws Exception;
}
