package com.api.nature_harvest_backend.responses.user;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserListResponse {
    private List<UserResponse> users;
    private int totalPages;
}
