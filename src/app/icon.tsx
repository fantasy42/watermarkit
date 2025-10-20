import {ImageResponse} from 'next/og';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#f9f9fb',
          borderRadius: 9999,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20px"
          height="20px"
          viewBox="0 0 512 512"
        >
          <path
            fill="#98c8ed"
            d="M256 512c-29.229 0-57.067-5.947-82.373-16.699C68.517 450.643 32.298 319.574 97.79 226.014L256 0l158.21 226.014c65.491 93.56 29.274 224.629-75.837 269.286C313.067 506.053 285.229 512 256 512z"
          />
          <path
            fill="#7ab9e8"
            d="M414.21 226.014 256 0v512c29.229 0 57.067-5.947 82.373-16.699 105.11-44.658 141.329-175.727 75.837-269.287z"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';
