"use client";

import React from "react";
import { Scissors, Compass, Award, ShieldCheck } from "lucide-react";

export function CraftsmanshipSection() {
  return (
    <section
      id="craftsmanship"
      className="relative py-28 px-6 md:px-12 lg:px-20 bg-[#080808] border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Editorial Header */}
        <div className="mb-20 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-atelier-gold" />
            <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-atelier-gold font-medium">
              Sartorial Heritage
            </span>
          </div>
          <h2 className="font-serif text-[clamp(2.5rem,6vw,5rem)] font-light leading-[1.04] text-atelier-text mb-6">
            TECHNOLOGY
            <br />
            MEETS TRADITION
          </h2>
          <p className="font-sans text-sm md:text-base text-atelier-textMuted leading-relaxed font-light">
            Every bespoke garment begins not on the cutting table, but in deep observation.
            We synthesize centuries-old hand craftsmanship with digital 3D spatial precision,
            creating an architectural second skin tailored to your individual presence.
          </p>
        </div>

        {/* Asymmetric Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Pillar 01 */}
          <div className="md:col-span-6 lg:col-span-5 p-8 md:p-10 bg-[#0d0d0d] border border-white/10 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full border border-atelier-gold/40 flex items-center justify-center mb-8 text-atelier-gold">
                <Scissors className="w-4 h-4" />
              </div>
              <span className="font-mono text-xs text-atelier-gold/80 block mb-2">01 / CANVASSING</span>
              <h3 className="font-serif text-2xl md:text-3xl text-atelier-text font-light mb-4">
                Floating Full Horsehair Canvas
              </h3>
              <p className="font-sans text-xs md:text-sm text-atelier-textMuted leading-relaxed">
                Unlike mass-produced fused garments, our bespoke jackets feature a floating chest piece
                crafted from natural horsehair and wool canvas. As you wear the suit, the canvas
                gradually molds to your chest contours, producing an irreplaceable natural drape.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-atelier-gold">
              <span>Hand-Padded Lapels</span>
              <span className="tracking-widest font-mono">1,800+ STITCHES</span>
            </div>
          </div>

          {/* Pillar 02 */}
          <div className="md:col-span-6 lg:col-span-7 p-8 md:p-10 bg-[#121212] border border-white/10 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center mb-8 text-atelier-text">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-mono text-xs text-atelier-gold/80 block mb-2">02 / ANATOMY</span>
              <h3 className="font-serif text-2xl md:text-3xl text-atelier-text font-light mb-4">
                32 Ergonomic Datum Measurements
              </h3>
              <p className="font-sans text-xs md:text-sm text-atelier-textMuted leading-relaxed">
                Standard sizing captures only chest and waist. Our master cutters evaluate spinal curvature,
                shoulder drop angles, rotational arm posture, and stride dynamics to eliminate collar gap,
                back bunching, and unnatural fabric tension.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
              <div>
                <span className="block font-serif text-xl text-atelier-text">32</span>
                <span className="text-[9px] uppercase tracking-wider text-atelier-textMuted">Data Points</span>
              </div>
              <div>
                <span className="block font-serif text-xl text-atelier-text">3</span>
                <span className="text-[9px] uppercase tracking-wider text-atelier-textMuted">Fittings</span>
              </div>
              <div>
                <span className="block font-serif text-xl text-atelier-text">60+</span>
                <span className="text-[9px] uppercase tracking-wider text-atelier-textMuted">Artisan Hours</span>
              </div>
            </div>
          </div>

          {/* Pillar 03 */}
          <div className="md:col-span-6 lg:col-span-7 p-8 md:p-10 bg-[#121212] border border-white/10 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center mb-8 text-atelier-text">
                <Award className="w-4 h-4" />
              </div>
              <span className="font-mono text-xs text-atelier-gold/80 block mb-2">03 / WEAVES</span>
              <h3 className="font-serif text-2xl md:text-3xl text-atelier-text font-light mb-4">
                Direct Mill Partnerships
              </h3>
              <p className="font-sans text-xs md:text-sm text-atelier-textMuted leading-relaxed">
                We maintain direct allocations from the world&apos;s most venerable mills in Biella and
                Yorkshire: Loro Piana, Dormeuil, Scabal, and Holland &amp; Sherry. Super 130s to 180s
                merino, raw silk, and cashmere woven for high humidity and tropical climates.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-atelier-textMuted">
              <span>Authentic Mill Selvedge Guaranteed</span>
              <span className="text-atelier-gold uppercase tracking-wider">Huddersfield &amp; Biella</span>
            </div>
          </div>

          {/* Pillar 04 */}
          <div className="md:col-span-6 lg:col-span-5 p-8 md:p-10 bg-[#0d0d0d] border border-white/10 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-full border border-atelier-gold/40 flex items-center justify-center mb-8 text-atelier-gold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-mono text-xs text-atelier-gold/80 block mb-2">04 / ATELIER</span>
              <h3 className="font-serif text-2xl md:text-3xl text-atelier-text font-light mb-4">
                Milanaise Hand Finishing
              </h3>
              <p className="font-sans text-xs md:text-sm text-atelier-textMuted leading-relaxed">
                The lapel buttonhole (l&apos;asola lucida / milanaise) is sewn completely by hand with gimp
                silk cord over 45 minutes of concentrated craftsmanship, creating an unmistakable raised
                sculptural ridge that defines true haute sartorial tailoring.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-atelier-gold">
              <span>Individual Tailor Signature</span>
              <span className="tracking-widest font-mono">EST. HANOI</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
