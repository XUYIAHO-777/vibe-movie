import Link from "next/link";

import type { Step } from "@/features/vibe-movie/constants";
import { cn } from "@/lib/cn";

export function NavigationBar({
  step,
  setStep,
}: {
  step: Step;
  setStep: (s: Step) => void;
}) {
  const steps = [
    { id: 1, label: "MOOD", subLabel: "情绪", activeSteps: [1] },
    { id: 2, label: "RESONANCE", subLabel: "共鸣", activeSteps: [2] },
    { id: 3, label: "SELECTION", subLabel: "选片", activeSteps: [3, 4, 5, 6, 7] },
  ];

  const currentStepIndex = steps.findIndex((s) => s.activeSteps.includes(step));

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-slate-950/70 border-b border-white/5">
      <div className="w-full px-4 md:px-8 h-16 flex items-center justify-center">
        <div
          className={cn(
            "flex items-center gap-2 sm:gap-8",
            "overflow-x-auto overflow-y-hidden",
            "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          )}
        >
          {steps.map((s, idx) => {
            const isCurrent = s.activeSteps.includes(step);
            const isPast = idx < currentStepIndex;
            const isFuture = idx > currentStepIndex;

            return (
              <div key={s.id} className="flex items-center gap-2 sm:gap-5 shrink-0">
                <button
                  onClick={() => isPast && setStep(s.activeSteps[0] as Step)}
                  disabled={isFuture || isCurrent}
                  className={cn(
                    "flex flex-col items-center justify-center py-2 transition-all duration-300",
                    isCurrent
                      ? "text-sky-400"
                      : isPast
                        ? "text-slate-300/60 hover:text-white"
                        : "text-slate-600 cursor-not-allowed"
                  )}
                >
                  <span className={cn("font-bold tracking-widest", "text-[10px] sm:text-xs")}>
                    {s.label}
                  </span>
                  <span className="text-[9px] opacity-50 font-normal leading-none">
                    {s.subLabel}
                  </span>
                </button>
                <div className="w-4 sm:w-10 h-px bg-white/5 shrink-0" />
              </div>
            );
          })}

          <div className="flex items-center gap-2 sm:gap-5 shrink-0">
            <Link
              href="/archive"
              className="shrink-0 flex flex-col items-center justify-center py-2 transition-all duration-300 text-slate-300/60 hover:text-white"
            >
              <span className={cn("font-bold tracking-widest", "text-[10px] sm:text-xs")}>
                ARCHIVE
              </span>
              <span className="text-[9px] opacity-50 font-normal leading-none">档案</span>
            </Link>
            <div className="w-4 sm:w-10 h-px bg-white/5 shrink-0" />
            <Link
              href="/wall"
              className="shrink-0 flex flex-col items-center justify-center py-2 transition-all duration-300 text-slate-300/60 hover:text-white"
            >
              <span className={cn("font-bold tracking-widest", "text-[10px] sm:text-xs")}>
                WALL
              </span>
              <span className="text-[9px] opacity-50 font-normal leading-none">星空</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
