package com.api.nature_harvest_backend.dtos.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RefreshTokenDto {
    @NotBlank
    private String refreshToken;
}
