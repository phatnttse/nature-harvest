package com.api.nature_harvest_backend.services.user;

import com.api.nature_harvest_backend.components.JwtTokenUtils;
import com.api.nature_harvest_backend.dtos.SignUpDto;
import com.api.nature_harvest_backend.dtos.UpdateUserDto;
import com.api.nature_harvest_backend.exceptions.DataNotFoundException;
import com.api.nature_harvest_backend.exceptions.ExpiredTokenException;
import com.api.nature_harvest_backend.exceptions.InvalidPasswordException;
import com.api.nature_harvest_backend.models.Role;
import com.api.nature_harvest_backend.models.Token;
import com.api.nature_harvest_backend.models.User;
import com.api.nature_harvest_backend.repositories.RoleRepository;
import com.api.nature_harvest_backend.repositories.TokenRepository;
import com.api.nature_harvest_backend.repositories.UserRepository;
import com.api.nature_harvest_backend.responses.user.LoginResponse;
import com.api.nature_harvest_backend.services.email.IEmailService;
import com.api.nature_harvest_backend.services.token.ITokenService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
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
    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String GOOGLE_CLIENT_ID;

    @Override
    @Transactional
    public User createUser(SignUpDto signUpDTO) throws Exception {

        if (userRepository.existsByEmailAndGoogleIdIsNull(signUpDTO.getEmail())) {
            throw new DataIntegrityViolationException("Email already exists");
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
            throw new DataNotFoundException("Email incorrect");
        }
        if (!optionalUser.get().isActive()) {
            throw new DataNotFoundException("User is locked");
        }
        if (!optionalUser.get().isEmailVerified()) {
            throw new DataNotFoundException("Unverified email");
        }
        User existingUser = optionalUser.get();

        if (!passwordEncoder.matches(password, existingUser.getPassword()))
            throw new BadCredentialsException("Password incorrect");

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                email, password,
                existingUser.getAuthorities()
        );

        //authenticate with Java Spring security
        authenticationManager.authenticate(authenticationToken);
        String token = jwtTokenUtil.generateToken(existingUser);
        Token jwtToken = tokenService.addToken(existingUser, token, isMobileDevice(userAgent));
        return LoginResponse.builder()
                .message("Login Successfully")
                .token(jwtToken.getToken())
                .tokenType(jwtToken.getTokenType())
                .refreshToken(jwtToken.getRefreshToken())
                .username(existingUser.getUsername())
                .role(existingUser.getAuthorities().stream().map(item -> item.getAuthority()).toList())
                .id(existingUser.getId())
                .build();
    }

    //@Override
    @Override
    public LoginResponse loginGoogle(String googleToken, String userAgent) throws Exception {
        JsonFactory jsonFactory = GsonFactory.getDefaultInstance();
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), jsonFactory)
                .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
                .build();

        String extractedToken = googleToken.substring(7);
        GoogleIdToken idToken = verifier.verify(extractedToken);
        if (idToken == null) {
            throw new IllegalArgumentException("Invalid ID token");
        }

        Payload payload = idToken.getPayload();
        String email = payload.getEmail();

        String googleId = payload.getSubject();
        String pictureUrl = (String) payload.get("picture");
        String name = (String) payload.get("name");

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            Role role = roleRepository.findByName("User");
            if (role == null) throw new DataNotFoundException("Role User does not exist");

            User newUser = User.builder()
                    .id(UUID.randomUUID().toString())
                    .email(email)
                    .emailVerified(true)
                    .name(name)
                    .role(role)
                    .googleId(googleId)
                    .active(true)
                    .picture(pictureUrl)
                    .build();
            newUser = userRepository.save(newUser);
            String token = jwtTokenUtil.generateToken(newUser);
            Token jwtToken = tokenService.addToken(newUser, token, isMobileDevice(userAgent));
            return LoginResponse.builder()
                    .message("Login Successfully")
                    .token(jwtToken.getToken())
                    .tokenType(jwtToken.getTokenType())
                    .refreshToken(jwtToken.getRefreshToken())
                    .username(newUser.getUsername())
                    .role(newUser.getAuthorities().stream().map(item -> item.getAuthority()).toList())
                    .id(newUser.getId())
                    .build();
        } else {
            String token = jwtTokenUtil.generateToken(optionalUser.get());
            Token jwtToken = tokenService.addToken(optionalUser.get(), token, isMobileDevice(userAgent));
            return LoginResponse.builder()
                    .message("Login Successfully")
                    .token(jwtToken.getToken())
                    .tokenType(jwtToken.getTokenType())
                    .refreshToken(jwtToken.getRefreshToken())
                    .username(optionalUser.get().getUsername())
                    .role(optionalUser.get().getAuthorities().stream().map(item -> item.getAuthority()).toList())
                    .id(optionalUser.get().getId())
                    .build();
        }
    }

    @Override
    public boolean verifyUser(String token) throws Exception {
        if (jwtTokenUtil.isTokenExpired(token)) {
            throw new ExpiredTokenException("Token is expired");
        }
        String email = jwtTokenUtil.extractEmail(token);
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            user.get().setEmailVerified(true);
            userRepository.save(user.get());
            return true;
        }
        return false;
    }

    @Override
    public User getUserDetailsFromToken(String token) throws Exception {
        if (jwtTokenUtil.isTokenExpired(token)) {
            throw new ExpiredTokenException("Token is expired");
        }
        String email = jwtTokenUtil.extractEmail(token);
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent()) {
            return user.get();
        } else {
            throw new Exception("User not found");
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
                .orElseThrow(() -> new DataNotFoundException("User not found"));

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
    @Transactional
    public void resetPassword(String userId, String newPassword) throws InvalidPasswordException, DataNotFoundException {
        User existingUser = userRepository.findById(userId).orElseThrow(() -> new DataNotFoundException("User not found"));
        if (!existingUser.isActive()) throw new DataNotFoundException("User account is locked");
        String encodedPassword = passwordEncoder.encode(newPassword);
        if (existingUser.getPassword() != null) {
            existingUser.setPassword(encodedPassword);
        } else {
            throw new DataNotFoundException("Google account cannot change the account password");
        }
        userRepository.save(existingUser);

        //reset password => clear token
        List<Token> tokens = tokenRepository.findByUser(existingUser);
        for (Token token : tokens) {
            tokenRepository.delete(token);
        }

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
