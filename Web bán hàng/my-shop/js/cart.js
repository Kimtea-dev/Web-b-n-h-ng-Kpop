/* js/cart.js - BẢN TĨNH
   Không dùng localStorage / sessionStorage / cookie, không có cơ sở dữ liệu.
   Chỉ gồm: thông báo demo, tìm kiếm trên header, và dữ liệu sản phẩm ghi cứng cho trang chi tiết. */

// Thông báo nhỏ ở cuối màn hình
function showToast(message) {
  var t = document.getElementById('demo-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'demo-toast';
    t.style.cssText = 'position:fixed;left:50%;bottom:32px;transform:translateX(-50%);background:#111;color:#fff;padding:12px 20px;border-radius:10px;font-size:14px;z-index:9999;box-shadow:0 6px 20px rgba(0,0,0,.25);max-width:90vw;text-align:center;transition:opacity .25s;opacity:0;';
    document.body.appendChild(t);
  }
  t.textContent = message;
  t.style.opacity = '1';
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(function () { t.style.opacity = '0'; }, 2600);
}

function formatMoney(n) {
  return n.toLocaleString('vi-VN') + ' ₫';
}

// Tìm kiếm: chuyển sang products.html?search=...
function executeSearch() {
  var input = document.getElementById('header-search-input');
  if (input && input.value.trim()) {
    window.location.href = 'products.html?search=' + encodeURIComponent(input.value.trim());
  }
}

// Dữ liệu sản phẩm ghi cứng (id khớp với ?id= ở link "Chi tiết" trong products.html)
var PRODUCT_CATALOG = [
  { id: 1, artist: 'BLACKPINK',   name: 'DEADLINE STANDARD',    price: 880000,  image: 'image/deadline.jpg', variants: ['STANDARD'] },
  { id: 2, artist: 'CORTIS',      name: 'GREEN GREEN STANDARD', price: 1200000, image: 'image/green.jpg',    variants: ['STANDARD'] },
  { id: 3, artist: 'NEWJEANS',    name: 'EP STANDARD',          price: 430000,  image: 'image/EP.jpg',       variants: ['STANDARD'] },
  { id: 4, artist: 'ILLIT',       name: 'BOMP STANDARD',        price: 690000,  image: 'image/bomp.jpg',     variants: ['STANDARD'] },
  { id: 5, artist: 'BTS',         name: 'ARIRANG',              price: 3260000, image: 'image/arirang.jpg',  variants: ['CD BOX SET', 'VINYL'],
    desc: '• Travel Tag CD Box Set: Hộp gồm Jewel Case, đĩa CD, sách ảnh (Booklet), móc khóa dạng thẻ (Chainkey Tag) và poster.<br>• Phiên bản Đĩa than (Vinyl): Gồm các bản Modern Korea, Group Red, Deluxe B&W, Deluxe Color, và 7 phiên bản riêng của từng thành viên.' },
  { id: 6, artist: 'LE SSERAFIM', name: '5TH MINI ALBUM',       price: 1620000, image: 'image/5th.jpg',      variants: ['STANDARD'] },
  { id: 7, artist: 'BABYMONSTER', name: 'CHOOM MINI ALBUM',     price: 700000,  image: 'image/choom.jpg',    variants: ['STANDARD'] },
  { id: 8, artist: 'JENNIE',      name: 'RUBY STANDARD',        price: 1200000, image: 'image/ruby.jpg',     variants: ['STANDARD'] }
];

// Trang chi tiết: điền thông tin theo ?id=
function renderProductDetail() {
  var titleEl = document.querySelector('.detail-title');
  if (!titleEl) return null;

  var id = parseInt(new URLSearchParams(window.location.search).get('id'), 10);
  var p = PRODUCT_CATALOG.filter(function (x) { return x.id === id; })[0] ||
          PRODUCT_CATALOG.filter(function (x) { return x.id === 5; })[0];

  titleEl.innerHTML = '<b>' + p.name + '</b>';
  var priceEl = document.querySelector('.detail-price');
  if (priceEl) priceEl.innerHTML = '<b>' + formatMoney(p.price) + '</b>';
  var imgEl = document.querySelector('.detail-img');
  if (imgEl) { imgEl.src = p.image; imgEl.alt = p.name; }
  var descEl = document.querySelector('.detail-desc');
  if (descEl) {
    descEl.innerHTML = p.desc || ('Album ' + p.artist + ' - ' + p.name + '. Hàng chính hãng nhập khẩu từ Hàn Quốc, nguyên seal, tính điểm Hanteo / Circle Chart.');
  }

  var firstBtn = document.querySelector('.version-btn');
  if (firstBtn) {
    var group = firstBtn.parentElement;
    group.querySelectorAll('.version-btn').forEach(function (b) { b.remove(); });
    p.variants.forEach(function (v, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'version-btn' + (i === 0 ? ' active' : '');
      b.textContent = v;
      b.addEventListener('click', function () {
        group.querySelectorAll('.version-btn').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
      });
      group.appendChild(b);
    });
  }
  document.title = p.name + ' - K-POP STORE';
  return p;
}

document.addEventListener('DOMContentLoaded', function () {
  // Lọc sản phẩm theo từ khóa trên products.html?search=...
  var q = (new URLSearchParams(window.location.search).get('search') || '').trim().toLowerCase();
  var searchInput = document.getElementById('header-search-input');
  if (searchInput && q) searchInput.value = q;

  var cards = document.querySelectorAll('.product-grid .product-card');
  if (q && cards.length) {
    var found = 0;
    cards.forEach(function (card) {
      var match = card.textContent.toLowerCase().indexOf(q) !== -1;
      card.style.display = match ? '' : 'none';
      if (match) found++;
    });
    if (found === 0) {
      var grid = cards[0].parentElement;
      var msg = document.createElement('p');
      msg.style.cssText = 'padding:20px;text-align:center;width:100%;';
      msg.textContent = 'Không tìm thấy sản phẩm nào cho "' + q + '"';
      grid.parentElement.insertBefore(msg, grid);
    }
  }

  // Trang chi tiết: nút "Thêm vào giỏ hàng" chỉ hiện thông báo (không lưu gì)
  var product = renderProductDetail();
  var addBtn = document.querySelector('.btn-add-cart');
  if (addBtn && product) {
    var fresh = addBtn.cloneNode(true);   // gỡ các sự kiện cũ (nếu có)
    addBtn.replaceWith(fresh);
    fresh.addEventListener('click', function () {
      var qtyInput = document.getElementById('quantity-input');
      var qty = Math.max(1, qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1);
      showToast('🛒 Đã thêm ' + qty + ' "' + product.name + '" vào giỏ hàng!');
    });
  }
});
