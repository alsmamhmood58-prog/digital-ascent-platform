import { SVGProps } from "react";

export const Butterfly = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} {...props}>
    <defs>
      <linearGradient id="bf-grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="hsl(42 90% 62%)" />
        <stop offset="100%" stopColor="hsl(38 78% 45%)" />
      </linearGradient>
    </defs>
    <g fill="url(#bf-grad)">
      <path d="M32 32c-3-10-12-16-20-12-6 3-7 12-2 17 6 6 16 4 22-5z" />
      <path d="M32 32c3-10 12-16 20-12 6 3 7 12 2 17-6 6-16 4-22-5z" />
      <path d="M32 32c-2 8-8 14-15 14-5 0-8-4-7-9 1-6 8-9 22-5z" opacity="0.85" />
      <path d="M32 32c2 8 8 14 15 14 5 0 8-4 7-9-1-6-8-9-22-5z" opacity="0.85" />
    </g>
    <ellipse cx="32" cy="32" rx="1.6" ry="9" fill="hsl(224 80% 18%)" />
    <circle cx="32" cy="22" r="2" fill="hsl(224 80% 18%)" />
    <path d="M32 21c-1-3-3-5-5-5M32 21c1-3 3-5 5-5" stroke="hsl(224 80% 18%)" strokeWidth="1" strokeLinecap="round" />
  </svg>
);
