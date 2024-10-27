"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AndonDataDto } from "@/app/_data-access/andon/get-andon";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

export const andonTableColumns: ColumnDef<AndonDataDto>[] = [
  {
    accessorKey: "title",
    header: "",
  },
  {
    accessorKey: "week_2",
    header: ({ table }) => `W${table.getRowModel().rows[0]?.original.week_numbers[1] || '2'}`,
    cell: ({ row }) => formatCellValue(row.original.title, row.original.week_2),
  },
  {
    accessorKey: "week_3",
    header: ({ table }) => `W${table.getRowModel().rows[0]?.original.week_numbers[2] || '3'}`,
    cell: ({ row }) => formatCellValue(row.original.title, row.original.week_3),
  },
  {
    accessorKey: "week_4",
    header: ({ table }) => `W${table.getRowModel().rows[0]?.original.week_numbers[3] || '4'}`,
    cell: ({ row }) => formatCellValue(row.original.title, row.original.week_4),
  },
  {
    accessorKey: "week_5",
    header: ({ table }) => `W${table.getRowModel().rows[0]?.original.week_numbers[4] || '5'}`,
    cell: ({ row }) => formatCellValue(row.original.title, row.original.week_5),
  },
];

const formatCellValue = (title: string, value: number) => {
  if (title === "Man Hour" || title === "Andon") {
    return `${(Number(value)).toFixed(0)}`;
  } else if (title === "Andon Stop Qty") {
    return String(value);
  } else if (title === "Target" || title === "Instant Stop Rate") {
    return `${(Number(value) * 100).toFixed(2)}%`;
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
