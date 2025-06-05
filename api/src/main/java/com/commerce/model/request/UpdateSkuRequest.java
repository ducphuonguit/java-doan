package com.commerce.model.request;

import com.commerce.model.entity.ProductVariant;
import com.commerce.model.entity.Sku;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpdateSkuRequest {
    private Integer id;
    private double price;
    private int stockQuantity = 0;

    public Sku toEntity(ProductVariant variant) {
        Sku sku = new Sku();
        sku.setPrice(this.price);
        sku.setStockQuantity(this.stockQuantity);
        sku.setProductVariant(variant);
        return sku;
    }
}
