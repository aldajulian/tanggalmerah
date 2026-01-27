"use client";
import { format } from "date-fns";
import { id, enUS } from "date-fns/locale";
import { useState, useEffect } from "react";
import { Grid, Calendar, List, Setting } from "./Icons";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSettingsStore } from "../store/settingsStore";
import { dictionary } from "../data/dictionary";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

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
    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
      {label}
    </span>
    <div className="flex bg-gray-200 dark:bg-neutral-700/50 rounded-lg p-0.5 min-w-26.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 px-2.5 py-1.5 text-sm rounded-md transition-all ${value === opt.value
            ? "bg-white dark:bg-neutral-600 shadow-sm text-black dark:text-white"
            : "text-gray-500 dark:text-gray-400"
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
    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
      {label}
    </span>
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

      <motion.div
        initial={{ width: 210, height: 48 }}
        animate={{
          width: setting ? 360 : 210,
          height: setting ? 380 : 48,
        }}
        transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
        dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
        dragElastic={0.1}
        drag={!setting}
        className="navigation flex flex-col fixed h-12 z-30 mx-auto left-0 right-0 bg-white/80 backdrop-blur dark:bg-neutral-800 select-none overflow-hidden rounded-xl"
      >
        <AnimatePresence>
          {setting && (
            <motion.div
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)" }}
              className="flex flex-col items-center justify-start pb-16 w-full"
            >
              <div className="flex flex-col w-full p-4  space-y-4">
                <ToggleItem
                  label={t.settings.national}
                  checked={showNational}
                  onCheckedChange={setShowNational}
                  accentClass="data-[state=checked]:bg-red-500"
                />

                <ToggleItem
                  label={t.settings.collective}
                  checked={showCollective}
                  onCheckedChange={setShowCollective}
                  accentClass="data-[state=checked]:bg-sky-500"
                />

                <ToggleItem
                  label={t.recommendations.title}
                  checked={showAnnualLeave}
                  onCheckedChange={setShowAnnualLeave}
                  accentClass="data-[state=checked]:bg-purple-500"
                />

              </div>

              <div className="w-full h-px bg-black/5 dark:bg-white/5 my-1" />

              <div className="flex flex-col w-full p-4  space-y-4">
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
                    { label: t.settings.system, value: "system" },
                    { label: t.settings.light, value: "light" },
                    { label: t.settings.dark, value: "dark" },
                  ]}
                />
              </div>

              <div className="w-full h-px bg-black/5 dark:bg-white/5 my-1" />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className="flex absolute bottom-1 left-0 right-0 mx-auto justify-between px-1 w-full select-none"
          animate={{ width: setting ? 360 : 210 }}
          transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
        >
          <Link href="/year" className="contents">
            <motion.div
              className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${isGrid
                ? "bg-black/5 dark:bg-white/10 text-neutral-600 dark:text-white"
                : "text-neutral-400 hover:text-neutral-700 dark:hover:text-gray-300"
                }`}
            >
              <Grid />
            </motion.div>
          </Link>
          <Link href="/" className="contents">
            <motion.div
              className={`flex items-center justify-center relative px-3 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${isStack
                ? "bg-black/5 dark:bg-white/10 text-neutral-600 dark:text-white"
                : "text-neutral-400 hover:text-neutral-700 dark:hover:text-gray-300"
                }`}
            >
              <Calendar />
              <span
                className="block absolute top-[55%] -translate-y-[55%] right-1/2 translate-x-1/2 text-[10px] leading-none text-red-500 font-semibold"
                suppressHydrationWarning={true}
              >
                {date}
              </span>
            </motion.div>
          </Link>
          <Link href="/list" className="contents">
            <motion.div
              className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${isList
                ? "bg-black/5 dark:bg-white/10 text-neutral-600 dark:text-white"
                : "text-neutral-400 hover:text-neutral-700 dark:hover:text-gray-300"
                }`}
            >
              <List />
            </motion.div>
          </Link>
          <motion.div
            className="flex items-center px-1 ml-auto" 
            animate={{ opacity: setting ? 0 : 1 }}
            transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
          >
            <div className="w-0.5 h-[60%] rounded-md bg-neutral-200 dark:bg-neutral-700" />
          </motion.div>
          <motion.button
            onClick={() => setSetting(!setting)}
            className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${setting
              ? "bg-black/5 dark:bg-white/10 text-black dark:text-white"
              : "text-neutral-400 fill-neutral-500 hover:text-neutral-700 dark:hover:text-gray-300"
              }`}
          >
            <Setting />
          </motion.button>
          <motion.div />
        </motion.div>
      </motion.div>
    </>
  );
};
