package com.jacksnorwood.jacks_backend.service;

import com.jacksnorwood.jacks_backend.dto.DashboardStatsDTO;
import com.jacksnorwood.jacks_backend.entity.ReservationStatus;
import com.jacksnorwood.jacks_backend.repository.MenuItemRepository;
import com.jacksnorwood.jacks_backend.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ReservationRepository reservationRepository;
    private final MenuItemRepository menuItemRepository;

    public DashboardStatsDTO getStats() {
        return new DashboardStatsDTO(
                reservationRepository.count(),
                reservationRepository.countByStatus(ReservationStatus.PENDING),
                reservationRepository.countByStatus(ReservationStatus.CONFIRMED),
                reservationRepository.countByStatus(ReservationStatus.CANCELLED),
                menuItemRepository.count()
        );
    }
}
