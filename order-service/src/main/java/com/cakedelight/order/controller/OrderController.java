package com.cakedelight.order.controller;

import com.cakedelight.order.model.AddToCartRequest;
import com.cakedelight.order.model.Basket;
import com.cakedelight.order.model.CheckoutRequest;
import com.cakedelight.order.model.Order;
import com.cakedelight.order.service.OrderService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/cart")
    public ResponseEntity<Basket> addToCart(
            @RequestParam String customerEmail,
            @Valid @RequestBody AddToCartRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderService.addToCart(customerEmail, request));
    }

    @GetMapping("/cart/{customerEmail}")
    public ResponseEntity<Basket> getBasket(
            @PathVariable String customerEmail) {

        return ResponseEntity.ok(
                orderService.getBasket(customerEmail)
        );
    }

    @PutMapping("/cart/{customerEmail}/{cakeId}")
    public ResponseEntity<Basket> updateCart(
            @PathVariable String customerEmail,
            @PathVariable String cakeId,
            @RequestParam @Min(1) int quantity) {

        return ResponseEntity.ok(
                orderService.updateCart(customerEmail, cakeId, quantity)
        );
    }

    @DeleteMapping("/cart/{customerEmail}/{cakeId}")
    public ResponseEntity<Basket> removeFromCart(
            @PathVariable String customerEmail,
            @PathVariable String cakeId) {

        return ResponseEntity.ok(
                orderService.removeFromCart(customerEmail, cakeId)
        );
    }

    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(
            @Valid @RequestBody CheckoutRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderService.checkout(request));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(
            @PathVariable String orderId) {

        return ResponseEntity.ok(
                orderService.getOrderById(orderId)
        );
    }

    @GetMapping("/customer/{email}")
    public ResponseEntity<List<Order>> getOrdersByCustomer(
            @PathVariable String email) {

        return ResponseEntity.ok(
                orderService.getOrdersByCustomer(email)
        );
    }
}