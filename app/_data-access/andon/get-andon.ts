"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

export interface AndonDataDto {
  title: string;
  week_1: number;
  week_2: number;
  week_3: number;
  week_4: number;
  week_5: number;
  week_numbers: string[];
}

export const getAndonData = async (
  targetMonth: string,
  line?: string,
): Promise<AndonDataDto[]> => {
  const [year, month] = targetMonth.split("-");
  const formattedDate = `${year}-${month.padStart(2, "0")}-2`;

  // Este código SQL gera os números das semanas para o mês especificado
  const weekNumbers = await db.$queryRaw<{ week_number: string }[]>`
    -- Seleciona os números das semanas distintos para o mês
    SELECT DISTINCT 
      -- Converte a data para o número da semana (formato 'WW')
      TO_CHAR(
        -- Trunca a data para o início da semana
        DATE_TRUNC('week', 
          -- Gera uma série de datas para o mês inteiro
          generate_series(
            ${formattedDate}::date, -- Data inicial (primeiro dia do mês)
            (${formattedDate}::date + interval '1 month - 2 day')::date, -- Data final (último dia do mês)
            '1 day' -- Intervalo de 1 dia
          )
        ), 
        'WW'
      ) AS week_number
    -- Ordena os números das semanas
    ORDER BY week_number
    -- Limita o resultado a 5 semanas (para cobrir meses que podem ter partes de 5 semanas)
    LIMIT 5
  `;

  const [week1, week2, week3, week4, week5] = weekNumbers.map(
    (w) => w.week_number,
  );

  const lineFilter =
    line && line !== "All" ? Prisma.sql`AND line = ${line}` : Prisma.empty;
  const equipmentLineFilter =
    line && line !== "All"
      ? Prisma.sql`AND equipment_line = ${line}`
      : Prisma.empty;

  const result = await db.$queryRaw<AndonDataDto[]>`
    WITH common_filter AS (
      SELECT ${formattedDate}::date AS target_month
    ),
    weekly_manhour AS (
      SELECT
        TO_CHAR(DATE_TRUNC('week', work_date), 'WW') AS week_number,
        SUM(total_working_time) AS total_work_time
      FROM
        manhour, common_filter
      WHERE
        TO_CHAR(work_date, 'YYYY-MM') = TO_CHAR(common_filter.target_month, 'YYYY-MM')
        ${lineFilter}
      GROUP BY
        TO_CHAR(DATE_TRUNC('week', work_date), 'WW')
    ),
    andon_data AS (
      SELECT
        'Andon' AS title,
        SUM(CASE WHEN TO_CHAR(DATE_TRUNC('week', "end"::date), 'WW') = ${week1} THEN andon_time ELSE 0 END) AS week_1,
        SUM(CASE WHEN TO_CHAR(DATE_TRUNC('week', "end"::date), 'WW') = ${week2} THEN andon_time ELSE 0 END) AS week_2,
        SUM(CASE WHEN TO_CHAR(DATE_TRUNC('week', "end"::date), 'WW') = ${week3} THEN andon_time ELSE 0 END) AS week_3,
        SUM(CASE WHEN TO_CHAR(DATE_TRUNC('week', "end"::date), 'WW') = ${week4} THEN andon_time ELSE 0 END) AS week_4,
        SUM(CASE WHEN TO_CHAR(DATE_TRUNC('week', "end"::date), 'WW') = ${week5} THEN andon_time ELSE 0 END) AS week_5
      FROM
        andon, common_filter
      WHERE
        TO_CHAR("end"::date, 'YYYY-MM') = TO_CHAR(common_filter.target_month, 'YYYY-MM')
        ${equipmentLineFilter}
    ),
    andon_stop_qty AS (
      SELECT
        'Andon Stop Qty' AS title,
        COUNT(CASE WHEN TO_CHAR(DATE_TRUNC('week', "end"::date), 'WW') = ${week1} THEN 1 END) AS week_1,
        COUNT(CASE WHEN TO_CHAR(DATE_TRUNC('week', "end"::date), 'WW') = ${week2} THEN 1 END) AS week_2,
        COUNT(CASE WHEN TO_CHAR(DATE_TRUNC('week', "end"::date), 'WW') = ${week3} THEN 1 END) AS week_3,
        COUNT(CASE WHEN TO_CHAR(DATE_TRUNC('week', "end"::date), 'WW') = ${week4} THEN 1 END) AS week_4,
        COUNT(CASE WHEN TO_CHAR(DATE_TRUNC('week', "end"::date), 'WW') = ${week5} THEN 1 END) AS week_5
      FROM
        andon, common_filter
      WHERE
        TO_CHAR("end"::date, 'YYYY-MM') = TO_CHAR(common_filter.target_month, 'YYYY-MM')
        ${equipmentLineFilter}
    ),
    manhour_data AS (
      SELECT
        'Man Hour' AS title,
        SUM(CASE WHEN week_number = ${week1} THEN total_work_time ELSE 0 END) AS week_1,
        SUM(CASE WHEN week_number = ${week2} THEN total_work_time ELSE 0 END) AS week_2,
        SUM(CASE WHEN week_number = ${week3} THEN total_work_time ELSE 0 END) AS week_3,
        SUM(CASE WHEN week_number = ${week4} THEN total_work_time ELSE 0 END) AS week_4,
        SUM(CASE WHEN week_number = ${week5} THEN total_work_time ELSE 0 END) AS week_5
      FROM
        weekly_manhour
    ),
    instant_stop_data AS (
      SELECT
        'Instant Stop Rate' AS title,
        CASE WHEN m.week_1 != 0 THEN (a.week_1 / 60.0 / m.week_1) ELSE 0 END AS week_1,
        CASE WHEN m.week_2 != 0 THEN (a.week_2 / 60.0 / m.week_2) ELSE 0 END AS week_2,
        CASE WHEN m.week_3 != 0 THEN (a.week_3 / 60.0 / m.week_3) ELSE 0 END AS week_3,
        CASE WHEN m.week_4 != 0 THEN (a.week_4 / 60.0 / m.week_4) ELSE 0 END AS week_4,
        CASE WHEN m.week_5 != 0 THEN (a.week_5 / 60.0 / m.week_5) ELSE 0 END AS week_5
      FROM andon_data a
      CROSS JOIN manhour_data m
    ),
    target_data AS (
      SELECT
        'Target' AS title,
        0.02 AS week_1,
        0.02 AS week_2,
        0.02 AS week_3,
        0.02 AS week_4,
        0.02 AS week_5
    ),
    wot_data AS (
      SELECT
        'Achievement Rate' AS title,
        CASE WHEN t.week_1 != 0 THEN (t.week_1 - i.week_1) / t.week_1 ELSE 0 END AS week_1,
        CASE WHEN t.week_2 != 0 THEN (t.week_2 - i.week_2) / t.week_2 ELSE 0 END AS week_2,
        CASE WHEN t.week_3 != 0 THEN (t.week_3 - i.week_3) / t.week_3 ELSE 0 END AS week_3,
        CASE WHEN t.week_4 != 0 THEN (t.week_4 - i.week_4) / t.week_4 ELSE 0 END AS week_4,
        CASE WHEN t.week_5 != 0 THEN (t.week_5 - i.week_5) / t.week_5 ELSE 0 END AS week_5
      FROM target_data t
      CROSS JOIN instant_stop_data i
    )
    SELECT title, week_1, week_2, week_3, week_4, week_5
    FROM (
      SELECT *, 1 AS sort_order FROM manhour_data
      UNION ALL
      SELECT *, 2 AS sort_order FROM andon_data
      UNION ALL
      SELECT *, 3 AS sort_order FROM andon_stop_qty
      UNION ALL
      SELECT *, 4 AS sort_order FROM target_data
      UNION ALL
      SELECT *, 5 AS sort_order FROM instant_stop_data
      UNION ALL
      SELECT *, 6 AS sort_order FROM wot_data
    ) combined_data
    ORDER BY sort_order, title
  `;

  const resultWithWeekNumbers = result.map((item) => ({
    ...item,
    week_numbers: [week1, week2, week3, week4, week5].filter(Boolean),
  }));

  revalidatePath("/andon");
  return resultWithWeekNumbers;
};
