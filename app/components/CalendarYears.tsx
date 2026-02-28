"use client";

import * as React from "react";
import { holidays } from "../../data/holidays";
import { MonthCalendar } from "./MonthCalendar";

export function CalendarYears() {
  const year = 2026;
  const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));

  const allHolidays = [
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
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-x-4 md:gap-x-8 gap-y-4 md:gap-x-8 justify-center">
        {months.map((month) => (
          <MonthCalendar
            key={month.toISOString()}
            month={month}
            holidays={allHolidays}
            className="w-full max-w-[320px] mx-auto"
            compact={true}
          />
        ))}
      </div>
    </div>
  );
}
