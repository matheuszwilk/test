"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { AndonByYearDataDto } from "@/app/_data-access/andon/get-andon-by-year";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { Badge } from "@/app/_components/ui/badge";

export const andonTableColumnsByYear: ColumnDef<AndonByYearDataDto, unknown>[] =
  [
    {
      accessorKey: "title",
      header: "",
    },
    {
      accessorKey: "year_1",
      header: ({ table }) => (
        <strong>
          {table.getRowModel().rows[0]?.original.year_numbers?.[0] || "Year 1"}
        </strong>
      ),
      cell: ({ row }) =>
        formatCellValue(row.original.title, row.getValue("year_1")),
    },
    {
      accessorKey: "year_2",
      header: ({ table }) => (
        <strong>
          {table.getRowModel().rows[0]?.original.year_numbers?.[1] || "Year 2"}
        </strong>
      ),
      cell: ({ row }) =>
        formatCellValue(row.original.title, row.getValue("year_2")),
    },
  ];

const formatCellValue = (title: string, value: number) => {
  if (title === "Man Hour" || title === "Andon") {
    return `${Number(value).toFixed(0)}`;
  } else if (title === "Andon Stop Qty") {
    return String(value);
  } else if (title === "Target" || title === "Instant Stop Rate") {
    return (
      <Badge variant="outline">{`${(Number(value) * 100).toFixed(2)}%`}</Badge>
    );
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
