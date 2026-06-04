// A small stylized lotus / aripan motif evoking Sita Mata.
// Eight petals around a center bindu — Madhubani-inspired, indigo by default.

export function SitaMotif({ size = 18, color = "var(--indigo)", opacity = 0.85 }) {
  const petals = Array.from({ length: 8 }, (_, i) => (i * 360) / 8);
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* Petals */}
      {petals.map((deg, i) => (
        <ellipse
          key={i}
          cx="16"
          cy="9"
          rx="2.4"
          ry="5.5"
          transform={`rotate(${deg} 16 16)`}
          fill="none"
          stroke={color}
          strokeWidth="0.9"
        />
      ))}
      {/* Inner bindu */}
      <circle cx="16" cy="16" r="1.6" fill={color} />
      <circle cx="16" cy="16" r="3" fill="none" stroke={color} strokeWidth="0.7" />
    </svg>
  );
}
