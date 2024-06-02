package com.api.nature_harvest_backend.services.user;

import com.api.nature_harvest_backend.dtos.SignUpDto;
import com.api.nature_harvest_backend.dtos.UpdateUserDto;
import com.api.nature_harvest_backend.exceptions.DataNotFoundException;
import com.api.nature_harvest_backend.exceptions.InvalidPasswordException;
import com.api.nature_harvest_backend.models.Token;
import com.api.nature_harvest_backend.models.User;
import com.api.nature_harvest_backend.responses.user.LoginResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface IUserService {
    User createUser(SignUpDto userDTO) throws Exception;
    LoginResponse login(String email, String password, String userAgent) throws Exception;
    LoginResponse loginGoogle(String token, String userAgent) throws Exception;
    User getUserDetailsFromToken(String token) throws Exception;
    User getUserDetailsFromRefreshToken(String refreshToken) throws Exception;
    User updateUser(String userId, UpdateUserDto updatedUserDTO) throws Exception;
    void resetPassword(String userId, String newPassword)
            throws InvalidPasswordException, DataNotFoundException;
    public void blockOrEnable(String userId, Boolean active) throws DataNotFoundException;
    Page<User> findAll(String keyword, Pageable pageable) throws Exception;

    verify



}
