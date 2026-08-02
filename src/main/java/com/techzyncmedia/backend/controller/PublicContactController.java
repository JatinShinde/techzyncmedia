package com.techzyncmedia.backend.controller;

import com.techzyncmedia.backend.dto.ContactRequestDto;
import com.techzyncmedia.backend.model.ContactMessage;
import com.techzyncmedia.backend.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/public/contacts")
@CrossOrigin
public class PublicContactController {

    private final ContactService contactService;

    @Autowired
    public PublicContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<?> submitContactMessage(@Valid @RequestBody ContactRequestDto dto) {
        ContactMessage savedMessage = contactService.createContactMessage(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "message", "Your message has been received! We will get back to you shortly.",
                "messageId", savedMessage.getId()
        ));
    }
}
