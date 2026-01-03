import { create } from "zustand";
import { persist } from "zustand/middleware";

type WeekStart = "monday" | "sunday";

interface SettingsState {
  weekStartsOn: WeekStart;
  setWeekStartsOn: (day: WeekStart) => void;
  language: "id" | "en";
  setLanguage: (lang: "id" | "en") => void;
  theme: "system" | "light" | "dark";
  setTheme: (theme: "system" | "light" | "dark") => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      weekStartsOn: "monday", // Default to Monday
      setWeekStartsOn: (day) => set({ weekStartsOn: day }),
      language: "id", // Default to Indonesian
      setLanguage: (lang) => set({ language: lang }),
      theme: "system",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "settings-storage",
    }
  )
);
