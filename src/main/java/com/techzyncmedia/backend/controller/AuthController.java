package com.techzyncmedia.backend.controller;

import com.techzyncmedia.backend.dto.AuthResponseDto;
import com.techzyncmedia.backend.dto.LoginRequestDto;
import com.techzyncmedia.backend.service.AdminUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AdminUserService adminUserService;

    @Autowired
    public AuthController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginRequestDto loginDto) {
        AuthResponseDto response = adminUserService.authenticate(loginDto);
        return ResponseEntity.ok(response);
    }
}
