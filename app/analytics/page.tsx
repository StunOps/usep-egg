"use client";

import { useEffect, useState } from "react";
import {
  getCameras,
  getEggs,
  seedSampleData,
  Camera,
  EggRecord,
} from "@/lib/storage";
import {
  countBySize,
  countByDate,
  getDateNDaysAgo,
} from "@/lib/utils";
import StatsCard from "@/components/StatsCard";
import ProductionChart from "@/components/charts/ProductionChart";
import SizeDistChart from "@/components/charts/SizeDistChart";
import DateCompChart from "@/components/charts/DateCompChart";
import { Egg, TrendingUp, Calendar, BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [eggs, setEggs] = useState<EggRecord[]>([]);
  const [mounted, setMounted] = useState(false);
  const [range, setRange] = useState<7 | 30 | 90>(30);

  useEffect(() => {
    seedSampleData();
    setCameras(getCameras());
    setEggs(getEggs());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const startDate = getDateNDaysAgo(range);
  const rangeEggs = eggs.filter((e) => e.date >= startDate);

  const totalEggs = rangeEggs.length;
  const daysWithData = new Set(rangeEggs.map((e) => e.date)).size;
  const avgPerDay = daysWithData > 0 ? (totalEggs / daysWithData).toFixed(1) : "0";
  const sizeCounts = countBySize(rangeEggs);
  const dailyCounts = countByDate(rangeEggs);

  // Dominant size
  const dominantSize = Object.entries(sizeCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">
            Egg production statistics and trends
          </p>
        </div>
        {/* Range Toggle */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {([7, 30, 90] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                range === r
                  ? "bg-white text-primary-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          label="Total Eggs"
          value={totalEggs}
          icon={<Egg className="w-5 h-5" />}
          className="animate-fade-in-up stagger-1"
        />
        <StatsCard
          label="Avg / Day"
          value={avgPerDay}
          icon={<TrendingUp className="w-5 h-5" />}
          className="animate-fade-in-up stagger-2"
        />
        <StatsCard
          label="Days Tracked"
          value={daysWithData}
          icon={<Calendar className="w-5 h-5" />}
          className="animate-fade-in-up stagger-3"
        />
        <StatsCard
          label="Top Size"
          value={dominantSize ? dominantSize[0] : "—"}
          icon={<BarChart3 className="w-5 h-5" />}
          className="animate-fade-in-up stagger-4"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="animate-fade-in-up stagger-1">
          <ProductionChart data={dailyCounts} />
        </div>
        <div className="animate-fade-in-up stagger-2">
          <SizeDistChart data={sizeCounts} />
        </div>
      </div>

      <div className="animate-fade-in-up stagger-3">
        <DateCompChart eggs={rangeEggs} />
      </div>
    </div>
  );
}
