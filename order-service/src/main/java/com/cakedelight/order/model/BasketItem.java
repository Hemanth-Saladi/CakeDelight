package com.cakedelight.order.model;

import java.math.BigDecimal;

public class BasketItem {

    private String cakeId;
    private String cakeName;
    private BigDecimal price;
    private int quantity;
    private BigDecimal subtotal;

    public BasketItem() {
    }

    public BasketItem(String cakeId, String cakeName, BigDecimal price, int quantity) {
        this.cakeId = cakeId;
        this.cakeName = cakeName;
        this.price = price;
        this.quantity = quantity;
        calculateSubtotal();
    }

    public void calculateSubtotal() {
        this.subtotal = price.multiply(BigDecimal.valueOf(quantity));
    }

    public String getCakeId() {
        return cakeId;
    }

    public void setCakeId(String cakeId) {
        this.cakeId = cakeId;
    }

    public String getCakeName() {
        return cakeName;
    }

    public void setCakeName(String cakeName) {
        this.cakeName = cakeName;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
        calculateSubtotal();
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
        calculateSubtotal();
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}