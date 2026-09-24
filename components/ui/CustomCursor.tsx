"use client";

import React, { useEffect, useState } from "react";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isDragTarget, setIsDragTarget] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    // Only enable on pointer-fine devices
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest("button") ||
          target.closest("a") ||
          target.closest("input") ||
          target.closest(".interactive-target")
        );
        setIsHovered(isInteractive);

        const is3DViewer = Boolean(
          target.closest(".canvas-3d-container") ||
          target.tagName.toLowerCase() === "canvas"
        );
        setIsDragTarget(is3DViewer);
      }
    };

    const onMouseDown = () => setIsMouseDown(true);
    const onMouseUp = () => setIsMouseDown(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 transition-transform duration-75 ease-out -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {isDragTarget ? (
        <div
          className={`px-3 py-1.5 rounded-full border border-atelier-gold/70 bg-[#080808]/90 text-[9px] tracking-[0.25em] text-atelier-gold uppercase font-sans shadow-lg transition-transform duration-200 ${
            isMouseDown ? "scale-90 bg-atelier-gold text-atelier-bg" : "scale-100"
          }`}
        >
          {isMouseDown ? "INSPECT" : "DRAG 3D"}
        </div>
      ) : (
        <div
          className={`rounded-full border border-atelier-gold/60 transition-all duration-300 ${
            isHovered
              ? "w-10 h-10 bg-atelier-gold/15 scale-125 border-atelier-gold"
              : "w-4 h-4 bg-transparent scale-100"
          }`}
        />
      )}
    </div>
  );
}
