"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getCameras,
  saveCamera,
  updateCamera,
  deleteCamera,
  Camera,
  seedSampleData,
} from "@/lib/storage";
import CameraForm from "@/components/CameraForm";
import { Plus, Camera as CameraIcon, Pencil, Trash2 } from "lucide-react";

export default function CamerasPage() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editCamera, setEditCamera] = useState<Camera | null>(null);
  const [mounted, setMounted] = useState(false);

  const reload = useCallback(() => setCameras(getCameras()), []);

  useEffect(() => {
    seedSampleData();
    reload();
    setMounted(true);
  }, [reload]);

  const handleSave = useCallback((data: {
    cameraNumber: number;
    label: string;
    cageCount: number;
    chickenCount: number;
  }) => {
    if (editCamera) {
      updateCamera(editCamera.id, data);
    } else {
      saveCamera(data);
    }
    reload();
    setShowForm(false);
    setEditCamera(null);
  }, [editCamera, reload]);

  const handleDelete = useCallback((id: string) => {
    if (confirm("Delete this camera and all its egg records?")) {
      deleteCamera(id);
      reload();
    }
  }, [reload]);

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title">Camera Setup</h1>
          <p className="page-subtitle">Manage your cameras, cages, and chickens</p>
        </div>
        <button
          onClick={() => {
            setEditCamera(null);
            setShowForm(true);
          }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          Add Camera
        </button>
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cameras.map((cam, i) => (
          <div
            key={cam.id}
            className={`card animate-fade-in-up stagger-${i + 1}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                  <CameraIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Camera {cam.cameraNumber}
                  </h3>
                  <p className="text-xs text-slate-400">{cam.label}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditCamera(cam);
                    setShowForm(true);
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cam.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 font-medium">Cages</p>
                <p className="text-2xl font-bold text-slate-900">{cam.cageCount}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 font-medium">Chickens</p>
                <p className="text-2xl font-bold text-slate-900">
                  {cam.chickenCount}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 mt-3">
              Added {new Date(cam.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}

        {cameras.length === 0 && (
          <div className="card text-center py-16 col-span-full">
            <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
              <CameraIcon className="w-8 h-8 text-primary-400" />
            </div>
            <p className="text-slate-500 text-lg font-medium">No cameras yet</p>
            <p className="text-sm text-slate-400 mt-1 mb-4">
              Add a camera to start tracking egg production
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4" />
              Add Your First Camera
            </button>
          </div>
        )}
      </div>

      {/* Camera Form Modal */}
      {showForm && (
        <CameraForm
          camera={editCamera}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditCamera(null);
          }}
        />
      )}
    </div>
  );
}
