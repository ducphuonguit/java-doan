import React, { useState, useEffect, useRef, type ReactNode, useCallback } from "react"
import type { ControllerProps, FieldPath, FieldValues } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {Check, ChevronDown, ChevronLeft, Search} from "lucide-react"
import { cn } from "@/lib/utils"
import type { RequiredFields } from "@/types"

interface StaticSelectFormFieldProps<
    TValue,
    TOption,
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends RequiredFields<Omit<ControllerProps<TFieldValues, TName>, "render">, "control"> {
    label?: string
    placeholder?: string
    description?: string
    disabled?: boolean
    className?: string
    required?: boolean
    options: TOption[]
    getOptionLabel: (option: TOption) => string
    getOptionValue: (option: TOption) => TValue
    noOptionsMessage?: string
    groupBy?: (option: TOption) => string
    renderOption?: (option: TOption) => React.ReactNode
    onChange?: (value: TOption) => void
    enableSearch?: boolean
    icon?: ReactNode
    initialValueLabel?: string
}

export function StaticSelectFormField<
    TValue extends string | number,
    TOption,
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
      options,
      getOptionLabel,
      getOptionValue,
      noOptionsMessage = "No options available",
      groupBy,
      renderOption,
      onChange,
      enableSearch = true,
      initialValueLabel,
  }: StaticSelectFormFieldProps<TValue, TOption, TFieldValues, TName>) {
    const [searchText, setSearchText] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const searchInputRef = useRef<HTMLInputElement>(null)

    // Filter options based on search text
    const filteredOptions = React.useMemo(() => {
        if (!searchText) return options

        return options.filter((option) => getOptionLabel(option).toLowerCase().includes(searchText.toLowerCase()))
    }, [options, searchText, getOptionLabel])

    // Group options if groupBy function is provided
    const groupedOptions = React.useMemo(() => {
        if (!groupBy) return { ungrouped: filteredOptions }

        return filteredOptions.reduce((acc: Record<string, TOption[]>, option) => {
            const group = groupBy(option)
            if (!acc[group]) acc[group] = []
            acc[group].push(option)
            return acc
        }, {})
    }, [filteredOptions, groupBy])

    // Clear search when dropdown closes
    useEffect(() => {
        if (!isOpen) {
            setSearchText("")
        }
    }, [isOpen])

    // Focus search input when popover opens
    useEffect(() => {
        if (isOpen && searchInputRef.current && enableSearch) {
            // Small delay to ensure the popover is fully open
            setTimeout(() => {
                searchInputRef.current?.focus()
            }, 50)
        }
    }, [isOpen, enableSearch])

    const getSelectedOptionLabel = useCallback(
        (value: TValue) => {
            const option = options.find((option) => getOptionValue(option) === value)
            if (!option) return
            return getOptionLabel(option)
        },
        [getOptionLabel, getOptionValue, options],
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
                                    type="button"
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={isOpen}
                                    disabled={disabled}
                                    className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                                >
                                    {getSelectedOptionLabel(field.value) || initialValueLabel || placeholder || "Select an option"}
                                    {
                                        isOpen ? <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" /> : <ChevronLeft className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                                    }
                                </Button>
                            </FormControl>
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
                                                const value = getOptionValue(option)
                                                const label = getOptionLabel(option)
                                                const isSelected = field.value === value

                                                return (
                                                    <div
                                                        key={value}
                                                        className={cn(
                                                            "flex cursor-pointer items-center justify-between px-2 py-1.5 hover:bg-accent hover:text-accent-foreground transition-colors duration-200",
                                                            groupBy && group !== "ungrouped" && "pl-4",
                                                            isSelected && "bg-accent text-accent-foreground font-medium",
                                                        )}
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            e.stopPropagation()
                                                            field.onChange(value)
                                                            if (onChange) onChange(option)
                                                            setIsOpen(false)
                                                        }}
                                                    >
                                                        <div>{renderOption ? renderOption(option) : label}</div>
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
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default StaticSelectFormField
