package com.api.nature_harvest_backend.services.user;

import com.api.nature_harvest_backend.components.JwtTokenUtils;
import com.api.nature_harvest_backend.dtos.auth.ChangePasswordDto;
import com.api.nature_harvest_backend.dtos.auth.ForgotPasswordDto;
import com.api.nature_harvest_backend.dtos.auth.SignUpDto;
import com.api.nature_harvest_backend.dtos.auth.UpdateUserDto;
import com.api.nature_harvest_backend.exceptions.DataNotFoundException;
import com.api.nature_harvest_backend.exceptions.ExpiredTokenException;
import com.api.nature_harvest_backend.models.Role;
import com.api.nature_harvest_backend.models.Token;
import com.api.nature_harvest_backend.models.User;
import com.api.nature_harvest_backend.repositories.RoleRepository;
import com.api.nature_harvest_backend.repositories.TokenRepository;
import com.api.nature_harvest_backend.repositories.UserRepository;
import com.api.nature_harvest_backend.responses.user.LoginResponse;
import com.api.nature_harvest_backend.services.email.IEmailService;
import com.api.nature_harvest_backend.services.token.ITokenService;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtils jwtTokenUtil;
    private final AuthenticationManager authenticationManager;
    private final ITokenService tokenService;
    private final IEmailService emailService;
//    @Value("${spring.security.oauth2.client.registration.google.client-id}")
//    private String GOOGLE_CLIENT_ID;

    @Override
    @Transactional
    public User signup(SignUpDto signUpDTO) throws Exception {
        if (userRepository.existsByEmail(signUpDTO.getEmail())) {
            throw new DataIntegrityViolationException("Email đã được sử dụng");
        }

        Role role = roleRepository.findByName("User");
        if (role == null) throw new DataNotFoundException("Role User does not exists");

        User newUser = User.builder()
                .id(UUID.randomUUID().toString())
                .email(signUpDTO.getEmail())
                .emailVerified(false)
                .name(signUpDTO.getName())
                .password(signUpDTO.getPassword())
                .picture(User.DEFAULT_PICTURE)
                .role(role)
                .active(true)
                .build();

        String encodedPassword = passwordEncoder.encode(signUpDTO.getPassword());
        newUser.setPassword(encodedPassword);

        userRepository.save(newUser);
        String token = jwtTokenUtil.generateTokenEmail(newUser);
        emailService.sendConfirmationEmail(newUser, token);
        return newUser;
    }


    @Override
    public LoginResponse login(String email, String password, String userAgent) throws Exception {

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            throw new DataNotFoundException("Email không chính xác");
        }
        if (!optionalUser.get().isActive()) {
            throw new DataNotFoundException("Tài khoản đã bị khóa");
        }
        if (!optionalUser.get().isEmailVerified()) {
            throw new DataNotFoundException("Email chưa được xác thực");
        }
        User existingUser = optionalUser.get();

        if (!passwordEncoder.matches(password, existingUser.getPassword()))
            throw new BadCredentialsException("Mật khẩu không chính xác");

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                email, password,
                existingUser.getAuthorities()
        );

        //authenticate with Java Spring security
        authenticationManager.authenticate(authenticationToken);
        String token = jwtTokenUtil.generateToken(existingUser);
        Token jwtToken = tokenService.addToken(existingUser, token, isMobileDevice(userAgent));
        return LoginResponse.builder()
                .message("Đăng nhập thành công")
                .token(jwtToken.getToken())
                .tokenType(jwtToken.getTokenType())
                .refreshToken(jwtToken.getRefreshToken())
                .username(existingUser.getUsername())
                .role(existingUser.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList())
                .id(existingUser.getId())
                .build();
    }

    //@Override
    @Override
    public LoginResponse loginGoogle(String firebaseToken, String userAgent) throws Exception {
//        JsonFactory jsonFactory = GsonFactory.getDefaultInstance();
//        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), jsonFactory)
//                .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
//                .build();
//
//        String extractedToken = googleToken.substring(7);
//        GoogleIdToken idToken = verifier.verify(extractedToken);
//        if (idToken == null) {
//            throw new IllegalArgumentException("Token không hợp lệ");
//        }
//
//        Payload payload = idToken.getPayload();
//        String email = payload.getEmail();
//
//        String googleId = payload.getSubject();
//        String pictureUrl = (String) payload.get("picture");
//        String name = (String) payload.get("name");
        String extractedToken = firebaseToken.substring(7);
        FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(extractedToken);
        String uid = decodedToken.getUid();
        String email = decodedToken.getEmail();
        String name = decodedToken.getName();
        String pictureUrl = decodedToken.getPicture();

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            Role role = roleRepository.findByName("User");
            if (role == null) throw new DataNotFoundException("Vai trò người dùng không tồn tại");

            User newUser = User.builder()
                    .id(UUID.randomUUID().toString())
                    .email(email)
                    .emailVerified(true)
                    .name(name)
                    .role(role)
                    .googleId(uid)
                    .active(true)
                    .picture(pictureUrl)
                    .build();
            newUser = userRepository.save(newUser);
            String token = jwtTokenUtil.generateToken(newUser);
            Token jwtToken = tokenService.addToken(newUser, token, isMobileDevice(userAgent));
            return LoginResponse.builder()
                    .message("Đăng nhập thành công")
                    .token(jwtToken.getToken())
                    .tokenType(jwtToken.getTokenType())
                    .refreshToken(jwtToken.getRefreshToken())
                    .username(newUser.getUsername())
                    .role(newUser.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList())
                    .id(newUser.getId())
                    .build();
        } else {
            if (!optionalUser.get().isActive()) {
                throw new DataNotFoundException("Tài khoản đã bị khóa");
            }
            String token = jwtTokenUtil.generateToken(optionalUser.get());
            Token jwtToken = tokenService.addToken(optionalUser.get(), token, isMobileDevice(userAgent));
            return LoginResponse.builder()
                    .message("Đăng nhập thành công")
                    .token(jwtToken.getToken())
                    .tokenType(jwtToken.getTokenType())
                    .refreshToken(jwtToken.getRefreshToken())
                    .username(optionalUser.get().getUsername())
                    .role(optionalUser.get().getAuthorities().stream().map(GrantedAuthority::getAuthority).toList())
                    .id(optionalUser.get().getId())
                    .build();
        }
    }

    @Override
    public boolean verifyUser(String token) throws Exception {
        if (jwtTokenUtil.isTokenExpired(token)) {
            throw new ExpiredTokenException("Token đã hết hạn");
        }
        String email = jwtTokenUtil.extractEmail(token);
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            if (user.get().isEmailVerified()) {
                return true;
            }
            user.get().setEmailVerified(true);
            userRepository.save(user.get());
            return true;
        }
        return false;
    }


    @Override
    public boolean resendVerificationEmail(String email) throws Exception {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            throw new DataNotFoundException("Không tìm thấy người dùng");
        }
        if (user.get().isEmailVerified()) {
            throw new DataNotFoundException("Email đã được xác thực");
        }
        String token = jwtTokenUtil.generateTokenEmail(user.get());
        emailService.sendConfirmationEmail(user.get(), token);
        return true;
    }

    @Override
    public boolean changePassword(ChangePasswordDto changePasswordDto) throws DataNotFoundException {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (user == null) {
            throw new DataNotFoundException("Không tìm thấy người dùng");
        }
        if (!user.isActive()) {
            throw new DataNotFoundException("Tài khoản đã bị khóa");
        }
        if (user.getGoogleId() != null || user.getPassword() == null) {
            throw new DataNotFoundException("Tài khoản Google không thể thay đổi mật khẩu");
        }

        if (!passwordEncoder.matches(changePasswordDto.getCurrentPassword(), user.getPassword())) {
            throw new DataNotFoundException("Mật khẩu hiện tại không chính xác");
        }

        if (passwordEncoder.matches(changePasswordDto.getNewPassword(), user.getPassword())) {
            throw new DataNotFoundException("Mật khẩu mới nên khác với mật khẩu cũ");
        }
        user.setPassword(passwordEncoder.encode(changePasswordDto.getNewPassword()));
        userRepository.save(user);
        List<Token> userTokens = tokenRepository.findByUser(user);
        tokenRepository.deleteAll(userTokens);
        return true;
    }

    @Override
    public boolean forgotPassword(ForgotPasswordDto forgotPasswordDto) throws Exception {
        Optional<User> userOptional = userRepository.findByEmail(forgotPasswordDto.getEmail());
        if (userOptional.isEmpty()) {
            throw new DataNotFoundException("Không tìm thấy người dùng");
        }
        User user = userOptional.get();
        if (!user.isActive()) {
            throw new DataNotFoundException("Tài khoản đã bị khóa");
        }
        if (user.getGoogleId() != null || user.getPassword() == null) {
            throw new DataNotFoundException("Tài khoản Google không thể thay đổi mật khẩu");
        }
        String newPassword = generateNewPassword();
        String newPasswordHashed = passwordEncoder.encode(newPassword);
        user.setPassword(newPasswordHashed);
        userRepository.save(user);
        List<Token> userTokens = tokenRepository.findByUser(user);
        tokenRepository.deleteAll(userTokens);

        emailService.sendResetPasswordEmail(user, newPassword);

        return true;
    }

    private String generateNewPassword() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 8);
    }

    @Override
    public User getUserDetailsFromToken(String token) throws Exception {
        if (jwtTokenUtil.isTokenExpired(token)) {
            throw new ExpiredTokenException("Token đã hết hạn");
        }
        String email = jwtTokenUtil.extractEmail(token);
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent()) {
            return user.get();
        } else {
            throw new Exception("Không tìm thấy người dùng");
        }
    }

    @Override
    public User getUserDetailsFromRefreshToken(String refreshToken) throws Exception {
        Token existingToken = tokenRepository.findByRefreshToken(refreshToken);
        return getUserDetailsFromToken(existingToken.getToken());
    }

    @Override
    @Transactional
    public User updateUser(String userId, UpdateUserDto updatedUserDTO) throws Exception {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new DataNotFoundException("Không tìm thấy người dùng"));

        if (updatedUserDTO.getName() != null) {
            existingUser.setName(updatedUserDTO.getName());
        }
        if (updatedUserDTO.getPhone() != null) {
            existingUser.setPhone(updatedUserDTO.getPhone());
        }
        if (updatedUserDTO.getAddress() != null) {
            existingUser.setAddress(updatedUserDTO.getAddress());
        }
        if (updatedUserDTO.getDateOfBirth() != null) {
            existingUser.setDateOfBirth(updatedUserDTO.getDateOfBirth());
        }
        return userRepository.save(existingUser);
    }

    @Override
    public User updatePicture(String url, User user) throws Exception {
        user.setPicture(url);
        return userRepository.save(user);
    }

    @Override
    public void blockOrEnable(String userId, Boolean active) throws DataNotFoundException {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new DataNotFoundException("User not found"));
        if (!existingUser.isActive()) throw new DataNotFoundException("user account is blocked");
        existingUser.setActive(active);
        userRepository.save(existingUser);
    }

    @Override
    public Page<User> findAll(String keyword, Pageable pageable) throws Exception {
        return userRepository.findAll(keyword, pageable);
    }

    private boolean isMobileDevice(String userAgent) {
        // Kiểm tra User-Agent header để xác định thiết bị di động
        // Ví dụ đơn giản:
        return userAgent.toLowerCase().contains("mobile");
    }

}
