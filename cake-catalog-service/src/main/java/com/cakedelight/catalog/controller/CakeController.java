package com.cakedelight.catalog.controller;

import com.cakedelight.catalog.model.Cake;
import com.cakedelight.catalog.service.CakeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/cakes")
public class CakeController {

    private final CakeService cakeService;

    public CakeController(CakeService cakeService) {
        this.cakeService = cakeService;
    }

    @GetMapping
    public ResponseEntity<List<Cake>> getAllCakes() {
        return ResponseEntity.ok(cakeService.getAllCakes());
    }

    @GetMapping("/{cakeId}")
    public ResponseEntity<Cake> getCakeById(@PathVariable String cakeId) {
        return ResponseEntity.ok(cakeService.getCakeById(cakeId));
    }

    @PostMapping
    public ResponseEntity<Cake> addCake(@Valid @RequestBody Cake cake) {
        return ResponseEntity.status(HttpStatus.CREATED).body(cakeService.addCake(cake));
    }

    @PutMapping("/{cakeId}")
    public ResponseEntity<Cake> updateCake(
            @PathVariable String cakeId,
            @Valid @RequestBody Cake cake) {

        return ResponseEntity.ok(cakeService.updateCake(cakeId, cake));
    }

    @DeleteMapping("/{cakeId}")
    public ResponseEntity<Void> deleteCake(@PathVariable String cakeId) {
        cakeService.deleteCake(cakeId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<Cake>> searchCakes(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {

        return ResponseEntity.ok(
                cakeService.searchCakes(name, category, minPrice, maxPrice)
        );
    }
}