package com.cakedelight.notification.service;

import com.cakedelight.notification.model.OrderCompletedEvent;
import com.cakedelight.notification.model.OrderItemEvent;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOrderConfirmation(OrderCompletedEvent event) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("hemanthsaladi2004@gmail.com");
        message.setTo(event.getEmail());
        message.setSubject("Cake Delight - Order Confirmed");

        StringBuilder body = new StringBuilder();

        body.append("Hello ")
                .append(event.getCustomerName())
                .append(",\n\n");

        body.append("Thank you for choosing Cake Delight!\n");
        body.append("Your order has been successfully confirmed.\n\n");

        body.append("ORDER DETAILS\n");
        body.append("----------------------------------------\n");

        if (event.getItems() != null) {

            for (OrderItemEvent item : event.getItems()) {

                body.append("Cake: ")
                        .append(item.getCakeName())
                        .append("\n");

                body.append("Quantity: ")
                        .append(item.getQuantity())
                        .append("\n");

                body.append("Price: ₹")
                        .append(item.getPrice())
                        .append("\n");

                body.append("Subtotal: ₹")
                        .append(item.getSubtotal())
                        .append("\n");

                body.append("----------------------------------------\n");
            }
        }

        body.append("Order ID: ")
                .append(event.getOrderId())
                .append("\n");

        body.append("Total Amount: ₹")
                .append(event.getTotalAmount())
                .append("\n\n");

        body.append("Phone: ")
                .append(event.getPhoneNumber())
                .append("\n\n");

        body.append("Thank you for choosing Cake Delight!\n");
        body.append("We hope you enjoy your delicious cakes.\n\n");

        body.append("Cake Delight Team");

        message.setText(body.toString());

        mailSender.send(message);
    }
}