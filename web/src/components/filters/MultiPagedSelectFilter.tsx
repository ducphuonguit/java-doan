import React, {useState, useEffect, useRef, useMemo} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Loader2, Search, ChevronLeft, ChevronRight, ChevronDown} from "lucide-react"
import {useQuery} from "@tanstack/react-query"
import {cn} from "@/lib/utils"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Badge} from "@/components/ui/badge"
import {Checkbox} from "@/components/ui/checkbox"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Label} from "@/components/ui/label.tsx";

interface PageableParams {
    q?: string
    page: number
    size: number
}

interface MultiPagedSelectFilterProps<TValue extends string | number, FetchParams extends PageableParams, TData> {
    values: TValue[]
    onChange: (values: TValue[], items: TData[]) => void
    label?: string
    placeholder?: string
    disabled?: boolean
    className?: string
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
    maxDisplayValues?: number
    additionalParams?: Omit<FetchParams, keyof PageableParams>
}

export function MultiPagedSelectFilter<TValue extends string | number, FetchParams extends PageableParams, TData>({
                                                                                                                      values = [],
                                                                                                                      onChange,
                                                                                                                      label,
                                                                                                                      placeholder = "Select options",
                                                                                                                      disabled,
                                                                                                                      className,
                                                                                                                      fetchFn,
                                                                                                                      getOptionLabel,
                                                                                                                      getOptionValue,
                                                                                                                      pageSize = 10,
                                                                                                                      queryKey,
                                                                                                                      noOptionsMessage = "No options available",
                                                                                                                      groupBy,
                                                                                                                      renderOption,
                                                                                                                      maxDisplayValues = 3,
                                                                                                                      additionalParams,
                                                                                                                  }: MultiPagedSelectFilterProps<TValue, FetchParams, TData>) {
    const [searchText, setSearchText] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [isOpen, setIsOpen] = useState(false)
    const [selectedItems, setSelectedItems] = useState<TData[]>([])
    const searchInputRef = useRef<HTMLInputElement>(null)
    const abortControllerRef = useRef<AbortController | null>(null)
    const [debouncedText, setDebouncedText] = useState("")

    // Cleanup AbortController
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
        }, 300)

        return () => clearTimeout(timer)
    }, [searchText])

    // Focus search input when popover opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current?.focus()
            }, 100)
        }
    }, [isOpen])


    // Fetch wrapper with AbortController
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
                return {data: [], pageInfo: {totalCount: 0, next: 0, size: 0}}
            }
            throw error
        }
    }

    const {data, isLoading, error} = useQuery({
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
    // Fetch selected items if we don't have them yet
    const {data: selectedItemsData} = useQuery({
        queryKey: [queryKey, "selected-items", values],
        queryFn: async () => {
            if (values.length === 0) return {data: []}

            // If we already have all the selected items, don't fetch
            const missingValues = values.filter((v) => !selectedItems.some((item) => getOptionValue(item) === v))
            if (missingValues.length === 0) return {data: []}

            // Fetch missing items - this assumes your API supports fetching by IDs
            // You may need to adjust this based on your API
            return await fetchFn({
                ids: missingValues,
                page: 1,
                size: values.length,
                ...additionalParams,
            } as never)
        },
        enabled: values.length > 0 && selectedItems.length < values.length,
    })

    // Update selected items when values change or when we fetch selected items
    useEffect(() => {
        if (selectedItemsData?.data && selectedItemsData.data.length > 0) {
            setSelectedItems((prev) => {
                const newItems = [...prev]
                selectedItemsData.data.forEach((item) => {
                    if (!newItems.some((i) => getOptionValue(i) === getOptionValue(item))) {
                        newItems.push(item)
                    }
                })
                return newItems
            })
        }
    }, [selectedItemsData?.data, getOptionValue])

    const items = useMemo(() => data?.data || [], [data?.data])
    const totalPages = data?.pageInfo ? Math.ceil(data.pageInfo.totalCount / pageSize) : 0
    const hasNextPage = currentPage < totalPages
    const hasPrevPage = currentPage > 1

    const groupedItems = useMemo(() => {
        if (!groupBy) return {ungrouped: items}
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

    const handleOptionToggle = (item: TData) => {
        const itemValue = getOptionValue(item)
        let newValues: TValue[]
        let newItems: TData[]

        if (values.includes(itemValue)) {
            // Remove item
            newValues = values.filter((v) => v !== itemValue)
            newItems = selectedItems.filter((i) => getOptionValue(i) !== itemValue)
        } else {
            // Add item
            newValues = [...values, itemValue]
            newItems = [...selectedItems, item]
        }

        setSelectedItems(newItems)
        onChange(newValues, newItems)
    }

    const handleRemoveValue = (value: TValue) => {
        const newValues = values.filter((v) => v !== value)
        const newItems = selectedItems.filter((item) => getOptionValue(item) !== value)
        setSelectedItems(newItems)
        onChange(newValues, newItems)
    }

    const handleClearAll = (e: React.MouseEvent) => {
        e.stopPropagation()
        setSelectedItems([])
        onChange([], [])
    }

    const displaySelectedItems = selectedItems.filter((item) => values.includes(getOptionValue(item)))
    return (
        <div className={cn("space-y-2 flex flex-col gap-1", className)}>
            {label && (
                <Label>
                    {label}
                </Label>
            )}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger>
                    <Button
                        variant="outline"
                        type="button"
                        role="combobox"
                        disabled={disabled}
                        className={cn("w-full justify-between min-h-10", !values.length && "text-muted-foreground")}
                    >
                        <div className="flex flex-wrap gap-1 items-center max-w-[90%] overflow-hidden">
                            {displaySelectedItems.length === 0 ? (
                                <span>{placeholder}</span>
                            ) : (
                                <>
                                    {displaySelectedItems.slice(0, maxDisplayValues).map((item) => (
                                        <Badge
                                            key={getOptionValue(item).toString()}
                                            variant="secondary"
                                            onClick={() => handleRemoveValue(getOptionValue(item))}
                                        >
                                            {getOptionLabel(item)}
                                        </Badge>
                                    ))}
                                    {displaySelectedItems.length > maxDisplayValues && (
                                        <Badge
                                            variant="secondary">+{displaySelectedItems.length - maxDisplayValues} more</Badge>
                                    )}
                                </>
                            )}
                        </div>
                        <ChevronDown className="h-4 w-4 shrink-0 opacity-50"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <div className="px-2 py-2 space-y-2">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"/>
                            <Input
                                ref={searchInputRef}
                                placeholder="Search..."
                                className="pl-8"
                                value={searchText}
                                onChange={handleSearchChange}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>

                        {values.length > 0 && (
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">{values.length} selected</span>
                                <Button variant="ghost" size="sm" onClick={handleClearAll} className="h-7 text-xs">
                                    Clear all
                                </Button>
                            </div>
                        )}
                    </div>

                    {isLoading && (
                        <div className="flex items-center justify-center py-6">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/>
                        </div>
                    )}

                    {error &&
                        <div className="px-2 py-6 text-center text-sm text-destructive">Failed to load options</div>}

                    {!isLoading && items.length === 0 && (
                        <div className="px-2 py-6 text-center text-sm text-muted-foreground">{noOptionsMessage}</div>
                    )}

                    {!isLoading && items.length > 0 && (
                        <ScrollArea className="max-h-[300px]">
                            {Object.entries(groupedItems).map(([group, groupItems]) => (
                                <React.Fragment key={group}>
                                    {groupBy && group !== "ungrouped" && (
                                        <div
                                            className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{group}</div>
                                    )}
                                    {groupItems.map((item) => {
                                        const itemValue = getOptionValue(item)
                                        const isSelected = values.includes(itemValue)

                                        return (
                                            <div
                                                key={itemValue.toString()}
                                                className={cn(
                                                    "flex items-center px-2 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors duration-200 cursor-pointer",
                                                    groupBy && group !== "ungrouped" && "pl-4",
                                                    isSelected && "bg-accent/50",
                                                )}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleOptionToggle(item)
                                                }}
                                            >
                                                <Checkbox
                                                    checked={isSelected}
                                                    className="mr-2 h-4 w-4"
                                                    onCheckedChange={() => handleOptionToggle(item)}
                                                />
                                                {renderOption ? renderOption(item) : getOptionLabel(item)}
                                            </div>
                                        )
                                    })}
                                </React.Fragment>
                            ))}
                        </ScrollArea>
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
                                <ChevronLeft className="h-4 w-4"/>
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
                                <ChevronRight className="h-4 w-4"/>
                            </Button>
                        </div>
                    )}
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default MultiPagedSelectFilter
