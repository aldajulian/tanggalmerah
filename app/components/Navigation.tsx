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

const springTransition = {
  type: "spring",
  stiffness: 250,
  damping: 25,
  mass: 1,
};

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
    <AnimatePresence>
      {setting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, bottom: setting ? 80 : 20 }}
          exit={{ opacity: 0, bottom: 20  }}
          className="navigation flex flex-col items-center justify-start p-4 space-y-4 w-80 fixed left-0 right-0 bottom-20 mx-auto z-20 bg-white/90 backdrop-blur dark:bg-neutral-800 rounded-xl"
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {t.settings.weekStartsOn}
            </span>
            <div className="flex bg-gray-200 dark:bg-neutral-800 rounded-lg p-1">
              <button
                onClick={() => setWeekStartsOn("monday")}
                className={`px-3 py-1 text-xs rounded-md transition-all ${
                  weekStartsOn === "monday"
                    ? "bg-white dark:bg-neutral-600 shadow-sm text-black dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {t.settings.monday}
              </button>
              <button
                onClick={() => setWeekStartsOn("sunday")}
                className={`px-3 py-1 text-xs rounded-md transition-all ${
                  weekStartsOn === "sunday"
                    ? "bg-white dark:bg-neutral-600 shadow-sm text-black dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {t.settings.sunday}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {t.settings.language}
            </span>
            <div className="flex bg-gray-200 dark:bg-neutral-800 rounded-lg p-1">
              <button
                onClick={() => setLanguage("id")}
                className={`px-3 py-1 text-xs rounded-md transition-all ${
                  language === "id"
                    ? "bg-white dark:bg-neutral-600 shadow-sm text-black dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {t.settings.indonesian}
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 text-xs rounded-md transition-all ${
                  language === "en"
                    ? "bg-white dark:bg-neutral-600 shadow-sm text-black dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {t.settings.english}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {t.settings.theme}
            </span>
            <div className="flex bg-gray-200 dark:bg-neutral-800 rounded-lg p-1">
              <button
                onClick={() => setTheme("system")}
                className={`px-3 py-1 text-xs rounded-md transition-all ${
                  theme === "system"
                    ? "bg-white dark:bg-neutral-600 shadow-sm text-black dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {t.settings.system}
              </button>
              <button
                onClick={() => setTheme("light")}
                className={`px-3 py-1 text-xs rounded-md transition-all ${
                  theme === "light"
                    ? "bg-white dark:bg-neutral-600 shadow-sm text-black dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {t.settings.light}
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`px-3 py-1 text-xs rounded-md transition-all ${
                  theme === "dark"
                    ? "bg-white dark:bg-neutral-600 shadow-sm text-black dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {t.settings.dark}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    <motion.div
      transition={{ bounce: 0.2 }}
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      dragElastic={0.1}
      drag={!setting}
      className="navigation flex flex-col fixed h-12 z-30 mx-auto w-60 left-0 right-0 p-1 bg-white/70 backdrop-blur dark:bg-neutral-800 select-none overflow-hidden rounded-xl"
    >
      <motion.div
        className="flex absolute bottom-1 left-0 right-0 mx-auto justify-between px-1 w-full select-none"
      >
        <Link href="/year" className="contents">
          <motion.div
            className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
              isGrid
                ? "bg-black/5 dark:bg-white/10 text-neutral-600 dark:text-white"
                : "text-neutral-400 hover:text-neutral-700 dark:hover:text-gray-300"
            }`}
          >
            <Grid />
          </motion.div>
        </Link>
        <Link href="/" className="contents">
          <motion.div
            className={`flex items-center justify-center relative px-3 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
              isStack
                ? "bg-black/5 dark:bg-white/10 text-neutral-600 dark:text-white"
                : "text-neutral-400 hover:text-neutral-700 dark:hover:text-gray-300"
            }`}
          >
            <Calendar />
            <span
              className="block absolute top-[55%] -translate-y-[55%] right-1/2 translate-x-1/2 text-xs leading-none text-red-500 font-semibold"
              suppressHydrationWarning={true}
            >
              {date}
            </span>
          </motion.div>
        </Link>
        <Link href="/list" className="contents">
          <motion.div
            className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
              isList
                ? "bg-black/5 dark:bg-white/10 text-neutral-600 dark:text-white"
                : "text-neutral-400 hover:text-neutral-700 dark:hover:text-gray-300"
            }`}
          >
            <List />
          </motion.div>
        </Link>
        <div className="flex items-center px-2">
          <div className="w-0.5 h-[60%] rounded-md bg-neutral-100 dark:bg-neutral-700" />
        </div>
        <motion.button
          onClick={() => setSetting(!setting)}
          className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
            setting
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
