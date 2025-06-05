package com.commerce.model.response;

import com.commerce.model.entity.Sku;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import java.util.Objects;

@Data
@Getter
@Builder
public class SkuResponse {
    private int id;
    private int stockQuantity;
    private double price;

    public static SkuResponse from(Sku sku) {
        return new SkuResponse(
                Objects.requireNonNull(sku.getId(), "Sku ID must not be null"),
                sku.getStockQuantity(),
                sku.getPrice()
        );
    }

}
