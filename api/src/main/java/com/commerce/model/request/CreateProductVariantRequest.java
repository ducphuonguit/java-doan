package com.commerce.model.request;

import com.commerce.model.entity.Product;
import com.commerce.model.entity.ProductVariant;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateProductVariantRequest {
    private final String variantName;
    private final int quantityPerUnit;
    private final String unitType;
    private final CreateSkuRequest sku;

    public ProductVariant toEntity(Product product) {
        var variant = ProductVariant.builder()
                .product(product)
                .variantName(this.variantName)
                .quantityPerUnit(this.quantityPerUnit)
                .unitType(this.unitType)
                .build();
        variant.setSku(this.sku.toEntity(variant));
        return variant;
    }

}
