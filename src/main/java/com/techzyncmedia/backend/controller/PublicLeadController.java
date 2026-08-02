package com.techzyncmedia.backend.controller;

import com.techzyncmedia.backend.dto.LeadRequestDto;
import com.techzyncmedia.backend.model.Lead;
import com.techzyncmedia.backend.service.LeadService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/public/leads")
@CrossOrigin
public class PublicLeadController {

    private final LeadService leadService;

    @Autowired
    public PublicLeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    @PostMapping
    public ResponseEntity<?> submitLead(@Valid @RequestBody LeadRequestDto dto) {
        Lead savedLead = leadService.createLead(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "message", "Website Audit request submitted successfully! Our agency team will contact you within 24 hours.",
                "leadId", savedLead.getId()
        ));
    }
}
