package com.api.nature_harvest_backend.models;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User extends BaseEntity implements UserDetails, OAuth2User {
    @Id
    @Column(name = "user_id", nullable = false)
    private String id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "email_verified")
    private boolean emailVerified;

    @Column(nullable = false)
    private String password;

    private String name;

    @Column(length = 10)
    private String phone;

    private String address;

    private String picture;

    @Column(name = "date_of_birth")
    private Date dateOfBirth;

    private boolean active;

    @Column(name = "google_id")
    private String googleId;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private com.api.nature_harvest_backend.models.Role role;

    @Override
    public Map<String, Object> getAttributes() {
        return null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> authorityList = new ArrayList<>();
        authorityList.add(new SimpleGrantedAuthority("ROLE_" +getRole().getName().toUpperCase()));
        //authorityList.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        return authorityList;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
