import React, { useState } from "react"
import {  Loader2, ExternalLink, Check, X, Edit } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Badge, type BadgeProps } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Link } from "react-router-dom"
import type { PageInfo } from "@/types"
import { AxiosError } from "axios"
import { ColumnToggle } from "./ColumnToggle"
import { useLocalStorage } from "@/hooks/useLocalStorage.tsx"

// Define column types
export type SortDirection = "asc" | "desc" | null

export interface ListViewTooltipOption {
    visible: boolean
    message?: string | React.ReactNode
}

export interface BaseColumnDefinition<T> {
    // Name displayed in header cell
    name: string
    // Additional classname for header cell
    headerCellClassName?: string
    // Additional classname for header cell
    cellClassName?: string
    // min-width style of table column
    minWidth?: number
    // Expand column such that table can take full parent width
    fill?: boolean
    // tooltip hint configuration
    tooltipOption?: ListViewTooltipOption
    // Determine whether sorting is enabled (default = false)
    enableSorting?: boolean
    sortingName?: string
    enableHiding?: boolean
    key: keyof T
}

export interface TextColumn<T extends { id: string | number }> extends BaseColumnDefinition<T> {
    type: "text"
    customCell?: (item: T) => React.ReactNode
}

export interface LinkColumn<T extends { id: string | number }> extends BaseColumnDefinition<T> {
    type: "link"
    customCell?: (item: T) => React.ReactNode
    getRoute: (item: T) => string | undefined
}

export interface ImageColumn<T extends { id: string | number }> extends BaseColumnDefinition<T> {
    type: "image"
    altText?: string
    imageWidth?: number
    imageHeight?: number
}

export interface BadgesColumn<T extends { id: string | number }> extends BaseColumnDefinition<T> {
    type: "badges"
    variant?: BadgeProps["variant"]
    getBadgeVariant?: (value: string, item: T) => BadgeProps["variant"]
}

export interface BooleanIconColumn<T extends { id: string | number }> extends BaseColumnDefinition<T> {
    type: "boolean-icon"
}

export interface CheckboxColumn<T extends { id: string | number }> extends BaseColumnDefinition<T> {
    type: "checkbox"
    onChange?: (item: T, checked: boolean) => void
    disabled?: boolean | ((item: T) => boolean)
}

export interface ActionColumn<T extends { id: string | number }> extends Omit<BaseColumnDefinition<T>, "name" | "key"> {
    type: "action"
    name?: string
    actions: {
        onEditClick?: (item: T) => void
        onDeleteClick?: (item: T) => void
        onViewClick?: (item: T) => void
        customActions?: (item: T) => React.ReactNode
    }
}

export interface CustomColumn<T extends { id: string | number }> extends Omit<BaseColumnDefinition<T>, "key"> {
    type: "custom"
    key?: keyof T
    render: (item: T) => React.ReactNode
}

export type Column<T extends { id: string | number }> =
    | TextColumn<T>
    | LinkColumn<T>
    | ImageColumn<T>
    | BadgesColumn<T>
    | BooleanIconColumn<T>
    | CheckboxColumn<T>
    | ActionColumn<T>
    | CustomColumn<T>

export interface DataTableProps<T extends { id: string | number }> {
    columns: Column<T>[]
    items: T[]
    name?: string // Unique name for the table to use in localStorage
    isLoading?: boolean
    error?: string | Error | null
    emptyMessage?: string
    pageInfo?: PageInfo
    className?: string
    cardClassName?: string
    tableClassName?: string
    headerClassName?: string
    bodyClassName?: string
    rowClassName?: (row: T) => string
    onRowClick?: (row: T) => void
    renderExpandedRow?: (row: T) => React.ReactNode
    stickyHeader?: boolean
    striped?: boolean
    bordered?: boolean
    compact?: boolean
    highlightOnHover?: boolean
}

// Base storage key for hidden columns
const HIDDEN_COLUMNS_STORAGE_BASE_KEY = "data-table-hidden-columns"

export function DataTable<T extends { id: string | number }>({
                                                                 columns,
                                                                 items,
                                                                 name = "default", // Default name if none provided
                                                                 isLoading = false,
                                                                 error = null,
                                                                 emptyMessage = "No data found",

                                                                 className,
                                                                 cardClassName,
                                                                 tableClassName,
                                                                 headerClassName,
                                                                 bodyClassName,
                                                                 rowClassName,
                                                                 onRowClick,
                                                                 renderExpandedRow,
                                                                 stickyHeader = false,
                                                                 striped = true,
                                                                 bordered = false,
                                                                 compact = false,
                                                                 highlightOnHover = true,
                                                             }: DataTableProps<T>) {
    const [expandedRows, setExpandedRows] = useState<Record<string | number, boolean>>({})

    const [hiddenColumns, setHiddenColumns] = useLocalStorage<string[]>(`${HIDDEN_COLUMNS_STORAGE_BASE_KEY}-${name}`, [])


    const toggleRowExpansion = (rowId: string | number) => {
        setExpandedRows((prev) => ({
            ...prev,
            [rowId]: !prev[rowId],
        }))
    }

    const toggleColumnVisibility = (columnKey: string) => {
        setHiddenColumns((prev) => {
            if (prev.includes(columnKey)) {
                return prev.filter((key) => key !== columnKey)
            } else {
                return [...prev, columnKey]
            }
        })
    }

    // Filter out hidden columns
    const visibleColumns = columns.filter((column) => {
        if (column.type === "action") return true
        if (column.type === "custom" && !column.key) return true
        return !hiddenColumns.includes(String(column.key))
    })


    const renderCellContent = (column: Column<T>, row: T) => {
        switch (column.type) {
            case "text": {
                if (column.customCell) {
                    return column.customCell(row)
                }
                const value = row[column.key]
                return value !== undefined ? (value as React.ReactNode) : "-"
            }

            case "link": {
                if (column.customCell) {
                    return column.customCell(row)
                }
                const value = row[column.key]
                const route = column.getRoute(row)
                return route ? (
                    <Link to={route} className="flex items-center text-primary hover:underline">
                        {value as React.ReactNode}
                        <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                ) : value !== undefined ? (
                    (value as React.ReactNode)
                ) : (
                    "-"
                )
            }

            case "image": {
                const value = row[column.key]
                if (!value) return null

                return (
                    <div
                        className="overflow-hidden rounded-md"
                        style={{
                            width: column.imageWidth ? `${column.imageWidth}px` : "40px",
                            height: column.imageHeight ? `${column.imageHeight}px` : "40px",
                        }}
                    >
                        <img
                            src={(value as string) || "/placeholder.svg"}
                            alt={column.altText || "Image"}
                            className="h-full w-full object-cover"
                        />
                    </div>
                )
            }

            case "badges": {
                const values = row[column.key]
                if (!values || !Array.isArray(values) || values.length === 0) return null
                return (
                    <div className="flex flex-wrap gap-1">
                        {values.map((value, index) => {
                            const variant = column.getBadgeVariant ? column.getBadgeVariant(value, row) : column.variant || "primary"

                            return (
                                <Badge key={index} variant={variant}>
                                    {value}
                                </Badge>
                            )
                        })}
                    </div>
                )
            }

            case "boolean-icon": {
                const value = row[column.key]
                if (value === undefined) return "-"

                return value ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-red-500" />
            }

            case "checkbox": {
                const value = row[column.key]
                const isDisabled = typeof column.disabled === "function" ? column.disabled(row) : column.disabled || false

                return (
                    <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                        <input
                            type="checkbox"
                            checked={Boolean(value)}
                            disabled={isDisabled}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            onChange={(e) => {
                                if (column.onChange) {
                                    column.onChange(row, e.target.checked)
                                }
                            }}
                        />
                    </div>
                )
            }

            case "action": {
                const { actions } = column
                return (
                    <div className="flex justify-end gap-2">
                        {actions.onViewClick && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    actions.onViewClick?.(row)
                                }}
                            >
                                <ExternalLink size={18} className="text-blue-600" />
                            </Button>
                        )}
                        {actions.onEditClick && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    actions.onEditClick?.(row)
                                }}
                            >
                                <Edit size={18} className="text-blue-600" />
                            </Button>
                        )}
                        {actions.onDeleteClick && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    actions.onDeleteClick?.(row)
                                }}
                            >
                                <X size={18} className="text-red-600" />
                            </Button>
                        )}
                        {actions.customActions && actions.customActions(row)}
                    </div>
                )
            }

            case "custom": {
                return column.render(row)
            }

            default:
                return "-"
        }
    }

    const renderHeaderCell = (column: Column<T>) => {
        const headerContent = (
            <div className={`flex items-center ${column.type === "action" ? "justify-end" : ""}`}>
                <span>{column.name}</span>
            </div>
        )

        if (column.tooltipOption?.visible) {
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="inline-flex items-center">{headerContent}</div>
                        </TooltipTrigger>
                        <TooltipContent>{column.tooltipOption.message}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )
        }

        return headerContent
    }

    // Check if any columns have enableHiding set to true
    const hasHideableColumns = columns.some(
        (column) => column.type !== "action" && column.enableHiding !== false && "key" in column,
    )

    return (
        <Card className={cn("overflow-hidden", cardClassName)}>
            {hasHideableColumns && (
                <div className="flex justify-end p-2 border-b">
                    <ColumnToggle columns={columns} hiddenColumns={hiddenColumns} onToggleColumn={toggleColumnVisibility} />
                </div>
            )}
            <div className={cn("overflow-x-auto", className)}>
                <Table className={tableClassName}>
                    <TableHeader className={cn(stickyHeader && "sticky top-0 z-10 bg-background", headerClassName)}>
                        <TableRow>
                            {visibleColumns.map((column, index) => (
                                <TableHead
                                    key={index}
                                    className={cn(
                                        column.headerCellClassName,
                                        "whitespace-nowrap",
                                        column.enableSorting && "cursor-pointer select-none",
                                        column.type === "action" && "text-right",
                                    )}
                                    style={{
                                        minWidth: column.minWidth ? `${column.minWidth}px` : undefined,
                                        width: column.fill ? "100%" : undefined,
                                    }}
                                >
                                    {renderHeaderCell(column)}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody className={bodyClassName}>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={visibleColumns.length} className="h-24 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                        <span className="text-sm text-muted-foreground">Loading data...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={visibleColumns.length} className="h-24 text-center">
                                    <div className="flex flex-col items-center justify-center text-destructive">
                                        <span className="font-medium">Error loading data</span>
                                        <span className="text-sm">
                      {error instanceof AxiosError ? error.message : "Something went wrong! Please try again later"}
                    </span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={visibleColumns.length} className="h-24 text-center text-muted-foreground">
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((row, rowIndex) => {
                                const isExpanded = expandedRows[row.id] && renderExpandedRow
                                return (
                                    <React.Fragment key={row.id}>
                                        <TableRow
                                            className={cn(
                                                striped && rowIndex % 2 === 1 && "bg-muted/50",
                                                bordered && "border-b",
                                                compact && "h-10",
                                                highlightOnHover && "hover:bg-muted/70",
                                                (onRowClick || renderExpandedRow) && "cursor-pointer",
                                                rowClassName && rowClassName(row),
                                            )}
                                            onClick={() => {
                                                if (renderExpandedRow) {
                                                    toggleRowExpansion(row.id)
                                                }
                                                onRowClick?.(row)
                                            }}
                                        >
                                            {visibleColumns.map((column, colIndex) => (
                                                <TableCell
                                                    key={`${row.id}-${colIndex}`}
                                                    className={cn(column.cellClassName, column.type === "action" && "text-right")}
                                                >
                                                    {renderCellContent(column, row)}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                        {isExpanded && (
                                            <TableRow className="bg-muted/30">
                                                <TableCell colSpan={visibleColumns.length} className="p-0">
                                                    <div className="p-4 border-t">{renderExpandedRow(row)}</div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

        </Card>
    )
}
