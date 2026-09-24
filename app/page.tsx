"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useConfiguratorStore } from "@/hooks/useConfiguratorStore";
import { useScrollStage } from "@/hooks/useScrollStage";
import { Navbar } from "@/components/ui/Navbar";
import { AtelierLoader } from "@/components/ui/AtelierLoader";
import { BookingModal } from "@/components/ui/BookingModal";
import { OrderLookupModal } from "@/components/ui/OrderLookupModal";
import { CustomCursor } from "@/components/ui/CustomCursor";

// Sections
import { HeroSection } from "@/components/sections/HeroSection";
import { SilhouetteSection } from "@/components/sections/SilhouetteSection";
import { FabricSection } from "@/components/sections/FabricSection";
import { DetailsSection } from "@/components/sections/DetailsSection";
import { ShirtTieSection } from "@/components/sections/ShirtTieSection";
import { FitSection } from "@/components/sections/FitSection";
import { ConfiguratorSection } from "@/components/sections/ConfiguratorSection";
import { CraftsmanshipSection } from "@/components/sections/CraftsmanshipSection";
import { AIPreviewSection } from "@/components/sections/AIPreviewSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { Footer } from "@/components/sections/Footer";

// Dynamic import for R3F Canvas to prevent SSR hydration errors
const SuitCanvas = dynamic(
  () => import("@/components/3d/SuitCanvas").then((mod) => mod.SuitCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#080808] flex items-center justify-center">
        <span className="font-serif text-atelier-gold text-lg tracking-widest animate-pulse">
          PHƯƠNG ĐÔNG
        </span>
      </div>
    ),
  }
);

export default function Home() {
  const store = useConfiguratorStore();
  const scrollState = useScrollStage();
  const [is3DReady, setIs3DReady] = useState(false);
  const [isLookupOpen, setIsLookupOpen] = useState(false);

  const scrollToConfigurator = () => {
    const el = document.getElementById("configurator-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="relative bg-atelier-bg text-atelier-text min-h-screen overflow-x-hidden selection:bg-atelier-gold selection:text-atelier-bg">
      {/* Atelier Preloader */}
      <AtelierLoader isReady={is3DReady} />

      {/* Desktop Custom Minimalist Cursor */}
      <CustomCursor />

      {/* Navigation Header */}
      <Navbar
        onOpenBooking={store.openBooking}
        onOpenLookup={() => setIsLookupOpen(true)}
        onNavigateToConfigurator={scrollToConfigurator}
      />

      {/* ========================================================
          PERSISTENT STICKY 3D SUIT CANVAS
          Keeps single primary canvas instance alive across all sections
      ======================================================== */}
      <div
        className={`fixed inset-0 z-0 transition-opacity duration-700 pointer-events-none ${
          scrollState.progress > 0.98 && !scrollState.isConfiguratorVisible
            ? "opacity-25"
            : "opacity-100"
        }`}
        style={{
          // When configurator section is active, permit user pointer events for OrbitControls
          pointerEvents: scrollState.isConfiguratorVisible ? "auto" : "none",
        }}
      >
        <SuitCanvas
          config={store.config}
          scrollState={scrollState}
          isConfiguratorMode={scrollState.isConfiguratorVisible}
          onReady={() => setIs3DReady(true)}
        />
      </div>

      {/* ========================================================
          SCROLLYTELLING STORY CONTAINER (Sections 01 - 06)
      ======================================================== */}
      <div id="scrollytelling-container" className="relative z-10">
        {/* Section 01: Hero */}
        <HeroSection
          onDesignSuit={scrollToConfigurator}
          onBookFitting={store.openBooking}
        />

        {/* Section 02: The Silhouette */}
        <SilhouetteSection />

        {/* Section 03: Fabric Selection */}
        <FabricSection
          selectedFabricId={store.config.fabric}
          onSelectFabric={(id) => store.updateConfig("fabric", id)}
        />

        {/* Section 04: Lapel & Details */}
        <DetailsSection
          config={store.config}
          onUpdateConfig={store.updateConfig}
        />

        {/* Section 05: Shirt & Tie Styling */}
        <ShirtTieSection
          config={store.config}
          onUpdateConfig={store.updateConfig}
        />

        {/* Section 06: Fit & Proportion */}
        <FitSection
          selectedFitId={store.config.fit}
          onSelectFit={(fit) => store.updateConfig("fit", fit)}
        />
      </div>

      {/* ========================================================
          DEDICATED FULL 3D CONFIGURATOR SECTION
      ======================================================== */}
      <div className="relative z-10">
        <ConfiguratorSection
          config={store.config}
          onUpdateConfig={store.updateConfig}
          onResetConfig={store.resetConfig}
          onOpenBooking={store.openBooking}
        />
      </div>

      {/* ========================================================
          EDITORIAL CRAFTSMANSHIP & TECHNOLOGY
      ======================================================== */}
      <div className="relative z-10 bg-[#080808]">
        <CraftsmanshipSection />
        <AIPreviewSection />
        <FinalCTASection onOpenBooking={store.openBooking} />
        <Footer />
      </div>

      {/* ========================================================
          BOOKING & PRIVATE FITTING MODAL
      ======================================================== */}
      <BookingModal
        isOpen={store.isBookingOpen}
        onClose={store.closeBooking}
        suitConfig={store.config}
      />
      <OrderLookupModal isOpen={isLookupOpen} onClose={() => setIsLookupOpen(false)} />
    </main>
  );
}
