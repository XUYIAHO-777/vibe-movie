export function FilmGrain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30 mix-blend-soft-light"
      style={{
        backgroundImage:
          'url("data:image/svg+xml;utf8,<svg width=\'1200\' height=\'900\' viewBox=\'0 0 1200 900\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'grain\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.92\' numOctaves=\'4\' seed=\'2\' /></filter><rect width=\'1200\' height=\'900\' filter=\'url(%23grain)\' opacity=\'0.13\'/></svg>")',
        backgroundSize: "cover",
        opacity: 0.15,
        pointerEvents: "none",
      }}
    />
  );
}

export function DeepGradientBG() {
  return (
    <>
      <div aria-hidden className="fixed inset-0 z-0 bg-[#020617]" />
      <div
        aria-hidden
        className="fixed inset-0 z-0 bg-gradient-to-br from-[#020617] via-[#010b21] to-[#020617] opacity-90"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-[-30%] z-10 h-[700px] w-[1200px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% 25%, rgba(7,89,133,0.1) 0%, rgba(30,58,138,0.05) 52%, rgba(2,6,23,0.07) 100%)",
          filter: "blur(80px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed left-1/2 bottom-[-17%] z-10 h-[800px] w-[1600px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse 70% 33% at 50% 95%, rgba(30,58,138,0.12) 0%, rgba(15,23,42,0.08) 56%, rgba(2,6,23,0.001) 100%)",
          filter: "blur(100px)",
        }}
      />
    </>
  );
}
