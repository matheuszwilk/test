"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AndonAllDataDto } from "@/app/_data-access/andon/get-all-andon";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { Badge } from "@/app/_components/ui/badge";
import React from "react";

export const andonAllTableColumns: ColumnDef<AndonAllDataDto>[] = [
  {
    accessorKey: "title",
    header: "",
    cell: ({ row }) => <strong>{row.original.title}</strong>,
  },
  ...Array.from({ length: 53 }, (_, i) => {
    const weekNumber = (i + 1).toString().padStart(2, '0');
    return {
      accessorKey: `weeks.${weekNumber}`,
      header: () => <strong>W{weekNumber}</strong>,
      cell: ({ row }: { row: { original: AndonAllDataDto } }) => formatCellValue(row.original.title, row.original.weeks[weekNumber] || 0),
    };
  }),
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
