package com.cakedelight.order.repository;

import com.cakedelight.order.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {

    List<Order> findByEmail(String email);
}