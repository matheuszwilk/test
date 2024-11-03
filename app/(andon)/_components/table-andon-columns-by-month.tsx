"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { Badge } from "@/app/_components/ui/badge";
import { AndonByMonthDataDto } from "@/app/_data-access/andon/get-andon-by-month";

type CellFormatterFunction = (value: number) => React.ReactNode;

const CELL_FORMATTERS: Record<string, CellFormatterFunction> = {
  "Man Hour": (value) => `${Number(value).toFixed(0)}`,
  "Andon": (value) => `${Number(value).toFixed(0)}`,
  "Andon Stop Qty": (value) => String(value),
  "Target": (value) => <Badge variant="outline">{`${(Number(value) * 100).toFixed(2)}%`}</Badge>,
  "Instant Stop Rate": (value) => <Badge variant="outline">{`${(Number(value) * 100).toFixed(2)}%`}</Badge>,
  "Achievement Rate": (value) => {
    const formattedValue = `${(Number(value) * 100).toFixed(2)}%`;
    const Icon = value >= 0 ? ArrowDownCircle : ArrowUpCircle;
    const colorClass = value >= 0 ? "text-green-500" : "text-red-500";
    
    return (
      <div className="flex items-center justify-center">
        {formattedValue}
        <Icon className={`ml-1 ${colorClass}`} size={16} />
      </div>
    );
  }
};

const createMonthColumn = (monthIndex: number): ColumnDef<AndonByMonthDataDto, unknown> => ({
  accessorKey: `month_${monthIndex}`,
  header: ({ table }) => (
    <strong>
      {table.getRowModel().rows[0]?.original.month_numbers?.[monthIndex - 1] || `Month ${monthIndex}`}
    </strong>
  ),
  cell: ({ row }) => formatCellValue(
    row.original.title,
    row.getValue(`month_${monthIndex}`)
  )
});

export const andonTableColumnsByMonth: ColumnDef<AndonByMonthDataDto, unknown>[] = [
  ...Array.from({ length: 6 }, (_, i) => createMonthColumn(i + 1))
];

const formatCellValue = (title: string, value: number): React.ReactNode => {
  const formatter = CELL_FORMATTERS[title];
  return formatter ? formatter(value) : String(value);
};
