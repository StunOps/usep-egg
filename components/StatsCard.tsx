"use client";

import { ReactNode } from "react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export default function StatsCard({ label, value, icon, trend, trendUp, className = "" }: StatsCardProps) {
  return (
    <div className={`card flex items-start justify-between ${className}`}>
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value mt-1 animate-count-up">{value}</p>
        {trend && (
          <p className={`text-xs font-medium mt-1 ${trendUp ? "text-green-600" : "text-red-500"}`}>
            {trendUp ? "↑" : "↓"} {trend}
          </p>
        )}
      </div>
      <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
        {icon}
      </div>
    </div>
  );
}
