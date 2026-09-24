# Phương Đông · Antigravity

Website Next.js kết hợp trình diễn vest 3D với backend SQLite chạy trực tiếp trên máy chủ.

## Địa chỉ

- Website: `http://127.0.0.1:3000`
- Quản trị: `http://127.0.0.1:3000/admin`
- Kiểm tra backend: `http://127.0.0.1:3000/api/health`
- Điện thoại cùng Wi-Fi: `http://192.168.61.7:3000`

## Chạy website

```powershell
npm.cmd run build
npm.cmd run start -- -H 0.0.0.0
```

## Backend đã có

- SQLite lưu đơn hàng, cấu hình vest, lịch sử, báo giá và thanh toán mô phỏng.
- Khách đặt lịch và tra cứu bằng mã đơn kèm số điện thoại.
- Admin đăng nhập bằng cookie `HttpOnly`, hết hạn sau 8 giờ.
- Mật khẩu dùng `scrypt`; thao tác admin kiểm tra origin và phiên đăng nhập.
- Giới hạn số lần đăng nhập, tra cứu, đặt lịch và thanh toán.
- Giao dịch cơ sở dữ liệu bảo đảm cập nhật tiền và trạng thái đồng thời.
- Revision chống hai quản trị viên ghi đè cùng một đơn.
- Header chống nhúng iframe, dò MIME và giới hạn camera đúng website.

## Dữ liệu và sao lưu

- Cơ sở dữ liệu: `data/phuong-dong.sqlite`
- Cấu hình bí mật: `.env.local`
- Tạo bản sao an toàn khi website vẫn đang chạy:

```powershell
npm.cmd run db:backup
```

Bản sao được tạo trong `backups/`. Khi chuyển máy, dừng website rồi chép file sao lưu thành `data/phuong-dong.sqlite`.

## Kiểm tra

```powershell
npm.cmd run build
$env:ADMIN_PASSWORD='<mật khẩu quản trị>'; npm.cmd run verify:backend
```

Luồng kiểm thử tự tạo rồi xóa đơn thử: cơ sở dữ liệu, kiểm tra dữ liệu, tra cứu riêng tư, đăng nhập, báo giá, cọc, tiến độ, thanh toán cuối và tự hoàn tất.

## Trước khi đưa lên Internet

Đổi mật khẩu quản trị và `AUTH_SECRET`, cấu hình tên miền HTTPS, chỉ mở cổng 80/443, bật sao lưu hàng ngày và không công khai trực tiếp cổng 3000. Xem [ROADMAP.md](./ROADMAP.md).

Khi chuyển sang HTTPS, đặt `COOKIE_SECURE=true`. Bản chạy HTTP trong mạng nội bộ đang để `false` để admin đăng nhập được từ điện thoại.
