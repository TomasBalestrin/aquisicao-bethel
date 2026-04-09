"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  active: boolean;
  onExit: () => void;
  children: ReactNode;
}

export function PresentView({ active, onExit, children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    const el = containerRef.current;
    if (!el) return;

    el.requestFullscreen?.().catch(() => {
      /* user denied or unsupported */
    });

    function handleChange() {
      if (!document.fullscreenElement) onExit();
    }

    document.addEventListener("fullscreenchange", handleChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleChange);
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
    };
  }, [active, onExit]);

  if (!active) return null;

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#F5F6F8",
      }}
    >
      <div
        style={{
          width: 1920,
          height: 1080,
          padding: "32px 44px",
          overflow: "auto",
          transformOrigin: "center center",
        }}
      >
        {children}
      </div>
    </div>
  );
}
