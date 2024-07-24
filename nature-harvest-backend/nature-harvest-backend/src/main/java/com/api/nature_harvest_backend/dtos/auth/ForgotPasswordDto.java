package com.api.nature_harvest_backend.dtos.auth;

import jakarta.validation.constraints.Email;
import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ForgotPasswordDto {
    @Email(message = "Invalid email")
    private String email;
}
