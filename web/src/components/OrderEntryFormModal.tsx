import {useEffect, useMemo} from "react"
import type {OrderEntry, User, Product} from "@/types"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {useForm} from "react-hook-form"
import {type OrderEntryModel, orderEntrySchema} from "@/models/order-entry-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Form} from "@/components/ui/form"
import {AuditFooter} from "@/components/AuditFooter.tsx"
import {fetchUsers} from "@/api/user-api"
import PagedSelectFormField from "@/components/form/PagedSelectFormField.tsx"
import TextInputFormField from "@/components/form/TextInputFormField.tsx"
import {useQuery} from "@tanstack/react-query"
import StaticSelectFormField from "@/components/form/StaticSelectFormField.tsx"
import {fetchProducts, getById} from "@/api/product-api.ts"
import {ShoppingCart, UserIcon, Plus, Edit} from "lucide-react"
import {Card, CardContent} from "@/components/ui/card"
import {getUserNameWithPhoneNumber} from "@/lib/user-utils.ts";
import {getProductVariantLabel} from "@/lib/product-utils.ts";

interface OrderEntryFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (formData: OrderEntryModel, isSaveAndAddNew?: boolean) => void
    initialValue: OrderEntry | null
    isLoading: boolean
}

export default function OrderEntryFormModal({
                                                isOpen,
                                                onClose,
                                                onSave,
                                                initialValue,
                                                isLoading,
                                            }: OrderEntryFormModalProps) {
    const form = useForm<OrderEntryModel>({
        resolver: zodResolver(orderEntrySchema),
        defaultValues: {
            quantity: 1,
        } as unknown as OrderEntryModel,
    });

    const {watch} = form
    const selectedProductId = watch("productId")

    const onSubmit = (data: OrderEntryModel, event: any) => {
        const clickedButton: string = event.nativeEvent.submitter.name;
        if (clickedButton === "save") {
            onSave(data)
        }
        if (clickedButton === "saveAndAddNew") {
            onSave(data, true)
            form.reset()
        }
    }

    const {data: selectedProduct} = useQuery(
        {
            queryKey: ["product", selectedProductId],
            queryFn: () => {
                return getById(selectedProductId!)
            },
            enabled: !!selectedProductId,
        }
    )

    const skuOptions = useMemo(() => {
        if (selectedProduct?.variants) {
            return selectedProduct.variants.map(x => ({
                ...x.sku,
                name: x.variantName,
            }))
        }
        return []

    }, [selectedProduct])


    const formId = "order_entry_form"

    const getProductOptionLabel = (x: Product) => {
        return x.name;
    }

    useEffect(() => {
        form.reset({
            userId: initialValue?.user.id,
            skuId: initialValue?.sku.id,
            productId: initialValue?.sku.product?.id,
            quantity: initialValue?.quantity ?? 1,
        });
    }, [form, initialValue]);

    useEffect(() => {
        if (isOpen) {
            form.reset({
                userId: initialValue?.user.id,
                skuId: initialValue?.sku.id,
                productId: initialValue?.sku.product?.id,
                quantity: initialValue?.quantity ?? 1,
            });
        }
    }, [isOpen, form, initialValue]);

    if (!isOpen) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
                <DialogHeader
                    className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 rounded-t-lg border-b">
                    <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            {initialValue ? <Edit className="h-5 w-5 text-primary"/> :
                                <Plus className="h-5 w-5 text-primary"/>}
                        </div>
                        <div>
                            <DialogTitle
                                className="text-xl">{initialValue ? "Edit Order Entry" : "Add New Order Entry"}</DialogTitle>
                            <DialogDescription className="mt-1">
                                {initialValue ? "Update the details for this order." : "Fill in the details to create a new order entry."}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-6 py-4" id={formId}>
                        <div className="space-y-6">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center mb-4">
                                        <UserIcon className="h-5 w-5 text-primary mr-2"/>
                                        <h3 className="text-lg font-medium">Customer Information</h3>
                                    </div>
                                    <PagedSelectFormField
                                        control={form.control}
                                        name="userId"
                                        label="Customer"
                                        placeholder="Select a customer"
                                        required
                                        disabled={isLoading}
                                        fetchFn={fetchUsers}
                                        getOptionLabel={getUserNameWithPhoneNumber}
                                        getOptionValue={(user: User) => user.id}
                                        queryKey="users-select"
                                        pageSize={10}
                                        initialValueLabel={initialValue?.user && getUserNameWithPhoneNumber(initialValue.user)}
                                    />

                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6 flex flex-col gap-3">
                                    <div className="flex items-center mb-4">
                                        <ShoppingCart className="h-5 w-5 text-green-500 mr-2"/>
                                        <h3 className="text-lg font-medium">Order Details</h3>
                                    </div>
                                    <PagedSelectFormField
                                        control={form.control}
                                        name="productId"
                                        label="Product"
                                        placeholder="Select a product"
                                        required
                                        disabled={isLoading}
                                        fetchFn={fetchProducts}
                                        getOptionLabel={getProductOptionLabel}
                                        getOptionValue={(sku: Product) => sku.id}
                                        queryKey="skus-select"
                                        pageSize={10}
                                        initialValueLabel={initialValue?.sku.product && getProductOptionLabel(initialValue.sku.product)}
                                    />

                                    <StaticSelectFormField
                                        options={skuOptions ?? []}
                                        getOptionLabel={getProductVariantLabel}
                                        getOptionValue={(x) => x.id}
                                        name="skuId"
                                        control={form.control}
                                        label="Product Variant"
                                        placeholder="Select a variant"
                                        required
                                        disabled={!selectedProduct}
                                        initialValueLabel={initialValue?.sku && `${initialValue.sku.variant?.variantName} - ${initialValue.sku.price}`}
                                    />

                                    <TextInputFormField
                                        control={form.control}
                                        name="quantity"
                                        label="Quantity"
                                        type="number"
                                        min={1}
                                        required
                                        disabled={isLoading}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </form>
                </Form>

                <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 rounded-b-lg border-t">
                    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:items-center w-full">
                        {initialValue && initialValue.audit && (
                            <AuditFooter audit={initialValue.audit}/>
                        )}
                        <div className="flex gap-2 justify-end w-full">
                            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button
                                name="save"
                                type="submit"
                                form={formId}
                                disabled={isLoading}
                                className="px-4 py-2 bg-primary hover:bg-primary/90 transition-colors"
                            >
                                {initialValue ? "Update Order Entry" : "Save"}
                            </Button>
                            {
                                !initialValue && <Button
                                    name="saveAndAddNew"
                                    type="submit"
                                    form={formId}
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-primary hover:bg-primary/90 transition-colors"
                                >
                                    Save and Add New
                                </Button>
                            }

                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
