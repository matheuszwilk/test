'use client';

import React from 'react';
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Label,
  Tooltip
} from 'recharts';
import { useTheme } from 'next-themes';

interface ChartWeekProps {
  data: {
    title: string;
    week_1: number;
    week_2: number;
    week_3: number;
    week_4: number;
    week_5: number;
    week_numbers: string[];
  }[];
}

const ChartWeek = ({ data }: ChartWeekProps) => {
  const { theme } = useTheme();
  
  const chartData = data[0].week_numbers.map((week, index) => {
    const weekKey = `week_${index + 1}`;
    return {
      week,
      'Andon Stop Qty': data[2][weekKey as keyof typeof data[2]],
      'Target': data[3][weekKey as keyof typeof data[3]],
      'Instant Stop Rate': data[4][weekKey as keyof typeof data[4]]
    };
  });

  const isDark = theme === 'dark';
  
  const textColor = isDark ? 'hsl(var(--muted-foreground))' : 'hsl(var(--foreground))';
  const gridColor = isDark ? 'hsl(var(--border))' : 'hsl(var(--border))';

  return (
    <div className="w-full h-[250px]">
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
            dataKey="week" 
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fill: textColor, fontSize: 12 }}
          >
            <Label value="Week" position="bottom" style={{ fill: textColor, paddingTop: 20 }} />
          </XAxis>
          <YAxis 
            yAxisId="left" 
            stroke={textColor}
            tick={{ fill: textColor, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          >
            <Label value="Quantidade de Paradas" angle={-90} position="insideLeft" style={{ fill: textColor }} />
          </YAxis>
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke={textColor}
            tick={{ fill: textColor, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          >
            <Label value="Taxa (%)" angle={90} position="insideRight" style={{ fill: textColor }} />
          </YAxis>
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? 'hsl(var(--background))' : 'white',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
            labelStyle={{ color: textColor }}
          />
          <Bar
            yAxisId="left"
            dataKey="Andon Stop Qty"
            fill="rgb(165, 0, 52)"
            radius={[4, 4, 0, 0]}
            barSize={40}
            name="Quantidade de Paradas"
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
            name="Meta"
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
            name="Taxa de Parada Instantânea"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartWeek;
