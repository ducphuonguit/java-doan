package com.commerce.model.request;



import com.commerce.model.entity.Product;
import com.commerce.model.entity.ProductVariant;
import com.commerce.model.entity.Sku;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class UpdateProductRequest {
    private String name;
    private String description = "";
    private boolean isHidden = false;
    private List<UpdateProductVariantRequest> variants;
    private List<String> removedImageIds;
}



