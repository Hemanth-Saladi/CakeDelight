package com.cakedelight.rating.repository;

import com.cakedelight.rating.model.Rating;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RatingRepository extends MongoRepository<Rating, String> {

    List<Rating> findByCakeId(String cakeId);
}