"use client";

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
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type HolidayType = "national" | "collective" | "annual" | "school";

interface Holiday {
  date: string;
  title: string;
  type: HolidayType;
}

interface MonthCalendarProps {
  month: Date;
  holidays: Holiday[];
  className?: string;
  hideWeekdays?: boolean;
  stickyHeader?: boolean;
  compact?: boolean;
}

const typePriority: HolidayType[] = [
  "national",
  "collective",
  "annual",
  "school",
];

const bgColorMap: Record<HolidayType, string> = {
  national: "bg-[#FF3B30]/10 dark:bg-[#FF3B30]/15",
  collective: "bg-[#5AC8FA]/10 dark:bg-[#5AC8FA]/15",
  annual: "bg-[#AF52DE]/10 dark:bg-[#AF52DE]/15",
  school: "bg-[#34C759]/10 dark:bg-[#34C759]/15",
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
    showAnnualLeave,
    showSchoolHolidays,
  } = useSettingsStore();
  const [openDate, setOpenDate] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(monthStart);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDay = getDay(monthStart);
  const startDayIndex =
    weekStartsOn === "monday" ? (startDay + 6) % 7 : startDay;
  const emptySlots = Array.from({ length: startDayIndex });

  const t = dictionary[language];
  const currentWeekDayNames = t.weekdays[weekStartsOn];

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
            : "sticky top-[35px] z-20 gap-y-0.5 gap-0.5"
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
                  compact ? "text-[8px] px-0.5 pb-1" : "text-xs px-1 py-2"
                } font-normal text-neutral-400 capitalize`}
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

          // Get all holidays for this day, filtered by settings
          const dayHolidays = holidays
            .filter((h) => h.date === dateStr)
            .filter(
              (h) =>
                (h.type === "national" && showNational) ||
                (h.type === "collective" && showCollective) ||
                (h.type === "annual" && showAnnualLeave) ||
                (h.type === "school" && showSchoolHolidays),
            );

          const hasHolidays = dayHolidays.length > 0;

          // Determine which types are present, in priority order
          const presentTypes = typePriority.filter((type) =>
            dayHolidays.some((h) => h.type === type),
          );
          const primaryType = presentTypes[0] || null;

          const isWeekendDay = isWeekend(date);

          const dayCell = (
            <div
              className={`relative aspect-cell ${
                compact
                  ? "p-1 md:p-2 text-[8px] md:text-[11px] rounded-sm"
                  : "p-2 md:p-2 text-xs md:text-base rounded-lg"
              } w-full flex items-start justify-start font-medium leading-none
                ${
                  primaryType
                    ? `${bgColorMap[primaryType]} ${textColorMap[primaryType]} font-medium`
                    : ""
                }
                ${
                  !hasHolidays && isWeekendDay
                    ? "bg-neutral-100 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400"
                    : ""
                }
                ${
                  !hasHolidays && !isWeekendDay
                    ? "text-neutral-600 dark:text-neutral-400"
                    : ""
                }
                ${isToday ? "ring-1 ring-sky-400 dark:ring-sky-700 z-10" : ""}
              `}
            >
              <time dateTime={dateStr}>{format(date, "d")}</time>
              {/* Dot per holiday */}
              {dayHolidays.length > 0 && (
                <div
                  className={`absolute ${
                    compact
                      ? "bottom-1 left-1 gap-0.5"
                      : "bottom-2 left-2 gap-0.75"
                  } flex`}
                >
                  {dayHolidays.map((h, i) => (
                    <div
                      key={i}
                      className={`flex-shrink-0 flex-grow-0 ${compact ? "size-[3px]" : "size-[6px]"} ${dotColorMap[h.type]} rounded-full`}
                    />
                  ))}
                </div>
              )}
            </div>
          );

          if (hasHolidays) {
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
                {/* <PopoverAnchor asChild /> */}
                <PopoverContent
                  className="w-auto max-w-[280px] py-3 px-4 mx-2 rounded-xl bg-white/90 backdrop-blur dark:bg-neutral-800/90 border-0 shadow-lg"
                  side="top"
                  onMouseEnter={() => !isMobile && setOpenDate(dateStr)}
                  onMouseLeave={() => !isMobile && setOpenDate(null)}
                >
                  <PopoverArrow className="fill-white/90 dark:fill-neutral-800/90" />
                  <div className="space-y-3">
                    {dayHolidays.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 border-b border-dashed border-neutral-100 dark:border-neutral-700 last:border-b-0 pb-2 last:pb-0"
                      >
                        <div
                          className={`size-[8px] shrink-0 rounded-full mt-1.25 ${dotColorMap[h.type]}`}
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground leading-wide mb-1">
                            {h.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getTypeLabel(h.type, t)}
                          </p>
                        </div>
                      </div>
                    ))}
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
