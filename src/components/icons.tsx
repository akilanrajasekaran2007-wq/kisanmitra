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
      <path d="M12 4H8c-2 0-4 2-4 4v0c0 2 2 4 4 4h4" />
      <path d="M12 4h4c2 0 4 2 4 4v0c0 2-2 4-4 4h-4" />
    </svg>
  );
}
