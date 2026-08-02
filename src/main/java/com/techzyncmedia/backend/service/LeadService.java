package com.techzyncmedia.backend.service;

import com.techzyncmedia.backend.dto.LeadRequestDto;
import com.techzyncmedia.backend.model.Lead;
import com.techzyncmedia.backend.model.LeadStatus;
import com.techzyncmedia.backend.repository.LeadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeadService {

    private final LeadRepository leadRepository;

    @Autowired
    public LeadService(LeadRepository leadRepository) {
        this.leadRepository = leadRepository;
    }

    public Lead createLead(LeadRequestDto dto) {
        Lead lead = Lead.builder()
                .fullName(dto.getFullName())
                .email(dto.getEmail().trim().toLowerCase())
                .phone(dto.getPhone())
                .websiteUrl(dto.getWebsiteUrl())
                .serviceNeeded(dto.getServiceNeeded() != null ? dto.getServiceNeeded() : "Website Audit & Development")
                .budgetRange(dto.getBudgetRange())
                .notes(dto.getNotes())
                .status(LeadStatus.NEW)
                .build();
        return leadRepository.save(lead);
    }

    public List<Lead> getAllLeads(LeadStatus status) {
        if (status != null) {
            return leadRepository.findByStatusOrderByCreatedAtDesc(status);
        }
        return leadRepository.findAllByOrderByCreatedAtDesc();
    }

    public Lead getLeadById(Long id) {
        return leadRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Lead not found with ID: " + id));
    }

    public Lead updateLeadStatus(Long id, LeadStatus newStatus) {
        Lead lead = getLeadById(id);
        lead.setStatus(newStatus);
        return leadRepository.save(lead);
    }

    public void deleteLead(Long id) {
        if (!leadRepository.existsById(id)) {
            throw new IllegalArgumentException("Lead not found with ID: " + id);
        }
        leadRepository.deleteById(id);
    }
}
