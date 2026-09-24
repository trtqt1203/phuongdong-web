"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Scissors, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenLookup: () => void;
  onNavigateToConfigurator: () => void;
}

export function Navbar({ onOpenBooking, onOpenLookup, onNavigateToConfigurator }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 w-full z-40 transition-all duration-500 ease-out py-5 px-6 md:px-12 lg:px-16",
          scrolled
            ? "bg-[#080808]/85 backdrop-blur-md border-b border-white/10 py-4 shadow-2xl"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#"
            className="group flex items-center gap-3 text-left focus-visible:outline-none"
            aria-label="Phương Đông Tailor - Back to top"
          >
            <div className="w-8 h-8 rounded-full border border-atelier-gold/40 flex items-center justify-center transition-transform duration-500 group-hover:scale-105 group-hover:border-atelier-gold">
              <Scissors className="w-3.5 h-3.5 text-atelier-gold" />
            </div>
            <div>
              <span className="block font-serif text-lg md:text-xl tracking-[0.25em] font-light text-atelier-text">
                PHƯƠNG ĐÔNG
              </span>
              <span className="block font-sans text-[9px] tracking-[0.35em] text-atelier-gold uppercase font-medium">
                May đo · Việt Trì
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            <button
              onClick={() => scrollToSection("hero")}
              className="text-xs uppercase tracking-[0.2em] text-atelier-textMuted hover:text-atelier-text transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-atelier-gold hover:after:w-full after:transition-all after:duration-300"
            >
              Trang chủ
            </button>
            <button
              onClick={() => scrollToSection("silhouette")}
              className="text-xs uppercase tracking-[0.2em] text-atelier-textMuted hover:text-atelier-text transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-atelier-gold hover:after:w-full after:transition-all after:duration-300"
            >
              Phom dáng
            </button>
            <button
              onClick={() => scrollToSection("craftsmanship")}
              className="text-xs uppercase tracking-[0.2em] text-atelier-textMuted hover:text-atelier-text transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-atelier-gold hover:after:w-full after:transition-all after:duration-300"
            >
              Nghệ thuật may
            </button>
            <button
              onClick={onNavigateToConfigurator}
              className="text-xs uppercase tracking-[0.2em] text-atelier-text hover:text-atelier-gold transition-colors relative py-1 font-medium"
            >
              Thiết kế 3D
            </button>
            <button
              onClick={() => scrollToSection("process")}
              className="text-xs uppercase tracking-[0.2em] text-atelier-textMuted hover:text-atelier-text transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-atelier-gold hover:after:w-full after:transition-all after:duration-300"
            >
              Quy trình
            </button>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button onClick={onOpenLookup} className="flex items-center gap-2 px-2 py-2.5 text-xs tracking-[0.12em] uppercase text-atelier-textMuted hover:text-atelier-text">
              <Search className="h-4 w-4" /> Tra cứu đơn
            </button>
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 text-xs tracking-[0.2em] uppercase font-sans font-medium text-atelier-bg bg-atelier-gold hover:bg-[#cbb07a] transition-all duration-300 hover:shadow-[0_0_20px_rgba(185,154,99,0.3)]"
            >
              Đặt lịch
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-atelier-text hover:text-atelier-gold transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-[#080808]/98 backdrop-blur-xl transition-all duration-500 flex flex-col justify-center px-10 md:hidden",
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col gap-6 text-left">
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-atelier-gold">
            Điều hướng
          </span>
          <button
            onClick={() => scrollToSection("hero")}
            className="font-serif text-3xl text-atelier-text hover:text-atelier-gold text-left transition-colors"
          >
            01 Trang chủ
          </button>
          <button
            onClick={() => scrollToSection("silhouette")}
            className="font-serif text-3xl text-atelier-text hover:text-atelier-gold text-left transition-colors"
          >
            02 Phom dáng & chất liệu
          </button>
          <button
            onClick={() => scrollToSection("craftsmanship")}
            className="font-serif text-3xl text-atelier-text hover:text-atelier-gold text-left transition-colors"
          >
            03 Nghệ thuật may
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigateToConfigurator();
            }}
            className="font-serif text-3xl text-atelier-gold text-left transition-colors"
          >
            04 Thiết kế 3D
          </button>
          <button
            onClick={() => scrollToSection("process")}
            className="font-serif text-3xl text-atelier-text hover:text-atelier-gold text-left transition-colors"
          >
            05 Quy trình may đo
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col gap-4">
          <button onClick={() => { setMobileMenuOpen(false); onOpenLookup(); }} className="w-full border border-white/15 py-3.5 text-center text-xs uppercase tracking-[0.2em] text-atelier-text">
            Tra cứu đơn
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBooking();
            }}
            className="w-full py-3.5 text-xs tracking-[0.25em] uppercase font-sans font-medium text-atelier-bg bg-atelier-gold hover:bg-[#cbb07a] transition-all text-center"
          >
            Đặt lịch tư vấn
          </button>
          <p className="text-[11px] text-atelier-textMuted tracking-wider text-center">
            Số 02, ngõ 02 Đặng Dung, Quang Trung, Việt Trì, Phú Thọ
          </p>
        </div>
      </div>
    </>
  );
}
