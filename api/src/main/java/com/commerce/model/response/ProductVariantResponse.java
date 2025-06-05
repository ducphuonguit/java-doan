package com.commerce.model.response;
import com.commerce.model.entity.ProductVariant;
import lombok.Builder;
import lombok.Data;

import java.util.Objects;


@Data
@Builder
public class ProductVariantResponse {
    private int id;
    private String variantName;
    private int quantityPerUnit;
    private String unitType;
    private SkuResponse sku;
    private ProductResponse product;


    public static ProductVariantResponse from(ProductVariant variant) {
        return new ProductVariantResponse(
                Objects.requireNonNull(variant.getId(), "Variant ID must not be null"),
                variant.getVariantName(),
                variant.getQuantityPerUnit(),
                variant.getUnitType(),
                variant.getSku() != null ? SkuResponse.from(variant.getSku()) : null,
                ProductResponse.fromBrief(variant.getProduct())
        );
    }

    public static ProductVariantResponse fromBrief(ProductVariant variant) {
        return new ProductVariantResponse(
                Objects.requireNonNull(variant.getId(), "Variant ID must not be null"),
                variant.getVariantName(),
                variant.getQuantityPerUnit(),
                variant.getUnitType(),
                null,
                null
        );
    }

}
