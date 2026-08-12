package com.cakedelight.order.service;

import com.cakedelight.order.exception.EmptyBasketException;
import com.cakedelight.order.exception.OrderNotFoundException;
import com.cakedelight.order.model.AddToCartRequest;
import com.cakedelight.order.model.Basket;
import com.cakedelight.order.model.BasketItem;
import com.cakedelight.order.model.CheckoutRequest;
import com.cakedelight.order.model.Order;
import com.cakedelight.order.model.OrderItem;
import com.cakedelight.order.repository.BasketRepository;
import com.cakedelight.order.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final BasketRepository basketRepository;
    private final OrderRepository orderRepository;
    private final OrderEventPublisher orderEventPublisher;

    public OrderService(BasketRepository basketRepository,
                        OrderRepository orderRepository,
                        OrderEventPublisher orderEventPublisher) {
        this.basketRepository = basketRepository;
        this.orderRepository = orderRepository;
        this.orderEventPublisher = orderEventPublisher;
    }

    public Basket addToCart(String customerEmail, AddToCartRequest request) {

        Basket basket = basketRepository.findByCustomerEmail(customerEmail)
                .orElseGet(() -> new Basket(customerEmail));

        BasketItem existingItem = basket.getItems()
                .stream()
                .filter(item -> item.getCakeId().equals(request.getCakeId()))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(
                    existingItem.getQuantity() + request.getQuantity()
            );
        } else {
            BasketItem basketItem = new BasketItem(
                    request.getCakeId(),
                    request.getCakeName(),
                    request.getPrice(),
                    request.getQuantity()
            );

            basket.getItems().add(basketItem);
        }

        basket.calculateTotal();

        return basketRepository.save(basket);
    }

    public Basket getBasket(String customerEmail) {

        return basketRepository.findByCustomerEmail(customerEmail)
                .orElseGet(() -> new Basket(customerEmail));
    }

    public Basket updateCart(String customerEmail, String cakeId, int quantity) {

        Basket basket = basketRepository.findByCustomerEmail(customerEmail)
                .orElseThrow(() ->
                        new EmptyBasketException("Basket not found"));

        BasketItem item = basket.getItems()
                .stream()
                .filter(basketItem -> basketItem.getCakeId().equals(cakeId))
                .findFirst()
                .orElseThrow(() ->
                        new EmptyBasketException("Cake not found in basket"));

        item.setQuantity(quantity);

        basket.calculateTotal();

        return basketRepository.save(basket);
    }

    public Basket removeFromCart(String customerEmail, String cakeId) {

        Basket basket = basketRepository.findByCustomerEmail(customerEmail)
                .orElseThrow(() ->
                        new EmptyBasketException("Basket not found"));

        boolean removed = basket.getItems()
                .removeIf(item -> item.getCakeId().equals(cakeId));

        if (!removed) {
            throw new EmptyBasketException("Cake not found in basket");
        }

        basket.calculateTotal();

        return basketRepository.save(basket);
    }

    public Order checkout(CheckoutRequest request) {

        Basket basket = basketRepository.findByCustomerEmail(request.getEmail())
                .orElseThrow(() ->
                        new EmptyBasketException("Basket is empty"));

        if (basket.getItems().isEmpty()) {
            throw new EmptyBasketException("Basket is empty");
        }

        Order order = new Order();

        order.setCustomerName(request.getCustomerName());
        order.setEmail(request.getEmail());
        order.setPhoneNumber(request.getPhoneNumber());

        List<OrderItem> orderItems = new ArrayList<>();

        for (BasketItem basketItem : basket.getItems()) {

            OrderItem orderItem = new OrderItem(
                    basketItem.getCakeId(),
                    basketItem.getCakeName(),
                    basketItem.getPrice(),
                    basketItem.getQuantity()
            );

            orderItems.add(orderItem);
        }

        order.setItems(orderItems);
        order.setTotalAmount(basket.getTotalAmount());
        order.setStatus("CONFIRMED");
        order.setOrderDate(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);

        orderEventPublisher.publishOrderCompleted(savedOrder);

        basketRepository.delete(basket);

        return savedOrder;
    }

    public Order getOrderById(String orderId) {

        return orderRepository.findById(orderId)
                .orElseThrow(() ->
                        new OrderNotFoundException(
                                "Order not found with id: " + orderId));
    }

    public List<Order> getOrdersByCustomer(String email) {
        return orderRepository.findByEmail(email);
    }
}