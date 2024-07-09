package com.api.nature_harvest_backend.dtos.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SignUpDto {
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Name is required")
    private String name;

    private String password;

}
