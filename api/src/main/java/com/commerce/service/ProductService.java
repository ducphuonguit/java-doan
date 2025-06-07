package com.commerce.service;

import com.commerce.model.entity.Product;
import com.commerce.model.entity.ProductVariant;
import com.commerce.model.entity.Sku;
import com.commerce.model.exception.AppException;
import com.commerce.model.exception.ErrorCode;
import com.commerce.model.request.CreateProductRequest;
import com.commerce.model.request.UpdateProductRequest;
import com.commerce.model.request.UpdateProductVariantRequest;
import com.commerce.model.response.ProductResponse;
import com.commerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    public ProductResponse create(CreateProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        var variants = request.getVariants().stream()
                .map(variantRequest -> variantRequest.toEntity(product))
                .toList();

        product.setVariants(variants);
        productRepository.save(product);
        return ProductResponse.from(product);
    }

    public ProductResponse update(Integer id, UpdateProductRequest request) {
        Product product = productRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND,
                Map.of("id", String.valueOf(id)
                )));
        product.setName(request.getName());
        product.setDescription(request.getDescription());

        var updatedVariantIds = request.getVariants().stream()
                .map(UpdateProductVariantRequest::getId).toList();

        product.getVariants().removeIf(variant -> !updatedVariantIds.contains(variant.getId()));

        request.getVariants().forEach(requestVariant -> {
            if(requestVariant.getId() != null) {
                Optional<ProductVariant> optionExistingVariant = product.getVariants().stream().filter(
                        variant -> variant.getId().equals(requestVariant.getId())
                ).findFirst();
                if(optionExistingVariant.isPresent()){
                    var existingVariant = optionExistingVariant.get();
                    var existingSku = existingVariant.getSku();
                    existingVariant.setVariantName(requestVariant.getVariantName());
                    existingVariant.setQuantityPerUnit(requestVariant.getQuantityPerUnit());
                    existingVariant.setUnitType(requestVariant.getUnitType());
                    existingSku.setPrice(requestVariant.getSku().getPrice());
                    existingSku.setStockQuantity(requestVariant.getSku().getStockQuantity());
                }
            } else {
                ProductVariant newVariant = requestVariant.toEntity(product);
                Sku newSku = requestVariant.getSku().toEntity(newVariant);
                newVariant.setSku(newSku);
                product.getVariants().add(newVariant);
            }
        });
        productRepository.save(product);
        return ProductResponse.from(product);
    }


    public void delete(int id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND,
                        Map.of("id", String.valueOf(id))));
        productRepository.delete(product);
    }

    public List<ProductResponse> list(String q) {
        var spec = createSpecification(q);
        return productRepository.findAll(spec).stream().map(ProductResponse::from).collect(Collectors.toList());
    }

    Specification<Product> createSpecification(String q) {
        return (root, query, criteriaBuilder) -> {
            if (q == null || q.isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.or(
                    criteriaBuilder.like(root.get("name"), "%" + q + "%"),
                    criteriaBuilder.like(root.get("description"), "%" + q + "%")
            );
        };
    }

}