package com.techzyncmedia.backend.repository;

import com.techzyncmedia.backend.model.ContactMessage;
import com.techzyncmedia.backend.model.ContactStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContactRepository extends JpaRepository<ContactMessage, Long> {
    List<ContactMessage> findByStatusOrderByCreatedAtDesc(ContactStatus status);
    List<ContactMessage> findAllByOrderByCreatedAtDesc();
    long countByStatus(ContactStatus status);
}
