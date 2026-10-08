// Brand mark: "the wedge" — a level gold line over a green wedge that is
// thick where the ground is low and thin where it is high.
// Green is Pantone 348 C (#00843D); gold is Pantone 116 C (#FFCD00).
// Three optical weights, as drawn on the logo board; matches the site favicon.
const MARK = {
  large: {
    wedge: "M7 19H41V28L7 41Z",
    line: { x: 7, y: 12, width: 34, height: 4, rx: 2 },
  },
  medium: {
    wedge: "M6 19H42V28L6 42Z",
    line: { x: 6, y: 11, width: 36, height: 4.5, rx: 2 },
  },
  small: {
    wedge: "M4 20H44V29L4 44Z",
    line: { x: 4, y: 8, width: 40, height: 6.5, rx: 2.5 },
  },
};

export default function Logo({ size = 34 }: { size?: number }) {
  const mark = size >= 40 ? MARK.large : size >= 24 ? MARK.medium : MARK.small;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d={mark.wedge} className="fill-[#00843d] dark:fill-[#3ab36f]" />
      <rect {...mark.line} fill="#ffcd00" />
    </svg>
  );
}
