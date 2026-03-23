"use client";

import { useEffect, useState, useMemo } from "react";
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
  getTodayStr,
  getDateNDaysAgo,
  formatShortDate,
} from "@/lib/utils";
import StatsCard from "@/components/StatsCard";
import ProductionChart from "@/components/charts/ProductionChart";
import SizeDistChart from "@/components/charts/SizeDistChart";
import DateCompChart from "@/components/charts/DateCompChart";
import { Egg, TrendingUp, BarChart3, CalendarDays, Camera as CamIcon } from "lucide-react";

export default function DashboardPage() {
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

  const today = useMemo(() => getTodayStr(), []);
  const todayEggs = useMemo(() => eggs.filter((e) => e.date === today), [eggs, today]);

  // Filter eggs by selected range
  const startDate = useMemo(() => getDateNDaysAgo(range), [range]);
  const rangeEggs = useMemo(() => eggs.filter((e) => e.date >= startDate), [eggs, startDate]);

  const sizeCounts = useMemo(() => countBySize(rangeEggs), [rangeEggs]);
  const dailyCounts = useMemo(() => countByDate(rangeEggs), [rangeEggs]);

  // Best day
  const bestDay = useMemo(() => {
    if (dailyCounts.length === 0) return null;
    return dailyCounts.reduce((best, d) => (d.count > best.count ? d : best), dailyCounts[0]);
  }, [dailyCounts]);

  // Dominant size
  const dominantSize = useMemo(
    () => Object.entries(sizeCounts).sort((a, b) => b[1] - a[1])[0],
    [sizeCounts]
  );

  // Avg per day
  const daysWithData = useMemo(() => new Set(rangeEggs.map((e) => e.date)).size, [rangeEggs]);
  const avgPerDay = useMemo(
    () => (daysWithData > 0 ? (rangeEggs.length / daysWithData).toFixed(1) : "0"),
    [rangeEggs, daysWithData]
  );

  // Camera info
  const camera = cameras.length > 0 ? cameras[0] : null;

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Egg production overview and analytics
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

      {/* Camera Info Bar */}
      {camera && (
        <div className="card mb-6 animate-fade-in-up flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
              <CamIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Camera 1</h3>
              <p className="text-xs text-slate-400">{camera.label}</p>
            </div>
          </div>
          <div className="flex gap-6 ml-auto">
            <div className="text-center">
              <p className="text-xs text-slate-400 font-medium">Cages</p>
              <p className="text-xl font-bold text-slate-900">{camera.cageCount}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-400 font-medium">Chickens</p>
              <p className="text-xl font-bold text-slate-900">{camera.chickenCount}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-400 font-medium">Today</p>
              <p className="text-xl font-bold text-primary-600">{todayEggs.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          label="Today's Eggs"
          value={todayEggs.length}
          icon={<Egg className="w-5 h-5" />}
          className="animate-fade-in-up stagger-1"
        />
        <StatsCard
          label={`Total (${range}d)`}
          value={rangeEggs.length}
          icon={<TrendingUp className="w-5 h-5" />}
          className="animate-fade-in-up stagger-2"
        />
        <StatsCard
          label="Best Day"
          value={bestDay ? `${formatShortDate(bestDay.date)} (${bestDay.count})` : "—"}
          icon={<CalendarDays className="w-5 h-5" />}
          className="animate-fade-in-up stagger-3"
        />
        <StatsCard
          label="Avg / Day"
          value={avgPerDay}
          icon={<BarChart3 className="w-5 h-5" />}
          className="animate-fade-in-up stagger-4"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="animate-fade-in-up stagger-1">
          <ProductionChart data={dailyCounts} />
        </div>
        <div className="animate-fade-in-up stagger-2">
          <SizeDistChart data={sizeCounts} />
        </div>
      </div>

      {/* Date Comparison */}
      <div className="animate-fade-in-up stagger-3">
        <DateCompChart eggs={rangeEggs} />
      </div>
    </div>
  );
}
