import { z } from "zod";
export const skuFormSchema = z.object({
    id: z.number().nullish(),
    price: z.number().min(0, "Price must be a positive number"),
    stockQuantity: z.number().int().min(0, "Quantity must be a positive number"),
});

export const productVariantFormSchema = z.object({
    id: z.number().nullish(),
    variantName: z.string().min(1, "Variant name is required"),
    quantityPerUnit: z.number().int().min(1, "Quantity must be at least 1"),
    unitType: z.string().min(1, "Unit type is required"),
    sku: skuFormSchema,
});

export const productFormSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().optional().default(""),
    variants: z.array(productVariantFormSchema).nullable(),
});

export type ProductFormModel = z.infer<typeof productFormSchema>;