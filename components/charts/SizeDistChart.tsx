"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { EggSize } from "@/lib/storage";
import { sizeColor } from "@/lib/utils";

interface SizeDistChartProps {
  data: Record<EggSize, number>;
}

export default function SizeDistChart({ data }: SizeDistChartProps) {
  const chartData = Object.entries(data).map(([size, count]) => ({
    size,
    count: Number(count) || 0,
    color: sizeColor(size as EggSize),
  }));

  return (
    <div className="card">
      <h3 className="font-semibold text-slate-900 mb-4">Egg Size Distribution</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="size"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07)",
                padding: "8px 14px",
              }}
              labelStyle={{ fontWeight: 600, color: "#1e293b" }}
              cursor={{ fill: "rgba(245,158,11,0.05)" }}
              formatter={(value: number) => [String(value ?? 0), "Eggs"]}
            />
            <Bar
              dataKey="count"
              name="Eggs"
              radius={[8, 8, 0, 0]}
              barSize={48}
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
