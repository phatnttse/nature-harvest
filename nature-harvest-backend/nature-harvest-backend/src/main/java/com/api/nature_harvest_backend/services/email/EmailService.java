package com.api.nature_harvest_backend.services.email;

import com.api.nature_harvest_backend.models.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService implements  IEmailService {
    private  final JavaMailSender javaMailSender;
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
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

    @Override
    public void sendResetPasswordEmail(User user, String token, String newPassword) throws Exception {
        // MIME - HTML Message
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(user.getEmail());
        helper.setSubject("Confirm Your Email - Nature's Harvest Application Registration");

        String emailContent = generateEmailForgotPasswordContent(user.getName(), newPassword);
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

    private String generateEmailForgotPasswordContent(String name, String newPassword) {
        return "<!DOCTYPE html>\n" +
                "<html lang=\"vi\">\n" +
                "  <head>\n" +
                "    <meta charset=\"UTF-8\" />\n" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n" +
                "    <title>Xác Nhận Email</title>\n" +
                "    <style>\n" +
                "      body {\n" +
                "        font-family: Arial, sans-serif;\n" +
                "        background-color: #f4f4f4;\n" +
                "        margin: 0;\n" +
                "        padding: 0;\n" +
                "      }\n" +
                "      .container {\n" +
                "        width: 100%;\n" +
                "        max-width: 600px;\n" +
                "        margin: 0 auto;\n" +
                "        background-color: #ffffff;\n" +
                "        padding: 20px;\n" +
                "        border-radius: 10px;\n" +
                "        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);\n" +
                "      }\n" +
                "      .header {\n" +
                "        text-align: center;\n" +
                "        padding: 20px 0;\n" +
                "      }\n" +
                "      .header img {\n" +
                "        max-width: 180px;\n" +
                "      }\n" +
                "      .content {\n" +
                "        text-align: center;\n" +
                "        padding: 20px 0;\n" +
                "      }\n" +
                "      .content h1 {\n" +
                "        color: #333333;\n" +
                "      }\n" +
                "      .content p {\n" +
                "        color: #666666;\n" +
                "        line-height: 1.6;\n" +
                "      }\n" +
                "      .btn {\n" +
                "        display: inline-block;\n" +
                "        background-color: #13b451;\n" +
                "        color: #ffffff;\n" +
                "        text-decoration: none;\n" +
                "        padding: 10px 20px;\n" +
                "        border-radius: 5px;\n" +
                "        margin-top: 20px;\n" +
                "      }\n" +
                "      .footer {\n" +
                "        text-align: center;\n" +
                "        padding: 20px 0;\n" +
                "        color: #aaaaaa;\n" +
                "        font-size: 12px;\n" +
                "      }\n" +
                "      .signature {\n" +
                "        margin-top: 40px;\n" +
                "        text-align: left;\n" +
                "      }\n" +
                "      .a {\n" +
                "        color: #fff !important;\n" +
                "      }\n" +
                "    </style>\n" +
                "  </head>\n" +
                "  <body>\n" +
                "    <div class=\"container\">\n" +
                "      <div class=\"header\">\n" +
                "        <img src=\"https://res.cloudinary.com/dlpust9lj/image/upload/v1720436456/ebhqmo659apqbsoigbmy.png\" alt=\"Logo\" />\n" +
                "      </div>\n" +
                "      <div class=\"content\">\n" +
                "        <h1>Hi, " + name + "</h1>\n" +
                "        <p>\n" +
                "          Cảm ơn bạn đã thông báo đến chúng tôi về việc quên mật khẩu. Đây là\n" +
                "          mật khẩu mới của bạn. Ngay bây giờ bạn có thể đăng nhập với mật khẩu mới sau: .\n" +
                "        </p>\n" +
                "        " + newPassword + "\n" +
                "        <div class=\"signature\">\n" +
                "          <p>Trân trọng,</p>\n" +
                "          <p>Nature's Harvest</p>\n" +
                "        </div>\n" +
                "      </div>\n" +
                "      <div class=\"footer\">\n" +
                "        <p>Nếu bạn muốn đổi sang mật khẩu mới. Vui lòng đăng nhập bằng mật khẩu đã được" +
                "           hệ thống cấp, sau đó thực hiện đổi mật khẩu ở phần tài khoản. Cảm ơn bạn.</p>\n" +
                "      </div>\n" +
                "    </div>\n" +
                "  </body>\n" +
                "</html>\n";
    }

    private String generateConfirmationLink(String token){
        return String.format("<a href=%s/verify-email?token=%s>Confirm Email</a>", apiPrefix, token);
    }
}
