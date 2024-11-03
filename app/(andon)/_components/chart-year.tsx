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

interface YearData {
  title: string;
  year_1: number;
  year_2: number;
  year_numbers: string[];
}

interface ChartData {
  year: string;
  "Andon Stop Qty": number;
  Target: number;
  "Instant Stop Rate": number;
}

interface ChartYearProps {
  data: YearData[];
}

const ChartYear: React.FC<ChartYearProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const chartStyles = {
    text: {
      color: isDark ? "hsl(var(--muted-foreground))" : "hsl(var(--foreground))",
    },
    grid: {
      color: "hsl(var(--border))",
    },
    tooltip: {
      background: isDark ? "hsl(var(--background))" : "white",
      border: "1px solid hsl(var(--border))",
      text: isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
    },
  };

  const formatTooltipValue = (value: number, name: string): string => {
    return name.includes("Rate") || name === "Target"
      ? `${(value * 100).toFixed(2)}%`
      : value.toLocaleString();
  };

  const chartData: ChartData[] = data[0].year_numbers.map((year, index) => {
    const yearKey = `year_${index + 1}` as const;
    return {
      year,
      "Andon Stop Qty": Number(data[2][yearKey as keyof YearData]),
      Target: Number(data[3][yearKey as keyof YearData]),
      "Instant Stop Rate": Number(data[4][yearKey as keyof YearData]),
    };
  });

  const renderTooltipContent = (props: TooltipProps<number, string>) => {
    const { payload, label } = props;
    if (!payload) return null;

    return (
      <div
        style={{
          backgroundColor: chartStyles.tooltip.background,
          border: chartStyles.tooltip.border,
          borderRadius: "8px",
          padding: "8px 12px",
          boxShadow: "0 4px 12px rgba(255, 0, 81, 0.15)",
          backdropFilter: "blur(8px)",
        }}
      >
        <p
          style={{
            color: chartStyles.tooltip.text,
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
          <div key={entry.name} style={{ fontSize: "12px" }}>
            <span style={{ color: entry.color || chartStyles.tooltip.text }}>
              {entry.name}: {formatTooltipValue(entry.value as number, entry.name || '')}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer>
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={chartStyles.grid.color}
            vertical={false}
          />
          <XAxis
            dataKey="year"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fill: chartStyles.text.color, fontSize: 12 }}
          />
          <YAxis
            yAxisId="left"
            stroke={chartStyles.text.color}
            tick={{ fill: chartStyles.text.color, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke={chartStyles.text.color}
            tick={{ fill: chartStyles.text.color, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={renderTooltipContent} />
          <Bar
            yAxisId="left"
            dataKey="Andon Stop Qty"
            fill="rgb(165, 0, 52)"
            radius={[4, 4, 0, 0]}
            barSize={40}
          />
          <Line
            yAxisId="right"
            type="natural"
            dataKey="Target"
            stroke="hsl(var(--chart-2))"
            strokeWidth={2}
            dot={{ fill: "rgb(255, 255, 255)" }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="right"
            type="natural"
            dataKey="Instant Stop Rate"
            stroke={isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)"}
            strokeWidth={2}
            dot={{ fill: "rgb(255, 255, 255)" }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartYear;
