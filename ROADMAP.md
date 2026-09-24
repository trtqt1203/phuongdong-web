# Lộ trình backend Phương Đông

## Giai đoạn 1 · Chạy nội bộ trên máy hiện tại — hoàn thành

- Next.js API và SQLite thay cho `localStorage`.
- Một nguồn dữ liệu dùng chung cho website khách và admin.
- Đăng nhập quản trị, phiên 8 giờ, hash mật khẩu và chống CSRF bằng origin allowlist.
- Đặt lịch, tra cứu riêng tư, báo giá, cọc, tiến độ, thanh toán mô phỏng và tự hoàn tất.
- Health check, kiểm thử luồng nghiệp vụ và sao lưu nhất quán.

## Giai đoạn 2 · Chuẩn bị chạy thật

1. Đưa domain qua Cloudflare, dùng Caddy hoặc Nginx cấp HTTPS.
2. Kết nối cổng thanh toán ở chế độ sandbox; xác nhận tiền bằng webhook có chữ ký, không tin trạng thái từ trình duyệt.
3. Gửi SMS/email mã đơn và thông báo thay đổi tiến độ.
4. Thêm tài khoản riêng cho từng nhân viên, vai trò và nhật ký người thực hiện.
5. Lưu ảnh khách trong object storage riêng tư, có thời hạn xóa và sự đồng ý của khách.
6. Bổ sung giám sát uptime, cảnh báo lỗi và kiểm tra khôi phục backup định kỳ.

## Giai đoạn 3 · Chuyển sang máy Ubuntu

1. Trên Windows, chạy `npm.cmd run db:backup` và dừng website.
2. Chép mã nguồn, `.env.local` và file SQLite mới nhất sang Ubuntu; không chép `.next` hoặc `node_modules`.
3. Cài Node tương thích, chạy `npm ci` rồi `npm run build`.
4. Khôi phục backup thành `data/phuong-dong.sqlite` và chạy `npm run verify:backend`.
5. Chạy ứng dụng bằng service systemd dưới một user không có quyền root.
6. Đặt Caddy/Nginx ở phía trước, chỉ cho ứng dụng lắng nghe nội bộ; bật firewall và HTTPS.
7. Lập lịch backup SQLite hằng ngày sang một thiết bị hoặc kho lưu trữ khác.

## Giai đoạn 4 · Khi lượng khách tăng

Chuyển SQLite sang PostgreSQL khi có nhiều tiến trình ghi đồng thời, nhiều chi nhánh hoặc cần báo cáo lớn. Tách hàng đợi xử lý ảnh/3D khỏi website và dùng dịch vụ cloud/GPU; máy Ubuntu chỉ giữ API, dữ liệu nghiệp vụ và dashboard.
