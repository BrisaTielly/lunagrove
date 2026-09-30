import "./sprites.css";

export type LumiState = "idle" | "blink" | "water" | "walk" | "celebrate" | "rest";

interface LumiProps {
  state: LumiState;
  reducedMotion?: boolean;
  className?: string;
}

export function Lumi({ state, reducedMotion = false, className = "" }: LumiProps) {
  const resting = state === "rest";
  const eyesClosed = resting || state === "blink";
  const watering = state === "water";
  const celebrating = state === "celebrate";

  return (
    <svg
      className={`lumi lumi--${state}${reducedMotion ? " lumi--reduced-motion" : ""} ${className}`.trim()}
      data-state={state}
      role="img"
      aria-label={`Lumi, the moon gardener, ${state}`}
      viewBox="0 0 48 48"
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="lumi__sparkles" aria-hidden="true">
        {celebrating && (
          <>
            <path fill="#f4b85d" d="M5 11h2V8h2v3h2v2H9v3H7v-3H5z" />
            <path fill="#ffe6a7" d="M39 7h2V4h2v3h2v2h-2v3h-2V9h-2z" />
          </>
        )}
      </g>

      <g className="lumi__sprout" aria-hidden="true">
        <path fill="#171a2f" d="M22 7h3v5h-3zM16 4h7v5h-4V7h-3zM25 3h7v4h-3v2h-4z" />
        <path fill="#83aa62" d="M17 4h5v3h-3V6h-2zM26 4h5v2h-3v2h-2zM23 7h1v5h-1z" />
      </g>

      <g className="lumi__body" aria-hidden="true">
        <path
          fill="#171a2f"
          d="M14 10h20v2h5v4h3v6h2v13h-3v5h-6v3H13v-2H8v-4H5V22h2v-6h3v-3h4z"
        />
        <path
          fill="#ffe6a7"
          d="M15 12h18v2h5v4h2v5h2v11h-3v4h-6v2H14v-2H9v-4H7V23h2v-6h3v-3h3z"
        />
        <path fill="#f4b85d" d="M15 13h5v2h-3v2h-3v4h-2v-5h3z" opacity=".55" />
        <path fill="#ef806f" d="M11 29h4v2h-4zM34 29h4v2h-4z" opacity=".75" />

        <path fill="#f4b85d" d="M20 16h7v2h-3v2h-3v-2h-1z" />
        <path fill="#ffe6a7" d="M23 15h5v2h-2v2h-3z" />

        {eyesClosed ? (
          <path fill="#171a2f" d="M13 25h7v2h-7zM30 25h7v2h-7z" />
        ) : (
          <>
            <path fill="#171a2f" d="M13 22h7v9h-7zM30 22h7v9h-7z" />
            <path fill="#fff8dc" d="M15 23h3v3h-3zM32 23h3v3h-3z" />
            <path fill="#aaa0d2" d="M14 28h2v2h-2zM31 28h2v2h-2z" />
          </>
        )}

        {resting ? (
          <path fill="#171a2f" d="M23 32h5v2h-5z" />
        ) : celebrating ? (
          <path fill="#171a2f" d="M21 32h9v3h-2v2h-5v-2h-2z" />
        ) : (
          <path fill="#171a2f" d="M22 33h7v2h-2v2h-3v-2h-2z" />
        )}
      </g>

      <g className="lumi__feet" aria-hidden="true">
        <path fill="#171a2f" d="M10 40h12v5H8v-3h2zM29 40h10v2h3v3H28z" />
        <path fill="#302b52" d="M11 41h9v2h-9zM30 41h8v2h-8z" />
      </g>

      {watering && (
        <g className="lumi__watering-can" aria-hidden="true">
          <path fill="#171a2f" d="M2 31h14v3h3v9H5v-2H2zM16 32h5v2h3v3h-3v-2h-5z" />
          <path fill="#68aeb8" d="M4 33h11v8H6v-2H4zM16 34h4v2h-4z" />
          <path fill="#aaa0d2" d="M6 34h3v2H6z" />
          <path fill="#68aeb8" d="M0 28h3v2H0zM1 32h2v2H1z" />
        </g>
      )}
    </svg>
  );
}
