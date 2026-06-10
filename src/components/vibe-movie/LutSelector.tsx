import type { Dispatch, SetStateAction } from "react";

import { LUT_LABELS, type LutPreset } from "@/features/vibe-movie/constants";
import { cn } from "@/lib/cn";

export function LutSelector({
  lutPreset,
  setLutPreset,
}: {
  lutPreset: LutPreset;
  setLutPreset: Dispatch<SetStateAction<LutPreset>>;
}) {
  return (
    <div className="fixed right-3 top-20 z-[60] rounded-2xl border border-white/10 bg-slate-950/55 p-1.5 backdrop-blur-md">
      <div className="flex items-center gap-1">
        {(["cinematic", "wkw", "blade"] as LutPreset[]).map((preset) => (
          <button
            key={preset}
            onClick={() => setLutPreset(preset)}
            className={cn(
              "rounded-xl px-2.5 py-1.5 text-[10px] font-bold tracking-[0.2em] transition-all",
              lutPreset === preset
                ? "bg-sky-400/20 text-sky-200"
                : "text-slate-400 hover:text-white hover:bg-white/10"
            )}
          >
            {LUT_LABELS[preset]}
          </button>
        ))}
      </div>
    </div>
  );
}
