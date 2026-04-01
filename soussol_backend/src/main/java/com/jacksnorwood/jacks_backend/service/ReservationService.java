package com.jacksnorwood.jacks_backend.service;

import com.jacksnorwood.jacks_backend.dto.ReservationDTO;
import com.jacksnorwood.jacks_backend.entity.Reservation;
import com.jacksnorwood.jacks_backend.entity.ReservationStatus;
import com.jacksnorwood.jacks_backend.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final EmailService emailService;

    public ReservationDTO create(ReservationDTO dto) {
        Reservation r = Reservation.builder()
                .name(dto.getName()).email(dto.getEmail()).phone(dto.getPhone())
                .date(dto.getDate()).time(dto.getTime()).guests(dto.getGuests())
                .notes(dto.getNotes()).status(ReservationStatus.PENDING).build();
        ReservationDTO saved = toDTO(reservationRepository.save(r));
        emailService.sendReservationNotificationToRestaurant(saved);
        return saved;
    }

    public List<ReservationDTO> getAll() {
        return reservationRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ReservationDTO updateStatus(Long id, String status) {
        Reservation r = reservationRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        ReservationStatus newStatus = ReservationStatus.valueOf(status.toUpperCase());
        r.setStatus(newStatus);
        ReservationDTO saved = toDTO(reservationRepository.save(r));
        if (newStatus == ReservationStatus.CONFIRMED) {
            emailService.sendReservationConfirmationToGuest(saved);
        } else if (newStatus == ReservationStatus.CANCELLED) {
            emailService.sendReservationDeclinedToGuest(saved);
        }
        return saved;
    }

    private ReservationDTO toDTO(Reservation r) {
        ReservationDTO dto = new ReservationDTO();
        dto.setId(r.getId()); dto.setName(r.getName()); dto.setEmail(r.getEmail());
        dto.setPhone(r.getPhone()); dto.setDate(r.getDate()); dto.setTime(r.getTime());
        dto.setGuests(r.getGuests()); dto.setNotes(r.getNotes());
        dto.setStatus(r.getStatus().name()); dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }
}
