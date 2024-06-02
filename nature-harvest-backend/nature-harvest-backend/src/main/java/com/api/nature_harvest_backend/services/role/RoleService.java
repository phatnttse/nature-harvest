package com.api.nature_harvest_backend.services.role;

import com.api.nature_harvest_backend.repositories.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleService implements IRoleService {
    private final RoleRepository roleRepository;
}
