import React, { useState, useEffect, useRef, useMemo, useCallback } from "react"
import type { ControllerProps, ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { cn } from "@/lib/utils"
import type { PageableParams } from "@/types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover-dialog.tsx"

interface PagedSelectFormFieldProps<
    TValue extends string | number,
    FetchParams extends PageableParams,
    TData,
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render"> {
    label?: string
    placeholder?: string
    description?: string
    disabled?: boolean
    className?: string
    required?: boolean
    fetchFn: (
        params: FetchParams,
    ) => Promise<{ data: TData[]; pageInfo?: { totalCount: number; next: number; size: number } }>
    getOptionLabel: (item: TData) => string
    getOptionValue: (item: TData) => TValue
    pageSize?: number
    queryKey: string
    noOptionsMessage?: string
    groupBy?: (item: TData) => string
    renderOption?: (item: TData) => React.ReactNode
    onChange?: (value: TData) => void
    initialValueLabel?: string
    additionalParams?: Omit<FetchParams, keyof PageableParams>
}

export function PagedSelectFormField<
    TValue extends string | number,
    FetchParams extends PageableParams,
    TData = unknown,
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
      control,
      name,
      label,
      placeholder,
      description,
      disabled,
      required,
      className,
      fetchFn,
      getOptionLabel,
      getOptionValue,
      pageSize = 10,
      queryKey,
      noOptionsMessage = "No options available",
      groupBy,
      renderOption,
      onChange,
      initialValueLabel,
      additionalParams,
  }: PagedSelectFormFieldProps<TValue, FetchParams, TData, TFieldValues, TName>) {
    const [searchText, setSearchText] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [isOpen, setIsOpen] = useState(false)
    const searchInputRef = useRef<HTMLInputElement>(null)
    const abortControllerRef = useRef<AbortController | null>(null)
    const [debouncedText, setDebouncedText] = useState("")

    // Cleanup function for AbortController
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
        }
    }, [])

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedText(searchText)
            setCurrentPage(1)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchText])

    // Create a wrapper for the fetch function that includes the AbortController
    const fetchWithAbort = async (params: FetchParams) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        abortControllerRef.current = new AbortController()
        try {
            return await fetchFn({
                ...params,
                abortController: abortControllerRef.current.signal,
            })
        } catch (error) {
            if ((error as Error).name === "AbortError") {
                console.log("Fetch aborted")
                return { data: [], pageInfo: { totalCount: 0, next: 0, size: 0 } }
            }
            throw error
        }
    }

    const { data, isLoading, error } = useQuery({
        queryKey: [queryKey, debouncedText, currentPage, pageSize, additionalParams],
        queryFn: () =>
            fetchWithAbort({
                q: debouncedText,
                page: currentPage,
                size: pageSize,
                ...additionalParams,
            } as FetchParams),
        enabled: isOpen,
    })

    const items = useMemo(() => data?.data || [], [data?.data])
    const totalPages = data?.pageInfo ? Math.ceil(data.pageInfo.totalCount / pageSize) : 0
    const hasNextPage = currentPage < totalPages
    const hasPrevPage = currentPage > 1

    const groupedItems = React.useMemo(() => {
        if (!groupBy) return { ungrouped: items }
        return items.reduce((acc: Record<string, TData[]>, item) => {
            const group = groupBy(item)
            if (!acc[group]) acc[group] = []
            acc[group].push(item)
            return acc
        }, {})
    }, [items, groupBy])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setSearchText(e.target.value)
    }

    const handleOptionSelect = (item: TData, field: ControllerRenderProps<TFieldValues, TName>) => {
        const value = getOptionValue(item)
        field.onChange(value)
        if (onChange) onChange(item)
        setIsOpen(false)
    }

    // Prevent popover from closing when clicking inside
    const handlePopoverClick = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    const getSelectedOptionLabel = useCallback(
        (value: TValue) => {
            const option = items.find((option) => getOptionValue(option) === value)
            if (!option) return
            return getOptionLabel(option)
        },
        [getOptionLabel, getOptionValue, items],
    )

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    {label && (
                        <FormLabel>
                            {label} {required && "*"}
                        </FormLabel>
                    )}
                    <Popover open={isOpen} onOpenChange={setIsOpen}>
                        <PopoverTrigger>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    disabled={disabled}
                                    className={cn(
                                        "w-full justify-between",
                                        !field.value && !initialValueLabel && "text-muted-foreground",
                                    )}
                                    type="button"
                                >
                                    {getSelectedOptionLabel(field.value) || initialValueLabel || placeholder || "Select an option"}
                                    <ChevronLeft className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-[var(--radix-popover-trigger-width)] p-0"
                            align="start"
                            onClick={handlePopoverClick}
                        >
                            <div className="px-2 py-2">
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        ref={searchInputRef}
                                        placeholder="Search..."
                                        className="pl-8"
                                        value={searchText}
                                        onChange={handleSearchChange}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>
                            </div>

                            {isLoading && (
                                <div className="flex items-center justify-center py-6">
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            )}

                            {error && <div className="px-2 py-6 text-center text-sm text-destructive">Failed to load options</div>}

                            {!isLoading && items.length === 0 && (
                                <div className="px-2 py-6 text-center text-sm text-muted-foreground">{noOptionsMessage}</div>
                            )}

                            {!isLoading && items.length > 0 && (
                                <div className="max-h-[300px] overflow-auto">
                                    {Object.entries(groupedItems).map(([group, groupItems]) => (
                                        <React.Fragment key={group}>
                                            {groupBy && group !== "ungrouped" && (
                                                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{group}</div>
                                            )}
                                            {groupItems.map((item) => (
                                                <div
                                                    key={getOptionValue(item)}
                                                    className={cn(
                                                        "flex cursor-pointer items-center px-2 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors duration-200",
                                                        groupBy && group !== "ungrouped" && "pl-4",
                                                        field.value === getOptionValue(item) && "bg-accent text-accent-foreground font-medium",
                                                    )}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleOptionSelect(item, field)
                                                    }}
                                                >
                                                    {renderOption ? renderOption(item) : getOptionLabel(item)}
                                                </div>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </div>
                            )}

                            {totalPages > 1 && (
                                <div className="flex items-center justify-between border-t px-2 py-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                                        }}
                                        disabled={!hasPrevPage}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="text-xs text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            setCurrentPage((prev) => prev + 1)
                                        }}
                                        disabled={!hasNextPage}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </PopoverContent>
                    </Popover>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default PagedSelectFormField
