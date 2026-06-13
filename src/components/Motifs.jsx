// Madhubani-inspired decorative motifs used throughout the app.

export const SunMotif = ({ className = "" }) => (
  <svg viewBox="0 0 60 60" className={className} fill="none">
    <circle cx="30" cy="30" r="10" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="30" cy="30" r="6" stroke="currentColor" strokeWidth="1" />
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i * Math.PI * 2) / 12;
      return (
        <line key={i}
          x1={30 + Math.cos(a) * 12} y1={30 + Math.sin(a) * 12}
          x2={30 + Math.cos(a) * 22} y2={30 + Math.sin(a) * 22}
          stroke="currentColor" strokeWidth="1.2" />
      );
    })}
  </svg>
);

export const LotusMotif = ({ className = "" }) => (
  <svg viewBox="0 0 60 60" className={className} fill="none">
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i * Math.PI * 2) / 8;
      return (
        <ellipse key={i}
          cx={30 + Math.cos(a) * 10} cy={30 + Math.sin(a) * 10}
          rx="6" ry="14"
          transform={`rotate(${(a * 180) / Math.PI + 90} ${30 + Math.cos(a) * 10} ${30 + Math.sin(a) * 10})`}
          stroke="currentColor" strokeWidth="1.2" />
      );
    })}
    <circle cx="30" cy="30" r="4" fill="currentColor" />
  </svg>
);

export const FishMotif = ({ className = "" }) => (
  <svg viewBox="0 0 80 40" className={className} fill="none">
    <path d="M5 20 Q20 5 50 20 Q20 35 5 20 Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M50 20 L70 8 L70 32 Z" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="20" cy="20" r="2" fill="currentColor" />
    <path d="M25 15 Q30 20 25 25" stroke="currentColor" strokeWidth="1" fill="none" />
    <path d="M32 13 Q37 20 32 27" stroke="currentColor" strokeWidth="1" fill="none" />
    <path d="M39 11 Q44 20 39 29" stroke="currentColor" strokeWidth="1" fill="none" />
  </svg>
);

export const PeacockMotif = ({ className = "" }) => (
  <svg viewBox="0 0 80 80" className={className} fill="none">
    {/* Body */}
    <ellipse cx="40" cy="55" rx="8" ry="14" stroke="currentColor" strokeWidth="1.5" />
    {/* Neck */}
    <path d="M40 41 Q44 30 38 22" stroke="currentColor" strokeWidth="1.5" />
    {/* Head */}
    <circle cx="36" cy="20" r="4" stroke="currentColor" strokeWidth="1.5" />
    {/* Crest */}
    <line x1="35" y1="17" x2="33" y2="13" stroke="currentColor" strokeWidth="1" />
    <line x1="36" y1="17" x2="36" y2="12" stroke="currentColor" strokeWidth="1" />
    <line x1="37" y1="17" x2="39" y2="13" stroke="currentColor" strokeWidth="1" />
    {/* Tail feathers - fan */}
    {Array.from({ length: 7 }).map((_, i) => {
      const a = (-Math.PI / 2.5) + (i * (Math.PI / 7));
      const x2 = 40 + Math.cos(a) * 28;
      const y2 = 55 + Math.sin(a) * 28;
      return (
        <g key={i}>
          <line x1="40" y1="55" x2={x2} y2={y2} stroke="currentColor" strokeWidth="1" />
          <circle cx={x2} cy={y2} r="3" stroke="currentColor" strokeWidth="1" />
          <circle cx={x2} cy={y2} r="1" fill="currentColor" />
        </g>
      );
    })}
  </svg>
);

// Paag — the Maithil ceremonial turban, with its distinctive jutting front peak.
export const PaagMotif = ({ className = "" }) => (
  <svg viewBox="0 0 84 60" className={className} fill="none">
    {/* silhouette: a flared base, the back sweeping over to a sharp forward peak */}
    <path d="M12 50 Q7 28 24 20 Q38 13 48 17 L64 3 Q67 11 58 22 Q74 32 72 50"
          stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    {/* flared base resting line */}
    <path d="M12 50 Q42 58 72 50" stroke="currentColor" strokeWidth="1.5" />
    {/* wrap folds following the crown */}
    <path d="M22 48 Q24 32 42 22" stroke="currentColor" strokeWidth="1" />
    <path d="M34 49 Q40 32 52 22" stroke="currentColor" strokeWidth="1" />
    <path d="M46 49 Q54 34 60 26" stroke="currentColor" strokeWidth="1" />
    {/* ornament at the peak's base */}
    <circle cx="52" cy="18" r="1.8" fill="currentColor" />
  </svg>
);

// Joṛā maachh — the auspicious double-fish, a mirrored pair facing each other.
export const JoraMaachhMotif = ({ className = "" }) => {
  const Fish = (
    <>
      <path d="M4 22 Q19 8 49 22 Q19 36 4 22 Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M49 22 L67 11 L67 33 Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="22" r="1.8" fill="currentColor" />
      <path d="M24 17 Q29 22 24 27" stroke="currentColor" strokeWidth="1" />
      <path d="M31 15 Q36 22 31 29" stroke="currentColor" strokeWidth="1" />
    </>
  );
  return (
    <svg viewBox="0 0 150 44" className={className} fill="none">
      <g transform="translate(72,0) scale(-1,1)">{Fish}</g>
      <g transform="translate(74,0)">{Fish}</g>
    </svg>
  );
};

export const BorderPattern = () => (
  <svg viewBox="0 0 400 16" preserveAspectRatio="none" className="w-full h-4">
    <pattern id="tri-mcsa" x="0" y="0" width="20" height="16" patternUnits="userSpaceOnUse">
      <path d="M0 14 L10 2 L20 14 Z" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="10" cy="9" r="1.5" fill="currentColor" />
    </pattern>
    <rect width="400" height="16" fill="url(#tri-mcsa)" />
  </svg>
);

// Vine/floral side border used on placeholder pages
export const VineBorder = ({ className = "" }) => (
  <svg viewBox="0 0 40 200" preserveAspectRatio="none" className={className} fill="none">
    <path d="M20 0 Q30 25 20 50 Q10 75 20 100 Q30 125 20 150 Q10 175 20 200"
          stroke="currentColor" strokeWidth="1" />
    {[20, 60, 100, 140, 180].map((y, i) => (
      <g key={i}>
        <ellipse cx={i % 2 === 0 ? 30 : 10} cy={y} rx="5" ry="3"
                 transform={`rotate(${i % 2 === 0 ? 45 : -45} ${i % 2 === 0 ? 30 : 10} ${y})`}
                 stroke="currentColor" strokeWidth="1" />
        <circle cx={i % 2 === 0 ? 35 : 5} cy={y + (i % 2 === 0 ? 4 : -4)} r="2"
                stroke="currentColor" strokeWidth="1" />
      </g>
    ))}
  </svg>
);
