"use client";

import * as React from "react";
import { holidays } from "../../data/holidays";
import { parseISO, format } from "date-fns";
import { id, enUS } from "date-fns/locale";
import { useSettingsStore } from "../store/settingsStore";
import { dictionary } from "../data/dictionary";

type HolidayType = "national" | "collective" | "annual" | "school";

type Holiday = {
  date: string;
  title: string;
  type: HolidayType;
};

const textColorMap: Record<HolidayType, string> = {
  national: "text-[#FF3B30]",
  collective: "text-[#5AC8FA]",
  annual: "text-[#AF52DE]",
  school: "text-[#34C759]",
};

const dotColorMap: Record<HolidayType, string> = {
  national: "bg-[#FF3B30]",
  collective: "bg-[#5AC8FA]",
  annual: "bg-[#AF52DE]",
  school: "bg-[#34C759]",
};

function getTypeLabel(type: HolidayType, t: (typeof dictionary)["id"]) {
  switch (type) {
    case "national":
      return t.legend.national;
    case "collective":
      return t.legend.collective;
    case "annual":
      return t.recommendations.title;
    case "school":
      return t.legend.school;
  }
}

const allHolidays: Holiday[] = [
  ...holidays.nationalHolidays.map((h) => ({
    ...h,
    type: "national" as const,
  })),
  ...holidays.collectiveLeave.map((h) => ({
    ...h,
    type: "collective" as const,
  })),
  ...holidays.annualLeave.map((h) => ({
    ...h,
    type: "annual" as const,
  })),
  ...holidays.schoolHolidays.map((h) => ({
    ...h,
    type: "school" as const,
  })),
].sort((a, b) => a.date.localeCompare(b.date));

type FusedEntry = {
  date: string;
  holidays: Holiday[];
};

export function HolidayList() {
  const {
    language,
    showNational,
    showCollective,
    showAnnualLeave,
    showSchoolHolidays,
  } = useSettingsStore();
  const t = dictionary[language];

  const fusedEntries = React.useMemo(() => {
    const filtered = allHolidays.filter(
      (h) =>
        (h.type === "national" && showNational) ||
        (h.type === "collective" && showCollective) ||
        (h.type === "annual" && showAnnualLeave) ||
        (h.type === "school" && showSchoolHolidays),
    );

    // Group by date
    const byDate = filtered.reduce<Record<string, Holiday[]>>((acc, h) => {
      if (!acc[h.date]) acc[h.date] = [];
      acc[h.date].push(h);
      return acc;
    }, {});

    // Sort by date
    return Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, holidays]): FusedEntry => ({ date, holidays }));
  }, [showNational, showCollective, showAnnualLeave, showSchoolHolidays]);

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Group fused entries by month
  const groupedByMonth = fusedEntries.reduce(
    (groups, entry) => {
      const date = parseISO(entry.date);
      const monthKey = format(date, "MMMM", {
        locale: language === "id" ? id : enUS,
      });
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(entry);
      return groups;
    },
    {} as Record<string, FusedEntry[]>,
  );

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {Object.entries(groupedByMonth).map(([month, entries]) => (
        <div key={month}>
          <h3 className="text-base font-medium text-neutral-400 dark:text-neutral-400 sticky top-0 bg-background/50 backdrop-blur dark:bg-background/50 py-2 px-3 z-10 border-b border-black/5">
            {month}
          </h3>
          <div>
            {entries.map((entry) => {
              const date = parseISO(entry.date);
              return (
                <div
                  key={entry.date}
                  className="flex gap-4 py-4 pl-3 border-b border-neutral-100 dark:border-neutral-800 last:border-b-0"
                >
                  <div className="flex flex-col min-w-20 sm:mt-0 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    <span className="text-sm text-neutral-400 dark:text-neutral-500">
                      {format(date, "EEE", {
                        locale: language === "id" ? id : enUS,
                      })}
                    </span>
                    <span className="text-base text-neutral-600 dark:text-neutral-400">
                      {format(date, "d MMM", {
                        locale: language === "id" ? id : enUS,
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    {entry.holidays.map((h, i) => (
                      <div
                        key={i}
                        className="flex gap-4 border-b border-dashed border-neutral-100 dark:border-neutral-800 last:border-b-0 pb-2"
                      >
                        <div
                          key={i}
                          className={`size-2 rounded-full ${dotColorMap[h.type]} mt-1.75`}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium text-neutral-600 dark:text-neutral-400">
                            {h.title}
                          </span>
                          <span className={`text-sm ${textColorMap[h.type]}`}>
                            {getTypeLabel(h.type, t)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
