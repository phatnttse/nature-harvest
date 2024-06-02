package com.api.nature_harvest_backend.responses.user;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginResponse {
        private String message;
        private String token;
        private String refreshToken;
        private String tokenType = "Bearer";
        //user's detail
        private String id;
        private String username;
        private List<String> role;
}
