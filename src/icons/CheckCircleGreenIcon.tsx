import * as React from 'react';
export function CheckCircleGreenIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="#27ae60"
        d="M22 13c0 5.523-4.477 10-10 10S2 18.523 2 13 6.477 3 12 3s10 4.477 10 10z"
      />
      <path
        fill="#2ecc71"
        d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"
      />
      <path
        fill="#27ae60"
        d="m16 9-6 6-2.5-2.5-2.125 2.1 2.5 2.5 2 2 .125.1 8.125-8.1L16 9z"
      />
      <path
        fill="#ecf0f1"
        d="m16 8-6 6-2.5-2.5-2.125 2.1 2.5 2.5 2 2 .125.1 8.125-8.1L16 8z"
      />
    </svg>
  );
}
