package com.cakedelight.rating.exception;

public class RatingNotFoundException extends RuntimeException {

    public RatingNotFoundException(String message) {
        super(message);
    }
}