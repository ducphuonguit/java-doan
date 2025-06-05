import {useEffect} from "react"
import type {Product} from "@/types"
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {useForm, useFieldArray} from "react-hook-form"
import {type ProductFormModel, productFormSchema} from "@/models/product-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Plus, Trash2} from "lucide-react"
import {Card, CardContent} from "@/components/ui/card"
import {Label} from "@/components/ui/label"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"

interface ProductFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (formData: ProductFormModel) => void
    product: Product | null
    isLoading: boolean
}

export default function ProductFormModal({isOpen, onClose, onSave, product, isLoading}: ProductFormModalProps) {

    const form = useForm<ProductFormModel>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: "",
            description: "",
            variants: [],
        },
    })

    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: "variants",
    })

    // Reset form when modal opens/closes or product changes
    useEffect(() => {
        if (isOpen) {
            if (product) {
                // Map product data to form values
                form.reset({
                    name: product.name,
                    description: product.description,
                    variants: product.variants || [],
                })
            } else {
                // Reset to default values for new product
                form.reset({
                    name: "",
                    description: "",
                    variants: [],
                })
            }
        }
    }, [isOpen, product, form])

    const onSubmit = (data: ProductFormModel) => {
        onSave({
            ...data,
        })
    }

    const addVariant = () => {
        append({
            variantName: "",
            quantityPerUnit: 1,
            unitType: "",
            sku: {
                price: 0,
                stockQuantity: 0,
            },
        })
    }

    if (!isOpen) return null

    const formId = "product_form"

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:pr-4 p-4">
                <DialogHeader>
                    <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id={formId}>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                disabled={isLoading}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Product Name*</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter product name" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                disabled={isLoading}
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Enter product description" rows={4} {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-4">
                                <div
                                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                    <Label className="text-base font-medium">Product Variants</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addVariant}
                                        disabled={isLoading}
                                        className="w-full sm:w-auto"
                                    >
                                        <Plus className="h-4 w-4 mr-2"/>
                                        Add Variant
                                    </Button>
                                </div>

                                {fields.length > 0 ? (
                                    <div className="space-y-4">
                                        {fields.map((field, index) => (
                                            <Card key={field.id} className="border border-gray-200">
                                                <CardContent className="pt-4 px-3 sm:px-6">
                                                    <div
                                                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                                                        <h4 className="font-medium">Variant {index + 1}</h4>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => remove(index)}
                                                            className="self-end sm:self-auto"
                                                        >
                                                            <Trash2 className="h-4 w-4"/>
                                                        </Button>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <FormField
                                                            control={form.control}
                                                            disabled={isLoading}
                                                            name={`variants.${index}.variantName`}
                                                            render={({field}) => (
                                                                <FormItem>
                                                                    <FormLabel>Variant Name*</FormLabel>
                                                                    <FormControl>
                                                                        <Input {...field}
                                                                               placeholder="e.g. Small, Red, etc."/>
                                                                    </FormControl>
                                                                    <FormMessage/>
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <FormField
                                                                control={form.control}
                                                                disabled={isLoading}
                                                                name={`variants.${index}.quantityPerUnit`}
                                                                render={({field}) => (
                                                                    <FormItem>
                                                                        <FormLabel>Quantity Per Unit*</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                {...field}
                                                                                onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                                                                                min={1}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage/>
                                                                    </FormItem>
                                                                )}
                                                            />

                                                            <FormField
                                                                control={form.control}
                                                                disabled={isLoading}
                                                                name={`variants.${index}.unitType`}
                                                                render={({field}) => (
                                                                    <FormItem>
                                                                        <FormLabel>Unit Type*</FormLabel>
                                                                        <FormControl>
                                                                            <Input {...field}
                                                                                   placeholder="e.g. piece, kg, liter"/>
                                                                        </FormControl>
                                                                        <FormMessage/>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <FormField
                                                                control={form.control}
                                                                disabled={isLoading}
                                                                name={`variants.${index}.sku.price`}
                                                                render={({field}) => (
                                                                    <FormItem>
                                                                        <FormLabel>Price*</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                {...field}
                                                                                onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                                                                min={0}
                                                                                step="0.01"
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage/>
                                                                    </FormItem>
                                                                )}
                                                            />

                                                            <FormField
                                                                control={form.control}
                                                                disabled={isLoading}
                                                                name={`variants.${index}.sku.stockQuantity`}
                                                                render={({field}) => (
                                                                    <FormItem>
                                                                        <FormLabel>Stock Quantity</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                {...field}
                                                                                onChange={(e) => {
                                                                                    const value = e.target.value === "" ? null : Number.parseInt(e.target.value)
                                                                                    field.onChange(value)
                                                                                }}
                                                                                min={0}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage/>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 border border-dashed rounded-lg">
                                        <p className="text-muted-foreground">No variants added yet</p>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addVariant}
                                            className="mt-2 w-full sm:w-auto"
                                        >
                                            <Plus className="h-4 w-4 mr-2"/>
                                            Add Variant
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </Form>
                <DialogFooter>
                    <div className="flex w-full flex-col sm:flex-row gap-4 sm:gap-0 p-2 sm:p-6 justify-between">
                        {/*{product && product.audit && <AuditFooter audit={product.audit} className="w-full"/>}*/}
                        <div className="flex justify-end gap-2 sm:ml-auto w-full">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1 sm:flex-none"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" form={formId} disabled={isLoading} className="flex-1 sm:flex-none">
                                {product ? "Update Product" : "Create Product"}
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
