package com.api.nature_harvest_backend.services.email;

import com.api.nature_harvest_backend.models.EmailConfirmation;
import com.api.nature_harvest_backend.models.User;
import jakarta.mail.MessagingException;

public interface IEmailService {
    void sendConfirmationEmail(User user, String token) throws Exception;


}
