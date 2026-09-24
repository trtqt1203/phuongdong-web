"use client";

import React from "react";
import { SHIRTS, TIES, SuitConfiguration } from "@/data/configuratorOptions";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ShirtTieSectionProps {
  config: SuitConfiguration;
  onUpdateConfig: <K extends keyof SuitConfiguration>(key: K, value: SuitConfiguration[K]) => void;
}

export function ShirtTieSection({ config, onUpdateConfig }: ShirtTieSectionProps) {
  return (
    <section
      id="shirt-tie"
      className="relative min-h-[100svh] flex flex-col justify-center px-6 md:px-12 lg:px-20 py-20 z-10 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-start text-left pointer-events-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs text-atelier-gold">05</span>
            <span className="w-6 h-[1px] bg-white/20" />
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-atelier-textMuted">
              Harmonic Styling
            </span>
          </div>

          <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.05] tracking-tight text-atelier-text mb-6">
            SHIRT &
            <br />
            SILK TIE
          </h2>

          <p className="font-sans text-sm md:text-base text-atelier-textMuted leading-relaxed font-light mb-8 max-w-md">
            The shirt collar frames the face; the silk tie anchors the vertical line. Pair Egyptian
            Giza cotton weaves with 7-fold hand-rolled silks.
          </p>

          <div className="space-y-6 w-full max-w-md">
            {/* 1. Dress Shirt Weaves */}
            <div>
              <span className="block text-[11px] uppercase tracking-[0.25em] text-atelier-gold font-sans font-medium mb-3">
                Dress Shirt
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {SHIRTS.map((shirt) => {
                  const isSelected = config.shirt === shirt.id;
                  return (
                    <button
                      key={shirt.id}
                      onClick={() => onUpdateConfig("shirt", shirt.id)}
                      className={cn(
                        "flex items-center gap-3 p-2.5 border transition-all text-left",
                        isSelected
                          ? "border-atelier-gold bg-atelier-gold/10"
                          : "border-white/10 hover:border-white/25 bg-black/40"
                      )}
                    >
                      <div
                        className="w-5 h-5 border border-white/20 shrink-0"
                        style={{ backgroundColor: shirt.color }}
                      />
                      <div className="overflow-hidden">
                        <span className="block text-xs font-medium text-atelier-text truncate">
                          {shirt.name}
                        </span>
                        <span className="block text-[9px] text-atelier-textMuted truncate">
                          {shirt.fabric.split(" ")[0]} Cotton
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Silk Tie */}
            <div>
              <span className="block text-[11px] uppercase tracking-[0.25em] text-atelier-gold font-sans font-medium mb-3">
                Silk Tie Accent
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {TIES.map((tie) => {
                  const isSelected = config.tie === tie.id;
                  return (
                    <button
                      key={tie.id}
                      onClick={() => onUpdateConfig("tie", tie.id)}
                      className={cn(
                        "flex items-center gap-3 p-2.5 border transition-all text-left",
                        isSelected
                          ? "border-atelier-gold bg-atelier-gold/10"
                          : "border-white/10 hover:border-white/25 bg-black/40"
                      )}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 border border-white/20 shrink-0 flex items-center justify-center",
                          tie.color ? "" : "bg-neutral-800"
                        )}
                        style={{ backgroundColor: tie.color || undefined }}
                      >
                        {isSelected && (
                          <Check className="w-3 h-3 text-white drop-shadow" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <span className="block text-xs font-medium text-atelier-text truncate">
                          {tie.name}
                        </span>
                        <span className="block text-[9px] text-atelier-textMuted truncate">
                          {tie.silkType}
                        </span>
                      </div>
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
