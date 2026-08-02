package com.techzyncmedia.backend.service;

import com.techzyncmedia.backend.dto.ContactRequestDto;
import com.techzyncmedia.backend.model.ContactMessage;
import com.techzyncmedia.backend.model.ContactStatus;
import com.techzyncmedia.backend.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {

    private final ContactRepository contactRepository;

    @Autowired
    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public ContactMessage createContactMessage(ContactRequestDto dto) {
        ContactMessage contact = ContactMessage.builder()
                .name(dto.getName())
                .email(dto.getEmail().trim().toLowerCase())
                .phone(dto.getPhone())
                .company(dto.getCompany())
                .subject(dto.getSubject())
                .message(dto.getMessage())
                .status(ContactStatus.UNREAD)
                .build();
        return contactRepository.save(contact);
    }

    public List<ContactMessage> getAllMessages(ContactStatus status) {
        if (status != null) {
            return contactRepository.findByStatusOrderByCreatedAtDesc(status);
        }
        return contactRepository.findAllByOrderByCreatedAtDesc();
    }

    public ContactMessage getMessageById(Long id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Contact message not found with ID: " + id));
    }

    public ContactMessage updateMessageStatus(Long id, ContactStatus newStatus) {
        ContactMessage message = getMessageById(id);
        message.setStatus(newStatus);
        return contactRepository.save(message);
    }

    public void deleteMessage(Long id) {
        if (!contactRepository.existsById(id)) {
            throw new IllegalArgumentException("Contact message not found with ID: " + id);
        }
        contactRepository.deleteById(id);
    }
}
