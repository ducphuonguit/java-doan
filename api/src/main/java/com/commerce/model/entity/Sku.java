package com.commerce.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Table(name = "sku")
@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Sku {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "variant_id", referencedColumnName = "id", nullable = false)
    private ProductVariant productVariant;

    private Integer stockQuantity;

    private Double price;
    
}
