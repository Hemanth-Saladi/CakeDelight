package com.cakedelight.order.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class AddToCartRequest {

    @NotBlank(message = "Cake ID is required")
    private String cakeId;

    @NotBlank(message = "Cake name is required")
    private String cakeName;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;

    public AddToCartRequest() {
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
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}