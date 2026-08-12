package com.cakedelight.order.config;

import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE_NAME = "order.exchange";
    public static final String ROUTING_KEY = "order.completed";

    @Bean
    public DirectExchange orderExchange() {
        return new DirectExchange(EXCHANGE_NAME);
    }

    @Bean
    public JacksonJsonMessageConverter messageConverter() {
        return new JacksonJsonMessageConverter();
    }
}