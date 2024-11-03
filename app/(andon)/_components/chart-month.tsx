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

interface ChartData {
  month: string;
  "Andon Stop Qty": number;
  Target: number;
  "Instant Stop Rate": number;
}

interface MonthData {
  title: string;
  month_1: number;
  month_2: number;
  month_3: number;
  month_4: number;
  month_5: number;
  month_6: number;
  month_numbers: string[];
}

interface ChartMonthProps {
  data: MonthData[];
}

const ChartMonth: React.FC<ChartMonthProps> = ({ data }) => {
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

  const transformData = (): ChartData[] => {
    return data[0].month_numbers.map((month, index) => {
      const monthKey = `month_${index + 1}` as keyof MonthData;
      return {
        month,
        "Andon Stop Qty": Number(data[2][monthKey]),
        Target: Number(data[3][monthKey]),
        "Instant Stop Rate": Number(data[4][monthKey]),
      };
    });
  };

  const formatTooltipValue = (value: number, name: string): string => {
    return name.includes("Rate") || name === "Target"
      ? `${(value * 100).toFixed(2)}%`
      : value.toLocaleString();
  };

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

  const renderAxes = () => (
    <>
      <XAxis
        dataKey="month"
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
    </>
  );

  const renderChartElements = () => (
    <>
      <Bar
        yAxisId="left"
        dataKey="Andon Stop Qty"
        fill="rgb(165, 0, 52)"
        radius={[4, 4, 0, 0]}
        barSize={40}
        name="Andon Stop Qty"
      />
      <Line
        yAxisId="right"
        type="natural"
        dataKey="Target"
        stroke="hsl(var(--chart-2))"
        strokeWidth={2}
        dot={{ fill: "rgb(255, 255, 255)" }}
        activeDot={{ r: 6 }}
        name="Target"
      />
      <Line
        yAxisId="right"
        type="natural"
        dataKey="Instant Stop Rate"
        stroke={isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)"}
        strokeWidth={2}
        dot={{ fill: "rgb(255, 255, 255)" }}
        activeDot={{ r: 6 }}
        name="Instant Stop Rate"
      />
    </>
  );

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={transformData()}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={chartStyles.grid.color}
            vertical={false}
          />
          {renderAxes()}
          <Tooltip content={renderTooltipContent} />
          {renderChartElements()}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartMonth;
