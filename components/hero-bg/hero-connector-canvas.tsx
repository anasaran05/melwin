'use client'

export function HeroConnectorCanvas() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <svg
        className="w-full h-full opacity-40"
        viewBox="0 0 1400 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Background Grid Pattern */}
        <defs>
          <pattern
            id="heroGrid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#2563eb"
              strokeWidth="0.5"
              strokeOpacity="0.08"
            />
          </pattern>

          {/* Node Glow Filters */}
          <radialGradient id="blueNodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="100%" height="100%" fill="url(#heroGrid)" />

        {/* --- Top Left Curved Guide --- */}
        <path
          d="M 100 160 L 220 160 Q 260 160 260 200 L 260 280 Q 260 340 380 340 L 700 340"
          stroke="#bfdbfe"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* --- Top Right Curved Guide --- */}
        <path
          d="M 1300 160 L 1180 160 Q 1140 160 1140 200 L 1140 280 Q 1140 340 1020 340 L 700 340"
          stroke="#bfdbfe"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Center Node Accent */}
        <circle cx="700" cy="340" r="5" fill="#2563eb" />
        <circle cx="700" cy="340" r="16" fill="url(#blueNodeGlow)" />
      </svg>
    </div>
  )
}
