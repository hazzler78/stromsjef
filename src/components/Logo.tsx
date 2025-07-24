'use client'

import React from 'react'

export default function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={props.width || 39}
      height={props.height || 50}
      viewBox="0 0 39 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="8" y="8" width="23" height="34" fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="4" />
      <g transform="translate(4,4) scale(0.8)">
        <path
          d="M-0.00146484 0V50H38.6332V0H-0.00146484ZM34.0892 45.4533H4.54519V4.54665H34.0892V45.456V45.4533Z"
          fill="#BA0C2F"
        />
        <path
          d="M30.6811 14.7733H24.1866L27.4339 7.95459H14.4476L7.95312 21.5919H17.6922V42.0453L30.6811 14.7733Z"
          fill="#00205B"
        />
      </g>
    </svg>
  )
} 