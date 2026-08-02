package com.techzyncmedia.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_users")
public class AdminUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    private boolean enabled;

    private LocalDateTime createdAt;

    public AdminUser() {}

    public AdminUser(Long id, String username, String email, String password, String role, boolean enabled, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.enabled = enabled;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.role == null) {
            this.role = "ROLE_ADMIN";
        }
        this.enabled = true;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder
    public static AdminUserBuilder builder() { return new AdminUserBuilder(); }

    public static class AdminUserBuilder {
        private Long id;
        private String username;
        private String email;
        private String password;
        private String role;
        private boolean enabled = true;
        private LocalDateTime createdAt;

        public AdminUserBuilder id(Long id) { this.id = id; return this; }
        public AdminUserBuilder username(String username) { this.username = username; return this; }
        public AdminUserBuilder email(String email) { this.email = email; return this; }
        public AdminUserBuilder password(String password) { this.password = password; return this; }
        public AdminUserBuilder role(String role) { this.role = role; return this; }
        public AdminUserBuilder enabled(boolean enabled) { this.enabled = enabled; return this; }
        public AdminUserBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public AdminUser build() {
            return new AdminUser(id, username, email, password, role, enabled, createdAt);
        }
    }
}
