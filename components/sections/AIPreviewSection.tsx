"use client";

import React from "react";
import { Cpu, Scan, Layers, Sparkles } from "lucide-react";

export function AIPreviewSection() {
  const steps = [
    {
      num: "01",
      icon: Scan,
      title: "Capture & Digitize Proportions",
      description:
        "Upload front and profile posture photos or input bespoke measurements taken by our tailor or at home via guided spatial scanning.",
      badge: "Computer Vision",
    },
    {
      num: "02",
      icon: Cpu,
      title: "Intelligent Silhouette Analysis",
      description:
        "Our upcoming biometric engine computes shoulder slopes, spinal curve, and body cadence to recommend optimal lapel widths and waist stance.",
      badge: "Sartorial ML Model",
    },
    {
      num: "03",
      icon: Layers,
      title: "Instant 3D Blueprint Generation",
      description:
        "Preview photorealistic 3D suit configurations tailored specifically for your body type, occasion, and climate before your first atelier fitting.",
      badge: "Real-time 3D",
    },
  ];

  return (
    <section
      id="process"
      className="relative py-28 px-6 md:px-12 lg:px-20 bg-[#0c0c0c] border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-white/10 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-atelier-gold" />
              <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-atelier-gold font-medium">
                Future Technology Preview
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-light tracking-tight text-atelier-text">
              TAILORING,
              <br />
              AUGMENTED BY AI
            </h2>
          </div>
          <p className="font-sans text-xs md:text-sm text-atelier-textMuted max-w-md leading-relaxed font-light">
            Body proportions, personal style and professional context can work together to guide
            your next suit. The future of bespoke begins in digital harmony.
          </p>
        </div>

        {/* 3 Steps Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-8 bg-[#121212] border border-white/10 hover:border-atelier-gold/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-mono text-xl text-atelier-gold font-light">
                      {step.num}
                    </span>
                    <span className="text-[9px] uppercase tracking-widest font-sans font-medium px-2 py-1 bg-[#181818] border border-white/10 text-atelier-textMuted">
                      {step.badge}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center mb-6 text-atelier-gold group-hover:border-atelier-gold transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>

                  <h3 className="font-serif text-xl text-atelier-text font-light mb-3">
                    {step.title}
                  </h3>

                  <p className="font-sans text-xs text-atelier-textMuted leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] tracking-wider uppercase text-atelier-textMuted font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-atelier-gold/70" />
                  <span>Module Architecture Ready</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
