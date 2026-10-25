// A thin line-art car, drawn as an SVG. It takes its colour from the text
// colour, so a Tailwind `text-*` class recolours it. `tall` gives a boxier
// body for SUVs, MPVs and pickups.
export default function CarSilhouette({ tall = false, className = "" }) {
  const body = tall
    ? "M12 62 V46 Q12 40 20 38 L48 33 L64 12 Q67 9 72 9 H160 Q166 9 169 13 L180 33 L214 38 Q224 40 224 48 V62"
    : "M12 62 V52 Q12 46 20 44 L52 38 L74 18 Q77 15 82 15 H146 Q151 15 155 19 L176 38 L212 44 Q224 46 224 54 V62";
  const window = tall
    ? "M72 33 L82 14 H158 L170 33 Z"
    : "M80 38 L92 20 H146 L166 38 Z";

  return (
    <svg
      viewBox="0 0 236 80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={body} vectorEffect="non-scaling-stroke" />
      <path d={window} vectorEffect="non-scaling-stroke" />
      <path d="M12 62 H224" vectorEffect="non-scaling-stroke" />
      {/* Wheels are filled with the page colour so they sit "in front" of the body line. */}
      <circle cx="58" cy="64" r="14" fill="#0f1011" vectorEffect="non-scaling-stroke" />
      <circle cx="178" cy="64" r="14" fill="#0f1011" vectorEffect="non-scaling-stroke" />
      <circle cx="58" cy="64" r="5" vectorEffect="non-scaling-stroke" />
      <circle cx="178" cy="64" r="5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}