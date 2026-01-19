"use client";

import React from "react";
import {
  format,
  eachDayOfInterval,
  endOfMonth,
  startOfMonth,
  getDay,
  isWeekend,
} from "date-fns";
import { enUS, id } from "date-fns/locale";
import { useSettingsStore } from "../store/settingsStore";
import { dictionary } from "../data/dictionary";
import { useEffect, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type HolidayType = "national" | "collective";

interface Holiday {
  date: string;
  title: string;
  type: HolidayType;
}

interface MonthCalendarProps {
  month: Date;
  holidays: Holiday[];
  className?: string; // Additional classes for the container
  hideWeekdays?: boolean; // Option to hide weekday headers
  stickyHeader?: boolean; // Option to make header sticky
  compact?: boolean; // Option for compact text size (8px)
}

export function MonthCalendar({
  month,
  holidays,
  className = "",
  hideWeekdays = false,
  stickyHeader = false,
  compact = false,
}: MonthCalendarProps) {
  const { weekStartsOn, language } = useSettingsStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(monthStart);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  const startDay = getDay(monthStart); // 0 (Sun) to 6 (Sat)

  // Calculate start index based on preference
  // If Monday start: Mon=0, Sun=6. Formula: (day + 6) % 7
  // If Sunday start: Sun=0, Sat=6. Formula: day
  const startDayIndex =
    weekStartsOn === "monday" ? (startDay + 6) % 7 : startDay;

  // Create empty slots for days before the first day of the month
  const emptySlots = Array.from({ length: startDayIndex });

  // Mapping from our static array to dictionary values if we want full i18n for days
  // But dictionary has weekdays arrays.

  // Actually, let's use dictionary for weekdays
  const t = dictionary[language];
  const currentWeekDayNames = t.weekdays[weekStartsOn];

  // if (!hydrated) {
  //   return (
  //     <div
  //       className={`w-full ${className} animate-pulse h-64 bg-gray-100 dark:bg-gray-800 rounded-lg`}
  //     ></div>
  //   );
  // }

  return (
    <div className={`w-full ${className}`}>
      {/* Month Header */}
      <div
        className={`text-base font-medium py-2 px-3 text-neutral-900 dark:text-neutral-100 ${
          stickyHeader
            ? "sticky top-0 bg-background/80 backdrop-blur-sm z-20"
            : ""
        }`}
      >
        {format(month, "MMMM", { locale: language === "id" ? id : enUS })}
      </div>

      <div
        className={`grid grid-cols-7 ${
          compact
            ? "gap-y-0.5 gap-0.5"
            : "sticky top-[39px] z-20 gap-y-0.5 gap-0.5"
        }`}
      >
        {/* Weekday Headers */}
        {!hideWeekdays && (
          <div
            className={`col-span-7 grid grid-cols-7 mb-2 ${
              stickyHeader
                ? "bg-background/80 backdrop-blur-sm z-10 border-b border-t border-black/5 dark:border-white/5"
                : ""
            } px-2`}
          >
            {currentWeekDayNames.map((day) => (
              <div
                key={day}
                className={`text-left ${
                  compact ? "text-[8px] px-0.5 pb-1" : "text-sm px-1 py-2"
                } font-medium text-neutral-500 capitalize`}
              >
                {day}
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        className={`grid grid-cols-7 ${
          compact ? "gap-y-0.5 gap-0.5" : "gap-y-0.5 gap-0.5"
        } px-2`}
      >
        {/* Empty Slots */}
        {emptySlots.map((_, index) => (
          <div key={`empty-${index}`} />
        ))}

        {/* Days */}
        {daysInMonth.map((date) => {
          const dateStr = format(date, "yyyy-MM-dd");
          const todayStr = format(new Date(), "yyyy-MM-dd");
          const isToday = dateStr === todayStr;
          const holiday = holidays.find((h) => h.date === dateStr);
          const isNational = holiday?.type === "national";
          const isCollective = holiday?.type === "collective";
          const isWeekendDay = isWeekend(date);

          const dayCell = (
            <div
              className={`relative aspect-cell ${
                compact
                  ? "p-1 md:p-2 text-[8px] md:text-[11px] rounded-sm"
                  : "p-1.5 md:p-2 text-xs md:text-base rounded-lg"
              } w-full flex items-start justify-start font-medium leading-none
                ${
                  isNational
                    ? "bg-red-50 text-red-700 font-normal dark:bg-red-900/20 dark:text-red-400"
                    : ""
                }
                ${
                  isCollective
                    ? "bg-sky-50 text-sky-700 font-normal dark:bg-sky-900/20 dark:text-sky-400"
                    : ""
                }
                ${
                  !holiday && isWeekendDay
                    ? "bg-neutral-100 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400"
                    : ""
                }
                ${
                  !holiday && !isWeekendDay
                    ? "text-neutral-600 dark:text-neutral-400"
                    : ""
                }
                ${isToday ? "ring-1 ring-sky-400 dark:ring-sky-700 z-10" : ""}
              `}
            >
              <time dateTime={dateStr}>{format(date, "d")}</time>
              {/* Dot Indicators */}
              {isNational && (
                <div
                  className={`absolute ${
                    compact
                      ? "bottom-1 left-1 size-0.75"
                      : "bottom-2 left-2 size-1.5"
                  } bg-red-500 rounded-full dark:bg-red-400`}
                />
              )}
              {isCollective && (
                <div
                  className={`absolute ${
                    compact
                      ? "bottom-1 left-1 size-0.75"
                      : "bottom-2 left-2 size-1.5"
                  } bg-sky-500 rounded-full dark:bg-sky-400`}
                />
              )}
            </div>
          );

          if (holiday) {
            return (
              <HoverCard key={dateStr} openDelay={200} closeDelay={100}>
                <HoverCardTrigger asChild>{dayCell}</HoverCardTrigger>
                <HoverCardContent className="w-auto max-w-[280px] p-3" side="top">
                  <div className="space-y-1">
                    <p
                      className={`text-xs font-medium ${
                        isNational
                          ? "text-red-600 dark:text-red-400"
                          : "text-sky-600 dark:text-sky-400"
                      }`}
                    >
                      {isNational ? t.legend.national : t.legend.collective}
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {holiday.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(date, "EEEE, d MMMM yyyy", {
                        locale: language === "id" ? id : enUS,
                      })}
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            );
          }

          return <div key={dateStr}>{dayCell}</div>;
        })}
      </div>
    </div>
  );
}
