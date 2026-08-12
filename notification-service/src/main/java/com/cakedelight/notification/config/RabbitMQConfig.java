package com.cakedelight.notification.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableRabbit
public class RabbitMQConfig {

    public static final String EXCHANGE_NAME = "order.exchange";
    public static final String QUEUE_NAME = "order.notification.queue";
    public static final String ROUTING_KEY = "order.completed";

    @Bean
    public DirectExchange orderExchange() {
        return new DirectExchange(EXCHANGE_NAME);
    }

    @Bean
    public Queue notificationQueue() {
        return new Queue(QUEUE_NAME, true);
    }

    @Bean
    public Binding notificationBinding(
            Queue notificationQueue,
            DirectExchange orderExchange) {

        return BindingBuilder
                .bind(notificationQueue)
                .to(orderExchange)
                .with(ROUTING_KEY);
    }

    @Bean
    public JacksonJsonMessageConverter messageConverter() {
        return new JacksonJsonMessageConverter();
    }
}