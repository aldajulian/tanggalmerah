"use client";

import * as React from "react";
import { holidays } from "../../data/holidays";
import { parseISO, format } from "date-fns";
import { id } from "date-fns/locale";

type Holiday = {
  date: string;
  title: string;
  type: "national" | "collective";
};

const allHolidays: Holiday[] = [
  ...holidays.nationalHolidays.map((h) => ({
    ...h,
    type: "national" as const,
  })),
  ...holidays.collectiveLeave.map((h) => ({
    ...h,
    type: "collective" as const,
  })),
].sort((a, b) => a.date.localeCompare(b.date));

export function HolidayList() {
  const groupedHolidays = allHolidays.reduce((groups, holiday) => {
    const date = parseISO(holiday.date);
    const monthKey = format(date, "MMMM", { locale: id });
    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(holiday);
    return groups;
  }, {} as Record<string, typeof allHolidays>);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {Object.entries(groupedHolidays).map(([month, holidaysInMonth]) => (
        <div key={month}>
          <h3 className="text-lg font-medium sticky top-0 bg-white/50 backdrop-blur dark:bg-background/50 py-2 px-4 z-10 border-b border-black/5">
            {month}
          </h3>
          <div className="">
            {holidaysInMonth.map((holiday, index) => {
              const date = parseISO(holiday.date);
              const isNational = holiday.type === "national";
              return (
                <div
                  key={`${holiday.date}-${index}`}
                  className={`flex gap-6 p-4 border-b border-neutral-100 dark:border-neutral-800 last:border-b-0`}
                >
                  <div className="flex flex-col min-w-20 sm:mt-0 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500">
                      {format(date, "EEE", { locale: id })}
                    </span>
                    <span>{format(date, "d MMM", { locale: id })}</span>
                  </div>
                  <div
                    className={`flex-shrink-0 size-2 rounded-full mt-2 ${
                      isNational ? "bg-red-600" : "bg-sky-400"
                    }`}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{holiday.title}</span>
                    <span
                      className={`text-sm ${
                        isNational
                          ? "text-red-600 dark:text-red-400"
                          : "text-sky-600 dark:text-sky-400"
                      }`}
                    >
                      {isNational ? "Libur Nasional" : "Cuti Bersama"}
                    </span>
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
