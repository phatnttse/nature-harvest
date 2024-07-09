package com.api.nature_harvest_backend.dtos.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginDto {
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password cannot be blank")
    private String password;
}
