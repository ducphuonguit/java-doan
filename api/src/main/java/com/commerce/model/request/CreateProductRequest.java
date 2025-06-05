package com.commerce.model.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class CreateProductRequest {
    private final String name;
    private final String description;
    private final List<CreateProductVariantRequest> variants;
}

