"use server";

import { db } from "@/app/_lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export interface DefectQtyAccDataDto {
  month: string;
  equipment_line: string;
  andon_process: string;
  total_andon_count: number;
  andon_porcent: number;
  andon_procent_acc: number;
}

export const getDefectQtyAccData = async (
  targetMonth: string,
  line?: string,
): Promise<DefectQtyAccDataDto[]> => {
  const lineFilter =
    line && line !== "All"
      ? Prisma.sql`AND equipment_line = ${line}`
      : Prisma.empty;

  const result = await db.$queryRaw<DefectQtyAccDataDto[]>`
    WITH top_andon AS (
      SELECT
        TO_CHAR("end"::date, 'YYYY-MM') AS month,
        equipment_line,
        andon_process,
        COUNT(*) AS total_andon_count
      FROM andon
      WHERE TO_CHAR("end"::date, 'YYYY-MM') = ${targetMonth}
      ${lineFilter}
      GROUP BY
        TO_CHAR("end"::date, 'YYYY-MM'),
        equipment_line,
        andon_process
      ORDER BY COUNT(*) DESC
      LIMIT 10
    ),
    total_count AS (
      SELECT SUM(total_andon_count) as total
      FROM top_andon
    ),
    andon_data AS (
      SELECT
        month,
        equipment_line,
        andon_process,
        CAST(total_andon_count AS integer) AS total_andon_count,
        CAST(ROUND(CAST((total_andon_count * 100.0 / total) AS numeric), 6) AS float) AS andon_porcent
      FROM
        top_andon, total_count
    )
    SELECT
      month,
      equipment_line,
      andon_process,
      total_andon_count,
      andon_porcent,
      LEAST(100, CAST(ROUND(CAST(SUM(andon_porcent) OVER (ORDER BY total_andon_count DESC) AS numeric), 6) AS float)) AS andon_procent_acc
    FROM
      andon_data
    ORDER BY
      total_andon_count DESC,
      month,
      andon_process,
      equipment_line
  `;

  revalidatePath("/andon");
  return result;
};
