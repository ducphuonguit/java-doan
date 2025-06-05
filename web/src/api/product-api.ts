import axiosInstance from "@/api/axios-instance.ts";
import {Product} from "@/types";
import {ProductFormModel} from "@/models/product-form.ts";
import {API_CONSTANTS} from "@/constants/api.ts";


export async function fetchProducts() {
    try {
        const result = await axiosInstance.get<Product[]>(API_CONSTANTS.PRODUCT_ENDPOINT);
        return result.data;
    } catch (error) {
        console.log(error)

        throw error;
    }
}

export async function addProduct(product: ProductFormModel) {
    const result = await axiosInstance.post<Product>(API_CONSTANTS.PRODUCT_ENDPOINT, product);

    return result.data;
}

export async function updateProduct({productId, product}: {
    productId: number, product: ProductFormModel
}) {
    const result = await axiosInstance.put<Product>(`${API_CONSTANTS.PRODUCT_ENDPOINT}/${productId}`, product);
    return result.data;
}

export async function deleteProduct(productId: number) {
    const result = await axiosInstance.delete(`${API_CONSTANTS.PRODUCT_ENDPOINT}/${productId}`);
    return result.data;
}