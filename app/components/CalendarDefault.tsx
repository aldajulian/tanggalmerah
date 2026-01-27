import { holidays } from "../../data/holidays";
import { MonthCalendar } from "./MonthCalendar";

export function CalendarDefault() {
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
  ];

  return (
    <div className="w-full flex-col items-center space-y-8">
      {months.map((month) => (
        <MonthCalendar
          key={month.toISOString()}
          month={month}
          holidays={allHolidays}
          className="w-full mx-auto"
          stickyHeader={true}
        />
      ))}
    </div>
  );
}
