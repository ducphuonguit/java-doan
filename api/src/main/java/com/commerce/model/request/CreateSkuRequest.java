package com.commerce.model.request;

import com.commerce.model.entity.ProductVariant;
import com.commerce.model.entity.Sku;
import lombok.Data;

@Data
public class CreateSkuRequest {
    private final double price;
    private final int stockQuantity;

    public CreateSkuRequest(double price, int stockQuantity) {
        this.price = price;
        this.stockQuantity = stockQuantity;
    }

    public Sku toEntity(ProductVariant variant) {
        return Sku.builder()
                .productVariant(variant)
                .price(this.price)
                .stockQuantity(this.stockQuantity)
                .build();
    }

}
