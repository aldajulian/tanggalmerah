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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type HolidayType = "national" | "collective" | "annual";

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
  const {
    weekStartsOn,
    language,
    showNational,
    showCollective,
    showAnnualLeave
  } = useSettingsStore();
  const [openDate, setOpenDate] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
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

  const t = dictionary[language];
  const currentWeekDayNames = t.weekdays[weekStartsOn];

  return (
    <div className={`w-full ${className}`}>
      {/* Month Header */}
      <div
        className={`text-base font-medium py-2 px-3 text-neutral-900 dark:text-neutral-100 ${stickyHeader
          ? "sticky top-0 bg-background/80 backdrop-blur-sm z-20"
          : ""
          }`}
      >
        {format(month, "MMMM", { locale: language === "id" ? id : enUS })}
      </div>

      <div
        className={`grid grid-cols-7 ${compact
          ? "gap-y-0.5 gap-0.5"
          : "sticky top-[39px] z-20 gap-y-0.5 gap-0.5"
          }`}
      >
        {/* Weekday Headers */}
        {!hideWeekdays && (
          <div
            className={`col-span-7 grid grid-cols-7 mb-2 ${stickyHeader
              ? "bg-background/80 backdrop-blur-sm z-10 border-b border-t border-black/5 dark:border-white/5"
              : ""
              } px-2`}
          >
            {currentWeekDayNames.map((day) => (
              <div
                key={day}
                className={`text-left ${compact ? "text-[8px] px-0.5 pb-1" : "text-xs px-1 py-2"
                  } font-normal text-neutral-400 capitalize`}
              >
                {day}
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        className={`grid grid-cols-7 ${compact ? "gap-y-0.5 gap-0.5" : "gap-y-0.5 gap-0.5"
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
          const holidayOriginal = holidays.find((h) => h.date === dateStr);
          const holiday = holidayOriginal && (
            (holidayOriginal.type === "national" && showNational) ||
            (holidayOriginal.type === "collective" && showCollective) ||
            (holidayOriginal.type === "annual" && showAnnualLeave)
          ) ? holidayOriginal : null;

          const isNational = holiday?.type === "national";
          const isCollective = holiday?.type === "collective";
          const isAnnual = holiday?.type === "annual";
          const isWeekendDay = isWeekend(date);

          const dayCell = (
            <div
              className={`relative aspect-cell ${compact
                ? "p-1 md:p-2 text-[8px] md:text-[11px] rounded-sm"
                : "p-1.5 md:p-2 text-xs md:text-base rounded-lg"
                } w-full flex items-start justify-start font-medium leading-none
                ${isNational
                  ? "bg-red-50 text-red-700 font-normal dark:bg-red-900/20 dark:text-red-400"
                  : ""
                }
                ${isCollective
                  ? "bg-sky-50 text-sky-700 font-normal dark:bg-sky-900/20 dark:text-sky-400"
                  : ""
                }
                ${isAnnual
                  ? "bg-purple-50 text-purple-700 font-normal dark:bg-purple-900/20 dark:text-purple-400"
                  : ""
                }
                ${!holiday && isWeekendDay
                  ? "bg-neutral-100 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400"
                  : ""
                }
                ${!holiday && !isWeekendDay
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
                  className={`absolute ${compact
                    ? "bottom-1 left-1 size-0.75"
                    : "bottom-2 left-2 size-1.5"
                    } bg-red-500 rounded-full dark:bg-red-400`}
                />
              )}
              {isCollective && (
                <div
                  className={`absolute ${compact
                    ? "bottom-1 left-1 size-0.75"
                    : "bottom-2 left-2 size-1.5"
                    } bg-sky-500 rounded-full dark:bg-sky-400`}
                />
              )}
              {isAnnual && (
                <div
                  className={`absolute ${compact
                    ? "bottom-1 left-1 size-0.75"
                    : "bottom-2 left-2 size-1.5"
                    } bg-purple-500 rounded-full dark:bg-purple-400`}
                />
              )}
            </div>
          );

          if (holiday) {
            return (
              <Popover
                key={dateStr}
                open={openDate === dateStr}
                onOpenChange={(open) => setOpenDate(open ? dateStr : null)}
              >
                <PopoverTrigger
                  asChild
                  onMouseEnter={() => !isMobile && setOpenDate(dateStr)}
                  onMouseLeave={() => !isMobile && setOpenDate(null)}
                >
                  {dayCell}
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto max-w-[280px] p-3"
                  side="top"
                  onMouseEnter={() => !isMobile && setOpenDate(dateStr)}
                  onMouseLeave={() => !isMobile && setOpenDate(null)}
                >
                  <div className="space-y-1">
                    <p
                      className={`text-xs font-medium ${isNational
                          ? "text-red-600 dark:text-red-400"
                          : isCollective
                            ? "text-sky-600 dark:text-sky-400"
                            : "text-purple-600 dark:text-purple-400"
                        }`}
                    >
                      {isNational ? t.legend.national : isCollective ? t.legend.collective : t.recommendations.title}
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
                </PopoverContent>
              </Popover>
            );
          }

          return <div key={dateStr}>{dayCell}</div>;
        })}
      </div>
    </div>
  );
}
