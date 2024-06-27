package com.api.nature_harvest_backend.responses.user;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponse {
    private String id;
    private String email;
    private String name;
    private String phone;
    private String picture;
    private String address;
    private Date dateOfBirth;
    private com.api.nature_harvest_backend.models.Role role;

    public static UserResponse fromUser(com.api.nature_harvest_backend.models.User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .phone(user.getPhone())
                .address(user.getAddress())
                .picture(user.getPicture())
                .dateOfBirth(user.getDateOfBirth())
                .role(user.getRole())
                .build();
    }
}
