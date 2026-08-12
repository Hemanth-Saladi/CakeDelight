package com.cakedelight.rating.service;

import com.cakedelight.rating.exception.RatingNotFoundException;
import com.cakedelight.rating.model.Rating;
import com.cakedelight.rating.repository.RatingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RatingService {

    private final RatingRepository ratingRepository;

    public RatingService(RatingRepository ratingRepository) {
        this.ratingRepository = ratingRepository;
    }

    public Rating addRating(Rating rating) {
        rating.setCreatedAt(java.time.LocalDateTime.now());
        return ratingRepository.save(rating);
    }

    public List<Rating> getRatingsByCake(String cakeId) {
        return ratingRepository.findByCakeId(cakeId);
    }

    public double getAverageRating(String cakeId) {

        List<Rating> ratings = ratingRepository.findByCakeId(cakeId);

        if (ratings.isEmpty()) {
            return 0.0;
        }

        double average = 
            ratings.stream()
                    .mapToInt(Rating::getRating)
                    .average()
                    .orElse(0.0);

        return Math.round(average * 10.0) / 10.0;
    }

    public Rating getRatingById(String ratingId) {

        return ratingRepository.findById(ratingId)
                .orElseThrow(() ->
                        new RatingNotFoundException(
                                "Rating not found with id: " + ratingId));
    }

    public void deleteRating(String ratingId) {

        Rating rating = getRatingById(ratingId);

        ratingRepository.delete(rating);
    }
}