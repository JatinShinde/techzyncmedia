package com.techzyncmedia.backend.controller;

import com.techzyncmedia.backend.dto.DashboardStatsDto;
import com.techzyncmedia.backend.dto.StatusUpdateRequestDto;
import com.techzyncmedia.backend.model.ContactMessage;
import com.techzyncmedia.backend.model.ContactStatus;
import com.techzyncmedia.backend.model.Lead;
import com.techzyncmedia.backend.model.LeadStatus;
import com.techzyncmedia.backend.service.AdminUserService;
import com.techzyncmedia.backend.service.ContactService;
import com.techzyncmedia.backend.service.LeadService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    private final LeadService leadService;
    private final ContactService contactService;
    private final AdminUserService adminUserService;

    @Autowired
    public AdminController(LeadService leadService, ContactService contactService, AdminUserService adminUserService) {
        this.leadService = leadService;
        this.contactService = contactService;
        this.adminUserService = adminUserService;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getStats() {
        return ResponseEntity.ok(adminUserService.getDashboardStats());
    }

    // Lead endpoints
    @GetMapping("/leads")
    public ResponseEntity<List<Lead>> getLeads(@RequestParam(required = false) LeadStatus status) {
        return ResponseEntity.ok(leadService.getAllLeads(status));
    }

    @GetMapping("/leads/{id}")
    public ResponseEntity<Lead> getLeadById(@PathVariable Long id) {
        return ResponseEntity.ok(leadService.getLeadById(id));
    }

    @PutMapping("/leads/{id}/status")
    public ResponseEntity<Lead> updateLeadStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequestDto request) {
        LeadStatus status = LeadStatus.valueOf(request.getStatus().toUpperCase());
        Lead updatedLead = leadService.updateLeadStatus(id, status);
        return ResponseEntity.ok(updatedLead);
    }

    @DeleteMapping("/leads/{id}")
    public ResponseEntity<?> deleteLead(@PathVariable Long id) {
        leadService.deleteLead(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Lead deleted successfully"));
    }

    // Contact Message endpoints
    @GetMapping("/contacts")
    public ResponseEntity<List<ContactMessage>> getContactMessages(@RequestParam(required = false) ContactStatus status) {
        return ResponseEntity.ok(contactService.getAllMessages(status));
    }

    @GetMapping("/contacts/{id}")
    public ResponseEntity<ContactMessage> getContactMessageById(@PathVariable Long id) {
        return ResponseEntity.ok(contactService.getMessageById(id));
    }

    @PutMapping("/contacts/{id}/status")
    public ResponseEntity<ContactMessage> updateMessageStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequestDto request) {
        ContactStatus status = ContactStatus.valueOf(request.getStatus().toUpperCase());
        ContactMessage updatedMessage = contactService.updateMessageStatus(id, status);
        return ResponseEntity.ok(updatedMessage);
    }

    @DeleteMapping("/contacts/{id}")
    public ResponseEntity<?> deleteContactMessage(@PathVariable Long id) {
        contactService.deleteMessage(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Contact message deleted successfully"));
    }
}
