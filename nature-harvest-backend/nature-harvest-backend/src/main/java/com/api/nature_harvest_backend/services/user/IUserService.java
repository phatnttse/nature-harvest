package com.api.nature_harvest_backend.services.user;

import com.api.nature_harvest_backend.dtos.auth.ChangePasswordDto;
import com.api.nature_harvest_backend.dtos.auth.ForgotPasswordDto;
import com.api.nature_harvest_backend.dtos.auth.SignUpDto;
import com.api.nature_harvest_backend.dtos.auth.UpdateUserDto;
import com.api.nature_harvest_backend.exceptions.DataNotFoundException;
import com.api.nature_harvest_backend.models.User;
import com.api.nature_harvest_backend.responses.user.LoginResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IUserService {
    User signup(SignUpDto userDTO) throws Exception;

    LoginResponse login(String email, String password, String userAgent) throws Exception;

    LoginResponse loginGoogle(String token, String userAgent) throws Exception;

    User getUserDetailsFromToken(String token) throws Exception;

    User getUserDetailsFromRefreshToken(String refreshToken) throws Exception;

    User updateUser(String userId, UpdateUserDto updatedUserDTO) throws Exception;

    User updatePicture(String url, User user) throws Exception;

    public void blockOrEnable(String userId, Boolean active) throws DataNotFoundException;

    Page<User> findAll(String keyword, Pageable pageable) throws Exception;

    boolean verifyUser(final String token) throws Exception;

    boolean resendVerificationEmail(String email) throws Exception;

    public boolean changePassword(ChangePasswordDto changePasswordDto) throws DataNotFoundException;

    public boolean forgotPassword(ForgotPasswordDto forgotPasswordDto) throws Exception;

}
