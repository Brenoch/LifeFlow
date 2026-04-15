"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface WeeklyChartProps {
  data: Array<{
    name: string;
    percentual: number;
    completas?: number;
    planejadas?: number;
  }>;
  height?: number;
}

export function WeeklyChart({ data, height = 260 }: WeeklyChartProps) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer height="100%" width="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="weeklyChartFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#43dce7" stopOpacity={0.38} />
              <stop offset="95%" stopColor="#43dce7" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(174,180,192,0.13)" vertical={false} />
          <XAxis axisLine={false} dataKey="name" tick={{ fill: "#aeb4c0", fontSize: 12 }} tickLine={false} />
          <YAxis axisLine={false} domain={[0, 100]} tick={{ fill: "#aeb4c0", fontSize: 12 }} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "#17191d",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8,
              color: "#f7f7f2",
            }}
          />
          <Area
            dataKey="percentual"
            fill="url(#weeklyChartFill)"
            stroke="#43dce7"
            strokeWidth={3}
            type="monotone"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
