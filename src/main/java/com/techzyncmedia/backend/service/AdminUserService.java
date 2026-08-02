package com.techzyncmedia.backend.service;

import com.techzyncmedia.backend.dto.AuthResponseDto;
import com.techzyncmedia.backend.dto.DashboardStatsDto;
import com.techzyncmedia.backend.dto.LoginRequestDto;
import com.techzyncmedia.backend.model.AdminUser;
import com.techzyncmedia.backend.model.ContactStatus;
import com.techzyncmedia.backend.model.LeadStatus;
import com.techzyncmedia.backend.repository.AdminUserRepository;
import com.techzyncmedia.backend.repository.ContactRepository;
import com.techzyncmedia.backend.repository.LeadRepository;
import com.techzyncmedia.backend.security.JwtUtils;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminUserService {

    private final AdminUserRepository adminUserRepository;
    private final LeadRepository leadRepository;
    private final ContactRepository contactRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Autowired
    public AdminUserService(AdminUserRepository adminUserRepository,
                            LeadRepository leadRepository,
                            ContactRepository contactRepository,
                            PasswordEncoder passwordEncoder,
                            JwtUtils jwtUtils) {
        this.adminUserRepository = adminUserRepository;
        this.leadRepository = leadRepository;
        this.contactRepository = contactRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @PostConstruct
    public void initDefaultAdmin() {
        if (!adminUserRepository.existsByEmail("admin@techzyncmedia.com")) {
            AdminUser admin = AdminUser.builder()
                    .username("admin")
                    .email("admin@techzyncmedia.com")
                    .password(passwordEncoder.encode("Admin@123456"))
                    .role("ROLE_ADMIN")
                    .enabled(true)
                    .build();
            adminUserRepository.save(admin);
        }
    }

    public AuthResponseDto authenticate(LoginRequestDto loginDto) {
        String identifier = loginDto.getUsernameOrEmail().trim().toLowerCase();
        AdminUser admin = adminUserRepository.findByEmail(identifier)
                .orElseGet(() -> adminUserRepository.findByUsername(identifier)
                        .orElseThrow(() -> new IllegalArgumentException("Invalid username or password")));

        if (!passwordEncoder.matches(loginDto.getPassword(), admin.getPassword())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        String token = jwtUtils.generateToken(admin.getUsername(), admin.getRole());

        return AuthResponseDto.builder()
                .token(token)
                .tokenType("Bearer")
                .username(admin.getUsername())
                .email(admin.getEmail())
                .role(admin.getRole())
                .build();
    }

    public DashboardStatsDto getDashboardStats() {
        long totalLeads = leadRepository.count();
        long newLeads = leadRepository.countByStatus(LeadStatus.NEW);
        long contactedLeads = leadRepository.countByStatus(LeadStatus.CONTACTED);
        long qualifiedLeads = leadRepository.countByStatus(LeadStatus.QUALIFIED);
        long convertedLeads = leadRepository.countByStatus(LeadStatus.CONVERTED);

        long totalMessages = contactRepository.count();
        long unreadMessages = contactRepository.countByStatus(ContactStatus.UNREAD);

        return DashboardStatsDto.builder()
                .totalLeads(totalLeads)
                .newLeads(newLeads)
                .contactedLeads(contactedLeads)
                .qualifiedLeads(qualifiedLeads)
                .convertedLeads(convertedLeads)
                .totalMessages(totalMessages)
                .unreadMessages(unreadMessages)
                .build();
    }
}
