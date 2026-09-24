"use client";

import React from "react";
import { FITS, SuitConfiguration } from "@/data/configuratorOptions";
import { cn } from "@/lib/utils";

interface FitSectionProps {
  selectedFitId: SuitConfiguration["fit"];
  onSelectFit: (fit: SuitConfiguration["fit"]) => void;
}

export function FitSection({ selectedFitId, onSelectFit }: FitSectionProps) {
  return (
    <section
      id="fit"
      className="relative min-h-[100svh] flex flex-col justify-center px-6 md:px-12 lg:px-20 py-20 z-10 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-start text-left pointer-events-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs text-atelier-gold">06</span>
            <span className="w-6 h-[1px] bg-white/20" />
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-atelier-textMuted">
              Ergonomic Pattern
            </span>
          </div>

          <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.05] tracking-tight text-atelier-text mb-6">
            CUT FOR
            <br />
            YOU
          </h2>

          <p className="font-sans text-sm md:text-base text-atelier-textMuted leading-relaxed font-light mb-8 max-w-md">
            The cut governs how a garment drapes across the chest and moves with your stride.
            Choose the baseline drape that mirrors your posture and lifestyle.
          </p>

          <div className="space-y-4 w-full max-w-md">
            {FITS.map((fit) => {
              const isSelected = selectedFitId === fit.id;
              return (
                <button
                  key={fit.id}
                  onClick={() => onSelectFit(fit.id)}
                  className={cn(
                    "w-full text-left p-5 border transition-all duration-300 relative group",
                    isSelected
                      ? "border-atelier-gold bg-atelier-gold/10"
                      : "border-white/10 hover:border-white/25 bg-black/40"
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-serif text-xl text-atelier-text font-light">
                      {fit.name}
                    </span>
                    <span
                      className={cn(
                        "text-[9px] uppercase tracking-widest font-sans font-medium px-2 py-0.5 border",
                        isSelected
                          ? "border-atelier-gold text-atelier-gold"
                          : "border-white/10 text-atelier-textMuted"
                      )}
                    >
                      {isSelected ? "Active Cut" : "Select"}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-atelier-textMuted leading-relaxed">
                    {fit.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: 3D model frame */}
        <div className="hidden lg:block lg:col-span-6 xl:col-span-7 h-[70vh] pointer-events-none" />
      </div>
    </section>
  );
}
