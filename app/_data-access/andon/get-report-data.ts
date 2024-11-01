"use server";

import { db } from "@/app/_lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export interface AndonReportDataDto {
  id: string;
  year_month: string;
  andon_process: string;
  equipment_line: string;
  reason: string;
  end_date: Date;
  cause_department: string;
  andon_time: number;
  createdat: Date;
  status: string;
  action_plan_file_url: string | null;
}

export const getAndonReportData = async (
  targetMonth: string,
  line?: string,
): Promise<AndonReportDataDto[]> => {
  const equipmentLineFilter =
    line && line !== "All"
      ? Prisma.sql`AND equipment_line = ${line}`
      : Prisma.empty;

  const result = await db.$queryRaw<AndonReportDataDto[]>`
    SELECT 
      id,
      year_month,
      andon_process,
      equipment_line,
      reason,
      end_date,
      cause_department,
      andon_time,
      createdat,
      status,
      action_plan_file_url
    FROM public.andon_monthly_top_defects
    WHERE year_month = ${targetMonth}
    ${equipmentLineFilter}
    ORDER BY year_month ASC, andon_time DESC
    LIMIT 5
  `;

  revalidatePath("/andon");
  return result;
};
