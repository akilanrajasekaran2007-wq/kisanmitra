
import type { SVGProps } from "react";

export function KisanMitraIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7 20h10" />
      <path d="M12 20V4" />
      <path d="M12 4c-2.5 0-4.5-2-4.5-4.5" />
      <path d="M12 4c2.5 0 4.5-2 4.5-4.5" />
    </svg>
  );
}
