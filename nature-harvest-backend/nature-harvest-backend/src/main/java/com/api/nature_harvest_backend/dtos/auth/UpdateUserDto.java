package com.api.nature_harvest_backend.dtos.auth;

import lombok.*;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UpdateUserDto {
    private String name;
    private String phone;
    private Date dateOfBirth;
    private String address;
}
