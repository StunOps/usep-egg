"use client";

import { Camera as CameraType, EggSize } from "@/lib/storage";
import { Camera, ChevronRight } from "lucide-react";

interface CameraCardProps {
  camera: CameraType;
  todayEggs: number;
  sizeCounts: Record<EggSize, number>;
  className?: string;
}

export default function CameraCard({ camera, todayEggs, sizeCounts, className = "" }: CameraCardProps) {
  const total = Object.values(sizeCounts).reduce((a, b) => a + b, 0);

  return (
    <div className={`card group cursor-default ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-100 transition">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Camera {camera.cameraNumber}</h3>
            <p className="text-xs text-slate-400">{camera.label}</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-slate-400 font-medium">Cages</p>
          <p className="text-xl font-bold text-slate-900">{camera.cageCount}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-slate-400 font-medium">Chickens</p>
          <p className="text-xl font-bold text-slate-900">{camera.chickenCount}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs text-slate-400 font-medium">Today&apos;s Eggs</span>
        <span className="text-lg font-bold text-primary-600">{todayEggs}</span>
      </div>

      {/* Size breakdown mini bar */}
      {total > 0 && (
        <>
          <div className="mt-3 flex gap-1 h-2 rounded-full overflow-hidden bg-gray-100">
            {Object.entries(sizeCounts).map(([size, count]) => {
              if (count === 0) return null;
              const pct = (count / total) * 100;
              const colors: Record<string, string> = {
                S: "bg-blue-400",
                M: "bg-green-400",
                L: "bg-orange-400",
                XL: "bg-purple-400",
                Jumbo: "bg-red-400",
              };
              return (
                <div
                  key={size}
                  className={`${colors[size]} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                  title={`${size}: ${count}`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-slate-400">S / M / L / XL / Jumbo</span>
            <span className="text-[10px] text-slate-400">
              {sizeCounts.S} / {sizeCounts.M} / {sizeCounts.L} / {sizeCounts.XL} / {sizeCounts.Jumbo}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
