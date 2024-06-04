package com.api.nature_harvest_backend.controllers;

import com.api.nature_harvest_backend.dtos.LoginDto;
import com.api.nature_harvest_backend.dtos.RefreshTokenDto;
import com.api.nature_harvest_backend.dtos.SignUpDto;
import com.api.nature_harvest_backend.dtos.UpdateUserDto;
import com.api.nature_harvest_backend.exceptions.DataNotFoundException;
import com.api.nature_harvest_backend.exceptions.InvalidPasswordException;
import com.api.nature_harvest_backend.models.Token;
import com.api.nature_harvest_backend.models.User;
import com.api.nature_harvest_backend.responses.user.LoginResponse;
import com.api.nature_harvest_backend.responses.user.SignUpResponse;
import com.api.nature_harvest_backend.responses.user.UserListResponse;
import com.api.nature_harvest_backend.responses.user.UserResponse;
import com.api.nature_harvest_backend.services.token.ITokenService;
import com.api.nature_harvest_backend.services.user.IUserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("${api.prefix}/users")
@RequiredArgsConstructor
public class UserController {
    private final IUserService userService;
    private final ITokenService tokenService;
    @PostMapping("/signup")
    public ResponseEntity<SignUpResponse> signUp(
            @Valid @RequestBody SignUpDto signUpDto,
            BindingResult result) throws Exception {

        SignUpResponse signUpResponse = new SignUpResponse();

        if (result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();

            signUpResponse.setMessage(errorMessages.toString());
            return ResponseEntity.badRequest().body(signUpResponse);
        }

        if (!signUpDto.getPassword().equals(signUpDto.getConfirmPassword())) {
            signUpResponse.setMessage("Confirm password not match");
            return ResponseEntity.badRequest().body(signUpResponse);
        }

        try {
            User user = userService.createUser(signUpDto);
            signUpResponse.setMessage("Sign Up Successfully. Login to shopping now!");
            return ResponseEntity.ok(signUpResponse);
        } catch (Exception e) {
            signUpResponse.setMessage(e.getMessage());
            return ResponseEntity.badRequest().body(signUpResponse);
        }
    }
    @GetMapping("/confirm-email")
    public ResponseEntity<SignUpResponse> confirmEmail(@RequestParam("token") String token) {
        try {
            if (userService.verifyUser(token))
                return ResponseEntity.ok(SignUpResponse.builder()
                    .message("Sign up successfully. Login to shopping now!")
                    .build());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(SignUpResponse.builder()
                    .message(e.getMessage())
                    .build());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginDto loginDto,
            HttpServletRequest request) throws Exception {

        try {
            String userAgent = request.getHeader("User-Agent");
            return ResponseEntity.ok(userService.login(loginDto.getEmail(), loginDto.getPassword(), userAgent));

        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(
                    LoginResponse.builder()
                            .message(ex.getMessage())
                            .build()
            );
        }
    }
    @PostMapping("/login-google")
    public ResponseEntity<LoginResponse> loginGoogle(
            @RequestHeader("Authorization") String googleToken,
            HttpServletRequest request) throws Exception {

        try {
            String userAgent = request.getHeader("User-Agent");
            return ResponseEntity.ok(userService.loginGoogle(googleToken, userAgent));

        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(
                    LoginResponse.builder()
                            .message(ex.getMessage())
                            .build()
            );
        }
    }
    
    @PostMapping("/refresh-token")
    public ResponseEntity<LoginResponse> refreshToken(
            @Valid @RequestBody RefreshTokenDto refreshTokenDto
            ) {
        try {
            User userDetail = userService.getUserDetailsFromRefreshToken(refreshTokenDto.getRefreshToken());
            Token jwtToken = tokenService.refreshToken(refreshTokenDto.getRefreshToken(), userDetail);

            return ResponseEntity.ok(LoginResponse.builder()
                            .message("Refresh token successfully")
                            .token(jwtToken.getToken())
                            .tokenType(jwtToken.getTokenType())
                            .refreshToken(jwtToken.getRefreshToken())
                            .username(userDetail.getUsername())
                            .role(userDetail.getAuthorities().stream().map(item -> item.getAuthority()).toList())
                            .id(userDetail.getId())
                            .build());

        }catch (Exception ex) {
            return ResponseEntity.badRequest().body(
                    LoginResponse.builder()
                            .message(ex.getMessage())
                            .build());
        }
    }

    @GetMapping("")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<UserListResponse> getAllUser(
            @RequestParam(defaultValue = "", required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        try {
            // Tạo Pageable từ thông tin trang và giới hạn
            PageRequest pageRequest = PageRequest.of(
                    page, limit,
                    Sort.by("id").ascending()
            );
            Page<UserResponse> userPage = userService.findAll(keyword, pageRequest).map(UserResponse::fromUser);

            //Lay tong so trang
            int totalPages = userPage.getTotalPages();
            List<UserResponse> userResponses = userPage.getContent();

            return ResponseEntity.ok(UserListResponse.builder()
                            .users(userResponses)
                            .totalPages(totalPages)
                    .build());

        }catch (Exception ex) {
            return ResponseEntity.badRequest().body(UserListResponse.builder()
                    .users(null)
                    .totalPages(0)
                    .build());
        }
    }
    @PostMapping("/details")
    public ResponseEntity<UserResponse> getUserDetails(
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        try {
            String extractedToken = authorizationHeader.substring(7); // Loại bỏ "Bearer " từ chuỗi token
            User user = userService.getUserDetailsFromToken(extractedToken);
            return ResponseEntity.ok(UserResponse.fromUser(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @PreAuthorize("hasRole('ROLE_USER')")
    @PutMapping("/details/{userId}")
    public ResponseEntity<UserResponse> updateUserDetails(
            @PathVariable String userId,
            @RequestBody UpdateUserDto updatedUserDTO,
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        try {
            String extractedToken = authorizationHeader.substring(7);
            User user = userService.getUserDetailsFromToken(extractedToken);
            // Ensure that the user making the request matches the user being updated
            if (!user.getId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            User updatedUser = userService.updateUser(userId, updatedUserDTO);
            return ResponseEntity.ok(UserResponse.fromUser(updatedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/reset-password/{userId}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<String> resetPassword(@Valid @PathVariable String userId){
        try {
            String newPassword = UUID.randomUUID().toString().substring(0, 5); // Tạo mật khẩu mới
            userService.resetPassword(userId, newPassword);
            return ResponseEntity.ok(newPassword);
        } catch (InvalidPasswordException e) {
            return ResponseEntity.badRequest().body("Invalid password");
        } catch (DataNotFoundException e) {
            return ResponseEntity.badRequest().body("User not found");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/block/{userId}/{active}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> blockOrEnable(
            @Valid @PathVariable String userId,
            @Valid @PathVariable int active
    ) {
        try {
            userService.blockOrEnable(userId, active > 0);
            String message = active > 0 ? "Successfully enabled the user." : "Successfully blocked the user.";
            return ResponseEntity.ok().body(message);
        } catch (DataNotFoundException e) {
            return ResponseEntity.badRequest().body("User not found.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
