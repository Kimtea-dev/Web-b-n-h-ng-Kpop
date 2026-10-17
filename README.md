# my-shop - Web bán hàng K-pop (HTML / CSS / JS thuần)

## Cách chạy
Không cần cài gì. Nhấp đúp `index.html` (khách hàng) hoặc `admin/dashboard.html` (admin) để mở bằng trình duyệt.
Khuyên dùng VS Code + extension **Live Server** để sửa là thấy ngay.

Mỗi trang đã có sẵn **header, footer, sidebar, topbar**. Trong phần nội dung có một khung vàng
(`.todo-box`) liệt kê việc cần làm của trang đó. Làm xong thì xóa khung vàng.

## Phân công

| Nhóm | File phụ trách |
|---|---|
| **N1** Nền tảng + trang phụ | `css/base.css`, `css/client.css`, `header-footer-mau.html`, `about.html`, `login.html`, `cart.html`, `js/cart.js` |
| **N2** Storefront sản phẩm | `index.html`, `products.html`, `product-detail.html`, `js/slider.js`, `js/quantity.js`, và tự tạo `css/home.css`, `css/detail.css` |
| **N3** Admin shell + thống kê | `css/admin.css`, `admin/admin-mau.html`, `admin/dashboard.html`, `admin/reports.html` |
| **N4** Admin quản lý | `css/admin-forms.css`, `js/modal.js`, `admin/products.html`, `admin/orders.html`, `admin/customers.html` |

## Quy tắc
1. **Chỉ sửa file của mình.** Cần chỉnh file người khác thì nhắn người đó.
2. `css/base.css` là "lớp cha": chỉ N1 sửa. Mọi người dùng biến `var(--...)`, không tự gõ mã màu.
3. Dùng đúng tên class đã thống nhất: `.card .btn .btn-primary .badge-success .badge-warning .badge-danger .badge-info .product-card .stat-card .chart-card .data-table .pagination .modal .show .form-group`
4. Modal: nút mở có `data-open="idModal"`, nút đóng có `data-close`. `modal.js` lo phần còn lại.
5. Thứ tự làm mỗi trang: **HTML → CSS → JS**.

## Ví dụ dùng class

```html
<!-- 1 thẻ sản phẩm -->
<div class="product-card">
  <div class="thumb"></div>
  <div class="group">Tên nhóm</div>
  <div class="album">Tên album</div>
  <div class="price">250.000đ</div>
  <div class="row"><span>⭐⭐⭐⭐⭐</span><a class="btn" href="product-detail.html">Xem</a></div>
</div>

<!-- 1 thẻ số liệu admin -->
<div class="stat-card">
  <div class="label">Tổng doanh thu</div>
  <div class="value">48.650.000đ</div>
  <div class="note">↑ 12% so với kỳ trước</div>
</div>

<!-- 1 dòng bảng có badge trạng thái -->
<tr><td>#DH1024</td><td>Nguyễn An</td><td><span class="badge badge-success">Hoàn thành</span></td></tr>
```
