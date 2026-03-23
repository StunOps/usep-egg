"use client";

import { useState, useEffect } from "react";
import { Camera } from "@/lib/storage";
import { X, Camera as CameraIcon } from "lucide-react";

interface CameraFormProps {
  camera: Camera | null;
  onSave: (data: { cageCount: number; chickenCount: number }) => void;
  onClose: () => void;
}

export default function CameraForm({ camera, onSave, onClose }: CameraFormProps) {
  const [cageCount, setCageCount] = useState(4);
  const [chickenCount, setChickenCount] = useState(4);

  useEffect(() => {
    if (camera) {
      setCageCount(camera.cageCount);
      setChickenCount(camera.chickenCount);
    }
  }, [camera]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ cageCount, chickenCount });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
            <CameraIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Modify Camera</h2>
            <p className="text-xs text-slate-400">Camera 1 — Update cage and chicken count</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1.5">Number of Cages</label>
              <input
                type="number"
                min={1}
                max={20}
                value={cageCount}
                onChange={(e) => setCageCount(parseInt(e.target.value) || 1)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600 block mb-1.5">Number of Chickens</label>
              <input
                type="number"
                min={1}
                max={100}
                value={chickenCount}
                onChange={(e) => setChickenCount(parseInt(e.target.value) || 1)}
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
