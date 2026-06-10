"use client";

import { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { toJpeg } from "html-to-image";

import { DeepGradientBG, FilmGrain } from "@/components/vibe-movie/BackgroundLayers";
import { LutSelector } from "@/components/vibe-movie/LutSelector";
import { MoodInputPanel } from "@/components/vibe-movie/MoodInputPanel";
import { NavigationBar } from "@/components/vibe-movie/NavigationBar";
import { QuestionPanel } from "@/components/vibe-movie/QuestionPanel";
import { RecommendationGrid } from "@/components/vibe-movie/RecommendationGrid";
import {
  LUT_PRESETS,
  TRANSITION_PHRASES,
  moodBackgrounds,
  type LutPreset,
  type Step,
} from "@/features/vibe-movie/constants";
import { cn } from "@/lib/cn";
import { compactText } from "@/lib/text";
import type { MovieItem } from "./api/movies/route";
import type { QuestionItem, QuestionsResponse } from "./api/questions/route";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<Step>(1);
  const [mood, setMood] = useState("");
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [healingMessage, setHealingMessage] = useState("");
  const [moodCategory, setMoodCategory] = useState<string>("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stepVisible, setStepVisible] = useState(false);
  const [transitionPhrase, setTransitionPhrase] = useState("");
  const [hasSaved, setHasSaved] = useState(false);
  const [posterImage, setPosterImage] = useState<string | null>(null);
  const [isPosterGenerating, setIsPosterGenerating] = useState(false);
  const [isPosterOpen, setIsPosterOpen] = useState(false);
  const [posterError, setPosterError] = useState<string | null>(null);
  const [lutPreset, setLutPreset] = useState<LutPreset>("cinematic");

  // 鍥剧墖棰勫姞杞藉紩鎿庯細鍦ㄧ粍浠堕娆℃寕杞芥椂闈欓粯涓嬭浇鎵€鏈夎儗鏅浘鍒版祻瑙堝櫒缂撳瓨
  useEffect(() => {
    const preloadImages = () => {
      const imageUrls = Array.from(new Set(Object.values(moodBackgrounds)));
      imageUrls.forEach((url) => {
        // 浣跨敤绫诲瀷鏂█瑙ｅ喅TypeScript閿欒
        const img = new window.Image();
        img.src = url;
        // 鍙€夌殑閿欒澶勭悊
        img.onerror = () => {
          console.warn(`Failed to preload image: ${url}`);
        };
      });
      console.log(`Preloaded ${imageUrls.length} mood background images.`);
    };

    preloadImages();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("vibe_lut_preset");
    if (saved === "cinematic" || saved === "wkw" || saved === "blade") {
      setLutPreset(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("vibe_lut_preset", lutPreset);
  }, [lutPreset]);

  useEffect(() => {
    // 妫€鏌ユ槸鍚︽湁瀛樺偍鐨勭姸鎬侀渶瑕佹仮澶?
    const savedStep = sessionStorage.getItem('vibeStep');
    if (savedStep === '7') {
      const savedMovie = sessionStorage.getItem('selectedMovie');
      const savedMood = sessionStorage.getItem('mood');
      const savedMoodCategory = sessionStorage.getItem('moodCategory');
      const savedHealingMessage = sessionStorage.getItem('healingMessage');

      if (savedMovie && savedMood && savedMoodCategory && savedHealingMessage) {
        setSelectedMovie(JSON.parse(savedMovie));
        setMood(savedMood);
        setMoodCategory(savedMoodCategory);
        setHealingMessage(savedHealingMessage);
        setStep(7);
        // 鎭㈠鍚庣珛鍗虫竻闄わ紝閬垮厤鍒锋柊鏃跺啀娆¤繘鍏?
        sessionStorage.removeItem('vibeStep');
        sessionStorage.removeItem('selectedMovie');
        sessionStorage.removeItem('mood');
        sessionStorage.removeItem('moodCategory');
        sessionStorage.removeItem('healingMessage');
      }
    }

    setStepVisible(false);
    const t = setTimeout(() => setStepVisible(true), 50);

    // Step 6 -> Step 7 鑷姩娴佽浆 (涓撳睘鏀炬槧鍘呭墠鐨勪簩娆¤繃娓?
    if (step === 6) {
      const timer = setTimeout(() => {
        setStep(7);
      }, 900);
      return () => {
        clearTimeout(t);
        clearTimeout(timer);
      };
    }

    return () => clearTimeout(t);
  }, [step]);

  const currentStageBackground =
    moodBackgrounds[moodCategory] || moodBackgrounds.ocean;
  const activeLutOverlay = LUT_PRESETS[lutPreset];

  // 褰撹繘鍏?Step 7 涓旈€夊畾浜嗙數褰辨椂锛岃嚜鍔ㄤ繚瀛樿褰?
  useEffect(() => {
    if (step === 7 && selectedMovie && !hasSaved) {
      const saveRecord = async () => {
        try {
          await fetch("/api/archive", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              initialMood: mood,
              moodCategory: moodCategory,
              healingMessage: healingMessage,
              movieTitle: selectedMovie.title.zh, // 浣跨敤涓枃鏍囬浣滀负涓绘爣璇?
            }),
          });
          setHasSaved(true);
        } catch (error) {
          console.error("Failed to save mood record:", error);
        }
      };
      saveRecord();
    }
  }, [step, selectedMovie, mood, moodCategory, healingMessage, hasSaved]);

  const allAnswered = questions.length > 0 && questions.every((q) => answers[q.id]);

  async function handleSubmitMood(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLoading) return;
    const text = mood.trim();
    if (!text) {
      setError("先写下一句此刻的心情。");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnswers({});
    setMovies([]);
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: text }),
      });
      const data: QuestionsResponse = await res.json().catch(() => null);
      if (!res.ok) {
        const msg =
          data &&
          typeof data === "object" &&
          "error" in data &&
          typeof (data as { error?: unknown }).error === "string"
            ? (data as { error: string }).error
            : null;
        setError(msg || "情绪信号断开了，请再试一次。");
        return;
      }
      setQuestions(data.questions ?? []);
      setHealingMessage(data.healing_message ?? "");
      setMoodCategory(data.mood_category ?? "");
      setStep(2); // 杩涘叆瑙嗚鍏遍福
    } catch {
      setError("网络有点冷，请稍后再试。");
    } finally {
      setIsLoading(false);
    }
  }

  function handleConfirmAnswers() {
    if (isLoading || !allAnswered) return;
    setError(null);
    setTransitionPhrase(TRANSITION_PHRASES[Math.floor(Math.random() * TRANSITION_PHRASES.length)] ?? TRANSITION_PHRASES[0]);
    setStep(4); // 杩涘叆杩囨浮
    setIsLoading(true);

    const minDelay = new Promise<void>((r) => setTimeout(r, 650));
    const fetchPromise = fetch("/api/movies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mood: mood.trim(),
        answers: questions.map((q) => answers[q.id] ?? ""),
      }),
    }).then(async (res) => {
      const data = await res.json().catch(() => null);
      return { res, data };
    });

    Promise.all([fetchPromise, minDelay])
      .then(([{ res, data }]) => {
        if (!res.ok) {
          setError((data && data.error) || "情绪信号断开了，请再试一次。");
          setStep(3); // 杩斿洖闂瓟
        } else {
          setMovies(data.movies ?? []);
          setStep(5); // 杩涘叆鎺ㄨ崘灞曠ず
        }
      })
      .catch(() => {
        setError("网络有点冷，请稍后再试。");
        setStep(3);
      })
      .finally(() => setIsLoading(false));
  }

  function handleReset() {
    setStep(1);
    setMood("");
    setQuestions([]);
    setAnswers({});
    setMovies([]);
    setSelectedMovie(null);
    setError(null);
    setHealingMessage("");
    setMoodCategory("");
    setHasSaved(false);
  }

  const subtitle =
    step === 1
      ? (
        <>
          Beyond genres, purely vibes.
          <span className="block text-sm opacity-50 mt-1 font-normal">不要分类，只要对味。</span>
        </>
      )
      : step === 3
        ? (
          <>
            Pick what resonates.
            <span className="block text-sm opacity-50 mt-1 font-normal">选择最像你的那一项。</span>
          </>
        )
        : step === 5
          ? (
            <>
              Your Curated Vibe.
              <span className="block text-sm opacity-50 mt-1 font-normal">你的专属影单。</span>
            </>
          )
          : "";

  async function handleGeneratePoster() {
    if (!posterRef.current || !selectedMovie || isPosterGenerating) return;
    setIsPosterGenerating(true);
    setPosterError(null);
    try {
      // 1. 淇濈暀鍥剧墖杞?Base64 鐨勯槻寰℃満鍒讹紝褰诲簳鏉滅粷璺ㄥ煙绾㈠瓧
      const imgElement = posterRef.current.querySelector('#poster-img') as HTMLImageElement;
      if (imgElement && selectedMovie.posterUrl && !imgElement.src.startsWith('data:')) {
          try {
              const res = await fetch(selectedMovie.posterUrl);
              const blob = await res.blob();
              const base64 = await new Promise<string>((resolve) => {
                  const reader = new FileReader();
                  reader.onloadend = () => resolve(reader.result as string);
                  reader.readAsDataURL(blob);
              });
              imgElement.src = base64;
              await new Promise(r => setTimeout(r, 150)); // 绛夊緟鍥剧墖鐪熸娓叉煋
          } catch (fetchErr) {
              console.warn("Failed to pre-fetch image as Base64", fetchErr);
          }
      }

      const dataUrl = await toJpeg(posterRef.current, {
        quality: 0.92,
        pixelRatio: 2, // 涔樹互2锛屼繚璇佺敓鎴愮殑娴锋姤鏄秴楂樻竻鐨?
        skipFonts: false,
      });

      setPosterImage(dataUrl);
      setIsPosterOpen(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "海报生成失败，请稍后再试。";
      const lowerMsg = msg.toLowerCase();
      const isChunkError =
        lowerMsg.includes("failed to fetch dynamically imported module") ||
        lowerMsg.includes("loading chunk") ||
        lowerMsg.includes("chunkloaderror") ||
        lowerMsg.includes("importing a module script failed");
      setPosterError(
        isChunkError
          ? "资源加载失败，请刷新页面后重新生成海报。"
          : "渲染出错: " + msg
      );
    } finally {
      setIsPosterGenerating(false);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center font-sans overflow-y-auto overflow-x-hidden bg-[#020617] text-slate-100">
      <DeepGradientBG />
      <FilmGrain />
      <NavigationBar step={step} setStep={setStep} />
      <LutSelector lutPreset={lutPreset} setLutPreset={setLutPreset} />

      {/* Step 2: 瑙嗚鍏遍福鍖?(鏂? */}
      {step === 2 && (
        <div className={cn(
          "fixed inset-0 z-40 flex items-center justify-center transition-all duration-1000",
          stepVisible ? "opacity-100" : "opacity-0"
        )}>
          {/* 鑳屾櫙鍥?- 澧炲己娓叉煋闃插尽锛氭繁鑹插厹搴?+ 瀹夊叏鍙栧€?*/}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[12000ms] ease-linear scale-110 bg-slate-900"
            style={{ 
              backgroundImage: `${activeLutOverlay}, url(${currentStageBackground})`,
              backgroundBlendMode: "normal, screen, soft-light, normal",
              transform: stepVisible ? "scale(1)" : "scale(1.15)"
            }}
          />
          {/* 榛戣壊姣涚幓鐠冮伄缃?*/}
          <div className="absolute inset-0 bg-[#020617]/70 backdrop-blur-[2px]" />
          
          <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-2xl">
            <div className="w-16 h-[2px] bg-sky-500/40 mb-10 rounded-full" />
            <p className="text-2xl md:text-4xl font-light leading-relaxed tracking-wide text-white mb-14 drop-shadow-2xl font-serif italic">
              {healingMessage}
            </p>
            <button
              onClick={() => setStep(3)}
              className="group relative px-12 py-4 rounded-full text-white overflow-hidden transition-all duration-500 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_40px_rgba(14,165,233,0.5)] active:scale-95"
            >
              {/* 鎸夐挳搴曡壊娓愬彉 */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-sky-500" />
              
              <span className="relative z-10 font-bold tracking-[0.25em] text-sm uppercase flex items-center gap-2">
                Breathe in, keep exploring
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
              
              {/* 鎵厜鍔ㄦ晥 */}
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: 鍏ㄥ睆娌夋蹈寮忚繃娓?*/}
      {step === 4 && (
        <div
          className={cn(
            "fixed inset-0 z-20 flex items-center justify-center px-6 bg-[#020617]",
            "transition-all duration-1000 ease-out",
            stepVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[12000ms] ease-linear scale-110 bg-slate-900"
            style={{
              backgroundImage: `${activeLutOverlay}, url(${currentStageBackground})`,
              backgroundBlendMode: "normal, screen, soft-light, normal",
              transform: stepVisible ? "scale(1)" : "scale(1.15)"
            }}
          />
          <div className="absolute inset-0 bg-[#020617]/70 backdrop-blur-[2px]" />
          <p
            className={cn(
              "relative z-10 font-light tracking-[0.2em] text-center max-w-xl",
              "text-2xl md:text-3xl text-slate-400 italic font-serif",
              "bg-clip-text text-transparent bg-gradient-to-b from-slate-100 to-slate-500"
            )}
            style={{ animation: "breath 5s ease-in-out infinite" }}
          >
            {transitionPhrase}
          </p>
        </div>
      )}

      {/* Step 6: 涓撳睘鏀炬槧鍘呭墠鐨勪簩娆¤繃娓?*/}
      {step === 6 && (
        <div
          className={cn(
            "fixed inset-0 z-20 flex items-center justify-center px-6 bg-[#020617]",
            "transition-all duration-[1500ms] ease-in-out",
            stepVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
        >
          <p
            className={cn(
              "font-light tracking-[0.3em] text-center max-w-xl flex flex-col items-center",
              "text-3xl md:text-4xl text-slate-300 uppercase",
              "bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-600"
            )}
            style={{ animation: "breath 6s ease-in-out infinite" }}
          >
            <span>Lights dimming, showtime...</span>
            <span className="text-sm opacity-40 font-normal tracking-widest mt-4">鐏厜娓愭殫锛屽ソ鎴忓紑鍦?..</span>
          </p>
        </div>
      )}

      {/* Step 7: 涓撳睘鏀炬槧鍘?(Hero Section) */}
      {step === 7 && selectedMovie && (
        <div
          className={cn(
            "fixed inset-0 z-30 flex flex-col items-center justify-start px-4 sm:px-6 bg-[#020617] overflow-y-auto",
            "transition-all duration-[1500ms] ease-out",
            stepVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {selectedMovie.posterUrl && (
            <div className="absolute inset-0 z-0">
              <NextImage
                src={selectedMovie.posterUrl}
                alt={selectedMovie.title.en}
                fill
                priority
                sizes="100vw"
                className="object-cover blur-3xl opacity-20 scale-110"
              />
            </div>
          )}

          {/* 鑳屾櫙鍏夋檿澧炲己 */}
          <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
             <div className="w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-sky-900/10 rounded-full blur-[120px] animate-pulse" />
             <div className="absolute w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-blue-900/5 rounded-full blur-[100px]" style={{ animation: "breath 7s ease-in-out infinite" }} />
          </div>

          <div className="sticky top-0 z-40 w-full pt-24 pb-6 flex justify-center bg-gradient-to-b from-[#020617] via-[#020617]/90 to-transparent">
            <button
              onClick={() => setStep(5)}
              className="px-6 py-2 rounded-full border border-white/5 text-slate-500 text-[10px] uppercase tracking-widest hover:text-slate-300 hover:border-white/10 transition-all duration-300 bg-white/5 backdrop-blur-xl"
            >
              ← Reselect <span className="opacity-30 ml-1">重新选择</span>
            </button>
          </div>

          {/* 鏍稿績灞曠ず鍖?*/}
          <div className="relative z-10 w-full max-w-6xl pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
              <div className="flex items-center justify-center">
                {selectedMovie.posterUrl ? (
                  <div className="relative h-[52vh] max-h-[520px] w-auto md:h-auto md:w-[380px] aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/20 border border-white/10 bg-white/5">
                    <NextImage
                      src={selectedMovie.posterUrl}
                      alt={selectedMovie.title.en}
                      fill
                      sizes="(max-width: 768px) 80vw, 420px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/70 via-transparent to-transparent" />
                  </div>
                ) : (
                  <div className="w-[240px] sm:w-[320px] md:w-[380px] aspect-[2/3] rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 shadow-2xl shadow-blue-900/20" />
                )}
              </div>

              <div className="text-center md:text-left">
                <h2 className="text-4xl sm:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-300 to-slate-600 uppercase">
                  {selectedMovie.title.en}
                </h2>
                <div className="mt-3 text-xl sm:text-2xl font-bold text-slate-400 tracking-widest">
                  {selectedMovie.title.zh}
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs uppercase tracking-[0.35em] text-slate-500">
                  <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
                    {selectedMovie.year}
                  </span>
                  <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
                    Rating{" "}
                    <span className="text-yellow-300/90">
                      {typeof selectedMovie.rating === "number" ? selectedMovie.rating.toFixed(1) : "--"}
                    </span>
                  </span>
                </div>

                <div className="mt-10 relative max-w-xl mx-auto md:mx-0 break-words">
                  <span className="absolute -top-6 -left-2 text-5xl text-white/5 font-serif select-none">
                    &ldquo;
                  </span>
                  <div className="flex flex-col gap-5">
                    <blockquote className="text-xl sm:text-3xl italic font-serif text-sky-100/80 leading-relaxed tracking-wide break-words whitespace-normal">
                      {selectedMovie.vibe_quote.en}
                    </blockquote>
                    <blockquote className="text-base sm:text-xl font-medium text-sky-200/50 leading-relaxed tracking-wider break-words whitespace-normal">
                      {selectedMovie.vibe_quote.zh}
                    </blockquote>
                  </div>
                  <span className="absolute -bottom-6 -right-2 text-5xl text-white/5 font-serif select-none rotate-180">
                    &rdquo;
                  </span>
                </div>

                <div className="mt-10 flex flex-col gap-4 max-w-xl mx-auto md:mx-0">
                  <div className="text-slate-200/75 text-sm sm:text-base leading-relaxed whitespace-normal break-words">
                    {compactText(selectedMovie.reason.en, 260)}
                  </div>
                  <div className="text-slate-400/70 text-sm sm:text-[15px] leading-relaxed whitespace-normal break-words border-l-2 border-white/10 pl-4">
                    {compactText(selectedMovie.reason.zh, 140)}
                  </div>
                </div>
              </div>
            </div>

             {/* 鎸夐挳鍖哄煙 */}
             <div className="mt-12 flex flex-col sm:flex-row items-center gap-5 sm:gap-8 w-full justify-center px-4">
                <button
                  onClick={() => window.open(`https://search.bilibili.com/all?keyword=${encodeURIComponent(selectedMovie.title.zh + ' 鐢靛奖瑙ｈ')}`, '_blank')}
                  className={cn(
                    "group relative w-full sm:w-auto px-10 py-4 rounded-2xl text-sm sm:text-base font-bold tracking-[0.2em] text-white overflow-hidden transition-all duration-500 uppercase",
                    "bg-gradient-to-r from-blue-700 to-sky-600 active:scale-95",
                    "shadow-[0_0_30px_rgba(29,78,216,0.3)] hover:shadow-[0_0_50px_rgba(14,165,233,0.4)]",
                    "animate-pulse-glow"
                  )}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    Bilibili <span className="text-[10px] opacity-70 font-normal">瀵绘壘鍏遍福</span>
                  </span>
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                </button>

                <button
                  onClick={() => window.open(`https://www.douyin.com/search/${encodeURIComponent(selectedMovie.title.zh + ' 鐢靛奖瑙ｈ')}?source=normal&type=general`, '_blank')}
                  className={cn(
                    "group relative w-full sm:w-auto px-10 py-4 rounded-2xl text-sm sm:text-base font-bold tracking-[0.2em] text-white overflow-hidden transition-all duration-500 uppercase",
                    "bg-slate-900/80 border border-white/10 active:scale-95 backdrop-blur-xl",
                    "hover:border-sky-500/30 hover:shadow-[0_0_30px_rgba(14,165,233,0.15)]"
                  )}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    Douyin <span className="text-[10px] opacity-70 font-normal">瀵绘壘鍏遍福</span>
                  </span>
                  <div className="absolute inset-0 bg-sky-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </button>
             </div>

             <div className="mt-6 w-full max-w-2xl px-4 mx-auto">
               <button
                 onClick={handleGeneratePoster}
                 disabled={isPosterGenerating}
                 className={cn(
                   "group relative w-full min-h-14 rounded-2xl overflow-hidden transition-all duration-700 px-5 py-3",
                   "bg-gradient-to-r from-purple-700/80 via-indigo-700/80 to-sky-600/70 border border-white/10",
                   "shadow-[0_0_35px_rgba(168,85,247,0.18)] hover:shadow-[0_0_55px_rgba(168,85,247,0.28)]",
                   "active:scale-95 disabled:opacity-60"
                 )}
               >
                 <div
                   className="absolute inset-0 opacity-70"
                   style={{ animation: "breath 6s ease-in-out infinite", background: "radial-gradient(circle at 50% 50%, rgba(168,85,247,0.25) 0%, transparent 55%)" }}
                 />
                 <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 text-white text-sm sm:text-base font-semibold tracking-wide leading-tight text-center whitespace-normal">
                   {isPosterGenerating ? "正在生成海报..." : (
                     <>
                       <span>Generate Mood Poster</span>
                       <span>生成专属情绪海报</span>
                       <span className="text-white/80 text-xs sm:text-sm font-medium tracking-[0.2em] uppercase">Save Poster</span>
                     </>
                   )}
                 </span>
               </button>
               {posterError && (
                 <div className="mt-3 text-center text-xs tracking-widest text-rose-400/80">
                   {posterError}
                 </div>
               )}
             </div>

             <div className="mt-10 flex justify-center">
               <button
                 onClick={() => {
                   // 淇濆瓨鐘舵€佷互渚胯繑鍥?
                   sessionStorage.setItem('vibeStep', '7');
                   sessionStorage.setItem('selectedMovie', JSON.stringify(selectedMovie));
                   sessionStorage.setItem('mood', mood);
                   sessionStorage.setItem('moodCategory', moodCategory);
                   sessionStorage.setItem('healingMessage', healingMessage);
                   window.location.href = '/archive';
                 }}
                 className={cn(
                   "group relative flex items-center gap-4 px-8 py-4 rounded-2xl transition-all duration-500",
                   "bg-white/5 border border-white/10 backdrop-blur-xl",
                   "ring-1 ring-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]",
                   "hover:ring-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95"
                 )}
               >
                 <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                   <svg className="w-6 h-6 text-sky-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                   </svg>
                 </div>
                 <div className="text-left">
                   <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 group-hover:text-slate-300 transition-colors">
                     Emotional Archive
                   </div>
                   <div className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                     鍓嶅線鎯呯华妗ｆ瀹?<span className="opacity-40 ml-1">Archive this moment</span>
                   </div>
                 </div>
                 <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" 
                      style={{ background: 'radial-gradient(circle at center, rgba(14,165,233,0.15) 0%, transparent 70%)' }} />
               </button>
             </div>
          </div>
        </div>
      )}

     {/* 娴锋姤妯℃澘 DOM (闅愯棌娓叉煋鐢? */}
      {step === 7 && selectedMovie && (
        <div
          ref={posterRef}
          className="absolute top-0 left-0 -z-[9999] w-[375px] h-[812px] overflow-hidden bg-gradient-to-br from-slate-900 to-blue-950 text-slate-100 p-8 flex flex-col"
        >
          {/* 椤堕儴鏃ユ湡鍜屽績鎯?*/}
          <div className="flex items-start justify-between shrink-0">
            <div className="text-[10px] uppercase tracking-[0.35em] text-slate-300/70 font-bold">
              {new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
            </div>
            <div className="max-w-[180px] text-right">
              <div className="inline-flex px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold tracking-[0.2em] uppercase text-slate-200/80 truncate max-w-full">
                {mood || "Tonight's mood"}
              </div>
            </div>
          </div>

          {/* 娴锋姤涓诲浘涓庣數褰卞悕 */}
          <div className="mt-8 flex flex-col items-center shrink-0">
            {selectedMovie.posterUrl ? (
              <NextImage
                id="poster-img"
                src={selectedMovie.posterUrl}
                width={220}
                height={330}
                unoptimized
                crossOrigin="anonymous"
                alt={selectedMovie.title.en}
                className="w-[220px] h-[330px] object-cover rounded-2xl shadow-2xl shadow-blue-900/30 border border-white/10"
              />
            ) : (
              <div className="w-[220px] h-[330px] rounded-2xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border border-white/10" />
            )}
            <div className="mt-5 text-center">
              <div className="text-xl font-black tracking-tight uppercase line-clamp-1">
                {selectedMovie.title.en}
              </div>
              <div className="mt-1 text-[10px] font-bold tracking-[0.3em] uppercase text-slate-300/70">
                {selectedMovie.year}
              </div>
            </div>
          </div>

          {/* 娌绘剤鏂囨涓庡彴璇?(浣跨敤 flex-1 鎾戝紑绌洪棿锛岄伩鍏嶉噸鍙? */}
          <div className="mt-6 flex-1 flex flex-col justify-center space-y-4">
            <div className="text-base font-serif italic leading-relaxed text-slate-100/90 line-clamp-3">
              &ldquo;{healingMessage}&rdquo;
            </div>
            <div className="text-xs font-serif italic leading-relaxed text-slate-200/70 line-clamp-2">
              {selectedMovie.vibe_quote.en}
            </div>
            <div className="text-xs font-serif italic leading-relaxed text-slate-200/55 line-clamp-2">
              {selectedMovie.vibe_quote.zh}
            </div>
          </div>

          {/* 鍝佺墝鍖?(搴曢儴鏋佺畝姘村嵃) */}
          <div className="shrink-0 mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="text-[10px] text-slate-300/60 tracking-widest uppercase font-bold">
              VibeMovie
              <span className="block text-[8px] font-normal tracking-wide mt-1 opacity-70 capitalize">
                Cinema of Emotions
              </span>
            </div>
            <div className="flex items-center gap-1.5 opacity-80">
              <div className="w-2 h-2 rounded-full bg-sky-400" />
              <div className="w-2 h-2 rounded-sm bg-slate-300" />
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isPosterOpen && posterImage && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPosterOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="relative w-full max-w-[560px] bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 sm:p-8 flex flex-col items-center gap-6">
                {/* 棰勮鍥剧墖 */}
                <NextImage
                  src={posterImage}
                  alt="VibeMovie Poster"
                  width={375}
                  height={812}
                  unoptimized
                  className="w-full h-auto rounded-3xl border border-white/10 shadow-2xl max-w-[90vw]"
                />
                
                {/* 鎻愮ず鏂囨 */}
                <div className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center">
                  <div className="text-xs text-slate-300 tracking-wide font-medium">
                    馃摫 鎵嬫満绔彲闀挎寜娴锋姤鐩存帴淇濆瓨鍒扮浉鍐?
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 tracking-wide">
                    淇濆瓨鍚庡彲鍒嗕韩鍒版湅鍙嬪湀銆丵Q 鎴栧彂缁欎綘鐨勫叡楦ｅソ鍙?
                  </div>
                </div>

                {/* 搴曢儴涓夊ぇ鎿嶄綔鎸夐挳 */}
                <div className="w-full flex flex-col gap-3">
                  {/* 涓嬭浇涓庡垎浜苟鎺?*/}
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={posterImage}
                      download={`VibeMovie_${new Date().getTime()}.jpg`}
                      className="h-12 rounded-2xl bg-gradient-to-r from-blue-700 to-sky-600 text-white text-[11px] font-bold uppercase tracking-[0.2em] flex items-center justify-center hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                    >
                      涓嬭浇 <span className="opacity-50 ml-1.5 font-normal">Download</span>
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('馃敆 閾炬帴宸插鍒讹紝蹇幓鍒嗕韩浣犵殑鍏遍福鍚э紒');
                      }}
                      className="h-12 rounded-2xl bg-white/10 border border-white/10 text-white text-[11px] font-bold uppercase tracking-[0.2em] flex items-center justify-center hover:bg-white/15 active:scale-95 transition-all"
                    >
                      鍒嗕韩 <span className="opacity-50 ml-1.5 font-normal">Share</span>
                    </button>
                  </div>
                  
                  {/* 杩斿洖鎸夐挳鍗犳弧搴曞 */}
                  <button
                    onClick={() => setIsPosterOpen(false)}
                    className="w-full h-12 rounded-2xl text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500 hover:text-slate-200 border border-white/5 hover:border-white/10 transition-all bg-black/20"
                  >
                    杩斿洖 <span className="opacity-50 ml-1 font-normal">Back</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Step 1 / 3 / 5 鍏辩敤涓诲竷灞€ */}
      {(step === 1 || step === 3 || step === 5) && (
        <div
          ref={containerRef}
          className={cn(
            "relative z-20 flex flex-col items-center w-full px-4 pt-32 pb-12 min-h-full",
            "transition-all duration-1000 ease-[cubic-bezier(0.45,0,0.15,1)]",
            stepVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <span
            className="mb-3 text-5xl select-none transition-all duration-300 hover:rotate-12 hover:scale-110"
            aria-label="Cinema Icon"
          >
            馃幀
          </span>
          <h1
            className={cn(
              "bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-300 to-slate-600 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]",
              "text-center font-sans font-black select-none uppercase",
              "tracking-[0.15em] text-5xl sm:text-7xl md:text-8xl leading-[1] mb-6",
              "transition-all duration-300 hover:tracking-[0.2em]"
            )}
          >
            VibeMovie
            <span className="block text-sm sm:text-base font-light tracking-[0.5em] text-slate-500 mt-2">Cinema of Emotions <span className="opacity-50 font-normal"></span></span>
          </h1>
          <div className="mb-10 sm:mb-16 flex flex-col items-center gap-2 w-full max-w-2xl">
            <div
              className="font-medium text-slate-400 text-lg sm:text-xl tracking-wider text-center"
            >
              {subtitle}
            </div>
          </div>

          {step === 1 && (
            <MoodInputPanel
              mood={mood}
              setMood={setMood}
              isLoading={isLoading}
              error={error}
              stepVisible={stepVisible}
              onSubmit={handleSubmitMood}
            />
          )}

          {step === 3 && (
            <QuestionPanel
              questions={questions}
              answers={answers}
              setAnswers={setAnswers}
              allAnswered={allAnswered}
              isLoading={isLoading}
              error={error}
              stepVisible={stepVisible}
              onConfirm={handleConfirmAnswers}
            />
          )}

          {step === 5 && (
            <RecommendationGrid
              movies={movies}
              setSelectedMovie={setSelectedMovie}
              setStep={setStep}
              stepVisible={stepVisible}
              onReset={handleReset}
            />
          )}
        </div>
      )}
    </div>
  );
}
