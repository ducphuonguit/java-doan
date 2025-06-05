"use client"

import { useState, useEffect, useMemo } from "react"
import type { Order, User, City, OrderItem } from "@/types"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useForm, useFieldArray, type Control } from "react-hook-form"
import { type OrderItemFormModel, type OrderFormModel, orderFormSchema } from "@/models/order-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Form } from "@/components/ui/form"
import { AuditFooter } from "@/components/AuditFooter.tsx"
import { useQuery } from "@tanstack/react-query"
import { fetchProducts, getVariantsByProduct } from "@/api/product-api"
import { fetchUsers } from "@/api/user-api"
import { OrderStatus, PaymentStatus } from "@/types"
import TextInputFormField from "@/components/form/TextInputFormField.tsx"
import StaticSelectFormField from "@/components/form/StaticSelectFormField.tsx"
import PagedSelectFormField from "@/components/form/PagedSelectFormField.tsx"
import TextAreaFormField from "@/components/form/TextAreaFormField.tsx"
import { fetchCities } from "@/api/city-api.ts"
import { fetchDistrictsByCityCode } from "@/api/district-api.ts"
import { getUserNameWithPhoneNumber } from "@/lib/user-utils.ts"
import PagedSelect from "@/components/PagedSelect.tsx"
import {getProductVariantLabel} from "@/lib/product-utils.ts";

// Status color mappings
const getOrderStatusColor = (status: OrderStatus): string => {
    switch (status) {
        case OrderStatus.PENDING:
            return "text-yellow-600 bg-yellow-50 border-yellow-200"
        case OrderStatus.CONFIRMED:
            return "text-blue-600 bg-blue-50 border-blue-200"
        case OrderStatus.DELIVERING:
            return "text-purple-600 bg-purple-50 border-purple-200"
        case OrderStatus.DELIVERED:
            return "text-green-600 bg-green-50 border-green-200"
        case OrderStatus.CANCELLED:
            return "text-red-600 bg-red-50 border-red-200"
        default:
            return "text-gray-600 bg-gray-50 border-gray-200"
    }
}

const getPaymentStatusColor = (status: PaymentStatus): string => {
    switch (status) {
        case PaymentStatus.PENDING:
            return "text-yellow-600 bg-yellow-50 border-yellow-200"
        case PaymentStatus.PAID:
            return "text-green-600 bg-green-50 border-green-200"
        case PaymentStatus.FAILED:
            return "text-red-600 bg-red-50 border-red-200"
        default:
            return "text-gray-600 bg-gray-50 border-gray-200"
    }
}

interface OrderFormModalProps {
    isOpen: boolean
    onClose: () => void
    isLoading: boolean
    initialValue?: Order | null
    onValidSubmit: (data: OrderFormModel) => void
}

export default function OrderFormModal({
                                           isOpen,
                                           onClose,
                                           isLoading,
                                           initialValue,
                                           onValidSubmit,
                                       }: OrderFormModalProps) {
    const [selectedCityCode, setSelectedCityCode] = useState<string>("")

    // Extended schema with Zod to include address fields
    const form = useForm<OrderFormModel>({
        resolver: zodResolver(orderFormSchema),
        values: {
            userId: initialValue?.user.id,
            cityCode: initialValue?.city.code,
            districtCode: initialValue?.district.code,
            address: initialValue?.address,
            recipientName: initialValue?.recipientName,
            phoneNumber: initialValue?.phoneNumber,
            deliveryNotes: initialValue?.deliveryNotes,
            notes: initialValue?.notes,
            items:
                initialValue?.orderItems.map((item) => ({
                    skuId: item.productVariantId,
                    quantity: item.quantity,
                    productId: item.productId,
                })) || [],
            orderStatus: initialValue?.orderStatus ?? "PENDING",
            paymentStatus: initialValue?.paymentStatus ?? "PENDING",
        } as OrderFormModel,
    })

    const onCustomerChange = (user: User) => {
        if (user.deliveries && user.deliveries?.length > 0) {
            const delivery = user.deliveries[0]
            form.setValue("recipientName", delivery.recipientName, {
                shouldValidate: true,
            })
            form.setValue("phoneNumber", delivery.phoneNumber, {
                shouldValidate: true,
            })
            form.setValue("cityCode", delivery.city.code, {
                shouldValidate: true,
            })
            form.setValue("districtCode", delivery.district.code, {
                shouldValidate: true,
            })
            form.setValue("address", delivery.address, {
                shouldValidate: true,
            })
            form.setValue("deliveryNotes", delivery.notes, {
                shouldValidate: true,
            })
        } else {
            form.setValue("recipientName", user.fullName || "", {
                shouldValidate: true,
            })
            form.setValue("phoneNumber", user.phoneNumber || "", {
                shouldValidate: true,
            })
        }
    }

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    })

    // Watch cityCode to update districts when it changes
    const watchedCityCode = form.watch("cityCode")

    useEffect(() => {
        setSelectedCityCode(watchedCityCode)
    }, [watchedCityCode])

    // Fetch cities
    const { data: cities } = useQuery({
        queryKey: ["cities"],
        queryFn: fetchCities,
        enabled: isOpen,
    })

    const { data: districts } = useQuery({
        queryKey: ["districts", selectedCityCode],
        queryFn: () => fetchDistrictsByCityCode(selectedCityCode),
        enabled: isOpen && !!selectedCityCode,
    })

    const onSubmit = (data: OrderFormModel) => {
        onValidSubmit(data)
    }

    const addOrderItem = () => {
        append({
            quantity: 1,
            productId: undefined,
            skuId: undefined,
        } as unknown as OrderItemFormModel)

        // Clear validation errors for the newly added item
        setTimeout(() => {
            const newIndex = fields.length
            form.clearErrors(`items.${newIndex}.skuId`)
        }, 0)
    }

    const formId = "order_form"

    useEffect(() => {
        if (!isOpen) {
            form.reset({
                userId: initialValue?.user.id,
                cityCode: initialValue?.city.code,
                districtCode: initialValue?.district.code,
                address: initialValue?.address,
                recipientName: initialValue?.recipientName,
                phoneNumber: initialValue?.phoneNumber,
                deliveryNotes: initialValue?.deliveryNotes,
                notes: initialValue?.notes,
                items:
                    initialValue?.orderItems.map((item) => ({
                        skuId: item.productVariantId,
                        quantity: item.quantity,
                        productId: item.productId,
                    })) || [],
                orderStatus: initialValue?.orderStatus ?? "PENDING",
                paymentStatus: initialValue?.paymentStatus ?? "PENDING",
            } as OrderFormModel)
        }
    }, [form, initialValue, isOpen])

    if (!isOpen) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto pr-4">
                <DialogHeader>
                    <DialogTitle>{initialValue ? "Edit Order" : "Add New Order"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id={formId}>
                        <div className="space-y-4">
                            {/* User Selection */}
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
                                onChange={onCustomerChange}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <StaticSelectFormField
                                        control={form.control}
                                        name="orderStatus"
                                        label="Order Status"
                                        placeholder="Select status"
                                        options={Object.values(OrderStatus)}
                                        getOptionLabel={(status) => status.charAt(0) + status.slice(1).toLowerCase()}
                                        getOptionValue={(status) => status}
                                        initialValueLabel={initialValue?.orderStatus ?? OrderStatus.PENDING}
                                        renderOption={(status) => (
                                            <div className={`flex items-center px-2 py-1 rounded-md border ${getOrderStatusColor(status)}`}>
                                                <div
                                                    className={`w-2 h-2 rounded-full mr-2 ${
                                                        getOrderStatusColor(status).includes("yellow")
                                                            ? "bg-yellow-500"
                                                            : getOrderStatusColor(status).includes("blue")
                                                                ? "bg-blue-500"
                                                                : getOrderStatusColor(status).includes("purple")
                                                                    ? "bg-purple-500"
                                                                    : getOrderStatusColor(status).includes("green")
                                                                        ? "bg-green-500"
                                                                        : getOrderStatusColor(status).includes("red")
                                                                            ? "bg-red-500"
                                                                            : "bg-gray-500"
                                                    }`}
                                                />
                                                {status.charAt(0) + status.slice(1).toLowerCase()}
                                            </div>
                                        )}
                                    />
                                </div>

                                <div>
                                    <StaticSelectFormField
                                        control={form.control}
                                        name="paymentStatus"
                                        label="Payment Status"
                                        placeholder="Select payment status"
                                        options={Object.values(PaymentStatus)}
                                        getOptionLabel={(status) => status.charAt(0) + status.slice(1).toLowerCase()}
                                        getOptionValue={(status) => status}
                                        initialValueLabel={initialValue?.paymentStatus ?? PaymentStatus.PENDING}
                                        renderOption={(status) => (
                                            <div className={`flex items-center px-2 py-1 rounded-md border ${getPaymentStatusColor(status)}`}>
                                                <div
                                                    className={`w-2 h-2 rounded-full mr-2 ${
                                                        getPaymentStatusColor(status).includes("yellow")
                                                            ? "bg-yellow-500"
                                                            : getPaymentStatusColor(status).includes("green")
                                                                ? "bg-green-500"
                                                                : getPaymentStatusColor(status).includes("red")
                                                                    ? "bg-red-500"
                                                                    : "bg-gray-500"
                                                    }`}
                                                />
                                                {status.charAt(0) + status.slice(1).toLowerCase()}
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Shipping Information Section */}
                            <div className="border p-4 rounded-md">
                                <h3 className="text-lg font-medium mb-4">Shipping Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Recipient Name */}
                                    <TextInputFormField
                                        control={form.control}
                                        name="recipientName"
                                        label="Recipient Name"
                                        placeholder="Enter recipient name"
                                        required
                                        disabled={isLoading}
                                    />

                                    {/* Phone Number */}
                                    <TextInputFormField
                                        control={form.control}
                                        name="phoneNumber"
                                        label="Phone Number"
                                        placeholder="e.g., 0912345678"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <StaticSelectFormField
                                        control={form.control}
                                        name="cityCode"
                                        label="City"
                                        placeholder="Select a city"
                                        required
                                        disabled={isLoading || !cities}
                                        options={cities || []}
                                        getOptionLabel={(city: City) => city.name}
                                        getOptionValue={(city: City) => city.code}
                                        initialValueLabel={initialValue?.city.name}
                                    />

                                    <StaticSelectFormField
                                        control={form.control}
                                        name="districtCode"
                                        label="District"
                                        placeholder="Select district"
                                        options={districts || []}
                                        getOptionLabel={(x) => x.name}
                                        getOptionValue={(x) => x.code}
                                        initialValueLabel={initialValue?.district.name}
                                    />
                                </div>

                                {/* Address */}
                                <div className="mt-4">
                                    <TextInputFormField
                                        control={form.control}
                                        name="address"
                                        label="Address"
                                        placeholder="e.g., 123 Main St"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Delivery Notes */}
                                <div className="mt-4">
                                    <TextAreaFormField
                                        control={form.control}
                                        name="deliveryNotes"
                                        label="Delivery Notes"
                                        placeholder="Special delivery instructions"
                                        disabled={isLoading}
                                        rows={3}
                                    />
                                </div>
                            </div>

                            {/* Order Notes */}
                            <TextAreaFormField
                                control={form.control}
                                name="notes"
                                label="Order Notes"
                                placeholder="Enter any notes for this order"
                                disabled={isLoading}
                                description="Optional notes about this order"
                            />

                            {/* Order Items */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-base font-medium">Order Items*</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addOrderItem} disabled={isLoading}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Item
                                    </Button>
                                </div>

                                {/* Show validation error for items array */}
                                {form.formState.errors.items && (
                                    <div className="text-sm text-red-500 mt-1">{form.formState.errors.items.message}</div>
                                )}

                                {fields.length > 0 ? (
                                    <div className="space-y-4">
                                        {fields.map((field, index) => (
                                            <Card key={field.id} className="border border-gray-200">
                                                <CardContent className="pt-4">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h4 className="font-medium">Item {index + 1}</h4>
                                                        <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <OrderItemFields
                                                        index={index}
                                                        control={form.control}
                                                        initialValue={initialValue?.orderItems[index]}
                                                        isLoading={isLoading}
                                                    />
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 border border-dashed rounded-lg">
                                        <p className="text-muted-foreground">No items added yet</p>
                                        <Button type="button" variant="outline" size="sm" onClick={addOrderItem} className="mt-2">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Item
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </Form>
                <DialogFooter>
                    <div className="flex w-full p-6">
                        {initialValue && initialValue.audit && <AuditFooter audit={initialValue.audit} />}
                        <div className="flex justify-end gap-2 ml-auto">
                            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button type="submit" form={formId} disabled={isLoading}>
                                {initialValue ? "Update Order" : "Create Order"}
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

interface OrderItemFieldsProps {
    index: number
    control: Control<OrderFormModel>
    initialValue?: OrderItem
    isLoading?: boolean
}

function OrderItemFields({ index, control, initialValue, isLoading }: OrderItemFieldsProps) {
    const [selectedProductId, setSelectedProductId] = useState(initialValue?.productId)

    useEffect(() => {
        setSelectedProductId(initialValue?.productId)
    }, [initialValue?.productId])

    const { data: variants } = useQuery({
        queryKey: ["product-variants", selectedProductId],
        queryFn: () => {
            if (!selectedProductId) return Promise.resolve([])
            return getVariantsByProduct(selectedProductId)
        },
        enabled: !!selectedProductId,
    })

    const skuOptions = useMemo(() => {
        if (variants) {
            return variants.map((x) => ({
                ...x.sku,
                name: x.variantName,
            }))
        }
        return []
    }, [variants])

    return (
        <div className="space-y-4">
            <PagedSelect
                fetchFn={fetchProducts}
                getOptionLabel={(x) => x.name}
                getOptionValue={(x) => x.id}
                queryKey={"products"}
                value={selectedProductId ?? null}
                disabled={isLoading}
                initialValueLabel={initialValue?.productName}
                onChange={(productId) => {
                    setSelectedProductId(productId)
                }}
                className="min-w-[200px]"
            />

            <StaticSelectFormField
                control={control}
                name={`items.${index}.skuId`}
                label="Product Variant"
                placeholder="Select a variant"
                options={skuOptions}
                getOptionLabel={getProductVariantLabel}
                getOptionValue={(x) => x.id}
                required
                disabled={isLoading || !selectedProductId}
                initialValueLabel={initialValue && `${initialValue?.variantName} - ${initialValue.unitPrice}`}
            />

            {/* Quantity */}
            <TextInputFormField
                control={control}
                name={`items.${index}.quantity`}
                label="Quantity"
                type="number"
                min={1}
                required
                disabled={isLoading}
            />
        </div>
    )
}
