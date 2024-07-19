package com.api.nature_harvest_backend.services.user;

import com.api.nature_harvest_backend.dtos.auth.ChangPasswordDto;
import com.api.nature_harvest_backend.dtos.auth.ForgotPasswordDto;
import com.api.nature_harvest_backend.dtos.auth.SignUpDto;
import com.api.nature_harvest_backend.dtos.auth.UpdateUserDto;
import com.api.nature_harvest_backend.exceptions.DataNotFoundException;
import com.api.nature_harvest_backend.exceptions.InvalidPasswordException;
import com.api.nature_harvest_backend.models.User;
import com.api.nature_harvest_backend.responses.base.BaseResponse;
import com.api.nature_harvest_backend.responses.user.LoginResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IUserService {
    User createUser(SignUpDto userDTO) throws Exception;

    LoginResponse login(String email, String password, String userAgent) throws Exception;

    LoginResponse loginGoogle(String token, String userAgent) throws Exception;

    User getUserDetailsFromToken(String token) throws Exception;

    User getUserDetailsFromRefreshToken(String refreshToken) throws Exception;

    User updateUser(String userId, UpdateUserDto updatedUserDTO) throws Exception;

    User updatePicture(String url, User user) throws Exception;

    void resetPassword(String userId, String newPassword)
            throws InvalidPasswordException, DataNotFoundException;

    public void blockOrEnable(String userId, Boolean active) throws DataNotFoundException;

    Page<User> findAll(String keyword, Pageable pageable) throws Exception;

    boolean verifyUser(final String token) throws Exception;

    public boolean changePassword(ChangPasswordDto changePasswordDto) throws DataNotFoundException;

    public void forgotPassword(ForgotPasswordDto forgotPasswordDto) throws Exception;
}
