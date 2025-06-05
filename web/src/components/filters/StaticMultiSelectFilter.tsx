import React, {useState, useEffect, useRef, useMemo} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Search, ChevronDown} from "lucide-react"
import {cn} from "@/lib/utils"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Badge} from "@/components/ui/badge"
import {Checkbox} from "@/components/ui/checkbox"
import {ScrollArea} from "@/components/ui/scroll-area"
import {Label} from "@/components/ui/label.tsx";


interface StaticMultiSelectFilterProps<TValue extends string | number, TData> {
    values: TValue[]
    options: TData[]
    onChange: (values: TValue[]) => void
    label?: string
    placeholder?: string
    disabled?: boolean
    className?: string
    getOptionLabel: (item: TData) => string
    getOptionValue: (item: TData) => TValue
    noOptionsMessage?: string
    groupBy?: (item: TData) => string
    renderOption?: (item: TData) => React.ReactNode
    maxDisplayValues?: number
}

export function StaticMultiSelectFilter<TValue extends string | number, TData>({
                                                                                   values = [],
                                                                                   onChange,
                                                                                   label,
                                                                                   placeholder = "Select options",
                                                                                   disabled,
                                                                                   className,
                                                                                   options,
                                                                                   getOptionLabel,
                                                                                   getOptionValue,
                                                                                   noOptionsMessage = "No options available",
                                                                                   groupBy,
                                                                                   renderOption,
                                                                                   maxDisplayValues = 3,
                                                                               }: StaticMultiSelectFilterProps<TValue, TData>) {
    const [searchText, setSearchText] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const searchInputRef = useRef<HTMLInputElement>(null)

    // Focus search input when popover opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current?.focus()
            }, 100)
        }
    }, [isOpen])

    const groupedItems = useMemo(() => {
        if (!groupBy) return {ungrouped: options}
        return options.reduce((acc: Record<string, TData[]>, item) => {
            const group = groupBy(item)
            if (!acc[group]) acc[group] = []
            acc[group].push(item)
            return acc
        }, {})
    }, [options, groupBy])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setSearchText(e.target.value)
    }

    const handleOptionToggle = (item: TData) => {
        const itemValue = getOptionValue(item)
        let newValues: TValue[]

        if (values.includes(itemValue)) {
            newValues = values.filter((v) => v !== itemValue)
        } else {
            newValues = [...values, itemValue]
        }

        onChange(newValues)
    }

    const handleRemoveValue = (value: TValue) => {
        const newValues = values.filter((v) => v !== value)
        onChange(newValues)
    }

    const handleClearAll = (e: React.MouseEvent) => {
        e.stopPropagation()
        onChange([],)
    }

    const displaySelectedItems = options.filter((item: TData) => values.includes(getOptionValue(item)))

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

                    {
                        options.length === 0 && <span>{noOptionsMessage}</span>
                    }

                    {options.length > 0 && (
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
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default StaticMultiSelectFilter
