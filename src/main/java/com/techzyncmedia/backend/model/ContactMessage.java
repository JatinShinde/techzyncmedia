package com.techzyncmedia.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "contact_messages")
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    private String phone;

    private String company;

    private String subject;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContactStatus status;

    private LocalDateTime createdAt;

    public ContactMessage() {}

    public ContactMessage(Long id, String name, String email, String phone, String company, String subject, String message, ContactStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.company = company;
        this.subject = subject;
        this.message = message;
        this.status = status;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = ContactStatus.UNREAD;
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public ContactStatus getStatus() { return status; }
    public void setStatus(ContactStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Builder
    public static ContactMessageBuilder builder() { return new ContactMessageBuilder(); }

    public static class ContactMessageBuilder {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private String company;
        private String subject;
        private String message;
        private ContactStatus status;
        private LocalDateTime createdAt;

        public ContactMessageBuilder id(Long id) { this.id = id; return this; }
        public ContactMessageBuilder name(String name) { this.name = name; return this; }
        public ContactMessageBuilder email(String email) { this.email = email; return this; }
        public ContactMessageBuilder phone(String phone) { this.phone = phone; return this; }
        public ContactMessageBuilder company(String company) { this.company = company; return this; }
        public ContactMessageBuilder subject(String subject) { this.subject = subject; return this; }
        public ContactMessageBuilder message(String message) { this.message = message; return this; }
        public ContactMessageBuilder status(ContactStatus status) { this.status = status; return this; }
        public ContactMessageBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ContactMessage build() {
            return new ContactMessage(id, name, email, phone, company, subject, message, status, createdAt);
        }
    }
}
