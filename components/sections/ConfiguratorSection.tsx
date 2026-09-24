"use client";

import React, { useState } from "react";
import {
  SuitConfiguration,
  FABRICS,
  LAPELS,
  BUTTONS,
  POCKETS,
  SHIRTS,
  TIES,
  FITS,
  FabricOption,
} from "@/data/configuratorOptions";
import { cn } from "@/lib/utils";
import { RotateCcw, Calendar, Check, SlidersHorizontal, Sparkles } from "lucide-react";

interface ConfiguratorSectionProps {
  config: SuitConfiguration;
  onUpdateConfig: <K extends keyof SuitConfiguration>(key: K, value: SuitConfiguration[K]) => void;
  onResetConfig: () => void;
  onOpenBooking: () => void;
}

type TabType = "fabric" | "lapel" | "buttons" | "pocket" | "shirt" | "tie" | "fit";

export function ConfiguratorSection({
  config,
  onUpdateConfig,
  onResetConfig,
  onOpenBooking,
}: ConfiguratorSectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>("fabric");

  const selectedFabric = FABRICS.find((f) => f.id === config.fabric) || FABRICS[0];
  const selectedLapel = LAPELS.find((l) => l.id === config.lapel) || LAPELS[1];
  const selectedButtons = BUTTONS.find((b) => b.id === config.buttons) || BUTTONS[1];
  const selectedPocket = POCKETS.find((p) => p.id === config.pocket) || POCKETS[0];
  const selectedShirt = SHIRTS.find((s) => s.id === config.shirt) || SHIRTS[0];
  const selectedTie = TIES.find((t) => t.id === config.tie) || TIES[0];
  const selectedFit = FITS.find((f) => f.id === config.fit) || FITS[1];

  const tabs: { id: TabType; label: string }[] = [
    { id: "fabric", label: "Fabric" },
    { id: "lapel", label: "Lapel" },
    { id: "buttons", label: "Stance" },
    { id: "pocket", label: "Pocket" },
    { id: "shirt", label: "Shirt" },
    { id: "tie", label: "Tie" },
    { id: "fit", label: "Cut" },
  ];

  return (
    <section
      id="configurator-section"
      className="relative min-h-screen py-24 px-6 md:px-12 lg:px-16 bg-transparent border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-white/10 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-atelier-gold" />
              <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-atelier-gold font-medium">
                Interactive Studio
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-light tracking-tight text-atelier-text">
              BUILD YOUR SUIT
            </h2>
          </div>
          <p className="font-sans text-xs md:text-sm text-atelier-textMuted max-w-md leading-relaxed font-light">
            Rotate, examine every bespoke feature in 360°, and customize each detail before reserving
            your bespoke fitting salon.
          </p>
        </div>

        {/* Main Configurator Split Layout (65-70% 3D viewer, 30-35% Panel on Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 3D Viewer Canvas Portal & Controls Hint (approx 68% desktop width) */}
          <div className="lg:col-span-8 bg-black/25 border border-white/15 relative rounded-none overflow-hidden h-[520px] md:h-[680px] flex flex-col justify-between pointer-events-none">
            {/* Viewer Overlay Controls Tag */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-[#080808]/80 border border-white/10 backdrop-blur-md pointer-events-auto">
              <SlidersHorizontal className="w-3 h-3 text-atelier-gold" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-sans text-atelier-textMuted">
                360° Inspection Active
              </span>
            </div>

            <div className="absolute top-4 right-4 z-10 flex items-center gap-2 pointer-events-auto">
              <button
                onClick={onResetConfig}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#080808]/80 hover:bg-[#161616] border border-white/10 text-atelier-textMuted hover:text-atelier-text text-[10px] uppercase tracking-widest font-sans transition-all"
                title="Restore default suit blueprint"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Hint at bottom of viewer */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none px-4 py-1.5 bg-[#080808]/75 border border-white/10 text-[10px] uppercase tracking-[0.25em] text-atelier-textMuted/90 backdrop-blur-sm">
              Click &amp; Drag to Orbit · Scroll to Zoom
            </div>

            {/* Empty view portal for fixed canvas underneath */}
            <div className="w-full h-full" />
          </div>

          {/* Right Column: Sleek Configurator Tabs & Blueprint Panel (approx 32% desktop width) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Tab Navigation (Segmented buttons) */}
            <div className="flex flex-wrap gap-1 p-1 bg-[#141414] border border-white/10">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={cn(
                    "flex-1 min-w-[56px] py-2 text-[10px] uppercase tracking-wider font-sans text-center transition-all duration-200",
                    activeTab === t.id
                      ? "bg-atelier-gold text-atelier-bg font-semibold shadow-sm"
                      : "text-atelier-textMuted hover:text-atelier-text hover:bg-white/5"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab Body Contents */}
            <div className="p-5 bg-[#121212] border border-white/10 min-h-[280px]">
              {/* 1. Fabric Tab */}
              {activeTab === "fabric" && (
                <div className="space-y-4">
                  <span className="block text-[10px] uppercase tracking-[0.25em] text-atelier-gold font-medium">
                    Select Mill &amp; Color
                  </span>
                  <div className="grid grid-cols-1 gap-2.5">
                    {FABRICS.map((f: FabricOption) => {
                      const isSelected = f.id === config.fabric;
                      return (
                        <button
                          key={f.id}
                          onClick={() => onUpdateConfig("fabric", f.id)}
                          className={cn(
                            "flex items-center gap-3 p-2.5 border transition-all text-left",
                            isSelected
                              ? "border-atelier-gold bg-atelier-gold/10"
                              : "border-white/10 hover:border-white/20 bg-black/30"
                          )}
                        >
                          <div
                            className="w-6 h-6 border border-white/20 shrink-0 flex items-center justify-center"
                            style={{ backgroundColor: f.color }}
                          >
                            {isSelected && (
                              <Check
                                className={cn(
                                  "w-3.5 h-3.5",
                                  f.id === "ivory" ? "text-black" : "text-white"
                                )}
                              />
                            )}
                          </div>
                          <div className="overflow-hidden">
                            <span className="block text-xs font-medium text-atelier-text truncate">
                              {f.name}
                            </span>
                            <span className="block text-[10px] text-atelier-textMuted truncate">
                              {f.composition}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Lapel Tab */}
              {activeTab === "lapel" && (
                <div className="space-y-3">
                  <span className="block text-[10px] uppercase tracking-[0.25em] text-atelier-gold font-medium">
                    Lapel Geometry
                  </span>
                  {LAPELS.map((lapel) => {
                    const isSelected = config.lapel === lapel.id;
                    return (
                      <button
                        key={lapel.id}
                        onClick={() => onUpdateConfig("lapel", lapel.id)}
                        className={cn(
                          "w-full text-left p-3 border transition-all",
                          isSelected
                            ? "border-atelier-gold bg-atelier-gold/10"
                            : "border-white/10 hover:border-white/20 bg-black/30"
                        )}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-atelier-text">
                            {lapel.name}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider text-atelier-gold font-medium">
                            {lapel.tagline}
                          </span>
                        </div>
                        <p className="text-[10px] text-atelier-textMuted leading-relaxed">
                          {lapel.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 3. Buttons Tab */}
              {activeTab === "buttons" && (
                <div className="space-y-3">
                  <span className="block text-[10px] uppercase tracking-[0.25em] text-atelier-gold font-medium">
                    Fastening Stance
                  </span>
                  {BUTTONS.map((btn) => {
                    const isSelected = config.buttons === btn.id;
                    return (
                      <button
                        key={btn.id}
                        onClick={() => onUpdateConfig("buttons", btn.id)}
                        className={cn(
                          "w-full text-left p-3 border transition-all",
                          isSelected
                            ? "border-atelier-gold bg-atelier-gold/10"
                            : "border-white/10 hover:border-white/20 bg-black/30"
                        )}
                      >
                        <div className="text-xs font-medium text-atelier-text mb-1">
                          {btn.name}
                        </div>
                        <p className="text-[10px] text-atelier-textMuted leading-relaxed">
                          {btn.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 4. Pocket Tab */}
              {activeTab === "pocket" && (
                <div className="space-y-3">
                  <span className="block text-[10px] uppercase tracking-[0.25em] text-atelier-gold font-medium">
                    Pocket Finishing
                  </span>
                  {POCKETS.map((pkt) => {
                    const isSelected = config.pocket === pkt.id;
                    return (
                      <button
                        key={pkt.id}
                        onClick={() => onUpdateConfig("pocket", pkt.id)}
                        className={cn(
                          "w-full text-left p-3 border transition-all",
                          isSelected
                            ? "border-atelier-gold bg-atelier-gold/10"
                            : "border-white/10 hover:border-white/20 bg-black/30"
                        )}
                      >
                        <div className="text-xs font-medium text-atelier-text mb-1">
                          {pkt.name}
                        </div>
                        <p className="text-[10px] text-atelier-textMuted leading-relaxed">
                          {pkt.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 5. Shirt Tab */}
              {activeTab === "shirt" && (
                <div className="space-y-3">
                  <span className="block text-[10px] uppercase tracking-[0.25em] text-atelier-gold font-medium">
                    Dress Shirt
                  </span>
                  <div className="grid grid-cols-1 gap-2">
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
                              : "border-white/10 hover:border-white/20 bg-black/30"
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
                            <span className="block text-[10px] text-atelier-textMuted truncate">
                              {shirt.fabric}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 6. Tie Tab */}
              {activeTab === "tie" && (
                <div className="space-y-3">
                  <span className="block text-[10px] uppercase tracking-[0.25em] text-atelier-gold font-medium">
                    Silk Tie
                  </span>
                  <div className="grid grid-cols-1 gap-2">
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
                              : "border-white/10 hover:border-white/20 bg-black/30"
                          )}
                        >
                          <div
                            className={cn(
                              "w-5 h-5 border border-white/20 shrink-0 flex items-center justify-center",
                              tie.color ? "" : "bg-neutral-800"
                            )}
                            style={{ backgroundColor: tie.color || undefined }}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white drop-shadow" />}
                          </div>
                          <div className="overflow-hidden">
                            <span className="block text-xs font-medium text-atelier-text truncate">
                              {tie.name}
                            </span>
                            <span className="block text-[10px] text-atelier-textMuted truncate">
                              {tie.silkType}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 7. Fit Tab */}
              {activeTab === "fit" && (
                <div className="space-y-3">
                  <span className="block text-[10px] uppercase tracking-[0.25em] text-atelier-gold font-medium">
                    Cut &amp; Silhouette
                  </span>
                  {FITS.map((f) => {
                    const isSelected = config.fit === f.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => onUpdateConfig("fit", f.id)}
                        className={cn(
                          "w-full text-left p-3 border transition-all",
                          isSelected
                            ? "border-atelier-gold bg-atelier-gold/10"
                            : "border-white/10 hover:border-white/20 bg-black/30"
                        )}
                      >
                        <div className="text-xs font-medium text-atelier-text mb-1">
                          {f.name}
                        </div>
                        <p className="text-[10px] text-atelier-textMuted leading-relaxed">
                          {f.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Compact Configuration Summary Card */}
            <div className="p-5 bg-[#141414] border border-white/10">
              <span className="block text-[10px] uppercase tracking-[0.3em] text-atelier-gold font-semibold mb-3">
                Your Suit Blueprint
              </span>

              <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs mb-6 pb-4 border-b border-white/10">
                <div>
                  <span className="block text-[10px] text-atelier-textMuted uppercase tracking-wider">
                    Fabric
                  </span>
                  <span className="font-medium text-atelier-text truncate block">
                    {selectedFabric.name}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-atelier-textMuted uppercase tracking-wider">
                    Lapel
                  </span>
                  <span className="font-medium text-atelier-text truncate block">
                    {selectedLapel.name}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-atelier-textMuted uppercase tracking-wider">
                    Cut
                  </span>
                  <span className="font-medium text-atelier-text truncate block">
                    {selectedFit.name}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-atelier-textMuted uppercase tracking-wider">
                    Buttons
                  </span>
                  <span className="font-medium text-atelier-text truncate block">
                    {selectedButtons.name}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-atelier-textMuted uppercase tracking-wider">
                    Shirt
                  </span>
                  <span className="font-medium text-atelier-text truncate block">
                    {selectedShirt.name}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-atelier-textMuted uppercase tracking-wider">
                    Tie
                  </span>
                  <span className="font-medium text-atelier-text truncate block">
                    {selectedTie.name}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={onOpenBooking}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 text-xs tracking-[0.25em] uppercase font-sans font-medium text-atelier-bg bg-atelier-gold hover:bg-[#cbb07a] transition-all duration-300"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Đặt lịch với thiết kế này</span>
                </button>
                <button
                  onClick={onResetConfig}
                  className="w-full py-2.5 text-[10px] tracking-[0.2em] uppercase font-sans text-atelier-textMuted hover:text-atelier-text transition-colors"
                >
                  Reset Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
