export function LemonGraphic({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 220"
      className={className}
      aria-hidden="true"
      role="img"
    >
      <defs>
        <radialGradient id="lemonBody" cx="38%" cy="32%" r="72%">
          <stop offset="0%" stopColor="#fff4a8" />
          <stop offset="38%" stopColor="#ffe14a" />
          <stop offset="78%" stopColor="#f5c400" />
          <stop offset="100%" stopColor="#d4a000" />
        </radialGradient>
        <radialGradient id="lemonShade" cx="70%" cy="78%" r="55%">
          <stop offset="0%" stopColor="#c98900" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#c98900" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8ee06a" />
          <stop offset="100%" stopColor="#3d9a2f" />
        </linearGradient>
      </defs>
      <ellipse cx="102" cy="198" rx="46" ry="10" fill="oklch(0.2 0.04 120 / 0.28)" />
      <path
        d="M104 18 C112 8 132 14 128 32 C148 28 164 48 150 56"
        fill="url(#leaf)"
        stroke="#2f7a24"
        strokeWidth="2"
      />
      <path d="M108 34 C108 18 100 8 94 4" fill="none" stroke="#3d6b28" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="100" cy="118" rx="78" ry="90" fill="url(#lemonBody)" />
      <ellipse cx="100" cy="118" rx="78" ry="90" fill="url(#lemonShade)" />
      <ellipse cx="100" cy="38" rx="16" ry="8" fill="#e8c430" />
      <ellipse cx="100" cy="198" rx="14" ry="7" fill="#e0b400" />
      <ellipse cx="62" cy="78" rx="18" ry="12" fill="#fff8c4" opacity="0.45" />
      {Array.from({ length: 14 }).map((_, index) => {
        const angle = (index / 14) * Math.PI * 2;
        const rx = 46 + (index % 3) * 8;
        const ry = 54 + (index % 2) * 10;
        return (
          <circle
            key={index}
            cx={100 + Math.cos(angle) * rx}
            cy={118 + Math.sin(angle) * ry}
            r={index % 4 === 0 ? 2.2 : 1.5}
            fill="#e2b400"
            opacity="0.35"
          />
        );
      })}
    </svg>
  );
}

export function MiniLemon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="miniLemon" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff3a0" />
          <stop offset="100%" stopColor="#f0c000" />
        </radialGradient>
      </defs>
      <ellipse cx="32" cy="36" rx="22" ry="24" fill="url(#miniLemon)" />
      <path d="M32 12 C34 6 42 8 40 16 C46 14 48 22 42 24" fill="#4fad38" />
    </svg>
  );
}
