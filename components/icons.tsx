import type { SVGProps } from "react";
import type { Category } from "@/lib/constants";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Crystal(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2.5 4 8l3 13.5h10L20 8 12 2.5Z" />
      <path d="M8.3 8h7.4M9.6 8 12 21.5M14.4 8 12 21.5" />
    </svg>
  );
}

function Sword(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 19 17 7" />
      <path d="M14 4l6 6-3 1-4-4 1-3Z" />
      <path d="M5 19l-1.5 1.5M5 19l2 .5.5 2" />
    </svg>
  );
}

function Mace(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="16.5" cy="7.5" r="4" />
      <path d="M16.5 3.7v.01M16.5 11.3v.01M12.7 7.5h.01M20.3 7.5h.01M13.8 4.6v.01M19.2 10.4v.01M19.2 4.6v.01M13.8 10.4v.01" strokeWidth="2.2" />
      <path d="M13.6 10.4 5 19" />
    </svg>
  );
}

function Axe(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 21 17.5 9.5" />
      <path d="M13 6c2.5-2.5 6-2.8 8-2.5.3 2-.1 5.5-2.5 8-1.6 1.6-4.2 1.9-5.8 1.4l-1.1-1.1c-.5-1.6-.2-4.2 1.4-5.8Z" />
    </svg>
  );
}

function NethPot(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10 2h4M11 2v4.2c0 .5-.2 1-.5 1.4l-3.3 4c-1.4 1.7-1.4 4.3 0 6L8.5 19c1.9 1.8 4.9 1.8 6.8 0l1.3-1.3c1.4-1.8 1.4-4.4 0-6.1l-3.3-4c-.3-.4-.5-.9-.5-1.4V2" />
      <path d="M9 14c1 1 2.5 1 3.5-.3.7-.9 1.9-.9 2.5 0" />
    </svg>
  );
}

function Diapot(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10 2h4M11 2v4.2c0 .5-.2 1-.5 1.4l-3.3 4c-1.4 1.7-1.4 4.3 0 6L8.5 19c1.9 1.8 4.9 1.8 6.8 0l1.3-1.3c1.4-1.8 1.4-4.4 0-6.1l-3.3-4c-.3-.4-.5-.9-.5-1.4V2" />
      <path d="M12 12.5 9.3 15l2.7 2.5 2.7-2.5-2.7-2.5Z" />
    </svg>
  );
}

function UHC(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20S3.5 14.9 3.5 9.1C3.5 6.3 5.7 4 8.4 4c1.5 0 2.9.7 3.6 1.9C12.7 4.7 14.1 4 15.6 4c2.7 0 4.9 2.3 4.9 5.1 0 5.8-8.5 10.9-8.5 10.9Z" />
      <path d="M9 10.5h1.6l1-2 1.6 4 1-2H16" />
    </svg>
  );
}

function SMP(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 10.5 12 4l9 6.5" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M10 20v-5.5h4V20" />
    </svg>
  );
}

function Hydro(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5c2.8 3.6 5 6.9 5 9.9a5 5 0 0 1-10 0c0-3 2.2-6.3 5-9.9Z" />
      <path d="M9.5 14c.3 1.3 1.3 2 2.6 2" />
    </svg>
  );
}

function Bedwars(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 20v-7.5A2.5 2.5 0 0 1 5.5 10H14" />
      <path d="M3 16h18" />
      <path d="M21 20v-4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v4" />
      <path d="M6 10V6.5A1.5 1.5 0 0 1 7.5 5h5A1.5 1.5 0 0 1 14 6.5V10" />
    </svg>
  );
}

export const CATEGORY_ICONS: Record<Category, (props: IconProps) => React.JSX.Element> = {
  Crystal,
  Sword,
  Mace,
  Axe,
  NethPot,
  Diapot,
  UHC,
  SMP,
  Hydro,
  Bedwars,
};
