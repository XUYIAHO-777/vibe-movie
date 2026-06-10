import type { FormEvent } from "react";

import { cn } from "@/lib/cn";

export function MoodInputPanel({
  mood,
  setMood,
  isLoading,
  error,
  stepVisible,
  onSubmit,
}: {
  mood: string;
  setMood: (value: string) => void;
  isLoading: boolean;
  error: string | null;
  stepVisible: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <div
      className={cn(
        "w-full max-w-2xl transition-all duration-1000 ease-out",
        stepVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <form className="w-full" autoComplete="off" onSubmit={onSubmit}>
        <div className="flex flex-col sm:flex-row items-stretch gap-4">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="e.g. 今天很累，但还是想看点温柔有希望的东西..."
              className={cn(
                "w-full min-w-0 h-16 pl-6 pr-6 sm:pr-48 text-base sm:text-lg font-medium tracking-wide rounded-2xl",
                "bg-white/[0.03] border border-white/5 backdrop-blur-2xl outline-none",
                "placeholder:text-slate-600 placeholder:font-normal italic",
                "focus:border-sky-700/40 focus:ring-4 focus:ring-sky-900/20",
                "transition-all duration-500 shadow-2xl",
                isLoading && "opacity-50"
              )}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "hidden sm:block absolute top-2 right-2 h-[48px] px-8 min-w-[140px] rounded-xl text-xs font-bold uppercase tracking-[0.2em] shadow-xl select-none",
                "bg-gradient-to-r from-blue-700 to-sky-600 text-white",
                "transition-all duration-300 hover:translate-y-[-1px] hover:shadow-sky-500/20 active:translate-y-[1px]",
                isLoading && "opacity-50"
              )}
            >
              {isLoading ? "Diving..." : "Find My Vibe"}
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "sm:hidden w-full h-14 rounded-2xl text-sm font-bold uppercase tracking-widest bg-gradient-to-r from-blue-700 to-sky-600 text-white shadow-xl",
              "transition-all duration-300 active:scale-95",
              isLoading && "opacity-50"
            )}
          >
            {isLoading ? "Diving..." : "Find My Vibe"}
          </button>
        </div>
        <div
          className={cn(
            "mt-6 text-slate-600 tracking-[0.3em] text-[10px] uppercase text-center select-none transition-all duration-700",
            isLoading ? "opacity-100 translate-y-0 animate-pulse" : "opacity-0 -translate-y-1"
          )}
        >
          Diving into your emotional depths...
          <span className="opacity-30 ml-2">正在潜入你的情绪海...</span>
        </div>
        {error && !isLoading && (
          <div className="mt-5 text-xs tracking-widest text-rose-500/80 text-center uppercase transition-all duration-700">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
