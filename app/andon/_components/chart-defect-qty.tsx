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
import { DefectQtyAccDataDto } from "../../_data-access/andon/get-defect-acc-by-qty";

interface ChartDefectProps {
  data: DefectQtyAccDataDto[];
}

const ChartDefectByQty = ({ data }: ChartDefectProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Convert BigInt and Decimal values to numbers before passing to chart
  const formattedData = data.map((item) => ({
    month: item.month,
    equipment_line: item.equipment_line,
    andon_process: item.andon_process,
    total_andon_count: Number(item.total_andon_count), // Convert BigInt to number
    andon_porcent: parseFloat(item.andon_porcent.toString()),
    andon_procent_acc: parseFloat(item.andon_procent_acc.toString()),
  }));

  const textColor = isDark
    ? "hsl(var(--muted-foreground))"
    : "hsl(var(--foreground))";
  const gridColor = isDark ? "hsl(var(--border))" : "hsl(var(--border))";

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={formattedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={gridColor}
            vertical={false}
          />
          <XAxis
            dataKey="andon_process"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fill: textColor, fontSize: 12 }}
          />
          <YAxis
            yAxisId="left"
            stroke={textColor}
            tick={{ fill: textColor, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke={textColor}
            tick={{ fill: textColor, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
          />
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
                name === "andon_procent_acc"
                  ? `${value.toFixed(2)}%`
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
                name === "total_andon_count" ? "Total Qty" : "Defect Index %",
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
            dataKey="total_andon_count"
            fill="rgb(165, 0, 52)"
            radius={[4, 4, 0, 0]}
            barSize={40}
            name="total_andon_count"
          />
          <Line
            yAxisId="right"
            type="natural"
            dataKey="andon_procent_acc"
            stroke={isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)"}
            strokeWidth={2}
            dot={{
              fill: "rgb(255, 255, 255)",
            }}
            activeDot={{
              r: 6,
            }}
            name="andon_procent_acc"
            label={{
              position: "top",
              fill: isDark ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
              fontSize: 12,
              formatter: (value: number) => `${value.toFixed(2)}%`,
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartDefectByQty;
