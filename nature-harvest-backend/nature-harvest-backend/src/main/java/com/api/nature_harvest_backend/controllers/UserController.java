package com.api.nature_harvest_backend.controllers;

import com.api.nature_harvest_backend.dtos.auth.*;
import com.api.nature_harvest_backend.exceptions.DataNotFoundException;
import com.api.nature_harvest_backend.models.Token;
import com.api.nature_harvest_backend.models.User;
import com.api.nature_harvest_backend.responses.base.BaseResponse;
import com.api.nature_harvest_backend.responses.user.LoginResponse;
import com.api.nature_harvest_backend.responses.user.UserListResponse;
import com.api.nature_harvest_backend.responses.user.UserResponse;
import com.api.nature_harvest_backend.services.aws.IAwsS3Service;
import com.api.nature_harvest_backend.services.cloudinary.ICloudinaryService;
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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/users")
@RequiredArgsConstructor
public class UserController {
    private final IUserService userService;
    private final ITokenService tokenService;
    private final ICloudinaryService cloudinaryService;
    private final IAwsS3Service awsS3Service;

    @PostMapping("/signup")
    public ResponseEntity<BaseResponse> signUp(
            @Valid @RequestBody SignUpDto signUpDto,
            BindingResult result) throws Exception {
        if (result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            return ResponseEntity.ok(BaseResponse.builder()
                    .message(errorMessages.toString())
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        }
        try {
            User user = userService.signup(signUpDto);
            return ResponseEntity.ok(BaseResponse.builder()
                    .message("Sign up successfully")
                    .status(HttpStatus.OK.value())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(BaseResponse.builder()
                    .message(e.getMessage())
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        }
    }

    @GetMapping("/confirm-email")
    public ResponseEntity<BaseResponse> confirmEmail(@Valid @RequestParam("token") String token) {
        try {
            if (!userService.verifyUser(token))
                return ResponseEntity.ok(BaseResponse.builder()
                        .message("Mã xác thực không hợp lệ")
                        .status(HttpStatus.BAD_REQUEST.value())
                        .build());
            return ResponseEntity.ok(BaseResponse.builder()
                    .message("Xác thực email thành công")
                    .status(HttpStatus.OK.value())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok(BaseResponse.builder()
                    .message("Mã xác thực đã hết hạn")
                    .status(HttpStatus.UNAUTHORIZED.value())
                    .build());
        }
    }


    @GetMapping("/resend-verification-email")
    public ResponseEntity<BaseResponse> resendVerificationEmail(@Valid @RequestParam("email") String email) {
        try {
            if (!userService.resendVerificationEmail(email))
                return ResponseEntity.ok(BaseResponse.builder()
                        .message("Gửi lại mã xác thực thất bại")
                        .status(HttpStatus.BAD_REQUEST.value())
                        .build());
            return ResponseEntity.ok(BaseResponse.builder()
                    .message("Gửi lại mã xác thực thành công")
                    .status(HttpStatus.OK.value())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(BaseResponse.builder()
                    .message(e.getMessage())
                    .status(HttpStatus.BAD_REQUEST.value())
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

        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(
                    LoginResponse.builder()
                            .message(ex.getMessage())
                            .build());
        }
    }

//    @PostMapping("/upload-picture")
//    @PreAuthorize("hasRole('ROLE_USER')")
//    public ResponseEntity<UserResponse> uploadPicture(@ModelAttribute("multipartFile") MultipartFile multipartFile) throws Exception {
//        try {
//            if (multipartFile.getSize() > 0) {
//                User loginUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//                String url = cloudinaryService.upload(multipartFile);
//                if (url != null && !url.isEmpty()) {
//                    User user = userService.updatePicture(url, loginUser);
//                    return ResponseEntity.ok(UserResponse.fromUser(user));
//                }
//            }
//            return ResponseEntity.badRequest().build();
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().build();
//        }
//    }

    @PatchMapping("/update-picture")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<UserResponse> updatePicture(@Valid @RequestBody UpdateUserPictureDto updateUserPictureDto) throws Exception {
        try {

            User loggedInUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User user = userService.updatePicture(updateUserPictureDto.getPictureUrl(), loggedInUser);
            return ResponseEntity.ok(UserResponse.fromUser(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{userId}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable String userId,
            @Valid @RequestBody UpdateUserDto updateUserDto) {
        try {
            User user = userService.updateUser(userId, updateUserDto);
            return ResponseEntity.ok().body(UserResponse.fromUser(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
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
            PageRequest pageRequest = PageRequest.of(
                    page, limit,
                    Sort.by("id").ascending()
            );
            Page<UserResponse> userPage = userService.findAll(keyword, pageRequest).map(UserResponse::fromUser);

            int totalPages = userPage.getTotalPages();
            List<UserResponse> userResponses = userPage.getContent();

            return ResponseEntity.ok(UserListResponse.builder()
                    .users(userResponses)
                    .totalPages(totalPages)
                    .build());

        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(UserListResponse.builder()
                    .users(null)
                    .totalPages(0)
                    .build());
        }
    }

    @PostMapping("/details")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
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

    @PatchMapping("/forgot-password")
    public ResponseEntity<BaseResponse> forgotPassword(@Valid @RequestBody ForgotPasswordDto forgotPasswordDto) {
        try {
            if (userService.forgotPassword(forgotPasswordDto)) {
                return ResponseEntity.ok(BaseResponse.builder()
                        .message("Reset password successfully")
                        .status(HttpStatus.OK.value())
                        .build());
            }
            return ResponseEntity.badRequest().body(BaseResponse.builder()
                    .message("Change password failed")
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(BaseResponse.builder()
                    .message(e.getMessage())
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        }
    }

    @PatchMapping("/block/{userId}/{active}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<BaseResponse> blockOrEnable(
            @Valid @PathVariable String userId,
            @Valid @PathVariable int active
    ) {
        try {
            userService.blockOrEnable(userId, active > 0);
            String message = active > 0 ? "Successfully enabled the user." : "Successfully blocked the user.";
            return ResponseEntity.ok().body(BaseResponse.builder()
                    .message(message)
                    .status(HttpStatus.OK.value())
                    .build());
        } catch (DataNotFoundException e) {
            return ResponseEntity.ok().body(BaseResponse.builder()
                    .message("User not found")
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok().body(BaseResponse.builder()
                    .message(e.getMessage())
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        }
    }

    @PatchMapping("/change-password")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<BaseResponse> changePassword(
            @Valid @RequestBody ChangePasswordDto changePasswordDto
    ) {
        try {
            if (userService.changePassword(changePasswordDto)) {
                return ResponseEntity.ok().body(BaseResponse.builder()
                        .message("Password changed successfully")
                        .status(HttpStatus.OK.value())
                        .build());
            }
            return ResponseEntity.ok().body(BaseResponse.builder()
                    .message("Password change failed")
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.ok().body(BaseResponse.builder()
                    .message(e.getMessage())
                    .status(HttpStatus.BAD_REQUEST.value())
                    .build());
        }
    }
}
