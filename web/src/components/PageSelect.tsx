import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PageInfo } from "@/types"

interface PaginationProps {
    pageInfo: PageInfo
    currentPage: number
    onPageChange: (page: number) => void
    className?: string
}

export function PageSelect({ pageInfo, currentPage, onPageChange, className = "" }: PaginationProps) {
    const { totalCount, size } = pageInfo

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / size)

    // Calculate the range of items being displayed
    const startItem = (currentPage - 1) * size + 1
    const endItem = Math.min(currentPage * size, totalCount)

    // Check if we can navigate to previous or next pages
    const canGoPrevious = currentPage > 1
    const canGoNext = currentPage < totalPages

    return (
        <div className={`flex items-center justify-between px-2 py-4 ${className}`}>
            <div className="flex-1 text-sm text-muted-foreground">
                Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of{" "}
                <span className="font-medium">{totalCount}</span> items
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">
                        Page {currentPage} of {totalPages}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={!canGoPrevious}
                        className="h-8 w-8 p-0"
                        aria-label="Go to previous page"
                        type="button"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={!canGoNext}
                        className="h-8 w-8 p-0"
                        aria-label="Go to next page"
                        type="button"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
