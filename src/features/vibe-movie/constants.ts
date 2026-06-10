export const moodBackgrounds: Record<string, string> = {
  ocean: "/backgrounds/mood-ocean.jpg",
  forest: "/backgrounds/mood-forest.jpg",
  night: "/backgrounds/mood-night.jpg",
  rain: "/backgrounds/mood-rain.jpg",
  space: "/backgrounds/mood-space.jpg",
  deep: "/backgrounds/mood-night.jpg",
  healing: "/backgrounds/mood-forest.jpg",
};

export type LutPreset = "cinematic" | "wkw" | "blade";

export const LUT_PRESETS: Record<LutPreset, string> = {
  cinematic:
    "linear-gradient(145deg, rgba(6,14,34,0.76) 0%, rgba(8,18,42,0.68) 46%, rgba(4,10,26,0.82) 100%), radial-gradient(circle at 20% 18%, rgba(56,189,248,0.15) 0%, rgba(56,189,248,0) 40%), radial-gradient(circle at 82% 84%, rgba(99,102,241,0.16) 0%, rgba(99,102,241,0) 44%)",
  wkw:
    "linear-gradient(150deg, rgba(20,8,12,0.72) 0%, rgba(46,18,28,0.58) 42%, rgba(14,8,14,0.78) 100%), radial-gradient(circle at 18% 24%, rgba(244,114,182,0.2) 0%, rgba(244,114,182,0) 42%), radial-gradient(circle at 78% 82%, rgba(250,204,21,0.16) 0%, rgba(250,204,21,0) 46%)",
  blade:
    "linear-gradient(145deg, rgba(4,18,26,0.78) 0%, rgba(6,30,38,0.62) 45%, rgba(4,10,16,0.84) 100%), radial-gradient(circle at 20% 18%, rgba(34,211,238,0.2) 0%, rgba(34,211,238,0) 40%), radial-gradient(circle at 82% 84%, rgba(249,115,22,0.2) 0%, rgba(249,115,22,0) 44%)",
};

export const LUT_LABELS: Record<LutPreset, string> = {
  cinematic: "CINEMA",
  wkw: "WKW",
  blade: "BLADE",
};

export const TRANSITION_PHRASES = [
  "Movies are a legal escape. Your exit is opening...",
  "Piecing together those scattered echoes of your heart...",
  "Take your seat. The screen is about to glow...",
];

export type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;
