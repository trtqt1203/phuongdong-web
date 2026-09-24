"use client";

import { useEffect, useState } from "react";
import { Check, CreditCard, Search, X } from "lucide-react";
import { lookupOrder, money, ORDER_STATUSES, payOrder, paymentDue, type TailorOrder } from "@/lib/orders";

interface OrderLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OrderLookupModal({ isOpen, onClose }: OrderLookupModalProps) {
  const [code, setCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [order, setOrder] = useState<TailorOrder | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const search = async () => {
    if (!/^PD-[A-Z0-9]{6}$/i.test(code.trim()) || !phoneNumber.trim()) {
      setMessage("Nhập đúng mã đơn PD-XXXXXX và số điện thoại đã đặt lịch.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      setOrder(await lookupOrder(code.trim(), phoneNumber));
      setSearched(true);
    } catch (error) {
      setOrder(null);
      setSearched(true);
      setMessage(error instanceof Error ? error.message : "Không thể tra cứu đơn.");
    } finally {
      setLoading(false);
    }
  };

  const pay = async (current: TailorOrder) => {
    const amount = paymentDue(current);
    if (!amount || !window.confirm(`Xác nhận thanh toán mô phỏng ${money(amount)}? Không thu tiền thật.`)) return;
    setLoading(true);
    try {
      setOrder(await payOrder(current.code, phoneNumber));
      setMessage("Đã ghi nhận thanh toán mô phỏng.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không cập nhật được đơn.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="lookup-title" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto border border-white/10 bg-[#101010] p-6 md:p-10">
        <button onClick={onClose} aria-label="Đóng tra cứu" className="absolute right-5 top-5 p-2 text-atelier-textMuted hover:text-atelier-text"><X className="h-5 w-5" /></button>
        <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-atelier-gold">Hồ sơ đặt may</span>
        <h2 id="lookup-title" className="mt-2 font-serif text-3xl text-atelier-text md:text-4xl">Tra cứu đơn</h2>
        <p className="mt-2 text-sm text-atelier-textMuted">Nhập mã đơn và số điện thoại để bảo vệ thông tin khách hàng.</p>

        <form className="mt-7 grid gap-3 md:grid-cols-[1fr_1fr_auto]" onSubmit={(event) => { event.preventDefault(); void search(); }}>
          <label><span className="mb-1.5 block text-[10px] uppercase tracking-wider text-atelier-textMuted">Mã đơn</span><input id="order-code" autoCapitalize="characters" value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="PD-XXXXXX" className="min-h-12 w-full border border-white/10 bg-[#181818] px-4 text-sm text-atelier-text placeholder:text-neutral-600 focus:border-atelier-gold" /></label>
          <label><span className="mb-1.5 block text-[10px] uppercase tracking-wider text-atelier-textMuted">Số điện thoại</span><input id="order-phone" type="tel" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} placeholder="09xxxxxxxx" className="min-h-12 w-full border border-white/10 bg-[#181818] px-4 text-sm text-atelier-text placeholder:text-neutral-600 focus:border-atelier-gold" /></label>
          <button disabled={loading} type="submit" className="mt-auto flex min-h-12 items-center justify-center gap-2 bg-atelier-gold px-6 text-xs font-medium uppercase tracking-[0.2em] text-atelier-bg disabled:opacity-50"><Search className="h-4 w-4" />{loading ? "Đang tìm" : "Tra cứu"}</button>
        </form>
        {message && <p className="mt-4 text-sm text-atelier-gold" role="status">{message}</p>}
        {searched && !order && !message && <div className="mt-8 border border-white/10 p-8 text-center text-sm text-atelier-textMuted">Không tìm thấy đơn phù hợp.</div>}

        {order && <article className="mt-8 border border-white/10 bg-[#141414] p-5 md:p-7">
          <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-start">
            <div><span className="text-[10px] uppercase tracking-[0.25em] text-atelier-gold">{order.code}</span><h3 className="mt-1 font-serif text-2xl text-atelier-text">{order.fullName}</h3><p className="text-xs text-atelier-textMuted">{order.preferredTime} · {new Date(`${order.preferredDate}T12:00:00`).toLocaleDateString("vi-VN")}</p></div>
            <span className="self-start border border-atelier-gold/30 px-3 py-1 text-xs text-atelier-gold">{ORDER_STATUSES[order.status]}</span>
          </div>
          <ol className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-7" aria-label="Tiến độ đơn may">
            {ORDER_STATUSES.map((label, index) => <li key={label} aria-current={index === order.status ? "step" : undefined} className={`border-t px-1 pt-2 text-[10px] leading-relaxed ${index <= order.status ? "border-atelier-gold text-atelier-text" : "border-white/10 text-atelier-textMuted"}`}><span className="block text-atelier-gold">{String(index + 1).padStart(2, "0")}</span>{label}</li>)}
          </ol>
          <div className="mt-6 grid gap-3 text-sm text-atelier-textMuted sm:grid-cols-3">
            <p>Báo giá<br /><strong className="text-atelier-text">{order.quote ? money(order.quote) : "Chờ xưởng xác nhận"}</strong></p>
            <p>Đã thanh toán<br /><strong className="text-atelier-text">{money(order.paidTotal)}</strong></p>
            <p>Còn lại<br /><strong className="text-atelier-text">{money(Math.max(0, order.quote - order.paidTotal))}</strong></p>
          </div>
          {paymentDue(order) > 0 && <button disabled={loading} onClick={() => void pay(order)} className="mt-5 flex w-full items-center justify-center gap-2 bg-atelier-gold px-5 py-3 text-xs font-medium uppercase tracking-[0.18em] text-atelier-bg disabled:opacity-50 sm:w-auto"><CreditCard className="h-4 w-4" />{order.status >= 5 ? order.paidTotal ? "Thanh toán còn lại" : "Thanh toán toàn bộ" : "Thanh toán cọc"} · {money(paymentDue(order))}</button>}
          {order.status === 6 && <p className="mt-5 flex items-center gap-2 text-sm text-atelier-gold"><Check className="h-4 w-4" />Đơn đã hoàn tất và thanh toán đủ.</p>}
          <p className="mt-4 text-[11px] text-atelier-textMuted">Bản demo · Thanh toán chỉ mô phỏng, không thu tiền thật.</p>
        </article>}
      </div>
    </div>
  );
}
