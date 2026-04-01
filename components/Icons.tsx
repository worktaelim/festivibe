// 2.5D illustrated icons — Airbnb style
// Each icon uses layered gradients + drop shadows for depth

export function CactusIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cact-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <linearGradient id="cact-arm-l" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <linearGradient id="cact-arm-r" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <linearGradient id="cact-pot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        <linearGradient id="cact-soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <filter id="cact-shadow">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#00000033" />
        </filter>
      </defs>
      {/* Pot */}
      <rect x="15" y="38" width="18" height="7" rx="3" fill="url(#cact-pot)" filter="url(#cact-shadow)" />
      {/* Soil */}
      <ellipse cx="24" cy="38.5" rx="9" ry="2.5" fill="url(#cact-soil)" />
      {/* Main body */}
      <rect x="19" y="14" width="10" height="26" rx="5" fill="url(#cact-body)" filter="url(#cact-shadow)" />
      {/* Left arm */}
      <rect x="10" y="20" width="9" height="6" rx="3" fill="url(#cact-arm-l)" />
      <rect x="10" y="14" width="6" height="12" rx="3" fill="url(#cact-arm-l)" />
      {/* Right arm */}
      <rect x="29" y="24" width="9" height="6" rx="3" fill="url(#cact-arm-r)" />
      <rect x="32" y="18" width="6" height="12" rx="3" fill="url(#cact-arm-r)" />
      {/* Highlight on body */}
      <rect x="21" y="15" width="3" height="14" rx="1.5" fill="white" opacity="0.2" />
      {/* Spines */}
      <line x1="24" y1="19" x2="27" y2="17" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <line x1="24" y1="25" x2="27" y2="23" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <line x1="24" y1="31" x2="27" y2="29" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function CameraIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cam-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id="cam-lens" x1="0.2" y1="0.2" x2="0.8" y2="0.8">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="60%" stopColor="#312e81" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
        <radialGradient id="cam-lens-shine" cx="35%" cy="35%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <filter id="cam-shadow">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#4f46e533" />
        </filter>
      </defs>
      {/* Body */}
      <rect x="4" y="11" width="32" height="22" rx="6" fill="url(#cam-body)" filter="url(#cam-shadow)" />
      {/* Notch */}
      <rect x="14" y="8" width="8" height="5" rx="2.5" fill="url(#cam-body)" />
      {/* Flash */}
      <rect x="7" y="14" width="6" height="4" rx="2" fill="white" opacity="0.3" />
      {/* Lens outer */}
      <circle cx="22" cy="22" r="8" fill="url(#cam-lens)" />
      {/* Lens ring */}
      <circle cx="22" cy="22" r="8" fill="none" stroke="white" strokeWidth="1" opacity="0.2" />
      <circle cx="22" cy="22" r="5.5" fill="#0f0a2e" />
      {/* Lens shine */}
      <circle cx="22" cy="22" r="5.5" fill="url(#cam-lens-shine)" />
      {/* Top highlight */}
      <rect x="6" y="12" width="28" height="3" rx="3" fill="white" opacity="0.15" />
    </svg>
  );
}

export function HeartIcon({ size = 24, filled = false }: { size?: number; filled?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="heart-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f72585" />
          <stop offset="100%" stopColor="#b5179e" />
        </linearGradient>
        <filter id="heart-glow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#f7258555" />
        </filter>
      </defs>
      {filled ? (
        <>
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="url(#heart-fill)"
            filter="url(#heart-glow)"
          />
          {/* Shine */}
          <path d="M8 7 C8 7 9 5.5 11 6" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
        </>
      ) : (
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="none"
          stroke="rgba(28,20,16,0.55)"
          strokeWidth="1.8"
        />
      )}
    </svg>
  );
}

export function HeartEmptyLarge({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="heart-lg-stroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f72585" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7b2fff" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <path
        d="M28 48l-3.4-3.09C12.6 35.5 5 29.32 5 21.5 5 14.98 10.15 10 16.75 10c3.64 0 7.12 1.7 9.25 4.38C28.13 11.7 31.61 10 35.25 10 41.85 10 47 14.98 47 21.5c0 7.82-7.6 14-19.6 23.41L28 48z"
        fill="none"
        stroke="url(#heart-lg-stroke)"
        strokeWidth="2"
      />
    </svg>
  );
}

export function CrewIcon({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="crew-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
        <linearGradient id="crew-b" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <filter id="crew-shadow">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#00000033" />
        </filter>
      </defs>
      {/* Back person */}
      <circle cx="33" cy="18" r="7" fill="url(#crew-b)" filter="url(#crew-shadow)" opacity="0.85" />
      <path d="M20 46c0-8.28 5.82-15 13-15s13 6.72 13 15" fill="url(#crew-b)" opacity="0.7" />
      {/* Front person */}
      <circle cx="22" cy="20" r="8" fill="url(#crew-a)" filter="url(#crew-shadow)" />
      <path d="M8 48c0-9.39 6.27-17 14-17s14 7.61 14 17" fill="url(#crew-a)" />
      {/* Highlights */}
      <path d="M19 14 C19 14 20.5 12 23 13" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

export function MusicIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="music-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f72585" />
          <stop offset="100%" stopColor="#fb8500" />
        </linearGradient>
        <filter id="music-shadow">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#f7258544" />
        </filter>
      </defs>
      {/* Note stem */}
      <rect x="13" y="3" width="2.5" height="12" rx="1.25" fill="url(#music-grad)" filter="url(#music-shadow)" />
      {/* Note flag */}
      <path d="M15.5 3 C15.5 3 19 4.5 19 8" stroke="url(#music-grad)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      {/* Note head */}
      <ellipse cx="11.5" cy="15.5" rx="4" ry="3" transform="rotate(-15 11.5 15.5)" fill="url(#music-grad)" filter="url(#music-shadow)" />
      {/* Shine */}
      <ellipse cx="10" cy="14.5" rx="1.5" ry="1" transform="rotate(-15 10 14.5)" fill="white" opacity="0.3" />
    </svg>
  );
}

export function MusicIconLarge({ size = 22, active = false }: { size?: number; active?: boolean }) {
  const color = active ? "#e03030" : "rgba(28,20,16,0.5)";
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="music-nav-active" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f72585" />
          <stop offset="100%" stopColor="#fb8500" />
        </linearGradient>
      </defs>
      <rect x="13" y="3" width="2.5" height="12" rx="1.25" fill={color} />
      <path d="M15.5 3 C15.5 3 19 4.5 19 8" stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <ellipse cx="11.5" cy="15.5" rx="4" ry="3" transform="rotate(-15 11.5 15.5)" fill={color} />
    </svg>
  );
}

export function HeartNavIcon({ size = 22, active = false }: { size?: number; active?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="heart-nav-active" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f72585" />
          <stop offset="100%" stopColor="#b5179e" />
        </linearGradient>
        <filter id="heart-nav-glow">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#f7258544" />
        </filter>
      </defs>
      <path
        d="M11 19.27l-1.33-1.21C4.95 14.14 2 11.26 2 7.8 2 5 4.24 3 7 3c1.6 0 3.13.74 4 1.91C11.87 3.74 13.4 3 15 3c2.76 0 5 2 5 4.8 0 3.46-2.95 6.34-7.67 10.26L11 19.27z"
        fill={active ? "#e03030" : "none"}
        stroke={active ? "none" : "rgba(28,20,16,0.5)"}
        strokeWidth="1.6"
        filter={active ? "url(#heart-nav-glow)" : "none"}
      />
      {active && <path d="M7.5 6.5C7.5 6.5 8.5 5.2 10 5.8" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.45" />}
    </svg>
  );
}

export function CrewNavIcon({ size = 22, active = false }: { size?: number; active?: boolean }) {
  const fill = active ? "#e03030" : "rgba(28,20,16,0.45)";
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="crew-nav-active" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f72585" />
          <stop offset="100%" stopColor="#7b2fff" />
        </linearGradient>
      </defs>
      {/* Back person */}
      <circle cx="14.5" cy="7.5" r="3" fill={fill} opacity="0.7" />
      <path d="M9 20c0-3.87 2.46-7 5.5-7s5.5 3.13 5.5 7" fill={fill} opacity="0.6" />
      {/* Front person */}
      <circle cx="8" cy="8" r="3.5" fill={fill} />
      <path d="M2 20c0-4.42 2.69-8 6-8s6 3.58 6 8" fill={fill} />
    </svg>
  );
}

export function LightningIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lightning-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <filter id="lightning-glow">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#fbbf2466" />
        </filter>
      </defs>
      <path
        d="M8.5 1.5 L4 8 L7 8 L5.5 13 L11 6 L8 6 Z"
        fill="url(#lightning-grad)"
        filter="url(#lightning-glow)"
      />
      <path d="M6.5 3.5 L6 5.5" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function CloseIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="9" r="8" fill="rgba(255,255,255,0.07)" />
      <path d="M6 6l6 6M12 6l-6 6" stroke="rgba(240,240,245,0.35)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
