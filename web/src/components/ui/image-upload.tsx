"use client"

import type React from "react"
import { forwardRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Upload, Trash2 } from "lucide-react"

export interface ImageUploadProps {
    images: Array<string | File>
    onImagesChange: (images: Array<string | File>, removedImageUrls?: string[]) => void
    maxImages?: number
    className?: string
    error?: string
    isLoading: boolean
}

const ImageUpload = forwardRef<HTMLDivElement, ImageUploadProps>(
    ({ images, onImagesChange, isLoading, maxImages = 10, className, error, ...props }, ref) => {
        const [currentImageIndex, setCurrentImageIndex] = useState(0)
        const [removedImageUrls, setRemovedImageUrls] = useState<string[]>([])
        const [previewUrls, setPreviewUrls] = useState<string[]>([])

        // Generate preview URLs for both string URLs and File objects
        useEffect(() => {
            const urls = images.map((image) => {
                if (typeof image === "string") {
                    return image
                } else {
                    return URL.createObjectURL(image)
                }
            })
            setPreviewUrls(urls)

            // Cleanup object URLs when component unmounts
            return () => {
                urls.forEach((url) => {
                    if (url.startsWith("blob:")) {
                        URL.revokeObjectURL(url)
                    }
                })
            }
        }, [images])

        const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files
            if (!files || files.length === 0) return

            // Add new files to the existing images array
            const newFiles = Array.from(files)
            const updatedImages = [...images, ...newFiles].slice(0, maxImages)
            onImagesChange(updatedImages, removedImageUrls)
        }

        const handleRemoveImage = (index: number) => {
            const imageToRemove = images[index]

            // If it's a string URL (existing image), add to removedImageUrls
            if (typeof imageToRemove === "string") {
                setRemovedImageUrls((prev) => [...prev, imageToRemove])
            }

            // Remove the image from the array
            const updatedImages = images.filter((_, i) => i !== index)
            onImagesChange(updatedImages, [
                ...removedImageUrls,
                ...(typeof imageToRemove === "string" ? [imageToRemove] : []),
            ])

            // Update current image index if needed
            if (currentImageIndex >= index && currentImageIndex > 0) {
                setCurrentImageIndex(currentImageIndex - 1)
            }
        }

        return (
            <div ref={ref} className={cn("space-y-2", className)} {...props}>
                <div className="border rounded-md p-4 space-y-4 border-gray-300">
                    {/* Image preview */}
                    {previewUrls.length > 0 ? (
                        <div className="space-y-4">
                            <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                                <img
                                    src={previewUrls[currentImageIndex] || "/placeholder.svg"}
                                    alt="Product preview"
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            {/* Image thumbnails */}
                            <div className="flex flex-wrap gap-2">
                                {previewUrls.map((previewUrl, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={previewUrl || "/placeholder.svg"}
                                            alt={`Thumbnail ${index + 1}`}
                                            className={`w-16 h-16 object-cover rounded-md cursor-pointer ${
                                                index === currentImageIndex ? "ring-2 ring-blue-500" : ""
                                            }`}
                                            onClick={() => setCurrentImageIndex(index)}
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute -top-2 -right-2 h-5 w-5 p-0"
                                            onClick={() => handleRemoveImage(index)}
                                        >
                                            <Trash2 size={12} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-40 bg-gray-100 rounded-md">
                            <p className="text-gray-500">No images selected</p>
                        </div>
                    )}

                    {/* Image upload */}
                    <div>
                        <label htmlFor="image-upload" className="block w-full">
                            <div className={`flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer bg-white hover:bg-gray-50`}>
                                <Upload size={18} className="mr-2 text-gray-500 " />
                                <span className={`text-sm text-gray-600`}>Upload Images</span>
                            </div>
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleAddImage}
                                className="hidden"
                                disabled={isLoading}
                            />
                        </label>
                    </div>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
        )
    },
)

ImageUpload.displayName = "ImageUpload"

export { ImageUpload }
