"use client";

import React from "react";
import { ArrowRight, Scissors } from "lucide-react";

interface FinalCTASectionProps {
  onOpenBooking: () => void;
}

export function FinalCTASection({ onOpenBooking }: FinalCTASectionProps) {
  return (
    <section className="relative py-32 px-6 md:px-12 lg:px-20 bg-[#080808] border-t border-white/10 overflow-hidden text-center flex flex-col items-center justify-center">
      {/* Subtle Background Glow */}
      <div className="absolute w-[600px] h-[300px] rounded-full bg-atelier-gold/5 blur-[120px] pointer-events-none -top-20" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Emblem */}
        <div className="w-12 h-12 rounded-full border border-atelier-gold/40 flex items-center justify-center mb-8 text-atelier-gold">
          <Scissors className="w-4 h-4" />
        </div>

        <span className="font-sans text-[11px] tracking-[0.4em] uppercase text-atelier-gold font-medium mb-6">
          Không gian may đo riêng · Việt Trì
        </span>

        <h2 className="font-serif text-[clamp(3rem,7vw,6.5rem)] font-light leading-[1.0] tracking-tight text-atelier-text mb-6">
          PHONG CÁCH.
          <br />
          <span className="italic font-normal text-atelier-gold">DẤU ẤN RIÊNG.</span>
        </h2>

        <p className="font-sans text-sm md:text-base text-atelier-textMuted max-w-lg leading-relaxed font-light mb-10">
          Thiết kế trực quan. Hoàn thiện theo số đo. Được tạo nên dành riêng cho bạn.
        </p>

        <button
          onClick={onOpenBooking}
          className="group flex items-center justify-center gap-3 px-10 py-4 text-xs tracking-[0.25em] uppercase font-sans font-medium text-atelier-bg bg-atelier-gold hover:bg-[#cbb07a] transition-all duration-300 hover:shadow-[0_0_30px_rgba(185,154,99,0.4)]"
        >
          <span>Đặt lịch tư vấn</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
}
