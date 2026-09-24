"use client";

import { useState, useCallback, useMemo } from "react";
import {
  DEFAULT_SUIT_CONFIG,
  SuitConfiguration,
  FABRICS,
  LAPELS,
  BUTTONS,
  POCKETS,
  SHIRTS,
  TIES,
  FITS,
  FabricOption,
  LapelOption,
  ButtonOption,
  PocketOption,
  ShirtOption,
  TieOption,
  FitOption,
} from "@/data/configuratorOptions";

export function useConfiguratorStore() {
  const [config, setConfig] = useState<SuitConfiguration>(DEFAULT_SUIT_CONFIG);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"fabric" | "lapel" | "buttons" | "pocket" | "shirt" | "tie" | "fit">("fabric");

  const updateConfig = useCallback(<K extends keyof SuitConfiguration>(key: K, value: SuitConfiguration[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_SUIT_CONFIG);
  }, []);

  const openBooking = useCallback(() => setIsBookingOpen(true), []);
  const closeBooking = useCallback(() => setIsBookingOpen(false), []);

  const selectedFabric = useMemo<FabricOption>(
    () => FABRICS.find((f) => f.id === config.fabric) || FABRICS[0],
    [config.fabric]
  );

  const selectedLapel = useMemo<LapelOption>(
    () => LAPELS.find((l) => l.id === config.lapel) || LAPELS[1],
    [config.lapel]
  );

  const selectedButtons = useMemo<ButtonOption>(
    () => BUTTONS.find((b) => b.id === config.buttons) || BUTTONS[1],
    [config.buttons]
  );

  const selectedPocket = useMemo<PocketOption>(
    () => POCKETS.find((p) => p.id === config.pocket) || POCKETS[0],
    [config.pocket]
  );

  const selectedShirt = useMemo<ShirtOption>(
    () => SHIRTS.find((s) => s.id === config.shirt) || SHIRTS[0],
    [config.shirt]
  );

  const selectedTie = useMemo<TieOption>(
    () => TIES.find((t) => t.id === config.tie) || TIES[0],
    [config.tie]
  );

  const selectedFit = useMemo<FitOption>(
    () => FITS.find((f) => f.id === config.fit) || FITS[1],
    [config.fit]
  );

  return {
    config,
    updateConfig,
    resetConfig,
    isBookingOpen,
    openBooking,
    closeBooking,
    activeTab,
    setActiveTab,
    selectedFabric,
    selectedLapel,
    selectedButtons,
    selectedPocket,
    selectedShirt,
    selectedTie,
    selectedFit,
  };
}

export type ConfiguratorStore = ReturnType<typeof useConfiguratorStore>;
