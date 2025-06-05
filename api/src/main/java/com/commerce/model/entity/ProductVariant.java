package com.commerce.model.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_variant")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "variant_name")
    private String variantName;

    @Column(name = "quantity_per_unit")
    private int quantityPerUnit;

    @Column(name = "unit_type")
    private String unitType;

    @OneToOne(mappedBy = "productVariant", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private Sku sku;

}