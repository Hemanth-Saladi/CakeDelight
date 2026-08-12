package com.cakedelight.order.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "baskets")
public class Basket {

    @Id
    private String basketId;

    private String customerEmail;

    private List<BasketItem> items = new ArrayList<>();

    private BigDecimal totalAmount = BigDecimal.ZERO;

    public Basket() {
    }

    public Basket(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public void calculateTotal() {
        totalAmount = items.stream()
                .map(BasketItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public String getBasketId() {
        return basketId;
    }

    public void setBasketId(String basketId) {
        this.basketId = basketId;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public List<BasketItem> getItems() {
        return items;
    }

    public void setItems(List<BasketItem> items) {
        this.items = items;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }
}