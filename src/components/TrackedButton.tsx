"use client";

import React from "react";

interface TrackedButtonProps extends React.ComponentProps<'a'> {
  buttonId: string;
}

export default function TrackedButton({ buttonId, children, ...props }: TrackedButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (props.onClick) props.onClick(e);
    fetch("/api/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buttonId }),
    });
  };

  return (
    <a {...props} onClick={handleClick}>
      {children}
    </a>
  );
} 