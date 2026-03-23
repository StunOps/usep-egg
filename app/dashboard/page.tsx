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
import { Egg, TrendingUp, BarChart3, CalendarDays, Camera as CamIcon, CalendarRange, CalendarClock, CalendarCheck } from "lucide-react";

// --- Helpers ---

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getWeeksInMonth(year: number, month: number): { label: string; start: string; end: string }[] {
  const weeks: { label: string; start: string; end: string }[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let weekStart = 1;
  let weekNum = 1;

  while (weekStart <= daysInMonth) {
    const weekEnd = Math.min(weekStart + 6, daysInMonth);
    const startStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(weekStart).padStart(2, "0")}`;
    const endStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(weekEnd).padStart(2, "0")}`;
    weeks.push({ label: `Week ${weekNum} (${weekStart}-${weekEnd})`, start: startStr, end: endStr });
    weekStart = weekEnd + 1;
    weekNum++;
  }
  return weeks;
}

function getAvailableYears(): number[] {
  const current = new Date().getFullYear();
  const years: number[] = [];
  for (let y = current; y >= current - 5; y--) years.push(y);
  return years;
}

function getAvailableMonths(year: number): number[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const months: number[] = [];
  const maxMonth = year === currentYear ? currentMonth : 11;
  for (let m = 0; m <= maxMonth; m++) months.push(m);
  return months;
}

function getAvailableWeeks(year: number, month: number): { label: string; start: string; end: string }[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const today = now.getDate();
  const allWeeks = getWeeksInMonth(year, month);

  if (year === currentYear && month === currentMonth) {
    return allWeeks.filter((w) => {
      const startDay = parseInt(w.start.split("-")[2]);
      return startDay <= today;
    });
  }
  return allWeeks;
}

// --- Component ---

export default function DashboardPage() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [eggs, setEggs] = useState<EggRecord[]>([]);
  const [mounted, setMounted] = useState(false);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Week filter state
  const [weekYear, setWeekYear] = useState(currentYear);
  const [weekMonth, setWeekMonth] = useState(currentMonth);
  const [weekIndex, setWeekIndex] = useState(0);

  // Month filter state
  const [monthYear, setMonthYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // Year filter state
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    seedSampleData();
    setCameras(getCameras());
    setEggs(getEggs());
    setMounted(true);
  }, []);

  // Set initial week to the latest available
  const availableWeeks = useMemo(() => getAvailableWeeks(weekYear, weekMonth), [weekYear, weekMonth]);
  useEffect(() => {
    setWeekIndex(Math.max(availableWeeks.length - 1, 0));
  }, [availableWeeks]);

  // Adjust month when year changes
  useEffect(() => {
    const months = getAvailableMonths(monthYear);
    if (!months.includes(selectedMonth)) {
      setSelectedMonth(months[months.length - 1]);
    }
  }, [monthYear, selectedMonth]);

  const today = useMemo(() => getTodayStr(), []);
  const todayEggs = useMemo(() => eggs.filter((e) => e.date === today), [eggs, today]);

  // Weekly summary
  const weeklySummary = useMemo(() => {
    const week = availableWeeks[weekIndex];
    if (!week) return { total: 0, avg: "0" };
    const weekEggs = eggs.filter((e) => e.date >= week.start && e.date <= week.end);
    const days = new Set(weekEggs.map((e) => e.date)).size;
    return { total: weekEggs.length, avg: days > 0 ? (weekEggs.length / days).toFixed(1) : "0" };
  }, [eggs, availableWeeks, weekIndex]);

  // Monthly summary
  const monthlySummary = useMemo(() => {
    const monthStr = `${monthYear}-${String(selectedMonth + 1).padStart(2, "0")}`;
    const monthEggs = eggs.filter((e) => e.date.startsWith(monthStr));
    const days = new Set(monthEggs.map((e) => e.date)).size;
    return { total: monthEggs.length, avg: days > 0 ? (monthEggs.length / days).toFixed(1) : "0" };
  }, [eggs, monthYear, selectedMonth]);

  // Yearly summary
  const yearlySummary = useMemo(() => {
    const yearStr = `${selectedYear}-`;
    const yearEggs = eggs.filter((e) => e.date.startsWith(yearStr));
    const days = new Set(yearEggs.map((e) => e.date)).size;
    return { total: yearEggs.length, avg: days > 0 ? (yearEggs.length / days).toFixed(1) : "0" };
  }, [eggs, selectedYear]);

  // Charts & stats based on current month
  const chartEggs = useMemo(() => {
    const monthStr = `${monthYear}-${String(selectedMonth + 1).padStart(2, "0")}`;
    return eggs.filter((e) => e.date.startsWith(monthStr));
  }, [eggs, monthYear, selectedMonth]);

  const sizeCounts = useMemo(() => countBySize(chartEggs), [chartEggs]);
  const dailyCounts = useMemo(() => countByDate(chartEggs), [chartEggs]);

  // Best day (all time)
  const allDailyCounts = useMemo(() => countByDate(eggs), [eggs]);
  const bestDay = useMemo(() => {
    if (allDailyCounts.length === 0) return null;
    return allDailyCounts.reduce((best, d) => (d.count > best.count ? d : best), allDailyCounts[0]);
  }, [allDailyCounts]);

  // Dominant size (all time)
  const allSizeCounts = useMemo(() => countBySize(eggs), [eggs]);
  const dominantSize = useMemo(
    () => Object.entries(allSizeCounts).sort((a, b) => b[1] - a[1])[0],
    [allSizeCounts]
  );

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
      <div className="mb-8">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Egg production overview and analytics</p>
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

      {/* Summary: Weekly / Monthly / Yearly */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* Weekly */}
        <div className="card animate-fade-in-up stagger-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
              <CalendarRange className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-700 text-sm">Weekly</h3>
          </div>
          <div className="flex gap-2 mb-3">
            <select
              value={weekMonth}
              onChange={(e) => setWeekMonth(parseInt(e.target.value))}
              className="select-field text-xs py-1.5 px-2"
            >
              {getAvailableMonths(weekYear).map((m) => (
                <option key={m} value={m}>{MONTH_NAMES[m].slice(0, 3)}</option>
              ))}
            </select>
            <select
              value={weekIndex}
              onChange={(e) => setWeekIndex(parseInt(e.target.value))}
              className="select-field text-xs py-1.5 px-2"
            >
              {availableWeeks.map((w, i) => (
                <option key={i} value={i}>{w.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-slate-900">{weeklySummary.total}</p>
              <p className="text-xs text-slate-400 mt-0.5">total eggs</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-blue-600">{weeklySummary.avg}</p>
              <p className="text-xs text-slate-400">avg/day</p>
            </div>
          </div>
        </div>

        {/* Monthly */}
        <div className="card animate-fade-in-up stagger-2">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-500">
              <CalendarClock className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-700 text-sm">Monthly</h3>
          </div>
          <div className="flex gap-2 mb-3">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="select-field text-xs py-1.5 px-2"
            >
              {getAvailableMonths(monthYear).map((m) => (
                <option key={m} value={m}>{MONTH_NAMES[m]}</option>
              ))}
            </select>
            <select
              value={monthYear}
              onChange={(e) => setMonthYear(parseInt(e.target.value))}
              className="select-field text-xs py-1.5 px-2 w-20"
            >
              {getAvailableYears().map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-slate-900">{monthlySummary.total}</p>
              <p className="text-xs text-slate-400 mt-0.5">total eggs</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-green-600">{monthlySummary.avg}</p>
              <p className="text-xs text-slate-400">avg/day</p>
            </div>
          </div>
        </div>

        {/* Yearly */}
        <div className="card animate-fade-in-up stagger-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-slate-700 text-sm">Yearly</h3>
          </div>
          <div className="mb-3">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="select-field text-xs py-1.5 px-2 w-24"
            >
              {getAvailableYears().map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-slate-900">{yearlySummary.total}</p>
              <p className="text-xs text-slate-400 mt-0.5">total eggs</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-purple-600">{yearlySummary.avg}</p>
              <p className="text-xs text-slate-400">avg/day</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          label="Today's Eggs"
          value={todayEggs.length}
          icon={<Egg className="w-5 h-5" />}
          className="animate-fade-in-up stagger-1"
        />
        <StatsCard
          label="All Time"
          value={eggs.length}
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
          label="Top Size"
          value={dominantSize ? `${dominantSize[0]} (${dominantSize[1]})` : "—"}
          icon={<BarChart3 className="w-5 h-5" />}
          className="animate-fade-in-up stagger-4"
        />
      </div>

      {/* Charts — based on selected month */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="animate-fade-in-up stagger-1">
          <ProductionChart data={dailyCounts} />
        </div>
        <div className="animate-fade-in-up stagger-2">
          <SizeDistChart data={sizeCounts} />
        </div>
      </div>
    </div>
  );
}
