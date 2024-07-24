package com.api.nature_harvest_backend.services.email;

import com.api.nature_harvest_backend.models.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
@RequiredArgsConstructor
public class EmailService implements IEmailService {
    private final JavaMailSender javaMailSender;
    @Value("${api.confirmEmail}")
    private String apiPrefix;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Override
    public void sendConfirmationEmail(User user, String token) throws MessagingException, UnsupportedEncodingException {
        // MIME - HTML Message
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        String senderName = "Nature's Harvest";
        InternetAddress fromAddress = new InternetAddress(senderEmail, senderName);
        helper.setFrom(fromAddress);

        helper.setTo(user.getEmail());
        helper.setSubject("Confirm Your Email - Nature's Harvest Application Registration");

        String emailContent = generateEmailContent(user.getName(), token, user.getEmail());
        helper.setText(emailContent, true);

        javaMailSender.send(message);
    }

    private String generateEmailContent(String name, String token, String email) {
        String confirmationLink = generateConfirmationLink(token, email);
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
                "          Cảm ơn bạn đã đăng ký tài khoản với cửa hàng của chúng tôi. Vui lòng\n" +
                "          nhấn vào nút bên dưới để xác nhận địa chỉ email của bạn. Mã xác thực sẽ hết hạn sau 1 giờ.\n" +
                "        </p>\n" +
                "        " + confirmationLink + "\n" +
                "        <div class=\"signature\">\n" +
                "          <p>Trân trọng,</p>\n" +
                "          <p>Nature's Harvest</p>\n" +
                "        </div>\n" +
                "      </div>\n" +
                "      <div class=\"footer\">\n" +
                "        <p>Nếu bạn không yêu cầu xác nhận, vui lòng bỏ qua email.</p>\n" +
                "      </div>\n" +
                "    </div>\n" +
                "  </body>\n" +
                "</html>\n";
    }

    private String generateConfirmationLink(String token, String email) {
        return String.format("<a href=%s/verify-email/%s/%s class=\"btn\" style=\"color: #fff !important\">Xác nhận email</a>", apiPrefix, token, email);
    }

    @Override
    public void sendResetPasswordEmail(User user, String newPassword) throws Exception {
        // MIME - HTML Message
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        String senderName = "Nature's Harvest";
        InternetAddress fromAddress = new InternetAddress(senderEmail, senderName);
        helper.setFrom(fromAddress);

        helper.setTo(user.getEmail());
        helper.setSubject("Reset Your Password - Nature's Harvest Application");

        String emailContent = generateEmailForgotPasswordContent(user.getName(), newPassword);
        helper.setText(emailContent, true);

        javaMailSender.send(message);
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
}
