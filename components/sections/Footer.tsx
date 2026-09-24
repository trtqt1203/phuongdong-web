"use client";

import React from "react";
import { Scissors, MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/10 text-atelier-textMuted py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
        {/* Brand Col */}
        <div className="md:col-span-4 flex flex-col items-start">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full border border-atelier-gold/40 flex items-center justify-center">
              <Scissors className="w-3.5 h-3.5 text-atelier-gold" />
            </div>
            <div>
              <span className="block font-serif text-lg tracking-[0.25em] font-light text-atelier-text">
                PHƯƠNG ĐÔNG
              </span>
              <span className="block font-sans text-[8px] tracking-[0.35em] text-atelier-gold uppercase font-medium">
                May đo · Việt Trì
              </span>
            </div>
          </div>
          <p className="font-sans text-xs text-atelier-textMuted leading-relaxed max-w-sm font-light mt-2">
            Chắt lọc tinh hoa. Định hình phong cách qua kỹ nghệ may đo và trải nghiệm thiết kế 3D.
          </p>
          <span className="block font-mono text-[10px] text-atelier-gold/70 mt-6 tracking-widest">
            VIỆT TRÌ · PHÚ THỌ · VIỆT NAM
          </span>
        </div>

        {/* Atelier Location */}
        <div className="md:col-span-3 text-left">
          <span className="block font-sans text-[10px] uppercase tracking-[0.3em] text-atelier-text mb-4 font-medium">
            Địa chỉ xưởng
          </span>
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-3.5 h-3.5 text-atelier-gold shrink-0 mt-0.5" />
              <span>
                Số nhà 02, ngõ 02 đường Đặng Dung,
                <br />
                Phường Quang Trung, Việt Trì, Phú Thọ
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-3.5 h-3.5 text-atelier-gold shrink-0" />
              <span>Thông tin liên hệ sẽ được cập nhật</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-3.5 h-3.5 text-atelier-gold shrink-0" />
              <span>Tiếp nhận lịch hẹn qua website</span>
            </div>
          </div>
        </div>

        {/* Salon Hours */}
        <div className="md:col-span-3 text-left">
          <span className="block font-sans text-[10px] uppercase tracking-[0.3em] text-atelier-text mb-4 font-medium">
            Thời gian làm việc
          </span>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2.5">
              <Clock className="w-3.5 h-3.5 text-atelier-gold shrink-0 mt-0.5" />
              <div>
                <p className="text-atelier-text">Theo lịch đã xác nhận</p>
                <p className="text-[11px] text-atelier-textMuted">Vui lòng đặt lịch trước khi đến</p>
              </div>
            </div>
            <div className="pt-2">
              <p className="text-atelier-text">Tư vấn riêng</p>
              <p className="text-[11px] text-atelier-textMuted">Khung giờ được xưởng xác nhận</p>
            </div>
            <div className="pt-1 text-[11px] text-atelier-gold">
              Lịch trên website là yêu cầu chờ xác nhận
            </div>
          </div>
        </div>

        {/* Navigation / Links */}
        <div className="md:col-span-2 text-left">
          <span className="block font-sans text-[10px] uppercase tracking-[0.3em] text-atelier-text mb-4 font-medium">
            Điều hướng
          </span>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="#hero" className="hover:text-atelier-gold transition-colors">
                Trang chủ
              </a>
            </li>
            <li>
              <a href="#silhouette" className="hover:text-atelier-gold transition-colors">
                Phom dáng
              </a>
            </li>
            <li>
              <a href="#craftsmanship" className="hover:text-atelier-gold transition-colors">
                Nghệ thuật may
              </a>
            </li>
            <li>
              <a href="#configurator-section" className="hover:text-atelier-gold transition-colors">
                Thiết kế 3D
              </a>
            </li>
            <li>
              <a href="#process" className="hover:text-atelier-gold transition-colors">
                Quy trình
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Sub-footer */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-atelier-textMuted/70 gap-4">
        <p>© {new Date().getFullYear()} Phương Đông. Bản demo trải nghiệm.</p>
        <p className="tracking-wider">
          Chắt lọc tinh hoa · Định hình phong cách
        </p>
      </div>
    </footer>
  );
}
