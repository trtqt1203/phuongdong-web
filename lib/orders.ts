import type { SuitConfiguration } from "@/data/configuratorOptions";

export const ORDER_STATUSES = [
  "Chờ duyệt lịch hẹn",
  "Đã duyệt lịch hẹn",
  "Đang cắt",
  "Đang may",
  "Chờ thử đồ",
  "Đã làm xong",
  "Đã hoàn tất",
] as const;

export type OrderStatus = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type PaymentType = "deposit" | "final";

export interface OrderHistory {
  at: string;
  text: string;
}

export interface TailorOrder {
  code: string;
  revision: number;
  createdAt: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  internalNote: string;
  config: SuitConfiguration;
  status: OrderStatus;
  owner: string;
  quote: number;
  depositRequired: number;
  paidTotal: number;
  payments: Array<{ at: string; amount: number; type: PaymentType }>;
  history: OrderHistory[];
}

export interface BookingInput {
  fullName: string;
  phoneNumber: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  config: SuitConfiguration;
}

export interface AdminOrderUpdate {
  revision: number;
  owner: string;
  preferredDate: string;
  preferredTime: string;
  quote: number;
  depositRequired: number;
  internalNote: string;
}

export const normalizePhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("84") ? `0${digits.slice(2)}` : digits;
};

export const money = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);

export function paymentDue(order: TailorOrder) {
  if (order.quote <= 0 || order.status === 6) return 0;
  if (order.status >= 5) return Math.max(0, order.quote - order.paidTotal);
  return Math.max(0, Math.min(order.depositRequired, order.quote) - order.paidTotal);
}

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) throw new Error(data.error || "Không thể kết nối máy chủ.");
  return data;
}

export const createOrder = (input: BookingInput) =>
  api<TailorOrder>("/api/bookings", { method: "POST", body: JSON.stringify(input) });

export const lookupOrder = (code: string, phoneNumber: string) =>
  api<TailorOrder>("/api/orders/lookup", {
    method: "POST",
    body: JSON.stringify({ code, phoneNumber }),
  });

export const payOrder = (code: string, phoneNumber: string) =>
  api<TailorOrder>(`/api/orders/${encodeURIComponent(code)}/pay`, {
    method: "POST",
    body: JSON.stringify({ phoneNumber }),
  });

export const getAdminSession = () => api<{ authenticated: boolean; username?: string }>("/api/admin/session");

export const loginAdmin = (username: string, password: string) =>
  api<{ authenticated: true; username: string }>("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

export const logoutAdmin = () => api<{ ok: true }>("/api/admin/logout", { method: "POST" });

export const getAdminOrders = () => api<TailorOrder[]>("/api/admin/orders");

export const updateAdminOrder = (code: string, input: AdminOrderUpdate) =>
  api<TailorOrder>(`/api/admin/orders/${encodeURIComponent(code)}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });

export const advanceAdminOrder = (code: string, revision: number) =>
  api<TailorOrder>(`/api/admin/orders/${encodeURIComponent(code)}/advance`, {
    method: "POST",
    body: JSON.stringify({ revision }),
  });
