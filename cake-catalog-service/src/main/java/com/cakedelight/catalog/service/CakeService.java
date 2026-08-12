package com.cakedelight.catalog.service;

import com.cakedelight.catalog.exception.CakeNotFoundException;
import com.cakedelight.catalog.model.Cake;
import com.cakedelight.catalog.repository.CakeRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class CakeService {

    private final CakeRepository cakeRepository;

    public CakeService(CakeRepository cakeRepository) {
        this.cakeRepository = cakeRepository;
    }

    public List<Cake> getAllCakes() {
        return cakeRepository.findAll();
    }

    public Cake getCakeById(String cakeId) {
        return cakeRepository.findById(cakeId)
                .orElseThrow(() -> new CakeNotFoundException("Cake not found with id: " + cakeId));
    }

    public Cake addCake(Cake cake) {
        return cakeRepository.save(cake);
    }

    public Cake updateCake(String cakeId, Cake cake) {
        Cake existingCake = getCakeById(cakeId);

        existingCake.setName(cake.getName());
        existingCake.setDescription(cake.getDescription());
        existingCake.setCategory(cake.getCategory());
        existingCake.setPrice(cake.getPrice());
        existingCake.setAvailability(cake.isAvailability());
        existingCake.setImageUrl(cake.getImageUrl());

        return cakeRepository.save(existingCake);
    }

    public void deleteCake(String cakeId) {
        Cake cake = getCakeById(cakeId);
        cakeRepository.delete(cake);
    }

    public List<Cake> searchCakes(String name, String category,
                                  BigDecimal minPrice, BigDecimal maxPrice) {

        List<Cake> cakes = cakeRepository.findAll();

        List<Cake> filteredCakes = new ArrayList<>();

        for (Cake cake : cakes) {

            boolean matches = true;

            if (name != null && !name.isBlank()
                    && !cake.getName().toLowerCase().contains(name.toLowerCase())) {
                matches = false;
            }

            if (category != null && !category.isBlank()
                    && !cake.getCategory().equalsIgnoreCase(category)) {
                matches = false;
            }

            if (minPrice != null && cake.getPrice().compareTo(minPrice) < 0) {
                matches = false;
            }

            if (maxPrice != null && cake.getPrice().compareTo(maxPrice) > 0) {
                matches = false;
            }

            if (matches) {
                filteredCakes.add(cake);
            }
        }

        return filteredCakes;
    }
}