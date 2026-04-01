package com.jacksnorwood.jacks_backend.service;

import com.jacksnorwood.jacks_backend.dto.ReservationDTO;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.restaurant.email}")
    private String restaurantEmail;

    /** Sent to restaurant when a new reservation request arrives. */
    public void sendReservationNotificationToRestaurant(ReservationDTO dto) {
        if (restaurantEmail == null || restaurantEmail.isBlank()) return;
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper h = new MimeMessageHelper(msg, false, "UTF-8");
            h.setFrom(fromEmail);
            h.setTo(restaurantEmail);
            h.setSubject("New Reservation Request — " + dto.getName());
            h.setText(buildRestaurantHtml(dto), true);
            mailSender.send(msg);
            log.info("Reservation notification sent to restaurant for {}", dto.getName());
        } catch (Exception e) {
            log.error("Failed to send restaurant notification email: {}", e.getMessage());
        }
    }

    /** Sent to guest when admin confirms their reservation. */
    public void sendReservationConfirmationToGuest(ReservationDTO dto) {
        if (dto.getEmail() == null || dto.getEmail().isBlank()) return;
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper h = new MimeMessageHelper(msg, false, "UTF-8");
            h.setFrom(fromEmail);
            h.setTo(dto.getEmail());
            h.setSubject("Your Reservation at Sous Sol — Confirmed");
            h.setText(buildGuestConfirmedHtml(dto), true);
            mailSender.send(msg);
            log.info("Confirmation email sent to guest {}", dto.getEmail());
        } catch (Exception e) {
            log.error("Failed to send guest confirmation email: {}", e.getMessage());
        }
    }

    /** Sent to guest when admin declines their reservation. */
    public void sendReservationDeclinedToGuest(ReservationDTO dto) {
        if (dto.getEmail() == null || dto.getEmail().isBlank()) return;
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper h = new MimeMessageHelper(msg, false, "UTF-8");
            h.setFrom(fromEmail);
            h.setTo(dto.getEmail());
            h.setSubject("Regarding Your Reservation Request at Sous Sol");
            h.setText(buildGuestDeclinedHtml(dto), true);
            mailSender.send(msg);
            log.info("Decline email sent to guest {}", dto.getEmail());
        } catch (Exception e) {
            log.error("Failed to send guest decline email: {}", e.getMessage());
        }
    }

    private String buildRestaurantHtml(ReservationDTO dto) {
        return """
            <html><body style="font-family:Georgia,serif;background:#f7f3ed;color:#1c1510;padding:32px">
            <h2 style="color:#8b6820;margin-bottom:4px">New Reservation Request</h2>
            <p style="color:#6b5c4a;font-size:13px;margin-top:0">Submitted via soussol.com.au</p>
            <table style="border-collapse:collapse;width:100%%">
              <tr><td style="padding:10px 14px;border-bottom:1px solid #d0c8bb;color:#6b5c4a;width:130px">Name</td>
                  <td style="padding:10px 14px;border-bottom:1px solid #d0c8bb"><strong>%s</strong></td></tr>
              <tr><td style="padding:10px 14px;border-bottom:1px solid #d0c8bb;color:#6b5c4a">Email</td>
                  <td style="padding:10px 14px;border-bottom:1px solid #d0c8bb">%s</td></tr>
              <tr><td style="padding:10px 14px;border-bottom:1px solid #d0c8bb;color:#6b5c4a">Phone</td>
                  <td style="padding:10px 14px;border-bottom:1px solid #d0c8bb">%s</td></tr>
              <tr><td style="padding:10px 14px;border-bottom:1px solid #d0c8bb;color:#6b5c4a">Date</td>
                  <td style="padding:10px 14px;border-bottom:1px solid #d0c8bb">%s</td></tr>
              <tr><td style="padding:10px 14px;border-bottom:1px solid #d0c8bb;color:#6b5c4a">Time</td>
                  <td style="padding:10px 14px;border-bottom:1px solid #d0c8bb">%s</td></tr>
              <tr><td style="padding:10px 14px;border-bottom:1px solid #d0c8bb;color:#6b5c4a">Guests</td>
                  <td style="padding:10px 14px;border-bottom:1px solid #d0c8bb">%d</td></tr>
              <tr><td style="padding:10px 14px;color:#6b5c4a;vertical-align:top">Notes</td>
                  <td style="padding:10px 14px">%s</td></tr>
            </table>
            <p style="margin-top:24px;color:#6b5c4a;font-size:13px">
              Log in to the admin dashboard to confirm or decline this reservation.
            </p>
            </body></html>
            """.formatted(
                dto.getName(),
                dto.getEmail(),
                dto.getPhone() != null && !dto.getPhone().isBlank() ? dto.getPhone() : "—",
                dto.getDate(),
                dto.getTime(),
                dto.getGuests(),
                dto.getNotes() != null && !dto.getNotes().isBlank() ? dto.getNotes() : "—"
        );
    }

    private String buildGuestConfirmedHtml(ReservationDTO dto) {
        return """
            <html><body style="font-family:Georgia,serif;background:#f7f3ed;color:#1c1510;padding:32px">
            <h2 style="color:#8b6820">Your Reservation is Confirmed</h2>
            <p>Dear %s,</p>
            <p>We are delighted to confirm your reservation at <strong>Sous Sol</strong>. We look forward to welcoming you.</p>
            <table style="border-collapse:collapse;width:100%%">
              <tr><td style="padding:10px 14px;border-bottom:1px solid #d0c8bb;color:#6b5c4a;width:100px">Date</td>
                  <td style="padding:10px 14px;border-bottom:1px solid #d0c8bb"><strong>%s</strong></td></tr>
              <tr><td style="padding:10px 14px;border-bottom:1px solid #d0c8bb;color:#6b5c4a">Time</td>
                  <td style="padding:10px 14px;border-bottom:1px solid #d0c8bb"><strong>%s</strong></td></tr>
              <tr><td style="padding:10px 14px;color:#6b5c4a">Guests</td>
                  <td style="padding:10px 14px"><strong>%d</strong></td></tr>
            </table>
            <p style="margin-top:24px;color:#6b5c4a;font-style:italic">
              Hidden Below. Found By Few.<br>
              Below the streets of Norwood, Adelaide SA 5067.
            </p>
            <p style="color:#6b5c4a;font-size:13px">
              For any enquiries please contact us at
              <a href="mailto:hello@soussol.com.au" style="color:#8b6820">hello@soussol.com.au</a>
            </p>
            </body></html>
            """.formatted(
                dto.getName(),
                dto.getDate(),
                dto.getTime(),
                dto.getGuests()
        );
    }

    private String buildGuestDeclinedHtml(ReservationDTO dto) {
        return """
            <html><body style="font-family:Georgia,serif;background:#f7f3ed;color:#1c1510;padding:32px">
            <h2 style="color:#8b6820">Reservation Update</h2>
            <p>Dear %s,</p>
            <p>Thank you for your interest in dining with us at <strong>Sous Sol</strong>.</p>
            <p>Unfortunately, we are unable to accommodate your reservation request for
            <strong>%s</strong> at <strong>%s</strong> (%d %s).</p>
            <p style="color:#6b5c4a">This may be due to full capacity on that evening.
            We would love to welcome you on another occasion — please don&apos;t hesitate
            to submit a new request for a different date or time.</p>
            <p style="margin-top:24px;color:#6b5c4a;font-style:italic">
              Hidden Below. Found By Few.<br>
              Below the streets of Norwood, Adelaide SA 5067.
            </p>
            <p style="color:#6b5c4a;font-size:13px">
              For any enquiries please contact us at
              <a href="mailto:hello@soussol.com.au" style="color:#8b6820">hello@soussol.com.au</a>
            </p>
            </body></html>
            """.formatted(
                dto.getName(),
                dto.getDate(),
                dto.getTime(),
                dto.getGuests(),
                dto.getGuests() == 1 ? "guest" : "guests"
        );
    }
}
