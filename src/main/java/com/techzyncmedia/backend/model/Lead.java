package com.techzyncmedia.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "leads")
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String email;

    private String phone;

    private String websiteUrl;

    private String serviceNeeded;

    private String budgetRange;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeadStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Lead() {}

    public Lead(Long id, String fullName, String email, String phone, String websiteUrl, String serviceNeeded, String budgetRange, String notes, LeadStatus status, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.websiteUrl = websiteUrl;
        this.serviceNeeded = serviceNeeded;
        this.budgetRange = budgetRange;
        this.notes = notes;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = LeadStatus.NEW;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getWebsiteUrl() { return websiteUrl; }
    public void setWebsiteUrl(String websiteUrl) { this.websiteUrl = websiteUrl; }

    public String getServiceNeeded() { return serviceNeeded; }
    public void setServiceNeeded(String serviceNeeded) { this.serviceNeeded = serviceNeeded; }

    public String getBudgetRange() { return budgetRange; }
    public void setBudgetRange(String budgetRange) { this.budgetRange = budgetRange; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LeadStatus getStatus() { return status; }
    public void setStatus(LeadStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Builder
    public static LeadBuilder builder() { return new LeadBuilder(); }

    public static class LeadBuilder {
        private Long id;
        private String fullName;
        private String email;
        private String phone;
        private String websiteUrl;
        private String serviceNeeded;
        private String budgetRange;
        private String notes;
        private LeadStatus status;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public LeadBuilder id(Long id) { this.id = id; return this; }
        public LeadBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public LeadBuilder email(String email) { this.email = email; return this; }
        public LeadBuilder phone(String phone) { this.phone = phone; return this; }
        public LeadBuilder websiteUrl(String websiteUrl) { this.websiteUrl = websiteUrl; return this; }
        public LeadBuilder serviceNeeded(String serviceNeeded) { this.serviceNeeded = serviceNeeded; return this; }
        public LeadBuilder budgetRange(String budgetRange) { this.budgetRange = budgetRange; return this; }
        public LeadBuilder notes(String notes) { this.notes = notes; return this; }
        public LeadBuilder status(LeadStatus status) { this.status = status; return this; }
        public LeadBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public LeadBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Lead build() {
            return new Lead(id, fullName, email, phone, websiteUrl, serviceNeeded, budgetRange, notes, status, createdAt, updatedAt);
        }
    }
}
