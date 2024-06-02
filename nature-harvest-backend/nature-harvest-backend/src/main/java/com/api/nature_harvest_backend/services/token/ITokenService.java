package com.api.nature_harvest_backend.services.token;

import com.api.nature_harvest_backend.models.Token;
import com.api.nature_harvest_backend.models.User;

public interface ITokenService {
    Token addToken(User user, String token, boolean isMobileDevice);
    Token refreshToken(String refreshToken, User user) throws Exception;
}
