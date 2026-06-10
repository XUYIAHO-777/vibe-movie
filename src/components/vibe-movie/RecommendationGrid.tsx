import NextImage from "next/image";

import type { MovieItem } from "@/app/api/movies/route";
import type { Step } from "@/features/vibe-movie/constants";
import { cn } from "@/lib/cn";
import { compactText } from "@/lib/text";

export function RecommendationGrid({
  movies,
  setSelectedMovie,
  setStep,
  stepVisible,
  onReset,
}: {
  movies: MovieItem[];
  setSelectedMovie: (movie: MovieItem) => void;
  setStep: (step: Step) => void;
  stepVisible: boolean;
  onReset: () => void;
}) {
  return (
    <div
      className={cn(
        "w-full max-w-7xl transition-all duration-1000 ease-out pb-20",
        stepVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
        {movies.map((movie, i) => (
          <div
            key={movie.title.en + i}
            className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl transition-all duration-700 hover:-translate-y-3"
          >
            {movie.posterUrl ? (
              <div className="absolute inset-0">
                <NextImage
                  src={movie.posterUrl}
                  alt={movie.title.en}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />

            <div className="relative z-10 flex flex-col p-8 sm:p-10 min-h-[520px]">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <div className="text-2xl sm:text-3xl font-black tracking-tighter uppercase text-white truncate">
                    {movie.title.en}
                  </div>
                  <div className="mt-2 text-sm sm:text-base font-bold text-slate-300/80 tracking-wider truncate">
                    {movie.title.zh}
                  </div>
                </div>
                <div className="shrink-0 text-sm font-bold tracking-widest text-yellow-300/90">
                  Rating {typeof movie.rating === "number" ? movie.rating.toFixed(1) : "--"}
                </div>
              </div>

              <div className="mt-4 text-[10px] uppercase tracking-[0.35em] text-slate-400/70">
                {movie.year}
              </div>

              <div className="mt-8 flex-1 flex flex-col justify-end gap-4">
                <div className="text-slate-100/80 text-sm sm:text-base font-light leading-relaxed whitespace-normal break-words">
                  {compactText(movie.reason.en, 220)}
                </div>
                <div className="text-slate-200/55 text-sm sm:text-[15px] leading-relaxed whitespace-normal break-words border-l-2 border-white/10 pl-4">
                  {compactText(movie.reason.zh, 120)}
                </div>
              </div>
            </div>

            <div className="relative z-10 px-8 sm:px-10 pb-8 sm:pb-10">
              <button
                type="button"
                onClick={() => {
                  setSelectedMovie(movie);
                  setStep(6);
                }}
                className={cn(
                  "w-full py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500",
                  "bg-white/10 border border-white/10 text-slate-100/80 backdrop-blur-xl",
                  "hover:bg-blue-700 hover:text-white hover:border-transparent hover:shadow-[0_0_30px_rgba(29,78,216,0.3)]",
                  "active:scale-95"
                )}
              >
                Watch This <span className="opacity-50 ml-1">就看这部</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-20 flex justify-center">
        <button
          type="button"
          onClick={onReset}
          className={cn(
            "px-12 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] transition-all duration-500",
            "bg-transparent border border-white/5 text-slate-600 hover:text-slate-400 hover:border-white/10 hover:bg-white/2"
          )}
        >
          Reset Vibe <span className="opacity-30 ml-1">重新感知</span>
        </button>
      </div>
    </div>
  );
}
