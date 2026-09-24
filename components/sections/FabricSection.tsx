"use client";

import React from "react";
import { FABRICS, FabricOption } from "@/data/configuratorOptions";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface FabricSectionProps {
  selectedFabricId: string;
  onSelectFabric: (id: string) => void;
}

export function FabricSection({
  selectedFabricId,
  onSelectFabric,
}: FabricSectionProps) {
  const currentFabric = FABRICS.find((f) => f.id === selectedFabricId) || FABRICS[0];

  return (
    <section
      id="fabric"
      className="relative min-h-[100svh] flex flex-col justify-center px-6 md:px-12 lg:px-20 py-20 z-10 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Interactive Swatches & Editorial Copy */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-start text-left pointer-events-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs text-atelier-gold">03</span>
            <span className="w-6 h-[1px] bg-white/20" />
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-atelier-textMuted">
              Mill Selection
            </span>
          </div>

          <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.05] tracking-tight text-atelier-text mb-6">
            SELECT YOUR
            <br />
            FABRIC
          </h2>

          <p className="font-sans text-sm md:text-base text-atelier-textMuted leading-relaxed font-light mb-8 max-w-md">
            From understated charcoal to midnight navy, every fabric changes how a suit moves,
            reflects light and commands a room. Woven by historic English and Italian mills.
          </p>

          {/* Swatches Selector */}
          <div className="flex flex-wrap items-center gap-3.5 mb-8">
            {FABRICS.map((fabric: FabricOption) => {
              const isSelected = fabric.id === selectedFabricId;
              return (
                <button
                  key={fabric.id}
                  onClick={() => onSelectFabric(fabric.id)}
                  className={cn(
                    "group relative flex items-center gap-2 p-1.5 transition-all duration-300 focus-visible:outline-none",
                    isSelected
                      ? "ring-1 ring-atelier-gold bg-white/5"
                      : "ring-1 ring-white/10 hover:ring-white/30"
                  )}
                  aria-label={`Select fabric ${fabric.name}`}
                  title={fabric.name}
                >
                  {/* Swatch color bubble */}
                  <div
                    className="w-9 h-9 rounded-none border border-white/20 relative flex items-center justify-center transition-transform group-hover:scale-105"
                    style={{ backgroundColor: fabric.color }}
                  >
                    {isSelected && (
                      <Check
                        className={cn(
                          "w-3.5 h-3.5 drop-shadow-md",
                          fabric.id === "ivory" ? "text-neutral-900" : "text-white"
                        )}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Fabric Editorial Card */}
          <div className="w-full max-w-md p-6 bg-[#111111]/90 border border-white/10 backdrop-blur-md transition-all duration-300">
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-serif text-2xl text-atelier-text font-light">
                {currentFabric.name}
              </span>
              <span className="font-sans text-[10px] tracking-widest uppercase text-atelier-gold font-medium">
                {currentFabric.weight}
              </span>
            </div>

            <p className="font-sans text-xs text-atelier-gold/90 font-medium mb-3">
              {currentFabric.composition}
            </p>

            <p className="font-sans text-xs text-atelier-textMuted leading-relaxed">
              {currentFabric.description}
            </p>
          </div>
        </div>

        {/* Right Column: 3D model frame */}
        <div className="hidden lg:block lg:col-span-6 xl:col-span-7 h-[70vh] pointer-events-none" />
      </div>
    </section>
  );
}
