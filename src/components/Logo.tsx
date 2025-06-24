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
      <path
        d="M-0.00146484 0V50H38.6332V0H-0.00146484ZM34.0892 45.4533H4.54519V4.54665H34.0892V45.456V45.4533Z"
        fill="currentColor"
      />
      <path
        d="M30.6811 14.7733H24.1866L27.4339 7.95459H14.4476L7.95312 21.5919H17.6922V42.0453L30.6811 14.7733Z"
        fill="currentColor"
      />
    </svg>
  )
} 