/**
 * AgentPulse mark — an Arc-inspired arch "A" in a deep-navy gradient disc.
 * Used in the sidebar, topbar and as the favicon (app/icon.svg mirrors this).
 */
export function Logo({
  size = 36,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="AgentPulse"
    >
      <defs>
        <radialGradient id="apLogoBg" cx="50%" cy="34%" r="80%">
          <stop offset="0%" stopColor="#27508c" />
          <stop offset="60%" stopColor="#102a52" />
          <stop offset="100%" stopColor="#070e1e" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#apLogoBg)" />
      {/* main arch (left leg, rounded apex, right leg) */}
      <path
        d="M31 80 L31 49 Q31 25 50 25 Q69 25 69 49 L69 80"
        fill="none"
        stroke="#ffffff"
        strokeWidth="12.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* right foot flaring outward — Arc's signature detail */}
      <path
        d="M69 71 q0 9 10 10"
        fill="none"
        stroke="#ffffff"
        strokeWidth="12.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
