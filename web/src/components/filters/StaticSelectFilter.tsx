import React, { useState, useEffect, useRef, type ReactNode } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface StaticSelectProps<TValue, TOption> {
    label?: string
    placeholder?: string
    description?: string
    disabled?: boolean
    className?: string
    required?: boolean
    value?: TValue
    onChange?: (value: TValue, option: TOption) => void
    onBlur?: () => void
    options: TOption[]
    getOptionLabel: (option: TOption) => string
    getOptionValue: (option: TOption) => TValue
    noOptionsMessage?: string
    groupBy?: (option: TOption) => string
    renderOption?: (option: TOption) => React.ReactNode
    enableSearch?: boolean
    icon?: ReactNode
    initialValueLabel?: string
}

export function StaticSelectFilter<TValue extends string | number, TOption>({
                                                                          label,
                                                                          placeholder,
                                                                          description,
                                                                          disabled,
                                                                          required,
                                                                          className,
                                                                          value,
                                                                          onChange,
                                                                          onBlur,
                                                                          options,
                                                                          getOptionLabel,
                                                                          getOptionValue,
                                                                          noOptionsMessage = "No options available",
                                                                          groupBy,
                                                                          renderOption,
                                                                          enableSearch = true,
                                                                          initialValueLabel,
                                                                      }: StaticSelectProps<TValue, TOption>) {
    const [searchText, setSearchText] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [selectedLabel, setSelectedLabel] = useState<string | null>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const selectedOption = options.find((opt) => getOptionValue(opt) === value)
        setSelectedLabel(selectedOption ? getOptionLabel(selectedOption) : null)
    }, [value, options, getOptionValue, getOptionLabel])

    const filteredOptions = React.useMemo(() => {
        if (!searchText) return options
        return options.filter((option) => getOptionLabel(option).toLowerCase().includes(searchText.toLowerCase()))
    }, [options, searchText, getOptionLabel])

    const groupedOptions = React.useMemo(() => {
        if (!groupBy) return { ungrouped: filteredOptions }
        return filteredOptions.reduce((acc: Record<string, TOption[]>, option) => {
            const group = groupBy(option)
            if (!acc[group]) acc[group] = []
            acc[group].push(option)
            return acc
        }, {})
    }, [filteredOptions, groupBy])

    useEffect(() => {
        if (!isOpen) setSearchText("")
    }, [isOpen])

    useEffect(() => {
        if (isOpen && searchInputRef.current && enableSearch) {
            setTimeout(() => searchInputRef.current?.focus(), 50)
        }
    }, [isOpen, enableSearch])

    return (
        <div>
            {label && (
                <label className="block mb-1 text-sm font-medium">
                    {label} {required && "*"}
                </label>
            )}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger>
                    <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={isOpen}
                        disabled={disabled}
                        className={cn("w-full justify-between", !value && "text-muted-foreground", className)}
                    >
                        {selectedLabel || initialValueLabel || placeholder || "Select an option"}
                        <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[var(--radix-popover-trigger-width)] p-0"
                    align="start"
                    onClick={(e) => e.preventDefault()}
                >
                    {enableSearch && (
                        <div className="px-2 py-2">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    ref={searchInputRef}
                                    placeholder="Search..."
                                    className="pl-8"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>
                    )}

                    {filteredOptions.length === 0 && (
                        <div className="px-2 py-6 text-center text-sm text-muted-foreground">{noOptionsMessage}</div>
                    )}

                    {filteredOptions.length > 0 && (
                        <div className="max-h-[300px] overflow-auto">
                            {Object.entries(groupedOptions).map(([group, groupOptions]) => (
                                <React.Fragment key={group}>
                                    {groupBy && group !== "ungrouped" && (
                                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{group}</div>
                                    )}
                                    {groupOptions.map((option) => {
                                        const optionValue = getOptionValue(option)
                                        const optionLabel = getOptionLabel(option)
                                        const isSelected = value === optionValue

                                        return (
                                            <div
                                                key={optionValue}
                                                className={cn(
                                                    "flex cursor-pointer items-center justify-between px-2 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors duration-200",
                                                    groupBy && group !== "ungrouped" && "pl-4",
                                                    isSelected && "bg-accent text-accent-foreground font-medium",
                                                )}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    onChange?.(optionValue, option)
                                                    setIsOpen(false)
                                                    onBlur?.()
                                                }}
                                            >
                                                <div>{renderOption ? renderOption(option) : optionLabel}</div>
                                                {isSelected && <Check className="h-4 w-4" />}
                                            </div>
                                        )
                                    })}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </PopoverContent>
            </Popover>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
    )
}
