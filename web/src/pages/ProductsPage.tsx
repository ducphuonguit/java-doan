import { useState} from "react"
import {Plus} from "lucide-react"
import type {Product} from "@/types"
import ProductFormModal from "../components/ProductFormModal"
import DeleteConfirmationModal from "../components/DeleteConfirmationModal"
import {Button} from "../components/ui/button"
import {useMutation, useQuery} from "@tanstack/react-query"
import {addProduct, deleteProduct, fetchProducts, updateProduct} from "@/api/product-api"
import type {ProductFormModel} from "@/models/product-form.ts"

import {toast} from "sonner"
import {type Column, DataTable} from "@/components/DataTable.tsx"
import {Card} from "@/components/ui/card.tsx";
import SearchInput from "@/components/SearchInput.tsx";
import {usePageQuery} from "@/hooks/usePageQuery.ts";
import parseError from "@/utils/error-utils.ts";


export default function ProductsPage() {
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
    const [isFormModalOpen, setIsFormModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const {
        searchText,
        onSearchTextChange
    } = usePageQuery("")

    const {error, data, isLoading, refetch} = useQuery({
        queryKey: ["products", searchText],
        queryFn: () =>
            fetchProducts(searchText),
    })

    const items = (data ?? []).map((x) => {
        return {
            ...x,
            payload: x,
        }
    })

    const handleEditProduct = (item: (typeof items)[number]) => {
        setCurrentProduct(item.payload)
        setIsFormModalOpen(true)
    }

    const handleDeleteProduct = (item: (typeof items)[number]) => {
        setCurrentProduct(item.payload)
        setIsDeleteModalOpen(true)
    }

    const columns: Column<(typeof items)[number]>[] = [
        {
            key: "id",
            name: "Product",
            type: "text",
            enableSorting: true,
        },
        {
            key: "name",
            name: "Name",
            type: "text",
            enableSorting: true,
        },
        {
            type: "action",
            name: "Actions",
            actions: {
                onEditClick: handleEditProduct,
                onDeleteClick: handleDeleteProduct,
            },
        },
    ]

    const mutation = useMutation({
        mutationFn: saveProduct,
        onSuccess: async (data) => {
            toast.success(currentProduct != null ? "Product updated successfully." : "Product created successfully.")
            setCurrentProduct(data)
            await refetch()
        },
        onError: (error) => {
            const errorMessage = parseError(error)
            toast.error(errorMessage)
        },
    })

    const deleteMutation = useMutation({
        mutationFn: async () => {
            if (!currentProduct) throw new Error("Delete failed, id is null")
            return await deleteProduct(currentProduct.id)
        },
        onSuccess: async () => {
            toast.success("Product deleted successfully.")
            setCurrentProduct(null)
            setIsDeleteModalOpen(false)
            await refetch()
        },
        onError: (error) => {
            const errorMessage = parseError(error)
            toast.error(errorMessage)
        },
    })

    async function saveProduct(data: ProductFormModel) {
        if (currentProduct == null) {
            return await addProduct(data)
        } else {
            if (!currentProduct) throw new Error("Update failed, id is null")
            return await updateProduct({
                productId: currentProduct!.id,
                product: data,
            })
        }
    }

    const handleCreateProduct = () => {
        setCurrentProduct(null)
        setIsFormModalOpen(true)
    }

    const handleDeleteConfirm = () => {
        deleteMutation.mutate()
    }

    const handleSaveProduct = async (data: ProductFormModel) => {
        mutation.mutate(data)
    }

    const onRowClick = (item: (typeof items)[number]) => {
        setCurrentProduct(item.payload)
        setIsFormModalOpen(true)
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                <Button onClick={handleCreateProduct} className="flex items-center" variant="default">
                    <Plus size={18} className="mr-1"/>
                    Add Product
                </Button>
            </div>
            <Card className="mb-4">
                <SearchInput initialValue={searchText} onChange={onSearchTextChange}/>
            </Card>

            {/* Products Table */}
            <DataTable
                name="products-table"
                columns={columns}
                items={items}
                isLoading={isLoading}
                error={error}
                onRowClick={onRowClick}
            />

            {/* Product Form Modal */}
            <ProductFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSave={handleSaveProduct}
                product={currentProduct}
                isLoading={mutation.isPending}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onOpenChange={setIsDeleteModalOpen}
                onConfirm={handleDeleteConfirm}
                title="Delete Product"
                message={`Are you sure you want to delete "${currentProduct?.name}"? This action cannot be undone.`}
            />
        </div>
    )
}
