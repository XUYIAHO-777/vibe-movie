import type { Dispatch, SetStateAction } from "react";

import type { QuestionItem } from "@/app/api/questions/route";
import { cn } from "@/lib/cn";

export function QuestionPanel({
  questions,
  answers,
  setAnswers,
  allAnswered,
  isLoading,
  error,
  stepVisible,
  onConfirm,
}: {
  questions: QuestionItem[];
  answers: Record<number, string>;
  setAnswers: Dispatch<SetStateAction<Record<number, string>>>;
  allAnswered: boolean;
  isLoading: boolean;
  error: string | null;
  stepVisible: boolean;
  onConfirm: () => void;
}) {
  return (
    <div
      className={cn(
        "w-full max-w-3xl pb-32 transition-all duration-1000 ease-out",
        stepVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <div className="flex flex-col gap-8">
        {questions.map((q) => (
          <div
            key={q.id}
            className="bg-white/[0.02] backdrop-blur-3xl border border-white/[0.03] rounded-[2rem] p-8 sm:p-10 shadow-2xl"
          >
            <p className="text-slate-200 font-medium text-lg sm:text-xl tracking-wide mb-8 font-serif italic">
              {q.text}
            </p>
            <div className="flex flex-wrap gap-4">
              {q.options.map((opt) => {
                const selected = answers[q.id] === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                    className={cn(
                      "px-7 py-3 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all duration-500",
                      "border border-white/5 backdrop-blur-xl",
                      selected
                        ? "bg-blue-700 text-white border-blue-500 shadow-[0_0_25px_rgba(29,78,216,0.4)] scale-105"
                        : "bg-white/2 text-slate-500 hover:text-slate-300 hover:border-white/10 hover:bg-white/5"
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-16 flex flex-col items-center gap-6">
        <button
          type="button"
          onClick={onConfirm}
          disabled={!allAnswered || isLoading}
          className={cn(
            "w-full sm:w-auto px-16 py-5 rounded-2xl text-sm font-bold uppercase tracking-[0.25em] transition-all duration-500",
            allAnswered && !isLoading
              ? "bg-gradient-to-r from-blue-700 to-sky-600 text-white shadow-2xl hover:scale-105 hover:shadow-sky-500/20 active:scale-95"
              : "bg-white/2 text-slate-700 cursor-not-allowed border border-white/5"
          )}
        >
          Confirm & Explore <span className="text-[10px] opacity-40 ml-2">确认探索</span>
        </button>
        {error && !isLoading && (
          <div className="text-xs tracking-widest text-rose-500/70 uppercase">{error}</div>
        )}
      </div>
    </div>
  );
}
