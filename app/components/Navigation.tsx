"use client";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useState, useEffect } from "react";
import { Grid, Calendar, List, Setting } from "./Icons";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSettingsStore } from "../store/settingsStore";

export const Navigation = () => {
  const [setting, setSetting] = useState(false);
  const date = format(new Date(), "d", { locale: id });
  const pathname = usePathname();
  const { weekStartsOn, setWeekStartsOn } = useSettingsStore();

  // Hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isGrid = pathname === "/year";
  const isStack = pathname === "/";
  const isList = pathname === "/list";

  if (!mounted) return null;

  return (
    <motion.div
      animate={{
        width: setting ? "380px" : "320px",
        height: setting ? "160px" : "62px",
        borderRadius: setting ? "24px" : "50px",
        bottom: setting ? "25px" : "25px",
      }}
      whileTap={{ scale: !setting ? 1.05 : 1 }}
      drag={!setting}
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      dragElastic={0.1}
      className="navigation flex flex-col fixed z-30 mx-auto left-0 right-0 w-fit p-1 bg-white/70 backdrop-blur dark:bg-black/60 select-none overflow-hidden"
    >
      <motion.div
        animate={{
          bottom: setting ? "12px" : "4px",
        }}
        className="flex absolute bottom-1 left-0 right-0 mx-auto justify-between px-1 w-full h-[54px] select-none"
      >
        <Link href="/year" className="contents">
          <motion.div
            className={`flex items-center justify-center px-7 py-2 text-sm font-medium rounded-full transition-all cursor-pointer ${
              isGrid && !setting
                ? "bg-black/5 dark:bg-white/10 text-black dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <Grid />
          </motion.div>
        </Link>
        <Link href="/" className="contents">
          <motion.div
            className={`flex items-center justify-center relative px-7 py-2 text-sm font-medium rounded-full transition-all cursor-pointer ${
              isStack && !setting
                ? "bg-black/5 dark:bg-white/10 text-black dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <Calendar />
            <span
              className="block absolute top-[55%] -translate-y-[55%] right-1/2 translate-x-1/2 text-xs leading-none"
              suppressHydrationWarning={true}
            >
              {date}
            </span>
          </motion.div>
        </Link>
        <Link href="/list" className="contents">
          <motion.div
            className={`flex items-center justify-center px-7 py-2 text-sm font-medium rounded-full transition-all cursor-pointer ${
              isList && !setting
                ? "bg-black/5 dark:bg-white/10 text-black dark:text-white"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <List />
          </motion.div>
        </Link>
        <motion.button
          onClick={() => setSetting(!setting)}
          className={`flex items-center justify-center px-7 py-2 text-sm font-medium rounded-full transition-all ${
            setting
              ? "bg-black/10 dark:bg-white/10 text-black dark:text-white"
              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          <Setting />
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {setting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-start pt-6 px-6 w-full h-full space-y-4"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Awal Minggu
              </span>
              <div className="flex bg-gray-200 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setWeekStartsOn("monday")}
                  className={`px-3 py-1 text-xs rounded-md transition-all ${
                    weekStartsOn === "monday"
                      ? "bg-white dark:bg-gray-600 shadow-sm text-black dark:text-white"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Senin
                </button>
                <button
                  onClick={() => setWeekStartsOn("sunday")}
                  className={`px-3 py-1 text-xs rounded-md transition-all ${
                    weekStartsOn === "sunday"
                      ? "bg-white dark:bg-gray-600 shadow-sm text-black dark:text-white"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  Minggu
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
