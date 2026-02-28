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
        <div className="h-6 w-16 bg-neutral-200 dark:bg-neutral-800 rounded-full mb-4"></div>
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
      <div className="flex items-center gap-2 font-semibold text-sm mb-2 dark:text-gray-300 -rotate-2">
        <span className="mr-0.25 text-gray-500 dark:text-gray-400">(</span>
        <span className="text-red font-bold text-base">2026</span>
        <span className="ml-0.25 text-gray-500 dark:text-gray-400">)</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white text-left text-[#262626] leading-wide">
        Indonesia{" "}
        <span className="inline-block rounded-full px-6 py-2 text-red bg-red/10 -rotate-2">
          Public
        </span>{" "}
        &{" "}
        <span className="inline-block rounded-full px-6 py-2 text-green bg-green/10 rotate-2">
          School
        </span>{" "}
        Holidays
      </h1>
      <ul className="flex flex-row flex-wrap justify-start gap-4 text-sm text-black/60 dark:text-white/60">
        <li className="flex items-center gap-2">
          <span className="block size-2 rounded-full bg-red"></span>
          {t.legend.national}
        </li>
        <li className="flex items-center gap-2">
          <span className="block size-2 rounded-full bg-sky"></span>
          {t.legend.collective}
        </li>
        <li className="flex items-center gap-2">
          <span className="block size-2 rounded-full bg-green"></span>
          {t.legend.school}
        </li>
        <li className="flex items-center gap-2">
          <span className="block size-2 rounded-full bg-purple"></span>
          {t.legend.recommendation}
        </li>
        <li className="flex items-center gap-2">
          <span className="block size-2 rounded-full bg-neutral-200"></span>
          {t.legend.weekend}
        </li>
      </ul>
    </header>
  );
};
