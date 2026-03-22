"use client";

import { useEffect, useState, useMemo } from "react";
import {
  getCameras,
  getEggs,
  seedSampleData,
  Camera,
  EggRecord,
  EggSize,
} from "@/lib/storage";
import EggTable from "@/components/EggTable";
import { Filter } from "lucide-react";

const EGG_SIZES: EggSize[] = ["S", "M", "L", "XL", "Jumbo"];

export default function HistoryPage() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [eggs, setEggs] = useState<EggRecord[]>([]);
  const [mounted, setMounted] = useState(false);

  // Filters
  const [selectedCamera, setSelectedCamera] = useState<string>("all");
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    seedSampleData();
    setCameras(getCameras());
    setEggs(getEggs());
    setMounted(true);
  }, []);

  const cameraMap = useMemo(() => {
    const map: Record<string, string> = {};
    cameras.forEach((c) => {
      map[c.id] = `Camera ${c.cameraNumber}`;
    });
    return map;
  }, [cameras]);

  const filteredEggs = useMemo(() => {
    let result = [...eggs];

    if (selectedCamera !== "all") {
      result = result.filter((e) => e.cameraId === selectedCamera);
    }
    if (selectedSize !== "all") {
      result = result.filter((e) => e.size === selectedSize);
    }
    if (startDate) {
      result = result.filter((e) => e.date >= startDate);
    }
    if (endDate) {
      result = result.filter((e) => e.date <= endDate);
    }

    return result.sort((a, b) => b.date.localeCompare(a.date) || b.timestamp.localeCompare(a.timestamp));
  }, [eggs, selectedCamera, selectedSize, startDate, endDate]);

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
      <div className="mb-6">
        <h1 className="page-title">History</h1>
        <p className="page-subtitle">Browse all egg records with filters</p>
      </div>

      {/* Filters */}
      <div className="card mb-6 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-primary-500" />
          <h3 className="font-semibold text-slate-700 text-sm">Filters</h3>
          <span className="badge bg-gray-100 text-slate-500 ml-auto">
            {filteredEggs.length} records
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Camera</label>
            <select
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="select-field text-sm"
            >
              <option value="all">All Cameras</option>
              {cameras.map((c) => (
                <option key={c.id} value={c.id}>
                  Camera {c.cameraNumber}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Size</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="select-field text-sm"
            >
              <option value="all">All Sizes</option>
              {EGG_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">From</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">To</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field text-sm"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="animate-fade-in-up stagger-2">
        <EggTable eggs={filteredEggs} cameraMap={cameraMap} />
      </div>
    </div>
  );
}
