"use client";

// Animated arc gauge for the overall score.
// Pure SVG so it's crisp at any size and prints nicely.

interface Props {
  score: number;   // 0..100
  verdict: string;
}

export function ScoreGauge({ score, verdict }: Props) {
  const radius = 92;
  const circumference = 2 * Math.PI * radius;
  // We draw a 270° arc (3/4 circle) so the gauge has a "dial" feel.
  const arcLength = circumference * 0.75;
  const filled = arcLength * (score / 100);

  // Pick stroke colour by score band, matching the verdict tone.
  const stroke =
    score >= 65 ? "var(--sage)" : score >= 45 ? "var(--ochre)" : "var(--rose)";

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg
        width="220"
        height="220"
        viewBox="0 0 220 220"
        className="-rotate-[135deg]"
        aria-label={`Score: ${score} out of 100`}
      >
        {/* Track */}
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke="var(--rule)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
        />
        {/* Filled arc */}
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
          style={{
            transition: "stroke-dasharray 1.2s cubic-bezier(0.2, 0.6, 0.2, 1)",
          }}
        />
        {/* Tick marks at 0, 25, 50, 75, 100 along the arc */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const angle = (t * 0.75) * Math.PI * 2; // 0..270°
          const x1 = 110 + Math.cos(angle) * (radius + 8);
          const y1 = 110 + Math.sin(angle) * (radius + 8);
          const x2 = 110 + Math.cos(angle) * (radius + 14);
          const y2 = 110 + Math.sin(angle) * (radius + 14);
          return (
            <line
              key={t}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="var(--ink-mute)"
              strokeWidth="1"
              opacity="0.5"
            />
          );
        })}
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="display text-7xl text-ink leading-none">{score}</div>
        <div className="eyebrow mt-2">/ 100</div>
      </div>

      <div className="mt-4 text-center">
        <div className="display text-2xl italic text-ink-soft">{verdict}</div>
      </div>
    </div>
  );
}
