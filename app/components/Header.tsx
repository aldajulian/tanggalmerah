"use client";

import { useSettingsStore } from "../store/settingsStore";
import { dictionary } from "../data/dictionary";
import { useEffect, useState } from "react";

export const Header = () => {
  const { language } = useSettingsStore();
  const t = dictionary[language];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="flex w-full flex-col items-start text-center px-4 animate-pulse py-18">
        <div className="h-7.5 w-16 bg-neutral-200 dark:bg-neutral-800 rounded-full mb-4"></div>
        <div className="h-9 w-90 bg-neutral-200 dark:bg-neutral-800 rounded-lg mb-4"></div>
        <div className="h-9 w-110 bg-neutral-200 dark:bg-neutral-800 rounded-lg mb-4"></div>
        <div className="flex gap-4 mt-2">
          <div className="h-5 w-26 bg-neutral-200 dark:bg-neutral-800 rounded-full"></div>
          <div className="h-5 w-26 bg-neutral-200 dark:bg-neutral-800 rounded-full"></div>
          <div className="h-5 w-26 bg-neutral-200 dark:bg-neutral-800 rounded-full"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="flex w-full flex-col items-start py-18 text-center px-4">
      <div className="flex items-center gap-2 border font-semibold border-black/15 dark:border-white/15 text-sm px-3 py-1 rounded-full mb-4 dark:text-gray-300">
        2026
      </div>
      <h1 className="text-2xl md:text-4xl font-semibold mb-6 dark:text-white text-left">
        {t.title}{" "}
        {/* <span className="inline-block -rotate-2 bg-red-500/10 rounded-full px-4 py-1 text-red-500">
          {t.legend.national}
        </span>{" "} */}
        & <br className="hidden sm:block" />{" "}
        <span className="inline-block rotate-2 bg-sky-500/10 rounded-full px-4 py-1 text-sky-500">
          {t.subtitle}
        </span>{" "}
        {t.country}
      </h1>
      <ul className="flex flex-wrap justify-center gap-4 text-sm text-black/60 dark:text-white/60">
        <li className="flex items-center gap-2">
          <span className="block size-2 rounded-full bg-red-500"></span>
          {t.legend.national}
        </li>
        <li className="flex items-center gap-2">
          <span className="block size-2 rounded-full bg-sky-400"></span>
          {t.legend.collective}
        </li>
        <li className="flex items-center gap-2">
          <span className="block size-2 rounded-full bg-neutral-200"></span>
          {t.legend.weekend}
        </li>
      </ul>
    </header>
  );
};
