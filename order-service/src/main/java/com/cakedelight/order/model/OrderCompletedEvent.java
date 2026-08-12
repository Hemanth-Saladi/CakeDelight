package com.cakedelight.order.model;

import java.math.BigDecimal;
import java.util.List;

public class OrderCompletedEvent {

    private String orderId;
    private String customerName;
    private String email;
    private String phoneNumber;
    private BigDecimal totalAmount;
    private List<OrderItem> items;

    public OrderCompletedEvent() {
    }

    public OrderCompletedEvent(
            String orderId,
            String customerName,
            String email,
            String phoneNumber,
            BigDecimal totalAmount,
            List<OrderItem> items) {

        this.orderId = orderId;
        this.customerName = customerName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.totalAmount = totalAmount;
        this.items = items;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }
}