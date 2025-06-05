package com.commerce.model.request;

import com.commerce.model.entity.Product;
import com.commerce.model.entity.ProductVariant;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpdateProductVariantRequest {
    private Integer id;
    private String variantName;
    private int quantityPerUnit;
    private String unitType;
    private UpdateSkuRequest sku;

    public ProductVariant toEntity(Product product) {
        ProductVariant variant = new ProductVariant();
        variant.setVariantName(this.variantName);
        variant.setQuantityPerUnit(this.quantityPerUnit);
        variant.setUnitType(this.unitType);
        variant.setProduct(product);
        return variant;
    }
}
