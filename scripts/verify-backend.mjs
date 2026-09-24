import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3000";
const adminUsername = process.env.ADMIN_USERNAME || "admin";
const adminPassword = process.env.ADMIN_PASSWORD;
assert(adminPassword, "Thiếu biến ADMIN_PASSWORD để kiểm thử đăng nhập.");

const call = async (pathname, init = {}) => {
  const response = await fetch(`${baseUrl}${pathname}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });
  const data = await response.json().catch(() => ({}));
  return { response, data };
};

let createdCode = "";
try {
  const health = await call("/api/health");
  assert.equal(health.response.status, 200);
  assert.equal(health.data.database, true);

  const invalid = await call("/api/bookings", { method: "POST", body: "{}" });
  assert.equal(invalid.response.status, 400);

  const date = new Date();
  date.setDate(date.getDate() + 3);
  const booking = await call("/api/bookings", {
    method: "POST",
    body: JSON.stringify({
      fullName: "Khách kiểm thử backend",
      phoneNumber: "0900000000",
      email: "backend@example.com",
      preferredDate: date.toISOString().slice(0, 10),
      preferredTime: "14:00",
      notes: "Tự động xóa sau kiểm thử",
      config: { fabric: "navy", lapel: "notch", buttons: "two", pocket: "flap", shirt: "white", tie: "navy", fit: "tailored" },
    }),
  });
  assert.equal(booking.response.status, 201);
  assert.match(booking.data.code, /^PD-[A-Z0-9]{6}$/);
  createdCode = booking.data.code;

  const hidden = await call("/api/orders/lookup", { method: "POST", body: JSON.stringify({ code: createdCode, phoneNumber: "0911111111" }) });
  assert.equal(hidden.response.status, 404);
  const lookup = await call("/api/orders/lookup", { method: "POST", body: JSON.stringify({ code: createdCode, phoneNumber: "0900000000" }) });
  assert.equal(lookup.response.status, 200);

  const denied = await call("/api/admin/orders");
  assert.equal(denied.response.status, 401);
  const badLogin = await call("/api/admin/login", { method: "POST", body: JSON.stringify({ username: adminUsername, password: "wrong-password" }) });
  assert.equal(badLogin.response.status, 401);
  const login = await call("/api/admin/login", { method: "POST", body: JSON.stringify({ username: adminUsername, password: adminPassword }) });
  assert.equal(login.response.status, 200);
  const cookie = login.response.headers.get("set-cookie")?.split(";")[0];
  assert(cookie?.startsWith("pd_admin_session="));

  const adminHeaders = { Cookie: cookie };
  const listing = await call("/api/admin/orders", { headers: adminHeaders });
  assert.equal(listing.response.status, 200);
  let order = listing.data.find((item) => item.code === createdCode);
  assert(order);

  const updated = await call(`/api/admin/orders/${createdCode}`, {
    method: "PATCH",
    headers: adminHeaders,
    body: JSON.stringify({ revision: order.revision, owner: "An · Xưởng", preferredDate: order.preferredDate, preferredTime: order.preferredTime, quote: 5_000_000, depositRequired: 1_000_000, internalNote: "Kiểm thử" }),
  });
  assert.equal(updated.response.status, 200);
  order = updated.data;

  const deposit = await call(`/api/orders/${createdCode}/pay`, { method: "POST", body: JSON.stringify({ phoneNumber: "0900000000" }) });
  assert.equal(deposit.response.status, 200);
  assert.equal(deposit.data.paidTotal, 1_000_000);
  order = deposit.data;

  for (let expected = 1; expected <= 5; expected += 1) {
    const advanced = await call(`/api/admin/orders/${createdCode}/advance`, { method: "POST", headers: adminHeaders, body: JSON.stringify({ revision: order.revision }) });
    assert.equal(advanced.response.status, 200);
    assert.equal(advanced.data.status, expected);
    order = advanced.data;
  }

  const finalPayment = await call(`/api/orders/${createdCode}/pay`, { method: "POST", body: JSON.stringify({ phoneNumber: "0900000000" }) });
  assert.equal(finalPayment.response.status, 200);
  assert.equal(finalPayment.data.paidTotal, 5_000_000);
  assert.equal(finalPayment.data.status, 6);

  const logout = await call("/api/admin/logout", { method: "POST", headers: adminHeaders, body: "{}" });
  assert.equal(logout.response.status, 200);
  console.log("PASS: database, validation, private lookup, admin auth, quote, deposit, progress, final payment, auto completion.");
} finally {
  if (createdCode) {
    const db = new DatabaseSync(path.resolve(process.env.DATABASE_PATH || "data/phuong-dong.sqlite"));
    db.exec("PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
    db.prepare("DELETE FROM orders WHERE code = ?").run(createdCode);
    db.close();
  }
}
