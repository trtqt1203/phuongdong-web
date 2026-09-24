"use client";

import { useState, useEffect } from "react";

export interface ScrollState {
  progress: number; // 0.0 to 1.0 through scrollytelling container
  activeStage: number; // 1 to 6
  isConfiguratorVisible: boolean;
  mouse: { x: number; y: number }; // normalized -1 to 1
}

export function useScrollStage() {
  const [scrollState, setScrollState] = useState<ScrollState>({
    progress: 0,
    activeStage: 1,
    isConfiguratorVisible: false,
    mouse: { x: 0, y: 0 },
  });

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollStoryEl = document.getElementById("scrollytelling-container");
          const configuratorEl = document.getElementById("configurator-section");

          let progress = 0;
          let activeStage = 1;

          if (scrollStoryEl) {
            const rect = scrollStoryEl.getBoundingClientRect();
            const totalScrollable = scrollStoryEl.offsetHeight - window.innerHeight;
            if (totalScrollable > 0) {
              const currentScroll = -rect.top;
              progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
            }

            if (progress < 0.18) activeStage = 1;
            else if (progress < 0.36) activeStage = 2;
            else if (progress < 0.54) activeStage = 3;
            else if (progress < 0.72) activeStage = 4;
            else if (progress < 0.90) activeStage = 5;
            else activeStage = 6;
          }

          let isConfiguratorVisible = false;
          if (configuratorEl) {
            const configRect = configuratorEl.getBoundingClientRect();
            // Active when configurator section is in view
            if (configRect.top < window.innerHeight * 0.7 && configRect.bottom > 100) {
              isConfiguratorVisible = true;
            }
          }

          setScrollState((prev) => ({
            ...prev,
            progress,
            activeStage,
            isConfiguratorVisible,
          }));

          ticking = false;
        });
        ticking = true;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Disabled on touch/mobile
      if (window.innerWidth < 768) return;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setScrollState((prev) => ({
        ...prev,
        mouse: { x, y },
      }));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return scrollState;
}
