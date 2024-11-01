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
} from "recharts";
import { useTheme } from "next-themes";

interface ChartYearProps {
  data: {
    title: string;
    year_1: number;
    year_2: number;
    year_numbers: string[];
  }[];
}

const ChartYear = ({ data }: ChartYearProps) => {
  const { theme } = useTheme();

  const chartData = data[0].year_numbers.map((year, index) => {
    const yearKey = `year_${index + 1}`;
    return {
      year,
      "Andon Stop Qty": data[2][yearKey as keyof (typeof data)[2]],
      Target: data[3][yearKey as keyof (typeof data)[3]],
      "Instant Stop Rate": data[4][yearKey as keyof (typeof data)[4]],
    };
  });

  const isDark = theme === "dark";

  const textColor = isDark
    ? "hsl(var(--muted-foreground))"
    : "hsl(var(--foreground))";
  const gridColor = isDark ? "hsl(var(--border))" : "hsl(var(--border))";

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={gridColor}
            vertical={false}
          />
          <XAxis
            dataKey="year"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fill: textColor, fontSize: 12 }}
          ></XAxis>
          <YAxis
            yAxisId="left"
            stroke={textColor}
            tick={{ fill: textColor, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          ></YAxis>
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke={textColor}
            tick={{ fill: textColor, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          ></YAxis>
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "hsl(var(--background))" : "white",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              padding: "8px 12px",
              boxShadow: "0 4px 12px rgba(255, 0, 81, 0.15)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              transition: "all 0.2s ease",
            }}
            labelStyle={{
              color: isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
              fontWeight: 300,
              fontSize: "12px",
              marginBottom: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
            formatter={(value: number, name: string) => {
              const formattedValue =
                name.includes("Rate") || name === "Target"
                  ? `${(value * 100).toFixed(2)}%`
                  : value.toLocaleString();

              return [
                <span
                  style={{
                    color: isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
                    fontWeight: 300,
                    fontSize: "12px",
                  }}
                  key={name}
                >
                  {formattedValue}
                </span>,
                name,
              ];
            }}
            separator=": "
            wrapperStyle={{
              outline: "none",
              opacity: 0.95,
              fontSize: "12px",
              color: isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
            }}
            cursor={{ strokeWidth: 1 }}
          />
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
            dot={{
              fill: "rgb(255, 255, 255)",
            }}
            activeDot={{
              r: 6,
            }}
            name="Target"
          />
          <Line
            yAxisId="right"
            type="natural"
            dataKey="Instant Stop Rate"
            stroke={isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)"}
            strokeWidth={2}
            dot={{
              fill: "rgb(255, 255, 255)",
            }}
            activeDot={{
              r: 6,
            }}
            name="Instant Stop Rate"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartYear;
