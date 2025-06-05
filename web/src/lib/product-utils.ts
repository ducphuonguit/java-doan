import {ProductBrief, ProductVariantBrief} from "@/types";


export function getProductVariantLabel(item: {
    name: string
    id: number
    stockQuantity: number
    price: number
    variant?: ProductVariantBrief
    product?: ProductBrief
}){
    return `${item.name} - $${item.price.toFixed(2)}`;
}