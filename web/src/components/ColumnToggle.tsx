import { Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Column } from "./DataTable"

interface ColumnToggleProps<T extends { id: string | number }> {
    columns: Column<T>[]
    hiddenColumns: string[]
    onToggleColumn: (columnKey: string) => void
}

export function ColumnToggle<T extends { id: string | number }>({
                                                                    columns,
                                                                    hiddenColumns,
                                                                    onToggleColumn,
                                                                }: ColumnToggleProps<T>) {
    // Filter columns that can be hidden
    const hideableColumns = columns.filter(
        (column) => column.type !== "action" && column.enableHiding !== false && "key" in column,
    )

    if (hideableColumns.length === 0) {
        return null
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant="outline" size="sm" className="ml-auto h-8 flex items-center gap-1">
                    <Settings2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Columns</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {hideableColumns.map((column) => {
                    // Skip columns without a key
                    if (!("key" in column)) return null

                    const columnKey = String(column.key)
                    const isHidden = hiddenColumns.includes(columnKey)

                    return (
                        <DropdownMenuCheckboxItem
                            className="cursor-pointer"
                            key={columnKey}
                            checked={!isHidden}
                            onSelect={(e) => {
                                // Prevent the dropdown from closing
                                e.preventDefault()
                                onToggleColumn(columnKey)
                            }}
                        >
                            {column.name}
                        </DropdownMenuCheckboxItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
