package planup.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import planup.backend.service.EmailService;
import planup.backend.service.PushService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    private EmailService emailService;
    @Autowired
    private PushService pushService;

    @PostMapping("/email")
    public void sendEmail(@RequestParam String to, @RequestParam String subject, @RequestParam String body) {
        emailService.sendEmail(to, subject, body);
    }

    @PostMapping("/push")
    public void sendPush(@RequestParam String token, @RequestParam String title, @RequestParam String message) {
        pushService.sendPush(token, title, message);
    }
} 