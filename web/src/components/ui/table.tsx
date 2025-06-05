import type React from "react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  variant?: "default" | "striped" | "bordered"
}

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <div className="relative w-full overflow-auto">
        <table
          ref={ref}
          className={cn(
            "w-full caption-bottom text-sm",
            variant === "striped" && "[&_tbody_tr:nth-child(even)]:bg-gray-50",
            variant === "bordered" && "[&_td]:border [&_th]:border border border-gray-200",
            className,
          )}
          {...props}
        >
          {children}
        </table>
      </div>
    )
  },
)
Table.displayName = "Table"

const TableHeader = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("[&_tr]:border-b border-gray-200", className)} {...props} />
  ),
)
TableHeader.displayName = "TableHeader"

const TableBody = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  ),
)
TableBody.displayName = "TableBody"

const TableFooter = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn("border-t bg-gray-50 font-medium text-gray-900", className)} {...props} />
  ),
)
TableFooter.displayName = "TableFooter"

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  disableHover?: boolean
}

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(({ className, disableHover, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn("border-b border-gray-200 transition-colors", !disableHover && "hover:bg-gray-50", className)}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th ref={ref} className={cn("h-12 px-4 text-left align-middle font-medium text-gray-500", className)} {...props} />
  ),
)
TableHead.displayName = "TableHead"

const TableCell = forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => <td ref={ref} className={cn("p-4 align-middle", className)} {...props} />,
)
TableCell.displayName = "TableCell"

export { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell }
