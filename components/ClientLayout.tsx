"use client";

import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import CameraForm from "@/components/CameraForm";
import { getCameras, updateCamera, seedSampleData } from "@/lib/storage";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [showCameraForm, setShowCameraForm] = useState(false);

  const handleModifyCamera = useCallback(() => {
    setShowCameraForm(true);
  }, []);

  const handleSaveCamera = useCallback((data: { cageCount: number; chickenCount: number }) => {
    seedSampleData();
    const cameras = getCameras();
    if (cameras.length > 0) {
      updateCamera(cameras[0].id, data);
    }
    setShowCameraForm(false);
    window.location.reload(); // Refresh to reflect changes
  }, []);

  const camera = typeof window !== "undefined" ? (() => {
    seedSampleData();
    const cameras = getCameras();
    return cameras.length > 0 ? cameras[0] : null;
  })() : null;

  return (
    <>
      <Navbar onModifyCamera={handleModifyCamera} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      {showCameraForm && (
        <CameraForm
          camera={camera}
          onSave={handleSaveCamera}
          onClose={() => setShowCameraForm(false)}
        />
      )}
    </>
  );
}
