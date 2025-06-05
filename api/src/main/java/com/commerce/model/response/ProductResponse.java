package com.commerce.model.response;


import com.commerce.model.entity.Product;
import com.commerce.model.entity.ProductVariant;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Data
@Builder
public class ProductResponse {
    private int id;
    private String name;
    private String description;
    private List<ProductVariantResponse> variants;
    private AuditResponse audit;


    public static ProductResponse from(Product product) {
        return new ProductResponse(
                Objects.requireNonNull(product.getId(), "Product ID must not be null"),
                product.getName(),
                product.getDescription(),
                product.getVariants().stream()
                        .map(ProductVariantResponse::from)
                        .collect(Collectors.toList()),
                AuditResponse.from(product)
        );
    }

    public static ProductResponse from(Product product, List<ProductVariant> variants) {
        return new ProductResponse(
                Objects.requireNonNull(product.getId(), "Product ID must not be null"),
                product.getName(),
                product.getDescription(),
                variants != null ? variants.stream()
                        .map(ProductVariantResponse::from)
                        .collect(Collectors.toList()) : null,
                AuditResponse.from(product)
        );
    }

    public static ProductResponse fromBrief(Product product) {
        return new ProductResponse(
                Objects.requireNonNull(product.getId(), "Product ID must not be null"),
                product.getName(),
                product.getDescription(),
                null,
                AuditResponse.from(product)
        );
    }

}
