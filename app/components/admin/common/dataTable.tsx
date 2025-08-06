"use client"

import { useCallback, useMemo, useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

type CellValue = string | number | boolean | Date | null

interface DataTableProps<TData extends object> {
  columns: ColumnDef<TData, CellValue>[]
  data: TData[]
  onRowClick?: (row: TData) => void
  loading?: boolean
  searchable?: boolean
  searchColumn?: string
  paginated?: boolean
  sortable?: boolean
}

export function DataTable<TData extends object>({
  columns,
  data,
  onRowClick,
  loading = false,
  searchable = false,
  searchColumn,
  paginated = false,
  sortable = false,
}: DataTableProps<TData>) {
  // State management
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)

  // Memoized data and columns
  const memoizedData = useMemo(() => data, [data])
  const memoizedColumns = useMemo(() => columns, [columns])

  // Table instance
  const table = useReactTable({
    data: memoizedData,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageSize: rowsPerPage,
        pageIndex: 0,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    enableSorting: sortable,
  })

  // Row click handler
  const handleRowClick = useCallback((row: TData): void => {
    onRowClick?.(row)
  }, [onRowClick])

  // Search handler
  const handleSearch = useCallback((term: string) => {
    if (searchColumn) {
      table.getColumn(searchColumn)?.setFilterValue(term)
    }
  }, [searchColumn, table])

  // Rows per page handler
  const handleRowsPerPageChange = useCallback((value: string) => {
    setRowsPerPage(Number(value))
    table.setPageSize(Number(value))
  }, [table])

  return (
    <div className="space-y-4">
      {/* Search and Pagination Controls */}
      <div className="flex items-center justify-between">
        {searchable && searchColumn && (
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search..."
              className="max-w-sm"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        )}
        {paginated && (
          <div className="flex items-center gap-2">
            <Select
              value={rowsPerPage.toString()}
              onValueChange={handleRowsPerPageChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select rows per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex justify-center items-center">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => handleRowClick(row.original)}
                  className={`
                    cursor-pointer
                    ${
                      'isNew' in row.original && 
                      (row.original as { isNew?: boolean }).isNew 
                        ? 'bg-blue-50' 
                        : ''
                    }
                    hover:bg-muted/50
                  `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {paginated && (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}