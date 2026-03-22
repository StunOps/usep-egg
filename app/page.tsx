"use client";

import { useEffect, useState, useMemo } from "react";
import {
  getCameras,
  getEggs,
  seedSampleData,
  Camera,
  EggRecord,
} from "@/lib/storage";
import { countBySize, countByDate, getTodayStr } from "@/lib/utils";
import StatsCard from "@/components/StatsCard";
import CameraCard from "@/components/CameraCard";
import ProductionChart from "@/components/charts/ProductionChart";
import { Egg, TrendingUp, BarChart3, Award } from "lucide-react";

export default function DashboardPage() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [eggs, setEggs] = useState<EggRecord[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    seedSampleData();
    setCameras(getCameras());
    setEggs(getEggs());
    setMounted(true);
  }, []);

  const today = useMemo(() => getTodayStr(), []);
  const todayEggs = useMemo(() => eggs.filter((e) => e.date === today), [eggs, today]);
  const sizeCounts = useMemo(() => countBySize(eggs), [eggs]);
  const last7 = useMemo(() => countByDate(eggs).slice(-7), [eggs]);

  // Most productive camera
  const bestCamLabel = useMemo(() => {
    const camCounts = new Map<string, number>();
    eggs.forEach((e) => {
      camCounts.set(e.cameraId, (camCounts.get(e.cameraId) || 0) + 1);
    });
    const best = Array.from(camCounts.entries()).sort((a, b) => b[1] - a[1])[0];
    if (!best) return "—";
    return `Camera ${cameras.find((c) => c.id === best[0])?.cameraNumber ?? "?"}`;
  }, [eggs, cameras]);

  // Dominant size
  const dominantSize = useMemo(
    () => Object.entries(sizeCounts).sort((a, b) => b[1] - a[1])[0],
    [sizeCounts]
  );

  // Pre-compute per-camera size counts (avoids localStorage reads inside CameraCard)
  const perCameraSizeCounts = useMemo(() => {
    const map: Record<string, ReturnType<typeof countBySize>> = {};
    cameras.forEach((cam) => {
      map[cam.id] = countBySize(eggs.filter((e) => e.cameraId === cam.id));
    });
    return map;
  }, [eggs, cameras]);

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
        <p className="page-subtitle">
          Overview of today&apos;s egg production and recent trends
        </p>
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
          label="Total Eggs (30d)"
          value={eggs.length}
          icon={<TrendingUp className="w-5 h-5" />}
          className="animate-fade-in-up stagger-2"
        />
        <StatsCard
          label="Most Productive"
          value={bestCamLabel}
          icon={<Award className="w-5 h-5" />}
          className="animate-fade-in-up stagger-3"
        />
        <StatsCard
          label="Dominant Size"
          value={dominantSize ? `${dominantSize[0]} (${dominantSize[1]})` : "—"}
          icon={<BarChart3 className="w-5 h-5" />}
          className="animate-fade-in-up stagger-4"
        />
      </div>

      {/* Camera Cards */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Cameras</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cameras.map((cam, i) => {
            const camTodayEggs = todayEggs.filter((e) => e.cameraId === cam.id).length;
            return (
              <CameraCard
                key={cam.id}
                camera={cam}
                todayEggs={camTodayEggs}
                sizeCounts={perCameraSizeCounts[cam.id] || countBySize([])}
                className={`animate-fade-in-up stagger-${i + 1}`}
              />
            );
          })}
          {cameras.length === 0 && (
            <div className="card text-center py-12 col-span-full">
              <p className="text-slate-400 text-lg">No cameras configured</p>
              <p className="text-sm text-slate-300 mt-1">
                Go to the <span className="font-medium text-primary-500">Cameras</span> page to add one
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mini Chart */}
      <ProductionChart data={last7} />
    </div>
  );
}
