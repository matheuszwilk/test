"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/app/_components/ui/badge";
import { AndonReportDataDto } from "@/app/_data-access/andon/get-report-data";
import { FileTextIcon } from "lucide-react";

export const defectReportColumns: ColumnDef<AndonReportDataDto>[] = [
  {
    accessorKey: "andon_process",
    header: "Process",
  },
  {
    accessorKey: "equipment_line", 
    header: "Line",
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "end_date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("end_date"));
      // Use Korean locale and format YYYY-MM-DD
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\. /g, '-').replace('.', '');
    }
  },
  {
    accessorKey: "cause_department",
    header: "Department",
  },
  {
    accessorKey: "andon_time",
    header: "Time (min)",
  },
  {
    accessorKey: "status",
    header: "Status", 
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const displayStatus = status === "OK" ? "Done" : "Waiting";
      return (
        <Badge variant={status === "OK" ? "default" : "secondary"}>
          {displayStatus}
        </Badge>
      );
    }
  },
  {
    accessorKey: "action_plan_file_url",
    header: "Action Plan",
    cell: ({ row }) => {
      const url = row.getValue("action_plan_file_url") as string;
      return url ? (
        <div className="flex justify-center">
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80">
            <FileTextIcon className="h-5 w-5" />
          </a>
        </div>
      ) : null;
    }
  }
];