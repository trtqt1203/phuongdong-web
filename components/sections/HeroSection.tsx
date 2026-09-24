"use client";

import React from "react";
import { ArrowRight, Calendar } from "lucide-react";

interface HeroSectionProps {
  onDesignSuit: () => void;
  onBookFitting: () => void;
}

export function HeroSection({ onDesignSuit, onBookFitting }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-24 pb-12 z-10 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Editorial Headline & Actions (45-55% desktop width) */}
        <div className="lg:col-span-7 xl:col-span-6 flex flex-col items-start text-left pointer-events-auto">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-6 h-[1px] bg-atelier-gold" />
            <span className="font-sans text-[11px] md:text-xs tracking-[0.35em] text-atelier-gold uppercase font-medium">
              May đo cao cấp · Việt Trì
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-[clamp(2.75rem,7vw,5.5rem)] font-light leading-[1.02] tracking-tight text-atelier-text mb-6">
            TINH HOA
            <br />
            TRONG TỪNG
            <br />
            <span className="italic font-normal text-atelier-gold">ĐƯỜNG MAY.</span>
          </h1>

          {/* Supporting Copy */}
          <p className="font-sans text-sm md:text-base text-atelier-textMuted max-w-lg leading-relaxed font-light mb-10">
            Chất liệu tuyển chọn, kỹ nghệ thủ công và thiết kế 3D tương tác — tạo nên trang phục
            mang dấu ấn riêng của bạn tại Phương Đông.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <button
              onClick={onDesignSuit}
              className="group flex items-center justify-center gap-3 px-8 py-4 text-xs tracking-[0.25em] uppercase font-sans font-medium text-atelier-bg bg-atelier-gold hover:bg-[#cbb07a] transition-all duration-300 hover:shadow-[0_0_25px_rgba(185,154,99,0.35)]"
            >
              <span>Thiết kế vest</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <button
              onClick={onBookFitting}
              className="group flex items-center justify-center gap-3 px-8 py-4 text-xs tracking-[0.2em] uppercase font-sans text-atelier-text hover:text-atelier-gold border border-white/15 hover:border-atelier-gold/50 bg-black/30 backdrop-blur-sm transition-all duration-300"
            >
              <Calendar className="w-3.5 h-3.5 text-atelier-gold" />
              <span>Đặt lịch tư vấn</span>
            </button>
          </div>

          {/* Editorial Specs Footer */}
          <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-3 gap-6 w-full max-w-md">
            <div>
              <span className="block font-serif text-xl md:text-2xl text-atelier-text font-light">
                50+
              </span>
              <span className="block font-sans text-[9px] tracking-widest uppercase text-atelier-textMuted mt-1">
                Hand Stitches
              </span>
            </div>
            <div>
              <span className="block font-serif text-xl md:text-2xl text-atelier-text font-light">
                150s
              </span>
              <span className="block font-sans text-[9px] tracking-widest uppercase text-atelier-textMuted mt-1">
                Wool Grades
              </span>
            </div>
            <div>
              <span className="block font-serif text-xl md:text-2xl text-atelier-text font-light">
                100%
              </span>
              <span className="block font-sans text-[9px] tracking-widest uppercase text-atelier-textMuted mt-1">
                Full Canvas
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Space reserved for the 3D suit (occupying 40-55% width) */}
        <div className="hidden lg:block lg:col-span-5 xl:col-span-6 h-[70vh] pointer-events-none" />
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-auto opacity-70 hover:opacity-100 transition-opacity">
        <span className="text-[9px] tracking-[0.3em] uppercase text-atelier-textMuted font-sans">
          Scroll To Discover
        </span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-atelier-gold to-transparent" />
      </div>
    </section>
  );
}
