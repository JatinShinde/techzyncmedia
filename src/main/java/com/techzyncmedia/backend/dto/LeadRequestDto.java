package com.techzyncmedia.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LeadRequestDto {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String phone;

    private String websiteUrl;

    private String serviceNeeded;

    private String budgetRange;

    private String notes;

    public LeadRequestDto() {}

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
}
