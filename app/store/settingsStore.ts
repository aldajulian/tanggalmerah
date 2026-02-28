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
  showNational: boolean;
  setShowNational: (val: boolean) => void;
  showCollective: boolean;
  setShowCollective: (val: boolean) => void;
  showAnnualLeave: boolean;
  setShowAnnualLeave: (val: boolean) => void;
  showSchoolHolidays: boolean;
  setShowSchoolHolidays: (val: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      weekStartsOn: "monday", // Default to Monday
      setWeekStartsOn: (day) => set({ weekStartsOn: day }),
      language: "id", // Default to Indonesian
      setLanguage: (lang) => set({ language: lang }),
      theme: "light",
      setTheme: (theme) => set({ theme }),
      showNational: true,
      setShowNational: (val) => set({ showNational: val }),
      showCollective: true,
      setShowCollective: (val) => set({ showCollective: val }),
      showAnnualLeave: true,
      setShowAnnualLeave: (val) => set({ showAnnualLeave: val }),
      showSchoolHolidays: false,
      setShowSchoolHolidays: (val) => set({ showSchoolHolidays: val }),
    }),
    {
      name: "settings-storage",
    },
  ),
);
