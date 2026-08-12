package com.cakedelight.notification.service;

import com.cakedelight.notification.config.RabbitMQConfig;
import com.cakedelight.notification.model.OrderCompletedEvent;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class NotificationListener {

    private final EmailService emailService;

    public NotificationListener(EmailService emailService) {
        this.emailService = emailService;
    }

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void handleOrderCompleted(OrderCompletedEvent event) {

        System.out.println(
                "Order completed event received: " + event.getOrderId()
        );

        try {
            emailService.sendOrderConfirmation(event);

            System.out.println(
                    "Order confirmation email sent to: " + event.getEmail()
            );

        } catch (Exception exception) {

            System.out.println(
                    "Failed to send notification: "
                            + exception.getMessage()
            );
            
            exception.printStackTrace();
        }
    }
}