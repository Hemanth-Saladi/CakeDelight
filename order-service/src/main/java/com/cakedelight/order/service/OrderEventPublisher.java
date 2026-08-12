package com.cakedelight.order.service;

import com.cakedelight.order.config.RabbitMQConfig;
import com.cakedelight.order.model.OrderCompletedEvent;
import com.cakedelight.order.model.Order;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class OrderEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public OrderEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishOrderCompleted(Order order) {

            OrderCompletedEvent event = 
                    new OrderCompletedEvent(
                            order.getOrderId(),
                            order.getCustomerName(),
                            order.getEmail(),
                            order.getPhoneNumber(),
                            order.getTotalAmount(),
                            order.getItems());

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE_NAME,
                RabbitMQConfig.ROUTING_KEY,
                event
        );

        System.out.println(
                "Order completed event published: "
                        + order.getOrderId()
        );
    }
}