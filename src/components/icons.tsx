
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
      <path d="M12 22V12" />
      <path d="M12 12H8.5a3.5 3.5 0 1 0 0 7H12" />
      <path d="M12 12h3.5a3.5 3.5 0 1 1 0 7H12" />
      <path d="M12 12V6.5a3.5 3.5 0 1 1 7 0V12" />
      <path d="M12 12V6.5a3.5 3.5 0 1 0-7 0V12" />
    </svg>
  );
}
