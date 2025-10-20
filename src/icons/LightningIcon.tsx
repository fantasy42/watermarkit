import * as React from 'react';
export function LightningIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path fill="#f1c40f" d="M7 0 2 12h8L6 22 20 8h-9l6-8z" />
      <path fill="#f39c12" d="M7 0 2 12h3l5-12zm3 12L6 22l3-3 4-7z" />
      <path fill="#e67e22" d="m10 12-.406 1H12.5l.5-1h-3z" />
    </svg>
  );
}

//style={{marginTop: 2}} 14px
