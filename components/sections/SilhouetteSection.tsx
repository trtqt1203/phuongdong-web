"use client";

import React from "react";

export function SilhouetteSection() {
  return (
    <section
      id="silhouette"
      className="relative min-h-[100svh] flex flex-col justify-center px-6 md:px-12 lg:px-20 py-20 z-10 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Content (pointer-events-auto) */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-start text-left pointer-events-auto">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs text-atelier-gold">02</span>
            <span className="w-6 h-[1px] bg-white/20" />
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-atelier-textMuted">
              Proportion & Balance
            </span>
          </div>

          <h2 className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.05] tracking-tight text-atelier-text mb-6">
            THE
            <br />
            SILHOUETTE
          </h2>

          <p className="font-sans text-sm md:text-base text-atelier-textMuted leading-relaxed font-light mb-12 max-w-md">
            Every line is shaped around the wearer — from shoulder balance to jacket length and
            trouser break. We engineer ease of motion while maintaining architectural sharpness.
          </p>

          {/* Three Key Specifications */}
          <div className="space-y-6 w-full max-w-md">
            <div className="p-4 border-l border-atelier-gold/50 bg-[#121212]/70 backdrop-blur-sm transition-all duration-300 hover:border-atelier-gold hover:bg-[#161616]/90">
              <span className="font-serif text-lg text-atelier-text block">Shoulder Balance</span>
              <p className="font-sans text-xs text-atelier-textMuted mt-1">
                Con rollino or roped sleeve head hand-set with horsehair canvas for natural stature.
              </p>
            </div>

            <div className="p-4 border-l border-white/20 bg-[#121212]/70 backdrop-blur-sm transition-all duration-300 hover:border-atelier-gold hover:bg-[#161616]/90">
              <span className="font-serif text-lg text-atelier-text block">Sculpted Waist</span>
              <p className="font-sans text-xs text-atelier-textMuted mt-1">
                Gentle suppression along the natural lumbar curve, enhancing posture without constriction.
              </p>
            </div>

            <div className="p-4 border-l border-white/20 bg-[#121212]/70 backdrop-blur-sm transition-all duration-300 hover:border-atelier-gold hover:bg-[#161616]/90">
              <span className="font-serif text-lg text-atelier-text block">Personalized Length</span>
              <p className="font-sans text-xs text-atelier-textMuted mt-1">
                Calibrated against thumb-joint proportion to elongate legs and anchor the suit&apos;s drape.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Space reserved for 3D suit side/profile framing */}
        <div className="hidden lg:block lg:col-span-6 xl:col-span-7 h-[70vh] pointer-events-none" />
      </div>
    </section>
  );
}
