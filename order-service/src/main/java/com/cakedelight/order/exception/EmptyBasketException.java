package com.cakedelight.order.exception;

public class EmptyBasketException extends RuntimeException {

    public EmptyBasketException(String message) {
        super(message);
    }
}