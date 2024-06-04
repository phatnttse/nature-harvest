package com.api.nature_harvest_backend.services.email;

import com.api.nature_harvest_backend.models.User;
import com.api.nature_harvest_backend.repositories.EmailConfirmationRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.keygen.BytesKeyGenerator;
import org.springframework.security.crypto.keygen.KeyGenerators;
import org.springframework.stereotype.Service;
import java.nio.charset.Charset;

@Service
@RequiredArgsConstructor
public class EmailService implements  IEmailService {
    private static final BytesKeyGenerator  DEFAULT_TOKEN_GENERATOR = KeyGenerators.secureRandom(15);
    private static final Charset US_ASCII = Charset.forName("US-ASCII");
    private final EmailConfirmationRepository emailConfirmationRepository;
    private  final JavaMailSender javaMailSender;
    @Value("${api.confirmEmail}")
    private String apiPrefix;

    @Override
    public void sendConfirmationEmail(User user, String token) throws MessagingException {
        // MIME - HTML Message
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(user.getEmail());
        helper.setSubject("Confirm Your Email - Nature's Harvest Application Registration");

        String emailContent = generateEmailContent(user.getName(), token);
        helper.setText(emailContent, true);

        javaMailSender.send(message);
    }
    private String generateEmailContent(String name, String token) {
        String confirmationLink = generateConfirmationLink(token);
        return "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }" +
                ".container { padding: 20px; background-color: #ffffff; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }" +
                ".header { background-color: #4CAF50; padding: 10px 0; text-align: center; color: white; border-radius: 5px 5px 0 0; }" +
                ".content { padding: 20px; }" +
                ".button { display: block; width: 200px; margin: 20px auto; padding: 10px 0; text-align: center; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; }" +
                ".footer { text-align: center; padding: 10px; font-size: 12px; color: #888888; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h2>Confirm Your Email</h2>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Dear " + name + ",</p>" +
                "<p>We're excited to have you get started. First, you need to confirm your account. Just press the button below.</p>" +
                ""+ confirmationLink + ""+
                "<p>If you did not create an account, no further action is required.</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>Regards,<br/>Vit con lon ton</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    private String generateConfirmationLink(String token){
        return String.format("<a href=%s/verify-email?token=%s>Confirm Email</a>", apiPrefix, token);
    }
}
