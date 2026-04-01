package com.jacksnorwood.jacks_backend.controller;

import com.jacksnorwood.jacks_backend.dto.ContactMessageDTO;
import com.jacksnorwood.jacks_backend.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<Void> send(@RequestBody ContactMessageDTO dto) {
        contactService.send(dto);
        return ResponseEntity.ok().build();
    }
}
