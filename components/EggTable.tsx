"use client";

import { EggRecord } from "@/lib/storage";
import { formatDate, sizeBadgeClass } from "@/lib/utils";

interface EggTableProps {
  eggs: EggRecord[];
  cameraMap: Record<string, string>;
}

export default function EggTable({ eggs, cameraMap }: EggTableProps) {
  if (eggs.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-slate-400 text-lg">No egg records found</p>
        <p className="text-sm text-slate-300 mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Date</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Camera</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Size</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-6 py-3">Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {eggs.map((egg, i) => (
              <tr
                key={egg.id}
                className={`border-b border-gray-50 hover:bg-primary-50/30 transition ${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                }`}
              >
                <td className="px-6 py-3 text-sm text-slate-700 font-medium">{formatDate(egg.date)}</td>
                <td className="px-6 py-3 text-sm text-slate-600">
                  {cameraMap[egg.cameraId] || "Unknown"}
                </td>
                <td className="px-6 py-3">
                  <span className={`badge ${sizeBadgeClass(egg.size)}`}>{egg.size}</span>
                </td>
                <td className="px-6 py-3 text-sm text-slate-500">
                  {new Date(egg.timestamp).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
