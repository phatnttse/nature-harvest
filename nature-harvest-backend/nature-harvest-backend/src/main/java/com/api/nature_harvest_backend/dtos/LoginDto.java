package com.api.nature_harvest_backend.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.*;


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
