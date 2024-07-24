package com.api.nature_harvest_backend.dtos.auth;

import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ChangePasswordDto {
    private String currentPassword;
    private String newPassword;
}
