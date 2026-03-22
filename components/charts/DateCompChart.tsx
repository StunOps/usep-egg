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
import { EggRecord } from "@/lib/storage";
import { formatShortDate } from "@/lib/utils";

interface DateCompChartProps {
  eggs: EggRecord[];
}

export default function DateCompChart({ eggs }: DateCompChartProps) {
  // Aggregate eggs by date
  const dateMap = new Map<string, number>();
  eggs.forEach((e) => {
    dateMap.set(e.date, (dateMap.get(e.date) || 0) + 1);
  });

  const chartData = Array.from(dateMap.entries())
    .map(([date, count]) => ({
      date,
      label: formatShortDate(date),
      count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Color bars based on value — higher = brighter amber
  const maxCount = Math.max(...chartData.map((d) => d.count), 1);

  return (
    <div className="card">
      <h3 className="font-semibold text-slate-900 mb-1">Daily Comparison</h3>
      <p className="text-xs text-slate-400 mb-4">
        How many eggs were produced each day
      </p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
              interval={chartData.length > 15 ? 2 : 0}
              angle={chartData.length > 15 ? -45 : 0}
              textAnchor={chartData.length > 15 ? "end" : "middle"}
              height={chartData.length > 15 ? 50 : 30}
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
            />
            <Bar dataKey="count" name="Eggs" radius={[6, 6, 0, 0]} barSize={chartData.length > 20 ? 14 : 28}>
              {chartData.map((entry, index) => {
                const intensity = 0.3 + (entry.count / maxCount) * 0.7;
                return (
                  <Cell
                    key={index}
                    fill={`rgba(245,158,11,${intensity})`}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
