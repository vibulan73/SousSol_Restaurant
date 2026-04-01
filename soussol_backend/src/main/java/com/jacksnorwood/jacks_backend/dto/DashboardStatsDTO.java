package com.jacksnorwood.jacks_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalReservations;
    private long pendingReservations;
    private long confirmedReservations;
    private long cancelledReservations;
    private long totalMenuItems;
}
