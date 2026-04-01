package com.jacksnorwood.jacks_backend.service;

import com.jacksnorwood.jacks_backend.dto.ContactMessageDTO;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
@RequiredArgsConstructor
@Slf4j
public class ContactService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String senderEmail;

    @Value("${app.restaurant.email:${spring.mail.username:}}")
    private String restaurantEmail;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public void send(ContactMessageDTO dto) {
        if (restaurantEmail == null || restaurantEmail.isBlank()) return;
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(senderEmail);
            helper.setTo(restaurantEmail);
            helper.setSubject("New Contact Message: " + (dto.getSubject() != null ? dto.getSubject() : "General"));
            helper.setText(
                "You have a new message from the website.\n\n" +
                "Name:    " + dto.getName() + "\n" +
                "Email:   " + dto.getEmail() + "\n" +
                "Phone:   " + (dto.getPhone() != null ? dto.getPhone() : "-") + "\n" +
                "Subject: " + (dto.getSubject() != null ? dto.getSubject() : "General") + "\n" +
                "\nMessage:\n" + dto.getMessage()
            );

            // Attach CV file if provided
            if (dto.getCvUrl() != null && !dto.getCvUrl().isBlank()) {
                String filename = dto.getCvUrl().replaceFirst("^/uploads/", "");
                File cvFile = new File(uploadDir).toPath().toAbsolutePath()
                        .resolve(filename).toFile();
                if (cvFile.exists()) {
                    helper.addAttachment("CV_" + dto.getName() + getExtension(filename), new FileSystemResource(cvFile));
                } else {
                    log.warn("CV file not found on disk: {}", cvFile.getAbsolutePath());
                }
            }

            mailSender.send(message);
        } catch (Exception e) {
            log.warn("Failed to send contact email: {}", e.getMessage());
        }
    }

    private String getExtension(String filename) {
        int dot = filename.lastIndexOf('.');
        return dot >= 0 ? filename.substring(dot) : "";
    }
}
