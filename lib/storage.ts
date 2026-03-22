// Egg size categories
export type EggSize = "S" | "M" | "L" | "XL" | "Jumbo";

// Camera configuration (manual input)
export interface Camera {
  id: string;
  cameraNumber: number;
  label: string;
  cageCount: number;
  chickenCount: number;
  createdAt: string;
}

// Egg record (from device / simulated)
export interface EggRecord {
  id: string;
  cameraId: string;
  cageNumber: number;
  size: EggSize;
  date: string; // YYYY-MM-DD
  timestamp: string;
}

// ---- LocalStorage Helpers ----

const CAMERAS_KEY = "usep_cameras";
const EGGS_KEY = "usep_eggs";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// --- Cameras ---

export function getCameras(): Camera[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(CAMERAS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveCamera(camera: Omit<Camera, "id" | "createdAt">): Camera {
  const cameras = getCameras();
  const newCamera: Camera = {
    ...camera,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };
  cameras.push(newCamera);
  localStorage.setItem(CAMERAS_KEY, JSON.stringify(cameras));
  return newCamera;
}

export function updateCamera(id: string, updates: Partial<Omit<Camera, "id" | "createdAt">>): Camera | null {
  const cameras = getCameras();
  const index = cameras.findIndex((c) => c.id === id);
  if (index === -1) return null;
  cameras[index] = { ...cameras[index], ...updates };
  localStorage.setItem(CAMERAS_KEY, JSON.stringify(cameras));
  return cameras[index];
}

export function deleteCamera(id: string): boolean {
  const cameras = getCameras();
  const filtered = cameras.filter((c) => c.id !== id);
  if (filtered.length === cameras.length) return false;
  localStorage.setItem(CAMERAS_KEY, JSON.stringify(filtered));
  // Also remove associated egg records
  const eggs = getEggs().filter((e) => e.cameraId !== id);
  localStorage.setItem(EGGS_KEY, JSON.stringify(eggs));
  return true;
}

// --- Eggs ---

export function getEggs(): EggRecord[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(EGGS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getEggsByDate(date: string): EggRecord[] {
  return getEggs().filter((e) => e.date === date);
}

export function getEggsByCamera(cameraId: string): EggRecord[] {
  return getEggs().filter((e) => e.cameraId === cameraId);
}

export function getEggsByDateRange(startDate: string, endDate: string): EggRecord[] {
  return getEggs().filter((e) => e.date >= startDate && e.date <= endDate);
}

// --- Seed Data ---

export function hasData(): boolean {
  return getCameras().length > 0;
}

export function seedSampleData(): void {
  if (hasData()) return;

  // Create sample cameras
  const cameras: Camera[] = [
    {
      id: "cam1",
      cameraNumber: 1,
      label: "Coop A - Layer Section",
      cageCount: 4,
      chickenCount: 4,
      createdAt: "2026-03-01T08:00:00Z",
    },
    {
      id: "cam2",
      cameraNumber: 2,
      label: "Coop B - Broiler Section",
      cageCount: 3,
      chickenCount: 3,
      createdAt: "2026-03-01T08:00:00Z",
    },
  ];

  localStorage.setItem(CAMERAS_KEY, JSON.stringify(cameras));

  // Generate egg records for the last 30 days
  const eggs: EggRecord[] = [];
  const sizes: EggSize[] = ["S", "M", "L", "XL", "Jumbo"];
  const sizeWeights = [0.12, 0.35, 0.28, 0.15, 0.1]; // M most common

  const today = new Date();
  for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);
    const dateStr = date.toISOString().split("T")[0];

    for (const cam of cameras) {
      for (let cage = 1; cage <= cam.cageCount; cage++) {
        // Each chicken lays 0-1 egg per day (roughly 70% chance)
        if (Math.random() < 0.7) {
          const rand = Math.random();
          let cumulative = 0;
          let size: EggSize = "M";
          for (let i = 0; i < sizeWeights.length; i++) {
            cumulative += sizeWeights[i];
            if (rand <= cumulative) {
              size = sizes[i];
              break;
            }
          }

          const hour = 6 + Math.floor(Math.random() * 6); // 6am - 12pm
          const minute = Math.floor(Math.random() * 60);

          eggs.push({
            id: generateId() + cage + dayOffset,
            cameraId: cam.id,
            cageNumber: cage,
            size,
            date: dateStr,
            timestamp: `${dateStr}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00Z`,
          });
        }
      }
    }
  }

  localStorage.setItem(EGGS_KEY, JSON.stringify(eggs));
}
