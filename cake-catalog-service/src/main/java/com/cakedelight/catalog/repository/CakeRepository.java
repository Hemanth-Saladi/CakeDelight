package com.cakedelight.catalog.repository;

import com.cakedelight.catalog.model.Cake;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.math.BigDecimal;
import java.util.List;

public interface CakeRepository extends MongoRepository<Cake, String> {

    List<Cake> findByNameContainingIgnoreCase(String name);

    List<Cake> findByCategoryIgnoreCase(String category);

    List<Cake> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
}