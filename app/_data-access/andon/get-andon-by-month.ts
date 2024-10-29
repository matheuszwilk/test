"use server";

import { db } from "@/app/_lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export interface AndonByMonthDataDto {
  title: string;
  month_1: number;
  month_2: number;
  month_3: number;
  month_4: number;
  month_5: number;
  month_6: number;
  month_numbers: string[];
}

interface RawAndonData {
  title: string;
  months: { [key: string]: number };
}

export const getAndonByMonthData = async (
  targetMonth: string,
  line?: string,
): Promise<AndonByMonthDataDto[]> => {
  const formattedDate = `${targetMonth}-01`; // Use January of the target year

  // Generate the last 6 months of the year-month selected
  const monthNumbers = await db.$queryRaw<{ month_number: string }[]>`
    SELECT TO_CHAR(generate_series(
      ${formattedDate}::date - interval '5 months',
      ${formattedDate}::date,
      '1 month'
    ), 'YYYY-MM') AS month_number
    ORDER BY month_number
  `;

  const monthNumbersArray = monthNumbers.map((m) => m.month_number);

  const lineFilter =
    line && line !== "All" ? Prisma.sql`AND line = ${line}` : Prisma.empty;
  const equipmentLineFilter =
    line && line !== "All"
      ? Prisma.sql`AND equipment_line = ${line}`
      : Prisma.empty;

  const result = await db.$queryRaw<RawAndonData[]>`
    WITH common_filter AS (
      SELECT ${formattedDate}::date AS target_month
    ),
    months AS (
      SELECT generate_series(
          (SELECT DATE_TRUNC('month', target_month::date) - INTERVAL '5 months' FROM common_filter),
          (SELECT DATE_TRUNC('month', target_month::date) FROM common_filter),
          '1 month'::interval
      ) AS month
    ),
    monthly_manhour AS (
      SELECT
          DATE_TRUNC('month', work_date) AS month,
          SUM(total_working_time) AS total_work_time
      FROM
          manhour, common_filter
      WHERE
          work_date >= (SELECT MIN(month) FROM months)
          AND work_date < (SELECT MAX(month) FROM months) + INTERVAL '1 month'
          ${lineFilter}
      GROUP BY
          DATE_TRUNC('month', work_date)
    ),
    monthly_andon AS (
      SELECT
          DATE_TRUNC('month', "end"::date) AS month,
          SUM(andon_time) AS total_andon_time,
          COUNT(*) AS andon_stop_qty
      FROM
          andon, common_filter
      WHERE
          "end"::date >= (SELECT MIN(month) FROM months)
          AND "end"::date < (SELECT MAX(month) FROM months) + INTERVAL '1 month'
          ${equipmentLineFilter}
      GROUP BY
          DATE_TRUNC('month', "end"::date)
    ),
    combined_data AS (
      SELECT
          m.month,
          COALESCE(ma.total_work_time, 0) AS man_hour,
          COALESCE(a.total_andon_time, 0) AS andon_time,
          COALESCE(a.andon_stop_qty, 0) AS andon_stop_qty,
          CASE 
              WHEN COALESCE(ma.total_work_time, 0) != 0 
              THEN (COALESCE(a.total_andon_time, 0) / 60.0 / COALESCE(ma.total_work_time, 0))
              ELSE 0 
          END AS instant_stop_rate
      FROM
          months m
      LEFT JOIN monthly_manhour ma ON m.month = ma.month
      LEFT JOIN monthly_andon a ON m.month = a.month
    ),
    target_data AS (
      SELECT
          month,
          0.02 AS target
      FROM months
    ),
    final_data AS (
      SELECT
          cd.month,
          cd.man_hour,
          cd.andon_time,
          cd.andon_stop_qty,
          cd.instant_stop_rate,
          td.target,
          CASE 
              WHEN td.target != 0 THEN (td.target - cd.instant_stop_rate) / td.target
              ELSE 0 
          END AS achievement_rate
      FROM combined_data cd
      JOIN target_data td ON cd.month = td.month
    ),
    result_data AS (
      SELECT 
          'Man Hour' AS title, 
          1 AS sort_order,
          jsonb_object_agg(TO_CHAR(month, 'YYYY-MM'), man_hour) AS months
      FROM final_data
      
      UNION ALL
      
      SELECT 
          'Andon' AS title, 
          2 AS sort_order,
          jsonb_object_agg(TO_CHAR(month, 'YYYY-MM'), andon_time) AS months
      FROM final_data
      
      UNION ALL
      
      SELECT 
          'Andon Stop Qty' AS title, 
          3 AS sort_order,
          jsonb_object_agg(TO_CHAR(month, 'YYYY-MM'), andon_stop_qty) AS months
      FROM final_data
      
      UNION ALL
      
      SELECT 
          'Target' AS title, 
          4 AS sort_order,
          jsonb_object_agg(TO_CHAR(month, 'YYYY-MM'), target) AS months
      FROM final_data
      
      UNION ALL
      
      SELECT 
          'Instant Stop Rate' AS title, 
          5 AS sort_order,
          jsonb_object_agg(TO_CHAR(month, 'YYYY-MM'), instant_stop_rate) AS months
      FROM final_data
      
      UNION ALL
      
      SELECT 
          'Achievement Rate' AS title, 
          6 AS sort_order,
          jsonb_object_agg(TO_CHAR(month, 'YYYY-MM'), achievement_rate) AS months
      FROM final_data
    )
    SELECT 
      title,
      months
    FROM 
      result_data
    ORDER BY 
      sort_order
  `;

  const formattedResult: AndonByMonthDataDto[] = result.map((item) => ({
    title: item.title,
    month_1: item.months[monthNumbersArray[0]] || 0,
    month_2: item.months[monthNumbersArray[1]] || 0,
    month_3: item.months[monthNumbersArray[2]] || 0,
    month_4: item.months[monthNumbersArray[3]] || 0,
    month_5: item.months[monthNumbersArray[4]] || 0,
    month_6: item.months[monthNumbersArray[5]] || 0,
    month_numbers: monthNumbersArray,
  }));

  revalidatePath("/andon");
  return formattedResult;
};
