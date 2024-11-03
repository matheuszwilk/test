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
  years: Record<string, number>;
}

const TARGET_RATE = 0.02;

const generateYearSeries = async (formattedDate: string) => {
  return await db.$queryRaw<{ year_number: string }[]>`
    SELECT TO_CHAR(generate_series(
      ${formattedDate}::date - interval '1 year',
      ${formattedDate}::date,
      '1 year'
    ), 'YYYY') AS year_number
    ORDER BY year_number
  `;
};

const buildLineFilters = (line?: string) => {
  const lineFilter = line && line !== 'All' 
    ? Prisma.sql`AND line = ${line}` 
    : Prisma.empty;
    
  const equipmentLineFilter = line && line !== 'All'
    ? Prisma.sql`AND equipment_line = ${line}`
    : Prisma.empty;

  return { lineFilter, equipmentLineFilter };
};

export const getAndonByYearData = async (
  targetYear: string, 
  line?: string
): Promise<AndonByYearDataDto[]> => {
  const formattedDate = `${targetYear}-01`;
  const { lineFilter, equipmentLineFilter } = buildLineFilters(line);

  const yearNumbers = await generateYearSeries(formattedDate);
  const yearNumbersArray = yearNumbers.map(y => y.year_number);

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
    final_data AS (
      SELECT
          cd.year,
          cd.man_hour,
          cd.andon_time,
          cd.andon_stop_qty,
          cd.instant_stop_rate,
          ${TARGET_RATE} AS target,
          CASE 
              WHEN ${TARGET_RATE} != 0 THEN (${TARGET_RATE} - cd.instant_stop_rate) / ${TARGET_RATE}
              ELSE 0 
          END AS achievement_rate
      FROM combined_data cd
    )
    SELECT title, years
    FROM (
      SELECT 
        metric.title,
        jsonb_object_agg(TO_CHAR(fd.year, 'YYYY'), 
          CASE 
            WHEN metric.title = 'Man Hour' THEN fd.man_hour
            WHEN metric.title = 'Andon' THEN fd.andon_time
            WHEN metric.title = 'Andon Stop Qty' THEN fd.andon_stop_qty
            WHEN metric.title = 'Target' THEN fd.target
            WHEN metric.title = 'Instant Stop Rate' THEN fd.instant_stop_rate
            WHEN metric.title = 'Achievement Rate' THEN fd.achievement_rate
          END
        ) AS years
      FROM final_data fd
      CROSS JOIN (
        VALUES 
          ('Man Hour', 1),
          ('Andon', 2),
          ('Andon Stop Qty', 3),
          ('Target', 4),
          ('Instant Stop Rate', 5),
          ('Achievement Rate', 6)
      ) AS metric(title, sort_order)
      GROUP BY metric.title, metric.sort_order
      ORDER BY metric.sort_order
    ) result_data
  `;

  const formattedResult: AndonByYearDataDto[] = result.map(item => ({
    title: item.title,
    year_1: item.years[yearNumbersArray[0]] || 0,
    year_2: item.years[yearNumbersArray[1]] || 0,
    year_numbers: yearNumbersArray
  }));

  revalidatePath('/');
  return formattedResult;
};
