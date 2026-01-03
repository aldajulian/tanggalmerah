import { create } from "zustand";
import { persist } from "zustand/middleware";

type WeekStart = "monday" | "sunday";

interface SettingsState {
  weekStartsOn: WeekStart;
  setWeekStartsOn: (day: WeekStart) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      weekStartsOn: "monday", // Default to Monday
      setWeekStartsOn: (day) => set({ weekStartsOn: day }),
    }),
    {
      name: "settings-storage",
    }
  )
);
