"use client";
import { format } from "date-fns";
import { id, enUS } from "date-fns/locale";
import { useState, useEffect } from "react";
import { Grid, Calendar, List, Setting } from "./Icons";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSettingsStore } from "../store/settingsStore";
import { dictionary } from "../data/dictionary";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover";

const SegmentedControl = <T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { label: string; value: T }[];
  onChange: (val: T) => void;
}) => (
  <div className="flex items-center justify-between w-full">
    <span className="text-neutral-500 dark:text-neutral-200">{label}</span>
    <div className="flex bg-neutral-100 dark:bg-neutral-700/50 rounded-full p-0.5 min-w-26.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 px-2.5 py-1.5 text-sm rounded-full ${
            value === opt.value
              ? "bg-white dark:bg-neutral-600 shadow-sm text-black dark:text-white"
              : "text-neutral-500 dark:text-neutral-400"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

const ToggleItem = ({
  label,
  checked,
  onCheckedChange,
  accentClass,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (val: boolean) => void;
  accentClass?: string;
}) => (
  <div className="flex items-center justify-between w-full">
    <span className="text-neutral-500 dark:text-gray-200">{label}</span>
    <Switch
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={cn(checked && accentClass)}
    />
  </div>
);

export const Navigation = () => {
  const [setting, setSetting] = useState(false);
  const pathname = usePathname();
  const {
    weekStartsOn,
    setWeekStartsOn,
    language,
    setLanguage,
    theme,
    setTheme,
    showNational,
    setShowNational,
    showCollective,
    setShowCollective,
    showAnnualLeave,
    setShowAnnualLeave,
    showSchoolHolidays,
    setShowSchoolHolidays,
  } = useSettingsStore();

  const t = dictionary[language];

  // Hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const date = format(new Date(), "d", {
    locale: language === "id" ? id : enUS,
  });
  const isGrid = pathname === "/year";
  const isStack = pathname === "/";
  const isList = pathname === "/list";

  if (!mounted) return null;

  return (
    <>
      <Popover open={setting} onOpenChange={setSetting}>
        <PopoverAnchor asChild>
          <motion.div
            transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            dragElastic={0.1}
            drag={!setting}
            className="navigation shadow-md w-fit flex fixed p-1.25 space-x-1 z-30 mx-auto left-0 right-0 bg-white/80 backdrop-blur dark:bg-neutral-800 select-none overflow-hidden rounded-full"
          >
            <motion.div
              whileTap={{ scale: 0.85 }}
              className={`flex items-center justify-center p-3 text-sm font-medium rounded-full cursor-pointer ${
                isGrid
                  ? "bg-black/5 dark:bg-white/10 text-[#262626] dark:text-white"
                  : "text-neutral-400 hover:text-neutral-700 dark:hover:text-gray-300"
              }`}
            >
              <Link href="/year" className="contents">
                <Grid />
              </Link>
            </motion.div>

            <motion.div
              whileTap={{ scale: 0.85 }}
              className={`flex items-center justify-center relative p-3 text-sm font-medium rounded-full cursor-pointer ${
                isStack
                  ? "bg-black/5 dark:bg-white/10 text-[#262626] dark:text-white"
                  : "text-neutral-400 hover:text-neutral-700 dark:hover:text-gray-300"
              }`}
            >
              <Link href="/" className="contents">
                <Calendar />
                <span
                  className="block absolute top-[55%] -translate-y-[50%] right-1/2 translate-x-1/2 text-[10px] leading-none text-[#FF3B30] font-semibold"
                  suppressHydrationWarning={true}
                >
                  {date}
                </span>
              </Link>
            </motion.div>

            <motion.div
              whileTap={{ scale: 0.85 }}
              className={`flex items-center justify-center p-3 text-sm font-medium rounded-full cursor-pointer ${
                isList
                  ? "bg-black/5 dark:bg-white/10 text-[#262626] dark:text-white"
                  : "text-neutral-400 hover:text-neutral-700 dark:hover:text-gray-300"
              }`}
            >
              <Link href="/list" className="contents">
                <List />
              </Link>
            </motion.div>
            <motion.div
              className="flex items-center px-1"
              transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
            >
              <div className="w-0.5 h-[40%] rounded-full bg-neutral-200 dark:bg-neutral-700" />
            </motion.div>
            <PopoverTrigger asChild>
              <motion.button
                whileTap={{ scale: 0.85 }}
                className={`flex items-center justify-center p-3 me-0 text-sm font-medium rounded-full ${
                  setting
                    ? "bg-black/5 dark:bg-white/10 text-[#262626] dark:text-white"
                    : "text-neutral-400 fill-neutral-500 hover:text-neutral-700 dark:hover:text-gray-300"
                }`}
              >
                <Setting />
              </motion.button>
            </PopoverTrigger>
            <motion.div />
          </motion.div>
        </PopoverAnchor>
        <PopoverContent
          side="top"
          sideOffset={12}
          className="w-80 bg-white/80 backdrop-blur dark:bg-neutral-800 border-0 shadow-md rounded-4xl p-0"
        >
          <div className="flex items-end w-full pt-[16px] pb-[14px] px-[16px] justify-between">
            <div className="text-base font-medium mb-0">
              <span className="text-red-500">(</span>{" "}
              <span className="font-semibold">Hari Libur</span>{" "}
              <span className="text-red-500">)</span>
            </div>
            <div className="flex gap-3 items-center text-neutral-400">
              <div className="text-sm">v1.0.2</div>
            </div>
          </div>
          <div className="w-full h-px bg-black/5 dark:bg-white/5" />
          <div className="flex flex-col w-full py-[15px] px-[16px] space-y-4">
            <ToggleItem
              label={t.settings.national}
              checked={showNational}
              onCheckedChange={setShowNational}
              accentClass="data-[state=checked]:bg-[#FF3B30]"
            />
            <ToggleItem
              label={t.settings.school}
              checked={showSchoolHolidays}
              onCheckedChange={setShowSchoolHolidays}
              accentClass="data-[state=checked]:bg-[#34C759]"
            />
            <ToggleItem
              label={t.settings.collective}
              checked={showCollective}
              onCheckedChange={setShowCollective}
              accentClass="data-[state=checked]:bg-[#5AC8FA]"
            />
            <ToggleItem
              label={t.recommendations.title}
              checked={showAnnualLeave}
              onCheckedChange={setShowAnnualLeave}
              accentClass="data-[state=checked]:bg-[#AF52DE]"
            />
          </div>

          <div className="w-full h-px bg-black/5 dark:bg-white/5" />

          <div className="flex flex-col w-full py-[15px] px-[16px] space-y-4">
            <SegmentedControl
              label={t.settings.weekStartsOn}
              value={weekStartsOn}
              onChange={setWeekStartsOn}
              options={[
                { label: t.settings.monday, value: "monday" },
                { label: t.settings.sunday, value: "sunday" },
              ]}
            />
            <SegmentedControl
              label={t.settings.language}
              value={language}
              onChange={setLanguage}
              options={[
                { label: t.settings.indonesian, value: "id" },
                { label: t.settings.english, value: "en" },
              ]}
            />
            <SegmentedControl
              label={t.settings.theme}
              value={theme}
              onChange={setTheme}
              options={[
                // { label: t.settings.system, value: "system" },
                { label: t.settings.light, value: "light" },
                { label: t.settings.dark, value: "dark" },
              ]}
            />
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};
