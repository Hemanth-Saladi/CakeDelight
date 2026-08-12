package com.cakedelight.rating.controller;

import com.cakedelight.rating.model.Rating;
import com.cakedelight.rating.service.RatingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    public ResponseEntity<Rating> addRating(
            @Valid @RequestBody Rating rating) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ratingService.addRating(rating));
    }

    @GetMapping("/cake/{cakeId}")
    public ResponseEntity<List<Rating>> getRatingsByCake(
            @PathVariable String cakeId) {

        return ResponseEntity.ok(
                ratingService.getRatingsByCake(cakeId)
        );
    }

    @GetMapping("/cake/{cakeId}/average")
    public ResponseEntity<Map<String, Object>> getAverageRating(
            @PathVariable String cakeId) {

        Map<String, Object> response = new HashMap<>();

        response.put("cakeId", cakeId);
        response.put("averageRating",
                ratingService.getAverageRating(cakeId));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{ratingId}")
    public ResponseEntity<Rating> getRatingById(
            @PathVariable String ratingId) {

        return ResponseEntity.ok(
                ratingService.getRatingById(ratingId)
        );
    }

    @DeleteMapping("/{ratingId}")
    public ResponseEntity<Void> deleteRating(
            @PathVariable String ratingId) {

        ratingService.deleteRating(ratingId);

        return ResponseEntity.noContent().build();
    }
}