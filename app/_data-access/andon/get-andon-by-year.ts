'use server';

import { db } from "@/app/_lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export interface AndonByYearDataDto {
  title: string;
  year_1: number;
  year_2: number;
  year_numbers: string[];
}

interface RawAndonData {
  title: string;
  years: { [key: string]: number };
}

export const getAndonByYearData = async (targetYear: string, line?: string): Promise<AndonByYearDataDto[]> => {
  // Modificar para usar o primeiro dia do mês
  const formattedDate = `${targetYear}-01`; // Adicionado -01 para dia

  // Generate the last 2 years of the year selected
  const yearNumbers = await db.$queryRaw<{ year_number: string }[]>`
    SELECT TO_CHAR(generate_series(
      ${formattedDate}::date - interval '1 year',
      ${formattedDate}::date,
      '1 year'
    ), 'YYYY') AS year_number
    ORDER BY year_number
  `;

  const yearNumbersArray = yearNumbers.map(y => y.year_number);

  const lineFilter = line && line !== 'All' ? Prisma.sql`AND line = ${line}` : Prisma.empty;
  const equipmentLineFilter = line && line !== 'All' ? Prisma.sql`AND equipment_line = ${line}` : Prisma.empty;

  const result = await db.$queryRaw<RawAndonData[]>`
    WITH common_filter AS (
      SELECT ${formattedDate}::date AS target_year
    ),
    years AS (
      SELECT generate_series(
          (SELECT DATE_TRUNC('year', target_year::date) - INTERVAL '1 year' FROM common_filter),
          (SELECT DATE_TRUNC('year', target_year::date) FROM common_filter),
          '1 year'::interval
      ) AS year
    ),
    yearly_manhour AS (
      SELECT
          DATE_TRUNC('year', work_date) AS year,
          SUM(total_working_time) AS total_work_time
      FROM
          manhour, common_filter
      WHERE
          work_date >= (SELECT MIN(year) FROM years)
          AND work_date < (SELECT MAX(year) FROM years) + INTERVAL '1 year'
          ${lineFilter}
      GROUP BY
          DATE_TRUNC('year', work_date)
    ),
    yearly_andon AS (
      SELECT
          DATE_TRUNC('year', "end"::date) AS year,
          SUM(andon_time) AS total_andon_time,
          COUNT(*) AS andon_stop_qty
      FROM
          andon, common_filter
      WHERE
          "end"::date >= (SELECT MIN(year) FROM years)
          AND "end"::date < (SELECT MAX(year) FROM years) + INTERVAL '1 year'
          ${equipmentLineFilter}
      GROUP BY
          DATE_TRUNC('year', "end"::date)
    ),
    combined_data AS (
      SELECT
          y.year,
          COALESCE(ym.total_work_time, 0) AS man_hour,
          COALESCE(ya.total_andon_time, 0) AS andon_time,
          COALESCE(ya.andon_stop_qty, 0) AS andon_stop_qty,
          CASE 
              WHEN COALESCE(ym.total_work_time, 0) != 0 
              THEN (COALESCE(ya.total_andon_time, 0) / 60.0 / COALESCE(ym.total_work_time, 0))
              ELSE 0 
          END AS instant_stop_rate
      FROM
          years y
      LEFT JOIN yearly_manhour ym ON y.year = ym.year
      LEFT JOIN yearly_andon ya ON y.year = ya.year
    ),
    target_data AS (
      SELECT
          year,
          0.02 AS target
      FROM years
    ),
    final_data AS (
      SELECT
          cd.year,
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
      JOIN target_data td ON cd.year = td.year
    ),
    result_data AS (
      SELECT 
          'Man Hour' AS title, 
          1 AS sort_order,
          jsonb_object_agg(TO_CHAR(year, 'YYYY'), man_hour) AS years
      FROM final_data
      
      UNION ALL
      
      SELECT 
          'Andon' AS title, 
           2 AS sort_order,
          jsonb_object_agg(TO_CHAR(year, 'YYYY'), andon_time) AS years
      FROM final_data
      
      UNION ALL
      
      SELECT 
          'Andon Stop Qty' AS title, 
           3 AS sort_order,
          jsonb_object_agg(TO_CHAR(year, 'YYYY'), andon_stop_qty) AS years
      FROM final_data
      
      UNION ALL
      
      SELECT 
          'Target' AS title, 
           4 AS sort_order,
          jsonb_object_agg(TO_CHAR(year, 'YYYY'), target) AS years
      FROM final_data
      
      UNION ALL
      
      SELECT 
          'Instant Stop Rate' AS title, 
           5 AS sort_order,
          jsonb_object_agg(TO_CHAR(year, 'YYYY'), instant_stop_rate) AS years
      FROM final_data
      
      UNION ALL
      
      SELECT 
          'Achievement Rate' AS title, 
           6 AS sort_order,
          jsonb_object_agg(TO_CHAR(year, 'YYYY'), achievement_rate) AS years
      FROM final_data
    )
    SELECT 
      title,
      years
    FROM 
      result_data
    ORDER BY 
      sort_order
  `;

  const formattedResult: AndonByYearDataDto[] = result.map(item => ({
    title: item.title,
    year_1: item.years[yearNumbersArray[0]] || 0,
    year_2: item.years[yearNumbersArray[1]] || 0,
    year_numbers: yearNumbersArray
  }));

  revalidatePath('/andon');
  return formattedResult;
};
