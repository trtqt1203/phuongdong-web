"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AtelierLoaderProps {
  isReady: boolean;
  onLoaded?: () => void;
}

export function AtelierLoader({ isReady, onLoaded }: AtelierLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);

  useEffect(() => {
    // Smooth counter progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) {
          return prev + Math.floor(Math.random() * 8) + 2;
        }
        if (isReady && prev < 100) {
          return prev + 2;
        }
        return prev;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [isReady]);

  useEffect(() => {
    if (progress >= 100 && isReady) {
      const timer = setTimeout(() => {
        setIsDone(true);
        onLoaded?.();
        setTimeout(() => setIsUnmounted(true), 800);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [progress, isReady, onLoaded]);

  if (isUnmounted) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-[#080808] flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out px-6",
        isDone ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
    >
      <div className="flex flex-col items-center max-w-sm w-full text-center">
        {/* Emblem */}
        <div className="w-12 h-12 mb-8 rounded-full border border-atelier-gold/40 flex items-center justify-center animate-pulse-slow">
          <span className="font-serif text-lg text-atelier-gold italic">PĐ</span>
        </div>

        {/* Brand Headline */}
        <div className="font-serif text-2xl md:text-3xl tracking-[0.3em] font-light text-atelier-text mb-3">
          PHƯƠNG ĐÔNG
        </div>

        <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-atelier-gold font-medium mb-10">
          Đang chuẩn bị không gian 3D
        </p>

        {/* Minimal Progress Bar */}
        <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden mb-4">
          <div
            className="absolute top-0 left-0 h-full bg-atelier-gold transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage Counter */}
        <div className="font-mono text-xs text-atelier-textMuted tracking-widest">
          {progress < 10 ? `0${progress}` : progress}%
        </div>
      </div>
    </div>
  );
}
