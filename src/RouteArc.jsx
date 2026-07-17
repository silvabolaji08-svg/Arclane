// src/RouteArc.jsx
export default function RouteArc({ origin, destination }) {
  return (
    <svg viewBox="0 0 520 160" width="100%" height="160">
      {/* Static dashed guide line */}
      <path
        id="flightPath"
        d="M 40 130 Q 260 -10 480 130"
        fill="none"
        stroke="rgba(247,248,250,0.15)"
        strokeWidth="1.5"
        strokeDasharray="2 8"
        strokeLinecap="round"
      />

      {/* Animated "flowing" overlay on the same curve */}
      <path
        d="M 40 130 Q 260 -10 480 130"
        fill="none"
        stroke="#F2A65A"
        strokeWidth="1.5"
        strokeDasharray="6 10"
        strokeLinecap="round"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="-160"
          dur="6s"
          repeatCount="indefinite"
        />
      </path>

      {/* Endpoint dots */}
      <circle cx="40" cy="130" r="5" fill="#F7F8FA" />
      <circle cx="480" cy="130" r="5" fill="#F2A65A" />

      {/* Airport code labels */}
      <text x="40" y="152" textAnchor="middle" fill="#F7F8FA" fontFamily="monospace" fontSize="14" fontWeight="700">
        {origin}
      </text>
      <text x="480" y="152" textAnchor="middle" fill="#F2A65A" fontFamily="monospace" fontSize="14" fontWeight="700">
        {destination}
      </text>

      {/* Plane riding the curve */}
      <g>
        <animateMotion dur="6s" repeatCount="indefinite" rotate="auto">
          <mpath href="#flightPath" />
        </animateMotion>
        <path d="M-8 0 L-11 8 L-8 6 L-5 8 Z" fill="#F7F8FA" transform="rotate(90)" />
      </g>
    </svg>
  );
}