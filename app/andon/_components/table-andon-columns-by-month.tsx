"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { Badge } from "@/app/_components/ui/badge";
import { AndonByMonthDataDto } from "@/app/_data-access/andon/get-andon-by-month";

export const andonTableColumnsByMonth: ColumnDef<AndonByMonthDataDto, unknown>[] = [
  {
    accessorKey: "month_1",
    header: ({ table }) => <strong>{table.getRowModel().rows[0]?.original.month_numbers?.[0] || 'Month 1'}</strong>,
    cell: ({ row }) => formatCellValue(row.original.title, row.getValue("month_1")),
  },
  {
    accessorKey: "month_2",
    header: ({ table }) => <strong>{table.getRowModel().rows[0]?.original.month_numbers?.[1] || 'Month 2'}</strong>,
    cell: ({ row }) => formatCellValue(row.original.title, row.getValue("month_2")),
  },
  {
    accessorKey: "month_3",
    header: ({ table }) => <strong>{table.getRowModel().rows[0]?.original.month_numbers?.[2] || 'Month 3'}</strong>,
    cell: ({ row }) => formatCellValue(row.original.title, row.getValue("month_3")),
  },
  {
    accessorKey: "month_4",
    header: ({ table }) => <strong>{table.getRowModel().rows[0]?.original.month_numbers?.[3] || 'Month 4'}</strong>,
    cell: ({ row }) => formatCellValue(row.original.title, row.getValue("month_4")),
  },
  {
    accessorKey: "month_5",
    header: ({ table }) => <strong>{table.getRowModel().rows[0]?.original.month_numbers?.[4] || 'Month 5'}</strong>,
    cell: ({ row }) => formatCellValue(row.original.title, row.getValue("month_5")),
  },
  {
    accessorKey: "month_6",
    header: ({ table }) => <strong>{table.getRowModel().rows[0]?.original.month_numbers?.[5] || 'Month 6'}</strong>,
    cell: ({ row }) => formatCellValue(row.original.title, row.getValue("month_6")),
  },
];

const formatCellValue = (title: string, value: number) => {
  if (title === "Man Hour" || title === "Andon") {
    return `${Number(value).toFixed(0)}`;
  } else if (title === "Andon Stop Qty") {
    return String(value);
  } else if (title === "Target" || title === "Instant Stop Rate") {
    return <Badge variant="outline">{`${(Number(value) * 100).toFixed(2)}%`}</Badge>;
  } else if (title === "Achievement Rate") {
    const formattedValue = `${(Number(value) * 100).toFixed(2)}%`;
    const isPositive = value >= 0;
    return (
      <div className="flex items-center justify-center">
        {formattedValue}
        {isPositive ? (
          <ArrowDownCircle className="ml-1 text-green-500" size={16} />
        ) : (
          <ArrowUpCircle className="ml-1 text-red-500" size={16} />
        )}
      </div>
    );
  }
  return String(value);
};
