package com.cakedelight.catalog.config;

import com.cakedelight.catalog.model.Cake;
import com.cakedelight.catalog.repository.CakeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner loadSampleCakes(CakeRepository cakeRepository) {
        return args -> {

            if (cakeRepository.count() > 0) {
                return;
            }

            List<Cake> cakes = List.of(
                    new Cake(
                            null,
                            "Chocolate Truffle Cake",
                            "Rich chocolate cake with smooth chocolate truffle frosting.",
                            "Birthday",
                            new BigDecimal("650"),
                            true,
                            "https://images.unsplash.com/photo-1578985545062-69928b1d9587"
                    ),
                    new Cake(
                            null,
                            "Red Velvet Cake",
                            "Soft red velvet cake layered with cream cheese frosting.",
                            "Birthday",
                            new BigDecimal("750"),
                            true,
                            "https://images.unsplash.com/photo-fxodEwTvn_0"
                    ),
                    new Cake(
                            null,
                            "Black Forest Cake",
                            "Classic chocolate sponge with cherries and whipped cream.",
                            "Classic",
                            new BigDecimal("600"),
                            true,
                            "https://images.unsplash.com/photo-P9WkD82hLUI"
                    ),
                    new Cake(
                            null,
                            "Butterscotch Cake",
                            "Vanilla sponge with butterscotch sauce and crunchy praline.",
                            "Classic",
                            new BigDecimal("550"),
                            true,
                            "https://images.unsplash.com/photo-1571115177098-24ec42ed204d"
                    ),
                    new Cake(
                            null,
                            "Strawberry Cream Cake",
                            "Fresh strawberry cake with light whipped cream.",
                            "Fruit",
                            new BigDecimal("700"),
                            true,
                            "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3"
                    ),
                    new Cake(
                            null,
                            "Vanilla Celebration Cake",
                            "Soft vanilla sponge decorated for special celebrations.",
                            "Celebration",
                            new BigDecimal("500"),
                            true,
                            "https://images.unsplash.com/photo-1535141192574-5d4897c12636"
                    )
            );

            cakeRepository.saveAll(cakes);
        };
    }
}