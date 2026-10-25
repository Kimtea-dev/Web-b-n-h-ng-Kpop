/* =========================================================
   cart.js  -  Quản lý Giỏ hàng, Bán hàng & Trạng thái Đăng nhập/Đăng xuất
   (Phụ trách: Nhóm 1 - N1)
   Các tính năng:
   - Giỏ hàng tĩnh với localStorage
   - Yêu cầu đăng nhập khi mua hàng & tự điền thông tin người mua
   - Lựa chọn địa chỉ tài khoản hoặc nhập địa chỉ mới
   - Lựa chọn hình thức chi trả: Tiền mặt (COD) hoặc Trực tuyến
   - Lưu và hiển thị hóa đơn khi kết thúc giao dịch
   ========================================================= */

// Danh sách sản phẩm mẫu khởi tạo ban đầu (nếu giỏ trống)
const DEFAULT_CART_ITEMS = [
  {
    id: 1,
    name: "ARIRANG - CD Box Set",
    artist: "BTS",
    variant: "CD BOX SET",
    price: 3260000,
    quantity: 1,
    image: "image/arirang.jpg"
  },
  {
    id: 2,
    name: "DEADLINE STANDARD",
    artist: "BLACKPINK",
    variant: "STANDARD VER",
    price: 880000,
    quantity: 1,
    image: "image/deadline.jpg"
  }
];

// Trạng thái mã giảm giá hiện tại
let currentDiscount = {
  code: "",
  type: "none", // 'percentage' hoặc 'shipping'
  value: 0
};

// Định dạng tiền tệ VND (ví dụ: 3.260.000 ₫)
function formatMoney(amount) {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
}

// 1. LẤY & KHỞI TẠO DỮ LIỆU GIỎ HÀNG
function getCartItems() {
  const stored = localStorage.getItem('kpop_cart_items');
  if (!stored) {
    localStorage.setItem('kpop_cart_items', JSON.stringify(DEFAULT_CART_ITEMS));
    return DEFAULT_CART_ITEMS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return [];
  }
}

// Lưu giỏ hàng vào localStorage và cập nhật giao diện
function saveCartItems(items) {
  localStorage.setItem('kpop_cart_items', JSON.stringify(items));
  updateHeaderCartBadge();
  renderCart();
}

// 2. CẬP NHẬT SỐ LƯỢNG SẢN PHẨM TRÊN BADGE HEADER
function updateHeaderCartBadge() {
  const badge = document.getElementById('header-cart-count');
  if (!badge) return;

  const items = getCartItems();
  const totalCount = items.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
  badge.textContent = totalCount;
  badge.style.display = totalCount > 0 ? 'inline-block' : 'none';
}

// 3. HIỂN THỊ DANH SÁCH GIỎ HÀNG (RENDER)
function renderCart() {
  const cartListContainer = document.getElementById('cart-items-list');
  const mainLayout = document.getElementById('cart-main-layout');
  const emptyCard = document.getElementById('empty-cart-card');
  const countText = document.getElementById('cart-item-count-text');

  if (!cartListContainer) return; // Nếu trang hiện tại không có khung giỏ hàng (about, login)

  const items = getCartItems();

  // Kiểm tra giỏ hàng rỗng
  if (!items || items.length === 0) {
    if (mainLayout) mainLayout.style.display = 'none';
    if (emptyCard) emptyCard.style.display = 'block';
    if (countText) countText.textContent = '0 sản phẩm';
    return;
  }

  // Nếu có sản phẩm
  if (mainLayout) mainLayout.style.display = 'grid';
  if (emptyCard) emptyCard.style.display = 'none';

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  if (countText) {
    countText.textContent = `${totalItemCount} sản phẩm`;
  }

  // Sinh HTML cho từng dòng sản phẩm
  let html = '';
  let subtotal = 0;

  items.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    html += `
      <div class="cart-item-card" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='image/deadline.jpg'">
        
        <div class="cart-item-info">
          <div class="cart-item-artist">${item.artist || 'K-POP'}</div>
          <div class="cart-item-name">${item.name}</div>
          <span class="cart-item-variant">${item.variant || 'Standard'}</span>
          <div class="cart-item-price">${formatMoney(item.price)}</div>
        </div>

        <div class="cart-qty-box">
          <button type="button" class="cart-qty-btn" onclick="changeItemQty(${item.id}, -1)">−</button>
          <input type="number" class="cart-qty-input" value="${item.quantity}" min="1" max="99" onchange="setItemQty(${item.id}, this.value)">
          <button type="button" class="cart-qty-btn" onclick="changeItemQty(${item.id}, 1)">+</button>
        </div>

        <div class="cart-item-subtotal">
          ${formatMoney(itemTotal)}
        </div>

        <button type="button" class="cart-item-remove" title="Xóa sản phẩm" onclick="removeCartItem(${item.id})">
          ✕
        </button>
      </div>
    `;
  });

  cartListContainer.innerHTML = html;

  // Tính toán Tóm tắt đơn hàng
  calculateSummary(subtotal);
  updateCheckoutAuthView();
}

// 4. TÍNH TỔNG TIỀN VÀ KHUYẾN MÃI
function calculateSummary(subtotal) {
  const subtotalEl = document.getElementById('summary-subtotal');
  const shippingEl = document.getElementById('summary-shipping');
  const discountRow = document.getElementById('summary-discount-row');
  const discountEl = document.getElementById('summary-discount');
  const totalEl = document.getElementById('summary-total');

  if (!subtotalEl || !totalEl) return;

  // Phí ship: Đơn trên 2.000.000đ hoặc mã FREESHIP thì miễn phí ship
  let shippingFee = 30000;
  if (subtotal >= 2000000 || currentDiscount.type === 'shipping') {
    shippingFee = 0;
  }

  // Tính giảm giá coupon
  let discountAmount = 0;
  if (currentDiscount.type === 'percentage') {
    discountAmount = Math.round(subtotal * (currentDiscount.value / 100));
  } else if (currentDiscount.type === 'fixed') {
    discountAmount = currentDiscount.value;
  }

  if (discountRow && discountEl) {
    if (discountAmount > 0) {
      discountRow.style.display = 'flex';
      discountEl.textContent = '-' + formatMoney(discountAmount);
    } else {
      discountRow.style.display = 'none';
    }
  }

  const finalTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  subtotalEl.textContent = formatMoney(subtotal);
  shippingEl.textContent = shippingFee === 0 ? 'Miễn phí' : formatMoney(shippingFee);
  totalEl.textContent = formatMoney(finalTotal);
}

// 5. TĂNG / GIẢM SỐ LƯỢNG
function changeItemQty(id, delta) {
  let items = getCartItems();
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return;

  const newQty = items[index].quantity + delta;
  if (newQty <= 0) {
    if (confirm(`Bạn có muốn xóa "${items[index].name}" khỏi giỏ hàng?`)) {
      items.splice(index, 1);
      showToast('Đã xóa sản phẩm khỏi giỏ hàng.');
    }
  } else {
    items[index].quantity = newQty;
  }

  saveCartItems(items);
}

// Nhập trực tiếp số lượng
function setItemQty(id, value) {
  let val = parseInt(value);
  if (isNaN(val) || val < 1) val = 1;

  let items = getCartItems();
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items[index].quantity = val;
    saveCartItems(items);
  }
}

// Xóa 1 sản phẩm khỏi giỏ
function removeCartItem(id) {
  let items = getCartItems();
  const item = items.find(i => i.id === id);
  const itemName = item ? item.name : 'sản phẩm';

  if (confirm(`Xác nhận xóa "${itemName}" khỏi giỏ hàng?`)) {
    items = items.filter(i => i.id !== id);
    saveCartItems(items);
    showToast(`Đã xóa "${itemName}"`);
  }
}

// Xóa tất cả sản phẩm
function clearCart() {
  if (confirm('Bạn có chắc chắn muốn làm trống toàn bộ giỏ hàng?')) {
    saveCartItems([]);
    showToast('Đã xóa toàn bộ sản phẩm trong giỏ hàng.');
  }
}

// 6. ÁP DỤNG MÃ GIẢM GIÁ (COUPON)
function applyCouponCode() {
  const input = document.getElementById('coupon-input');
  const msg = document.getElementById('coupon-message');
  if (!input || !msg) return;

  const code = input.value.trim().toUpperCase();

  if (!code) {
    msg.style.color = '#ef4444';
    msg.textContent = 'Vui lòng nhập mã giảm giá!';
    return;
  }

  if (code === 'KPOP10') {
    currentDiscount = { code: 'KPOP10', type: 'percentage', value: 10 };
    msg.style.color = '#166534';
    msg.textContent = '✔ Đã áp dụng mã KPOP10: Giảm 10% trên tổng giá trị đơn!';
    showToast('🎉 Áp dụng mã giảm 10% thành công!');
    renderCart();
  } else if (code === 'FREESHIP') {
    currentDiscount = { code: 'FREESHIP', type: 'shipping', value: 0 };
    msg.style.color = '#166534';
    msg.textContent = '✔ Đã áp dụng mã FREESHIP: Miễn phí vận chuyển toàn quốc!';
    showToast('🚚 Miễn phí vận chuyển thành công!');
    renderCart();
  } else {
    msg.style.color = '#ef4444';
    msg.textContent = '❌ Mã không hợp lệ! Hãy thử nhập "KPOP10" hoặc "FREESHIP".';
  }
}

// 7. CẬP NHẬT KHỐI CHECKOUT THEO TRẠNG THÁI ĐĂNG NHẬP
function updateCheckoutAuthView() {
  const loginRequiredBox = document.getElementById('checkout-login-required');
  const loggedInForm = document.getElementById('checkout-logged-in-form');
  const storedUser = localStorage.getItem('kpop_current_user');

  if (!loginRequiredBox || !loggedInForm) return;

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      loginRequiredBox.style.display = 'none';
      loggedInForm.style.display = 'block';

      // Tự động hiển thị thông tin người đăng nhập
      const nameEl = document.getElementById('checkout-user-name');
      const phoneEl = document.getElementById('checkout-user-phone');
      const emailEl = document.getElementById('checkout-user-email');
      const defaultAddrEl = document.getElementById('checkout-default-address');

      if (nameEl) nameEl.textContent = user.name || 'Thành viên K-Pop';
      if (phoneEl) phoneEl.textContent = user.phone || '0909 123 456';
      if (emailEl) emailEl.textContent = user.email || 'user@kpopstore.vn';
      if (defaultAddrEl) defaultAddrEl.textContent = user.address || '123 Đường K-Pop, Quận 1, TP. HCM';
    } catch (e) {}
  } else {
    loginRequiredBox.style.display = 'block';
    loggedInForm.style.display = 'none';
  }
}

// 8. TIẾN HÀNH ĐẶT HÀNG (YÊU CẦU ĐĂNG NHẬP, CHỌN ĐỊA CHỈ & HÌNH THỨC CHI TRẢ, LƯU ĐƠN HÀNG)
function proceedToCheckoutOrder() {
  const items = getCartItems();
  if (!items || items.length === 0) {
    alert('Giỏ hàng của bạn đang trống! Vui lòng chọn sản phẩm trước khi thanh toán.');
    return;
  }

  const storedUser = localStorage.getItem('kpop_current_user');
  if (!storedUser) {
    alert('🔒 Yêu cầu đăng nhập: Vui lòng đăng nhập tài khoản người mua để xác nhận địa chỉ và hoàn tất đơn hàng!');
    window.location.href = 'login.html';
    return;
  }

  let user = {};
  try {
    user = JSON.parse(storedUser);
  } catch (e) {
    alert('Lỗi thông tin tài khoản! Vui lòng đăng nhập lại.');
    return;
  }

  // 1. Xác định địa chỉ giao hàng
  const isDefaultAddr = document.getElementById('addr-type-default') ? document.getElementById('addr-type-default').checked : true;
  let finalDeliveryAddress = '';

  if (isDefaultAddr) {
    finalDeliveryAddress = user.address || '123 Đường K-Pop, Quận 1, TP. HCM';
  } else {
    const customAddrInput = document.getElementById('checkout-custom-address');
    finalDeliveryAddress = customAddrInput ? customAddrInput.value.trim() : '';
    if (!finalDeliveryAddress) {
      alert('Vui lòng nhập địa chỉ giao hàng mới cụ thể!');
      if (customAddrInput) customAddrInput.focus();
      return;
    }
  }

  // 2. Xác định hình thức chi trả
  const isCOD = document.getElementById('pay-cod') ? document.getElementById('pay-cod').checked : true;
  const paymentMethodText = isCOD 
    ? 'Tiền mặt khi nhận hàng (COD)' 
    : 'Chi trả Trực tuyến (Chuyển khoản QR / Ví MoMo)';

  // 3. Tạo thông tin đơn hàng
  const orderId = 'DH' + Math.floor(100000 + Math.random() * 900000);
  const now = new Date();
  const orderDateStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ngày ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
  const totalText = document.getElementById('summary-total') ? document.getElementById('summary-total').textContent : '0 ₫';

  const orderRecord = {
    id: orderId,
    date: orderDateStr,
    userEmail: user.email,
    userName: user.name || 'Khách hàng',
    userPhone: user.phone || '0909 123 456',
    address: finalDeliveryAddress,
    paymentMethod: paymentMethodText,
    items: [...items],
    total: totalText,
    status: 'Đang chuẩn bị hàng'
  };

  // 4. Lưu đơn hàng vào lịch sử giao dịch (localStorage)
  const ordersHistory = JSON.parse(localStorage.getItem('kpop_orders_history') || '[]');
  ordersHistory.unshift(orderRecord);
  localStorage.setItem('kpop_orders_history', JSON.stringify(ordersHistory));

  // 5. Hiển thị Hóa đơn Modal chi tiết
  const modal = document.getElementById('order-success-modal');
  if (modal) {
    document.getElementById('inv-order-id').textContent = '#' + orderId;
    document.getElementById('inv-order-date').textContent = orderDateStr;
    document.getElementById('inv-order-name').textContent = user.name || 'Khách hàng';
    document.getElementById('inv-order-phone').textContent = user.phone || '0909 123 456';
    document.getElementById('inv-order-address').textContent = finalDeliveryAddress;
    document.getElementById('inv-order-payment').textContent = paymentMethodText;
    document.getElementById('inv-order-total').textContent = totalText;

    const invItemsList = document.getElementById('inv-items-list');
    if (invItemsList) {
      invItemsList.innerHTML = items.map(it => `
        <div class="invoice-item-row">
          <span>${it.name} (x${it.quantity})</span>
          <strong>${formatMoney(it.price * it.quantity)}</strong>
        </div>
      `).join('');
    }

    modal.style.display = 'flex';
  }

  // 6. Xóa giỏ hàng khi kết thúc giao dịch
  saveCartItems([]);
  showToast(`🎉 Đặt hàng #${orderId} thành công!`);
}

// 9. ĐỒNG BỘ TRẠNG THÁI ĐĂNG NHẬP / ĐĂNG XUẤT TRÊN HEADER CỦA MỌI TRANG
function updateHeaderAuthStatus() {
  const userBtn = document.getElementById('header-user-btn');
  const storedUser = localStorage.getItem('kpop_current_user');

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      const shortName = user.name ? user.name.split(' ').slice(-1)[0] : 'Fan';
      const initial = (user.name || user.email || 'U').charAt(0).toUpperCase();

      // Khi ĐÃ ĐĂNG NHẬP:
      if (userBtn) {
        userBtn.className = 'user-header-status';
        userBtn.title = `Tài khoản: ${user.name || user.email} (Bấm để xem hồ sơ hoặc Đăng xuất)`;
        userBtn.innerHTML = `
          <span class="user-header-avatar">${initial}</span>
          <span>${shortName}</span>
        `;
      }
    } catch (e) {}
  } else {
    // Khi CHƯA ĐĂNG NHẬP (hoặc sau khi ĐĂNG XUẤT):
    if (userBtn) {
      userBtn.className = 'header-icon-btn';
      userBtn.title = 'Đăng nhập tài khoản';
      userBtn.innerHTML = '👤';
    }
  }
}

// 10. THÔNG BÁO TOAST POPUP TIỆN ÍCH
function showToast(message) {
  const oldToast = document.querySelector('.toast-notice');
  if (oldToast) oldToast.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notice';
  toast.innerHTML = `<span>✨</span> <span>${message}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s, transform 0.3s';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// 11. XỬ LÝ TÌM KIẾM ĐỒNG NHẤT TOÀN WEB
function executeSearch() {
  const input = document.getElementById('header-search-input');
  if (!input) return;
  const query = input.value.trim();

  // Nếu đang ở trang products.html, lọc sản phẩm ngay lập tức
  const isProductsPage = window.location.pathname.includes('products.html');
  if (isProductsPage) {
    filterProductsByQuery(query);
    // Cập nhật URL không reload
    const newUrl = query ? `products.html?search=${encodeURIComponent(query)}` : 'products.html';
    window.history.replaceState(null, '', newUrl);
  } else {
    // Nếu ở trang khác, chuyển hướng sang products.html kèm tham số tìm kiếm
    if (query) {
      window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    } else {
      window.location.href = 'products.html';
    }
  }
}

// Lọc sản phẩm trên trang products.html
function filterProductsByQuery(query) {
  const productCards = document.querySelectorAll('.product-card');
  if (!productCards || productCards.length === 0) return;

  const q = (query || '').toLowerCase().trim();
  let matchCount = 0;

  productCards.forEach(card => {
    const text = card.textContent.toLowerCase();
    if (!q || text.includes(q)) {
      card.style.display = 'block';
      matchCount++;
    } else {
      card.style.display = 'none';
    }
  });

  const sectionTitle = document.querySelector('.section-title h2, .section-title h3');
  if (sectionTitle) {
    if (q) {
      sectionTitle.innerHTML = `Kết quả tìm kiếm cho: "<span style="color: #dc2626;">${escapeHtml(query)}</span>" (${matchCount} sản phẩm)`;
    } else {
      sectionTitle.textContent = 'Tất cả sản phẩm';
    }
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 12. KHỞI TẠO TÌM KIẾM VÀ NÚT THÊM GIỎ HÀNG TRÊN TRANG CHI TIẾT
function initGlobalFeatures() {
  // Đọc từ khóa tìm kiếm từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const searchParam = urlParams.get('search');
  const searchInput = document.getElementById('header-search-input');

  if (searchParam && searchInput) {
    searchInput.value = searchParam;
    filterProductsByQuery(searchParam);
  }

  // Kết nối nút "Thêm vào giỏ hàng" trên trang chi tiết sản phẩm (product-detail.html)
  const addCartBtn = document.querySelector('.btn-add-cart');
  if (addCartBtn) {
    addCartBtn.addEventListener('click', function() {
      const titleEl = document.querySelector('.detail-title');
      const priceEl = document.querySelector('.detail-price');
      const imgEl = document.querySelector('.detail-img');
      const qtyInput = document.getElementById('quantity-input');
      const activeVersion = document.querySelector('.version-btn.active');

      const name = titleEl ? titleEl.textContent.trim() : 'Album K-Pop';
      const rawPrice = priceEl ? priceEl.textContent.replace(/[^\d]/g, '') : '3260000';
      const price = parseInt(rawPrice) || 3260000;
      const quantity = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
      const variant = activeVersion ? activeVersion.textContent.trim() : 'CD BOX SET';
      const image = imgEl ? imgEl.getAttribute('src') : 'image/arirang.jpg';

      let items = getCartItems();
      const existing = items.find(it => it.name === name && it.variant === variant);

      if (existing) {
        existing.quantity += quantity;
      } else {
        items.push({
          id: Date.now(),
          name: name,
          artist: 'BTS',
          variant: variant,
          price: price,
          quantity: quantity,
          image: image
        });
      }

      saveCartItems(items);
      showToast(`🛒 Đã thêm ${quantity} "${name}" vào giỏ hàng!`);
    });
  }

  // Chuyển chọn phân loại version trên trang chi tiết nếu có
  const versionBtns = document.querySelectorAll('.version-btn');
  versionBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      versionBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

// Khởi tạo chạy khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', function() {
  updateHeaderCartBadge();
  updateHeaderAuthStatus();
  renderCart();
  initGlobalFeatures();
});
