"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronRight, LogOut, Search, ShieldCheck } from "lucide-react";
import {
  advanceAdminOrder,
  getAdminOrders,
  getAdminSession,
  loginAdmin,
  logoutAdmin,
  money,
  ORDER_STATUSES,
  updateAdminOrder,
  type TailorOrder,
} from "@/lib/orders";

const OWNERS = ["Chưa phân công", "Mai · Tư vấn", "An · Xưởng", "Linh · Tư vấn"];

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [orders, setOrders] = useState<TailorOrder[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [busyCode, setBusyCode] = useState("");

  const refresh = async () => {
    try {
      setOrders(await getAdminOrders());
    } catch (error) {
      if (error instanceof Error && error.message.includes("đăng nhập")) setAuthenticated(false);
      else setNotice(error instanceof Error ? error.message : "Không tải được danh sách đơn.");
    }
  };

  useEffect(() => {
    void getAdminSession().then((session) => {
      setAuthenticated(session.authenticated);
      setUsername(session.username || "");
      if (session.authenticated) void refresh();
    }).catch(() => setAuthenticated(false));
  }, []);

  const visible = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("vi");
    return orders.filter((order) => (status === "all" || order.status === Number(status)) && (!term || `${order.code} ${order.fullName} ${order.phoneNumber}`.toLocaleLowerCase("vi").includes(term)));
  }, [orders, query, status]);
  const selected = orders.find((order) => order.code === selectedCode) || null;
  const summary = [
    ["Đang xử lý", orders.filter((order) => order.status < 6).length],
    ["Chờ duyệt", orders.filter((order) => order.status === 0).length],
    ["Chờ thanh toán", orders.filter((order) => order.status === 5).length],
  ] as const;

  const advance = async (order: TailorOrder) => {
    if (order.status >= 5 || busyCode) return;
    setBusyCode(order.code);
    try {
      const updated = await advanceAdminOrder(order.code, order.revision);
      setOrders((items) => items.map((item) => item.code === updated.code ? updated : item));
      setNotice(`Đã chuyển ${order.code} sang “${ORDER_STATUSES[updated.status]}”.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Không cập nhật được đơn.");
      await refresh();
    } finally {
      setBusyCode("");
    }
  };

  if (authenticated === null) return <AdminShell><div className="flex min-h-[60vh] items-center justify-center text-sm text-atelier-textMuted">Đang kiểm tra phiên quản trị…</div></AdminShell>;
  if (!authenticated) return <AdminShell><LoginForm onSuccess={(name) => { setAuthenticated(true); setUsername(name); void refresh(); }} /></AdminShell>;

  return <AdminShell username={username} onLogout={async () => { await logoutAdmin(); setAuthenticated(false); setOrders([]); }}>
    <div className="mx-auto max-w-7xl px-5 py-8 md:px-10">
      <div className="mb-8 flex gap-3 border border-emerald-700/30 bg-emerald-950/20 p-4 text-xs leading-relaxed text-emerald-200"><ShieldCheck className="h-5 w-5 shrink-0" /><p>Đã kết nối backend nội bộ. Đơn hàng được lưu trong cơ sở dữ liệu trên máy chủ, dùng chung giữa các thiết bị.</p></div>
      {notice && <p role="status" className="mb-5 border border-atelier-gold/30 p-3 text-sm text-atelier-gold">{notice}</p>}
      <div className="mb-8"><span className="text-[10px] uppercase tracking-[0.3em] text-atelier-gold">Điều hành xưởng</span><h1 className="mt-2 font-serif text-4xl md:text-5xl">Đơn may rõ ràng, dễ xử lý.</h1></div>
      <section className="mb-8 grid grid-cols-3 gap-3 md:gap-5">{summary.map(([label, value]) => <div key={label} className="border border-white/10 bg-[#121212] p-4 md:p-6"><strong className="font-serif text-3xl text-atelier-gold md:text-4xl">{value}</strong><span className="mt-2 block text-[10px] uppercase tracking-[0.12em] text-atelier-textMuted md:text-xs">{label}</span></div>)}</section>
      <section className="border border-white/10 bg-[#111]">
        <div className="grid gap-3 border-b border-white/10 p-4 md:grid-cols-[1fr_240px] md:p-5"><label className="relative"><span className="sr-only">Tìm đơn</span><Search className="absolute left-3 top-3.5 h-4 w-4 text-atelier-textMuted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm mã đơn, tên hoặc số điện thoại" className="min-h-11 w-full border border-white/10 bg-[#181818] pl-10 pr-3 text-sm" /></label><label><span className="sr-only">Lọc trạng thái</span><select value={status} onChange={(event) => setStatus(event.target.value)} className="min-h-11 w-full border border-white/10 bg-[#181818] px-3 text-sm"><option value="all">Tất cả trạng thái</option>{ORDER_STATUSES.map((label, index) => <option key={label} value={index}>{label}</option>)}</select></label></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[850px] border-collapse text-left text-sm"><thead className="bg-[#151515] text-[10px] uppercase tracking-[0.16em] text-atelier-textMuted"><tr><th className="p-4">Đơn / khách</th><th className="p-4">Lịch hẹn</th><th className="p-4">Trạng thái</th><th className="p-4">Phụ trách</th><th className="p-4">Thao tác</th></tr></thead><tbody>{visible.map((order) => <tr key={order.code} className="border-t border-white/10"><td className="p-4"><button onClick={() => setSelectedCode(order.code)} className="text-left font-medium text-atelier-text underline decoration-atelier-gold/50 underline-offset-4">{order.code}</button><small className="block text-atelier-textMuted">{order.fullName} · {order.phoneNumber}</small></td><td className="p-4">{new Date(`${order.preferredDate}T12:00:00`).toLocaleDateString("vi-VN")}<small className="block text-atelier-textMuted">{order.preferredTime}</small></td><td className="p-4"><span className="border border-atelier-gold/25 px-2 py-1 text-xs text-atelier-gold">{ORDER_STATUSES[order.status]}</span></td><td className="p-4 text-atelier-textMuted">{order.owner}</td><td className="p-4">{order.status < 5 ? <button disabled={busyCode === order.code} onClick={() => void advance(order)} className="inline-flex items-center gap-1 bg-atelier-gold px-3 py-2 text-xs font-medium text-atelier-bg disabled:opacity-50">{order.status === 0 ? "Duyệt lịch" : `Sang ${ORDER_STATUSES[order.status + 1]}`}<ChevronRight className="h-3.5 w-3.5" /></button> : order.status === 5 ? <span className="text-xs text-atelier-textMuted">Chờ khách thanh toán</span> : <span className="inline-flex items-center gap-1 text-xs text-atelier-gold"><Check className="h-4 w-4" />Hoàn tất</span>}</td></tr>)}</tbody></table>{visible.length === 0 && <div className="p-12 text-center text-sm text-atelier-textMuted">Chưa có đơn phù hợp.</div>}</div>
      </section>
    </div>
    {selected && <OrderEditor order={selected} onClose={() => setSelectedCode(null)} onSaved={(updated) => { setOrders((items) => items.map((item) => item.code === updated.code ? updated : item)); setSelectedCode(null); setNotice(`Đã lưu hồ sơ ${updated.code}.`); }} />}
  </AdminShell>;
}

function AdminShell({ children, username, onLogout }: { children: React.ReactNode; username?: string; onLogout?: () => void }) {
  return <main className="min-h-screen bg-[#0a0a0a] text-atelier-text"><header className="sticky top-0 z-30 border-b border-white/10 bg-[#0a0a0a]/95 px-5 py-4 backdrop-blur md:px-10"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4"><div><a href="/" className="font-serif text-xl tracking-[0.2em]">PHƯƠNG ĐÔNG</a><p className="text-[9px] uppercase tracking-[0.3em] text-atelier-gold">Không gian quản trị</p></div><div className="flex items-center gap-4">{username && <span className="hidden text-xs text-atelier-textMuted sm:inline">{username}</span>}{onLogout && <button onClick={onLogout} className="flex items-center gap-2 text-xs text-atelier-textMuted hover:text-atelier-text"><LogOut className="h-4 w-4" />Đăng xuất</button>}<a href="/" className="flex items-center gap-2 text-xs text-atelier-textMuted hover:text-atelier-text"><ArrowLeft className="h-4 w-4" />Website chính</a></div></div></header>{children}</main>;
}

function LoginForm({ onSuccess }: { onSuccess: (username: string) => void }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError("");
    try { const session = await loginAdmin(username, password); onSuccess(session.username); }
    catch (problem) { setError(problem instanceof Error ? problem.message : "Không thể đăng nhập."); }
    finally { setBusy(false); }
  };
  return <div className="mx-auto flex min-h-[75vh] max-w-md items-center px-5"><form onSubmit={submit} className="w-full border border-white/10 bg-[#111] p-7 md:p-9"><ShieldCheck className="mb-5 h-8 w-8 text-atelier-gold" /><span className="text-[10px] uppercase tracking-[0.3em] text-atelier-gold">Truy cập bảo mật</span><h1 className="mt-2 font-serif text-4xl">Đăng nhập quản trị</h1><p className="mt-2 text-sm text-atelier-textMuted">Phiên đăng nhập tự hết hạn sau 8 giờ.</p><div className="mt-7 space-y-4"><Field label="Tên đăng nhập"><input autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} className="admin-input" /></Field><Field label="Mật khẩu"><input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="admin-input" /></Field></div>{error && <p className="mt-4 text-sm text-red-400" role="alert">{error}</p>}<button disabled={busy} className="mt-6 w-full bg-atelier-gold px-5 py-3 text-xs font-medium uppercase tracking-[0.18em] text-atelier-bg disabled:opacity-50">{busy ? "Đang đăng nhập…" : "Đăng nhập"}</button></form></div>;
}

function OrderEditor({ order, onClose, onSaved }: { order: TailorOrder; onClose: () => void; onSaved: (order: TailorOrder) => void }) {
  const [form, setForm] = useState({ owner: order.owner, preferredDate: order.preferredDate, preferredTime: order.preferredTime, quote: String(order.quote), depositRequired: String(order.depositRequired), internalNote: order.internalNote });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const save = async (event: React.FormEvent) => {
    event.preventDefault(); const quote = Number(form.quote); const depositRequired = Number(form.depositRequired);
    if (!Number.isSafeInteger(quote) || quote < 0 || !Number.isSafeInteger(depositRequired) || depositRequired < 0 || depositRequired > quote) { setError("Báo giá và cọc phải hợp lệ; cọc không được lớn hơn báo giá."); return; }
    setBusy(true); setError("");
    try { onSaved(await updateAdminOrder(order.code, { ...form, revision: order.revision, quote, depositRequired })); }
    catch (problem) { setError(problem instanceof Error ? problem.message : "Không lưu được hồ sơ."); }
    finally { setBusy(false); }
  };
  return <div className="fixed inset-0 z-50 flex justify-end bg-black/75" role="dialog" aria-modal="true" aria-labelledby="editor-title" onClick={(event) => event.target === event.currentTarget && onClose()}><div className="h-full w-full max-w-xl overflow-y-auto border-l border-white/10 bg-[#101010] p-6 md:p-8"><div className="flex items-start justify-between gap-4"><div><span className="text-[10px] uppercase tracking-[0.25em] text-atelier-gold">Hồ sơ đặt may</span><h2 id="editor-title" className="font-serif text-3xl">{order.code}</h2><p className="text-sm text-atelier-textMuted">{order.fullName} · {order.phoneNumber}</p></div><button onClick={onClose} className="text-2xl text-atelier-textMuted" aria-label="Đóng">×</button></div>
    <ol className="mt-7 grid grid-cols-2 gap-2 sm:grid-cols-4">{ORDER_STATUSES.map((label, index) => <li key={label} className={`border-t px-1 pt-2 text-[10px] ${index <= order.status ? "border-atelier-gold text-atelier-text" : "border-white/10 text-atelier-textMuted"}`} aria-current={index === order.status ? "step" : undefined}>{String(index + 1).padStart(2, "0")}<br />{label}</li>)}</ol>
    <form onSubmit={save} className="mt-8 space-y-4"><div className="grid grid-cols-2 gap-4"><Field label="Ngày hẹn"><input type="date" required value={form.preferredDate} onChange={(event) => setForm({ ...form, preferredDate: event.target.value })} className="admin-input" /></Field><Field label="Giờ hẹn"><input type="time" required value={form.preferredTime} onChange={(event) => setForm({ ...form, preferredTime: event.target.value })} className="admin-input" /></Field></div><Field label="Người phụ trách"><select value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })} className="admin-input">{OWNERS.map((owner) => <option key={owner}>{owner}</option>)}</select></Field><div className="grid grid-cols-2 gap-4"><Field label="Báo giá (VND)"><input type="number" min="0" step="1000" value={form.quote} onChange={(event) => setForm({ ...form, quote: event.target.value })} className="admin-input" /></Field><Field label="Yêu cầu cọc (0 = không cọc)"><input type="number" min="0" step="1000" value={form.depositRequired} onChange={(event) => setForm({ ...form, depositRequired: event.target.value })} className="admin-input" /></Field></div><div className="border border-white/10 bg-[#151515] p-4 text-sm text-atelier-textMuted">Đã thanh toán: <strong className="text-atelier-text">{money(order.paidTotal)}</strong><br />Còn lại: <strong className="text-atelier-text">{money(Math.max(0, order.quote - order.paidTotal))}</strong></div><Field label="Ghi chú nội bộ"><textarea rows={4} maxLength={2000} value={form.internalNote} onChange={(event) => setForm({ ...form, internalNote: event.target.value })} className="admin-input resize-y" /></Field>{error && <p className="text-sm text-red-400" role="alert">{error}</p>}<div className="flex gap-3"><button disabled={busy} type="submit" className="flex-1 bg-atelier-gold px-5 py-3 text-xs font-medium uppercase tracking-[0.18em] text-atelier-bg disabled:opacity-50">{busy ? "Đang lưu…" : "Lưu thay đổi"}</button><button type="button" onClick={onClose} className="border border-white/15 px-5 py-3 text-xs uppercase tracking-[0.15em]">Đóng</button></div></form>
    <section className="mt-8 border-t border-white/10 pt-6"><h3 className="text-sm font-medium">Lịch sử</h3><ol className="mt-4 space-y-3">{[...order.history].reverse().map((item, index) => <li key={`${item.at}-${index}`} className="border-l border-atelier-gold/30 pl-3 text-xs text-atelier-textMuted"><span className="text-atelier-text">{item.text}</span><br />{new Date(item.at).toLocaleString("vi-VN")}</li>)}</ol></section></div></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-xs text-atelier-textMuted"><span className="mb-1.5 block uppercase tracking-[0.1em]">{label}</span>{children}</label>; }
