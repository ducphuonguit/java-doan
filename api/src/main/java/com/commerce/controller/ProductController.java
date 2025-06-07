package com.commerce.controller;

import com.commerce.model.request.CreateProductRequest;
import com.commerce.model.request.UpdateProductRequest;
import com.commerce.model.response.ProductResponse;
import com.commerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ProductResponse createProduct(@RequestBody CreateProductRequest request) {
        return productService.create(request);
    }

    @GetMapping()
    @PreAuthorize("isAuthenticated()")
    public List<ProductResponse> list(@RequestParam(defaultValue = "") String q) {
        return productService.list(q);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ProductResponse updateProduct(@PathVariable("id") Integer id, @RequestBody UpdateProductRequest request) {
        return productService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public void deleteProduct(@PathVariable("id") Integer id) {
        productService.delete(id);
    }
}
