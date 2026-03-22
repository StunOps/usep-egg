"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { formatShortDate } from "@/lib/utils";

interface ProductionChartProps {
  data: { date: string; count: number }[];
}

export default function ProductionChart({ data }: ProductionChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    label: formatShortDate(d.date),
  }));

  return (
    <div className="card">
      <h3 className="font-semibold text-slate-900 mb-4">Daily Egg Production</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formatted} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorEggs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="label"
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
              itemStyle={{ color: "#f59e0b" }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#f59e0b"
              strokeWidth={2.5}
              fill="url(#colorEggs)"
              name="Eggs"
              dot={{ r: 3, fill: "#f59e0b", stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 5, fill: "#f59e0b", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
