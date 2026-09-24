"use client";

import React from "react";
import { LAPELS, BUTTONS, POCKETS, SuitConfiguration } from "@/data/configuratorOptions";
import { cn } from "@/lib/utils";

interface DetailsSectionProps {
  config: SuitConfiguration;
  onUpdateConfig: <K extends keyof SuitConfiguration>(key: K, value: SuitConfiguration[K]) => void;
}

export function DetailsSection({ config, onUpdateConfig }: DetailsSectionProps) {
  return (
    <section
      id="details"
      className="relative min-h-[100svh] flex flex-col justify-center px-6 md:px-12 lg:px-20 py-20 z-10 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Interactive Tailoring Details */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-start text-left pointer-events-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs text-atelier-gold">04</span>
            <span className="w-6 h-[1px] bg-white/20" />
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-atelier-textMuted">
              Tailoring Geometry
            </span>
          </div>

          <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.05] tracking-tight text-atelier-text mb-6">
            MAKE IT
            <br />
            YOURS
          </h2>

          <p className="font-sans text-sm md:text-base text-atelier-textMuted leading-relaxed font-light mb-8 max-w-md">
            Lapel roll, fastening stance, and pocket welt. Small millimeter adjustments redefine
            the formality and demeanor of the finished jacket.
          </p>

          <div className="space-y-6 w-full max-w-md">
            {/* 1. Lapel Style */}
            <div>
              <span className="block text-[11px] uppercase tracking-[0.25em] text-atelier-gold font-sans font-medium mb-2.5">
                Lapel Architecture
              </span>
              <div className="grid grid-cols-3 gap-2">
                {LAPELS.map((lapel) => {
                  const isActive = config.lapel === lapel.id;
                  return (
                    <button
                      key={lapel.id}
                      onClick={() => onUpdateConfig("lapel", lapel.id)}
                      className={cn(
                        "py-3 px-2 text-xs font-sans tracking-wider uppercase transition-all duration-200 border text-center",
                        isActive
                          ? "border-atelier-gold text-atelier-text bg-atelier-gold/10 font-medium"
                          : "border-white/10 text-atelier-textMuted hover:border-white/30 hover:text-atelier-text bg-black/40"
                      )}
                    >
                      {lapel.name.replace(" Lapel", "")}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Button Fastening */}
            <div>
              <span className="block text-[11px] uppercase tracking-[0.25em] text-atelier-gold font-sans font-medium mb-2.5">
                Button Stance
              </span>
              <div className="grid grid-cols-3 gap-2">
                {BUTTONS.map((btn) => {
                  const isActive = config.buttons === btn.id;
                  return (
                    <button
                      key={btn.id}
                      onClick={() => onUpdateConfig("buttons", btn.id)}
                      className={cn(
                        "py-3 px-2 text-xs font-sans tracking-wider uppercase transition-all duration-200 border text-center",
                        isActive
                          ? "border-atelier-gold text-atelier-text bg-atelier-gold/10 font-medium"
                          : "border-white/10 text-atelier-textMuted hover:border-white/30 hover:text-atelier-text bg-black/40"
                      )}
                    >
                      {btn.name.replace(" (6x2)", "")}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Pocket Welt */}
            <div>
              <span className="block text-[11px] uppercase tracking-[0.25em] text-atelier-gold font-sans font-medium mb-2.5">
                Hip Pockets
              </span>
              <div className="grid grid-cols-3 gap-2">
                {POCKETS.map((pkt) => {
                  const isActive = config.pocket === pkt.id;
                  return (
                    <button
                      key={pkt.id}
                      onClick={() => onUpdateConfig("pocket", pkt.id)}
                      className={cn(
                        "py-3 px-2 text-xs font-sans tracking-wider uppercase transition-all duration-200 border text-center",
                        isActive
                          ? "border-atelier-gold text-atelier-text bg-atelier-gold/10 font-medium"
                          : "border-white/10 text-atelier-textMuted hover:border-white/30 hover:text-atelier-text bg-black/40"
                      )}
                    >
                      {pkt.name.replace(" (Besom)", "").replace(" Pockets", "")}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D model frame */}
        <div className="hidden lg:block lg:col-span-6 xl:col-span-7 h-[70vh] pointer-events-none" />
      </div>
    </section>
  );
}
