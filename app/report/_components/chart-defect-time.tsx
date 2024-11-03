"use client";

import React from "react";
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts";
import { useTheme } from "next-themes";
import { DefectAccDataDto } from "@/app/_data-access/andon/report/get-defect-acc-by-time";

interface ChartDefectProps {
  data: DefectAccDataDto[];
}

interface FormattedChartData {
  month: string;
  equipment_line: string;
  andon_process: string;
  total_andon_time: number;
  andon_porcent: number;
  andon_procent_acc: number;
}

const ChartDefectByTime: React.FC<ChartDefectProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const formatData = (rawData: DefectAccDataDto[]): FormattedChartData[] => {
    return rawData.map((item) => ({
      month: item.month,
      equipment_line: item.equipment_line,
      andon_process: item.andon_process,
      total_andon_time: Number(item.total_andon_time),
      andon_porcent: parseFloat(item.andon_porcent.toString()),
      andon_procent_acc: parseFloat(item.andon_procent_acc.toString()),
    }));
  };

  const getThemeColors = () => ({
    text: isDark ? "hsl(var(--muted-foreground))" : "hsl(var(--foreground))",
    grid: isDark ? "hsl(var(--border))" : "hsl(var(--border))",
    background: isDark ? "hsl(var(--background))" : "white",
    stroke: isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
  });

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (!active || !payload || !payload.length) return null;

    const colors = getThemeColors();

    return (
      <div
        style={{
          backgroundColor: colors.background,
          border: "1px solid hsl(var(--border))",
          borderRadius: "8px",
          padding: "8px 12px",
          boxShadow: "0 4px 12px rgba(255, 0, 81, 0.15)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <p
          style={{
            color: colors.text,
            fontWeight: 300,
            fontSize: "12px",
            marginBottom: "4px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          {label}
        </p>
        {payload.map((entry) => (
          <p
            key={entry.name}
            style={{
              color: colors.text,
              fontWeight: 300,
              fontSize: "12px",
            }}
          >
            {entry.name === "total_andon_time" ? "Tempo Total" : "Acumulado %"}:{" "}
            {entry.name === "andon_procent_acc"
              ? `${entry.value?.toFixed(2)}%`
              : entry.value?.toLocaleString()}
          </p>
        ))}
      </div>
    );
  };

  const colors = getThemeColors();
  const formattedData = formatData(data);

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={formattedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={colors.grid}
            vertical={false}
          />
          <XAxis
            dataKey="andon_process"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fill: colors.text, fontSize: 12 }}
          />
          <YAxis
            yAxisId="left"
            stroke={colors.text}
            tick={{ fill: colors.text, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke={colors.text}
            tick={{ fill: colors.text, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            yAxisId="left"
            dataKey="total_andon_time"
            fill="rgb(165, 0, 52)"
            radius={[4, 4, 0, 0]}
            barSize={40}
            name="total_andon_time"
          />
          <Line
            yAxisId="right"
            type="natural"
            dataKey="andon_procent_acc"
            stroke={colors.stroke}
            strokeWidth={2}
            dot={{ fill: "rgb(255, 255, 255)" }}
            activeDot={{ r: 6 }}
            name="andon_procent_acc"
            label={{
              position: "top",
              fill: colors.stroke,
              fontSize: 12,
              formatter: (value: number) => `${value.toFixed(2)}%`,
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartDefectByTime;
