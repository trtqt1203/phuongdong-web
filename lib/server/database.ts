import "server-only";

import { randomInt } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import type { SuitConfiguration } from "@/data/configuratorOptions";
import {
  normalizePhone,
  paymentDue,
  type AdminOrderUpdate,
  type BookingInput,
  type OrderStatus,
  type PaymentType,
  type TailorOrder,
} from "@/lib/orders";

type RunResult = { changes: number | bigint; lastInsertRowid: number | bigint };
type Statement = {
  get(...params: unknown[]): Record<string, unknown> | undefined;
  all(...params: unknown[]): Record<string, unknown>[];
  run(...params: unknown[]): RunResult;
};
type Database = { exec(sql: string): void; prepare(sql: string): Statement };

const dbPath = path.resolve(process.env.DATABASE_PATH || path.join(process.cwd(), "data", "phuong-dong.sqlite"));
mkdirSync(path.dirname(dbPath), { recursive: true });

const runtime = globalThis as typeof globalThis & { __phuongDongDb?: Database };

function openDatabase(): Database {
  if (runtime.__phuongDongDb) return runtime.__phuongDongDb;
  // Node 24 ships SQLite, so the same database works on this Windows machine and Ubuntu.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { DatabaseSync } = require("node:sqlite") as { DatabaseSync: new (filename: string) => Database };
  const database = new DatabaseSync(dbPath);
  database.exec(`
    PRAGMA busy_timeout = 5000;
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      revision INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      full_name TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      email TEXT NOT NULL DEFAULT '',
      preferred_date TEXT NOT NULL,
      preferred_time TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      internal_note TEXT NOT NULL DEFAULT '',
      config_json TEXT NOT NULL,
      status INTEGER NOT NULL DEFAULT 0 CHECK (status BETWEEN 0 AND 6),
      owner TEXT NOT NULL DEFAULT 'Chưa phân công',
      quote INTEGER NOT NULL DEFAULT 0 CHECK (quote >= 0),
      deposit_required INTEGER NOT NULL DEFAULT 0 CHECK (deposit_required >= 0),
      paid_total INTEGER NOT NULL DEFAULT 0 CHECK (paid_total >= 0)
    );
    CREATE INDEX IF NOT EXISTS orders_phone_idx ON orders(phone_number);
    CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL,
      amount INTEGER NOT NULL CHECK (amount > 0),
      type TEXT NOT NULL CHECK (type IN ('deposit', 'final'))
    );
    CREATE TABLE IF NOT EXISTS order_history (
      id INTEGER PRIMARY KEY,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      created_at TEXT NOT NULL,
      text TEXT NOT NULL
    );
  `);
  runtime.__phuongDongDb = database;
  return database;
}

const db = new Proxy({} as Database, {
  get(_target, property) {
    const database = openDatabase();
    const value = database[property as keyof Database];
    return typeof value === "function" ? value.bind(database) : value;
  },
});

function transaction<T>(work: () => T): T {
  db.exec("BEGIN IMMEDIATE");
  try {
    const result = work();
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function orderFromRow(row: Record<string, unknown>): TailorOrder {
  const orderId = Number(row.id);
  const payments = db.prepare("SELECT created_at, amount, type FROM payments WHERE order_id = ? ORDER BY id").all(orderId);
  const history = db.prepare("SELECT created_at, text FROM order_history WHERE order_id = ? ORDER BY id").all(orderId);
  return {
    code: String(row.code),
    revision: Number(row.revision),
    createdAt: String(row.created_at),
    fullName: String(row.full_name),
    phoneNumber: String(row.phone_number),
    email: String(row.email),
    preferredDate: String(row.preferred_date),
    preferredTime: String(row.preferred_time),
    notes: String(row.notes),
    internalNote: String(row.internal_note),
    config: JSON.parse(String(row.config_json)) as SuitConfiguration,
    status: Number(row.status) as OrderStatus,
    owner: String(row.owner),
    quote: Number(row.quote),
    depositRequired: Number(row.deposit_required),
    paidTotal: Number(row.paid_total),
    payments: payments.map((item) => ({ at: String(item.created_at), amount: Number(item.amount), type: String(item.type) as PaymentType })),
    history: history.map((item) => ({ at: String(item.created_at), text: String(item.text) })),
  };
}

function getOrderRow(code: string) {
  return db.prepare("SELECT * FROM orders WHERE code = ?").get(code.toUpperCase());
}

function uniqueCode() {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const code = `PD-${randomInt(36 ** 6).toString(36).padStart(6, "0").toUpperCase()}`;
    if (!getOrderRow(code)) return code;
  }
  throw new Error("Không tạo được mã đơn duy nhất.");
}

export function createOrderRecord(input: BookingInput) {
  return transaction(() => {
    const now = new Date().toISOString();
    const code = uniqueCode();
    const result = db.prepare(`
      INSERT INTO orders (code, created_at, updated_at, full_name, phone_number, email, preferred_date, preferred_time, notes, config_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(code, now, now, input.fullName.trim(), normalizePhone(input.phoneNumber), input.email.trim().toLowerCase(), input.preferredDate, input.preferredTime, input.notes.trim(), JSON.stringify(input.config));
    db.prepare("INSERT INTO order_history (order_id, created_at, text) VALUES (?, ?, ?)").run(Number(result.lastInsertRowid), now, "Khách đã gửi yêu cầu đặt lịch.");
    return orderFromRow(getOrderRow(code)!);
  });
}

export function lookupOrderRecord(code: string, phoneNumber: string) {
  const row = db.prepare("SELECT * FROM orders WHERE code = ? AND phone_number = ?").get(code.trim().toUpperCase(), normalizePhone(phoneNumber));
  return row ? orderFromRow(row) : null;
}

export function listOrderRecords() {
  // ponytail: per-row history queries are fine for a small atelier; batch when orders reach thousands.
  return db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all().map(orderFromRow);
}

export function updateOrderRecord(code: string, input: AdminOrderUpdate) {
  return transaction(() => {
    const row = getOrderRow(code);
    if (!row) throw new Error("NOT_FOUND");
    if (Number(row.revision) !== input.revision) throw new Error("CONFLICT");
    const now = new Date().toISOString();
    const result = db.prepare(`
      UPDATE orders SET revision = revision + 1, updated_at = ?, owner = ?, preferred_date = ?, preferred_time = ?, quote = ?, deposit_required = ?, internal_note = ?
      WHERE code = ? AND revision = ?
    `).run(now, input.owner, input.preferredDate, input.preferredTime, input.quote, input.depositRequired, input.internalNote, code.toUpperCase(), input.revision);
    if (Number(result.changes) !== 1) throw new Error("CONFLICT");
    db.prepare("INSERT INTO order_history (order_id, created_at, text) VALUES (?, ?, ?)").run(Number(row.id), now, "Quản trị đã cập nhật hồ sơ đơn.");
    return orderFromRow(getOrderRow(code)!);
  });
}

export function advanceOrderRecord(code: string, revision: number) {
  return transaction(() => {
    const row = getOrderRow(code);
    if (!row) throw new Error("NOT_FOUND");
    if (Number(row.revision) !== revision) throw new Error("CONFLICT");
    const current = Number(row.status) as OrderStatus;
    if (current >= 5) throw new Error("INVALID_STATUS");
    const next = (current + 1) as OrderStatus;
    const now = new Date().toISOString();
    db.prepare("UPDATE orders SET status = ?, revision = revision + 1, updated_at = ? WHERE id = ?").run(next, now, Number(row.id));
    const labels = ["Chờ duyệt lịch hẹn", "Đã duyệt lịch hẹn", "Đang cắt", "Đang may", "Chờ thử đồ", "Đã làm xong"];
    db.prepare("INSERT INTO order_history (order_id, created_at, text) VALUES (?, ?, ?)").run(Number(row.id), now, `${labels[current]} → ${labels[next]}`);
    return orderFromRow(getOrderRow(code)!);
  });
}

export function payOrderRecord(code: string, phoneNumber: string) {
  return transaction(() => {
    const row = db.prepare("SELECT * FROM orders WHERE code = ? AND phone_number = ?").get(code.toUpperCase(), normalizePhone(phoneNumber));
    if (!row) throw new Error("NOT_FOUND");
    const current = orderFromRow(row);
    const amount = paymentDue(current);
    if (amount <= 0) throw new Error("NOT_DUE");
    const type: PaymentType = current.status >= 5 ? "final" : "deposit";
    const paidTotal = Math.min(current.quote, current.paidTotal + amount);
    const completed = current.status >= 5 && paidTotal >= current.quote;
    const now = new Date().toISOString();
    db.prepare("INSERT INTO payments (order_id, created_at, amount, type) VALUES (?, ?, ?, ?)").run(Number(row.id), now, amount, type);
    db.prepare("UPDATE orders SET paid_total = ?, status = ?, revision = revision + 1, updated_at = ? WHERE id = ?").run(paidTotal, completed ? 6 : current.status, now, Number(row.id));
    db.prepare("INSERT INTO order_history (order_id, created_at, text) VALUES (?, ?, ?)").run(Number(row.id), now, `Thanh toán mô phỏng ${amount.toLocaleString("vi-VN")} ₫${completed ? " · Đơn tự động hoàn tất" : ""}.`);
    return orderFromRow(getOrderRow(code)!);
  });
}

export function databaseHealth() {
  const row = db.prepare("PRAGMA quick_check").get();
  return { ok: Object.values(row || {})[0] === "ok", path: dbPath };
}
