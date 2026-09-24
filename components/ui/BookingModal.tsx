"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Check, Calendar, Clock, Sparkles } from "lucide-react";
import { SuitConfiguration } from "@/data/configuratorOptions";
import { FABRICS, LAPELS, FITS, SHIRTS, TIES, BUTTONS } from "@/data/configuratorOptions";
import { createOrder, type TailorOrder } from "@/lib/orders";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  suitConfig: SuitConfiguration;
}

export function BookingModal({ isOpen, onClose, suitConfig }: BookingModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    preferredDate: "",
    preferredTime: "14:00",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [savedOrder, setSavedOrder] = useState<TailorOrder | null>(null);

  // Focus trap & Escape key listener
  useEffect(() => {
    if (!isOpen) {
      setIsSuccess(false);
      setErrors({});
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    setTimeout(() => firstInputRef.current?.focus(), 100);

    // Prevent body scroll when modal open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const validate = () => {
    const err: Record<string, string> = {};
    if (formData.fullName.trim().length < 2) err.fullName = "Vui lòng nhập họ và tên";
    if (!formData.phoneNumber.trim()) {
      err.phoneNumber = "Vui lòng nhập số điện thoại";
    } else if (!/^(?:\+?84|0)[35789](?:[ .-]?\d){8}$/.test(formData.phoneNumber.trim())) {
      err.phoneNumber = "Số điện thoại Việt Nam chưa hợp lệ";
    }
    if (formData.email.trim() && !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      err.email = "Email chưa hợp lệ";
    }
    if (!formData.preferredDate) err.preferredDate = "Vui lòng chọn ngày hẹn";
    else if (new Date(`${formData.preferredDate}T${formData.preferredTime}`) <= new Date()) err.preferredDate = "Vui lòng chọn thời gian trong tương lai";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const order = await createOrder({ ...formData, config: suitConfig });
      setSavedOrder(order);
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (error) {
      setIsSubmitting(false);
      setErrors({ submit: error instanceof Error ? error.message : "Không lưu được lịch hẹn. Vui lòng thử lại." });
    }
  };

  if (!isOpen) return null;

  // Selected config labels
  const fabricName = FABRICS.find((f) => f.id === suitConfig.fabric)?.name || suitConfig.fabric;
  const lapelName = LAPELS.find((l) => l.id === suitConfig.lapel)?.name || suitConfig.lapel;
  const fitName = FITS.find((f) => f.id === suitConfig.fit)?.name || suitConfig.fit;
  const shirtName = SHIRTS.find((s) => s.id === suitConfig.shirt)?.name || suitConfig.shirt;
  const tieName = TIES.find((t) => t.id === suitConfig.tie)?.name || suitConfig.tie;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-2xl bg-[#101010] border border-white/10 p-6 md:p-10 shadow-2xl overflow-y-auto max-h-[92vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-atelier-textMuted hover:text-atelier-text transition-colors focus-visible:outline-none"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full border border-atelier-gold flex items-center justify-center mb-6 text-atelier-gold">
              <Check className="w-7 h-7" />
            </div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-atelier-gold font-sans font-medium mb-2">
              Đã lưu lịch hẹn
            </span>
            <h3 className="font-serif text-3xl md:text-4xl text-atelier-text font-light mb-4">
              Hẹn gặp bạn tại Phương Đông
            </h3>
            <p className="text-sm text-atelier-textMuted max-w-md leading-relaxed mb-6">
              Cảm ơn <span className="text-atelier-text">{formData.fullName}</span>. Xưởng sẽ liên hệ số{" "}
              <span className="text-atelier-gold">{formData.phoneNumber}</span> để xác nhận lịch ngày {formData.preferredDate} lúc {formData.preferredTime}.
            </p>
            <div className="p-4 bg-[#161616] border border-white/5 text-left w-full max-w-md mb-8 text-xs">
              <span className="block text-[10px] uppercase tracking-widest text-atelier-gold mb-2 font-medium">
                Mã đơn: {savedOrder?.code}
              </span>
              <p className="text-atelier-textMuted leading-relaxed">
                {fabricName} · {lapelName} · {fitName} · {shirtName} · {tieName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-8 py-3 text-xs tracking-[0.25em] uppercase font-sans font-medium text-atelier-bg bg-atelier-gold hover:bg-[#cbb07a] transition-colors"
            >
              Tiếp tục trải nghiệm
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-8 text-left">
              <span className="inline-block text-[10px] tracking-[0.35em] uppercase text-atelier-gold font-sans font-medium mb-2">
                Lịch hẹn riêng
              </span>
              <h2 id="booking-title" className="font-serif text-3xl md:text-4xl text-atelier-text font-light">
                Đặt lịch cùng Phương Đông
              </h2>
              <p className="text-xs md:text-sm text-atelier-textMuted mt-2 leading-relaxed">
                Chọn thời gian phù hợp để xem vải, xác nhận thiết kế và lấy số đo tại xưởng Việt Trì.
              </p>
            </div>

            {/* Current Suit Config Summary Badge */}
            <div className="mb-6 p-3.5 bg-[#161616] border border-white/10 rounded-none flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-atelier-gold shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="text-atelier-gold uppercase tracking-wider text-[10px] block font-medium">
                  Thiết kế 3D được đính kèm
                </span>
                <span className="text-atelier-textMuted">
                  {fabricName} / {lapelName} / {fitName} / {shirtName}
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-[11px] uppercase tracking-wider text-atelier-textMuted mb-1.5 font-medium">
                    Họ và tên <span className="text-atelier-gold">*</span>
                  </label>
                  <input
                    ref={firstInputRef}
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Hoàng Nam"
                    className="w-full bg-[#181818] border border-white/10 px-3.5 py-2.5 text-sm text-atelier-text placeholder:text-neutral-600 focus-visible:border-atelier-gold transition-colors"
                  />
                  {errors.fullName && <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-[11px] uppercase tracking-wider text-atelier-textMuted mb-1.5 font-medium">
                    Số điện thoại <span className="text-atelier-gold">*</span>
                  </label>
                  <input
                    id="phoneNumber"
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    placeholder="+84 912 345 678"
                    className="w-full bg-[#181818] border border-white/10 px-3.5 py-2.5 text-sm text-atelier-text placeholder:text-neutral-600 focus-visible:border-atelier-gold transition-colors"
                  />
                  {errors.phoneNumber && <p className="text-[11px] text-red-400 mt-1">{errors.phoneNumber}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-[11px] uppercase tracking-wider text-atelier-textMuted mb-1.5 font-medium">
                  Email (không bắt buộc)
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full bg-[#181818] border border-white/10 px-3.5 py-2.5 text-sm text-atelier-text placeholder:text-neutral-600 focus-visible:border-atelier-gold transition-colors"
                />
                {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="preferredDate" className="block text-[11px] uppercase tracking-wider text-atelier-textMuted mb-1.5 font-medium">
                    Ngày mong muốn <span className="text-atelier-gold">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="preferredDate"
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full bg-[#181818] border border-white/10 px-3.5 py-2.5 text-sm text-atelier-text focus-visible:border-atelier-gold transition-colors"
                    />
                    <Calendar className="w-4 h-4 text-atelier-textMuted absolute right-3 top-3 pointer-events-none" />
                  </div>
                  {errors.preferredDate && <p className="text-[11px] text-red-400 mt-1">{errors.preferredDate}</p>}
                </div>

                <div>
                  <label htmlFor="preferredTime" className="block text-[11px] uppercase tracking-wider text-atelier-textMuted mb-1.5 font-medium">
                    Khung giờ
                  </label>
                  <div className="relative">
                    <select
                      id="preferredTime"
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full bg-[#181818] border border-white/10 px-3.5 py-2.5 text-sm text-atelier-text focus-visible:border-atelier-gold transition-colors appearance-none cursor-pointer"
                    >
                      <option value="10:00">Buổi sáng · 10:00</option>
                      <option value="11:30">Buổi trưa · 11:30</option>
                      <option value="14:00">Buổi chiều · 14:00</option>
                      <option value="16:00">Buổi chiều · 16:00</option>
                      <option value="18:00">Buổi tối · 18:00</option>
                    </select>
                    <Clock className="w-4 h-4 text-atelier-textMuted absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-[11px] uppercase tracking-wider text-atelier-textMuted mb-1.5 font-medium">
                  Ghi chú hoặc dịp sử dụng
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ví dụ: vest cưới, ưu tiên chất liệu nhẹ…"
                  className="w-full bg-[#181818] border border-white/10 px-3.5 py-2.5 text-sm text-atelier-text placeholder:text-neutral-600 focus-visible:border-atelier-gold transition-colors resize-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto flex-1 py-3.5 px-6 text-xs tracking-[0.25em] uppercase font-sans font-medium text-atelier-bg bg-atelier-gold hover:bg-[#cbb07a] transition-all duration-300 disabled:opacity-50 text-center"
                >
                  {isSubmitting ? "Đang lưu…" : "Xác nhận đặt lịch"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto py-3.5 px-6 text-xs tracking-[0.2em] uppercase font-sans text-atelier-textMuted hover:text-atelier-text border border-white/10 hover:border-white/20 transition-colors text-center"
                >
                  Để sau
                </button>
              </div>
            </form>
            {errors.submit && <p className="mt-4 text-sm text-red-400" role="alert">{errors.submit}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
