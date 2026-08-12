package com.cakedelight.order.repository;

import com.cakedelight.order.model.Basket;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface BasketRepository extends MongoRepository<Basket, String> {

    Optional<Basket> findByCustomerEmail(String customerEmail);
}