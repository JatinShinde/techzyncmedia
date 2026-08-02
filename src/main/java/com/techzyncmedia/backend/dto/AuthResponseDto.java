package com.techzyncmedia.backend.dto;

public class AuthResponseDto {
    private String token;
    private String tokenType;
    private String username;
    private String email;
    private String role;

    public AuthResponseDto() {}

    public AuthResponseDto(String token, String tokenType, String username, String email, String role) {
        this.token = token;
        this.tokenType = tokenType;
        this.username = username;
        this.email = email;
        this.role = role;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public static AuthResponseDtoBuilder builder() { return new AuthResponseDtoBuilder(); }

    public static class AuthResponseDtoBuilder {
        private String token;
        private String tokenType = "Bearer";
        private String username;
        private String email;
        private String role;

        public AuthResponseDtoBuilder token(String token) { this.token = token; return this; }
        public AuthResponseDtoBuilder tokenType(String tokenType) { this.tokenType = tokenType; return this; }
        public AuthResponseDtoBuilder username(String username) { this.username = username; return this; }
        public AuthResponseDtoBuilder email(String email) { this.email = email; return this; }
        public AuthResponseDtoBuilder role(String role) { this.role = role; return this; }

        public AuthResponseDto build() {
            return new AuthResponseDto(token, tokenType, username, email, role);
        }
    }
}
