package com.techzyncmedia.backend.repository;

import com.techzyncmedia.backend.model.Lead;
import com.techzyncmedia.backend.model.LeadStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {
    List<Lead> findByStatusOrderByCreatedAtDesc(LeadStatus status);
    List<Lead> findAllByOrderByCreatedAtDesc();
    long countByStatus(LeadStatus status);
}
