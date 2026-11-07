/* home.js - 2 carousel sản phẩm (Nổi bật, Tất cả) + đếm giỏ hàng.
   Dữ liệu là MẪU: thay các mảng trong LISTS bằng dữ liệu thật (hoặc fetch từ server).
   Ảnh: trong mỗi .media thêm <img src="..." alt="...">. */
const LISTS = {
  featured: [
    { id: 1, name: "Lightstick CORTIS", price: 1200000, image: "image/lightstickcortis.jpg" },
    { id: 2, name: "Box merch ARIRANG BTS", price: 5500000, image: "image/btsmerchbox.jpg" },
    { id: 3, name: "Mũ lưỡi trai thêu logo BIGBANG", price: 900000, image: "image/bigbanghat.jpg" },
    { id: 4, name: "Hộp album JISOO", price: 1500000, image: "image/jisooalbumbox.jpg" },
    { id: 5, name: "Album Color outside the line CORTIS", price: 730000, image: "image/cortisalbum.jpg"},
    { id: 6, name: "Áo hoodie ARIRANG BTS", price: 6200000, image: "image/ariranghoodie.jpg" },
    { id: 7, name: "Set photocard 9 thẻ NEWJEANS", price: 900000, image: "image/photocardnewjeans.jpg" },
    { id: 8, name: "Móc khóa acrylic ENHYPEN", price: 350000, image: "image/enhypenkeyring.jpg" }
  ],
  all: [
    { id: 9, name: "Album ARIRANG BTS", price: 1389000, image: "image/arirang.jpg" },
    { id: 10, name: "Album RUBY JENNIE ", price: 1389000, image: "image/ruby.jpg" },
    { id: 11, name: "Album CHOOM BABYMONSTER", price: 850000, image: "image/choom.jpg" },
    { id: 12, name: "Album DEADLINE BLACKPINK", price: 1129000, image: "image/deadline.jpg" },
    { id: 13, name: "Album EP NEWJEANS", price: 750000, image: "image/EP.jpg" },
    { id: 14, name: "Album GREEN CORTIS", price: 210000, image: "image/green.jpg" },
    { id: 15, name: "Album 5TH LE SSERAFIM", price: 790000, image: "image/5th.jpg" },
    { id: 16, name: "Album BOMP ILLIT", price: 720000, image: "image/bomp.jpg" }
  ]
};

const vnd = n => n.toLocaleString("vi-VN") + "đ";
const card = p => `
  <article class="p-card">
    <a href="product-detail.html" style="display:block">
      <div class="media"><img src="${p.image}" alt="${p.name}"></div>
    </a>
    <h3><a href="product-detail.html">${p.name}</a></h3>
    <p class="price">${vnd(p.price)}</p>
    <button class="add" data-id="${p.id}">+ Thêm vào giỏ</button>
  </article>`;

/* Carousel dùng chung cho mọi khối .carousel[data-list]: 4 sản phẩm/lần, tự chạy,
   dừng khi rê chuột hoặc focus bên trong, mũi tên bấm được, hết thì quay về đầu. */
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
function initCarousel(box) {
  const track = box.querySelector(".track");
  track.innerHTML = LISTS[box.dataset.list].map(card).join("");
  const step = () => (track.querySelector(".p-card")?.offsetWidth || 260) + 24;
  const atEnd = () => track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  let timer, paused = false;

  function slide(dir) {
    if (dir > 0 && atEnd()) track.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir < 0 && track.scrollLeft <= 4) track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
    else track.scrollBy({ left: dir * step(), behavior: "smooth" });
  }
  function restart() {
    clearInterval(timer);
    if (!reduce) timer = setInterval(() => { if (!paused) slide(1); }, Number(box.dataset.interval) || 3000);
  }
  box.querySelector(".prev").onclick = () => { slide(-1); restart(); };
  box.querySelector(".next").onclick = () => { slide(1); restart(); };
  box.addEventListener("mouseenter", () => { paused = true; });
  box.addEventListener("mouseleave", () => { paused = false; });
  box.addEventListener("focusin", () => { paused = true; });
  box.addEventListener("focusout", () => { paused = false; });
  restart();
}
document.querySelectorAll(".carousel").forEach(initCarousel);

/* Giỏ hàng: Đã tắt tự động ghi đè để giữ nguyên số 3 ghi cứng trong HTML */
document.addEventListener("click", e => {
  const b = e.target.closest(".add");
  if (!b) return;
  b.textContent = "Đã thêm ✓";
  setTimeout(() => { b.textContent = "+ Thêm vào giỏ"; }, 1200);
});

/* ===== ĐỒNG BỘ ACCORDION, CHUYỂN ẢNH VÀ ĐỔI MÀU NỀN TỰ ĐỘNG ===== */
function initGroupSlider() {
  const sectionFull = document.querySelector("#group-carousel-wrapper");
  const sliderBox = document.getElementById("groupSlider");
  if (!sliderBox) return;

  const items = sliderBox.querySelectorAll(".accordion-item");
  const images = sliderBox.querySelectorAll(".image-preview-container img");
  let currentIndex = 0;
  let groupTimer = null;
  const INTERVAL_TIME = 4000;

  function showGroupSlide(index) {
    currentIndex = index;
    items.forEach((item, idx) => {
      item.classList.toggle("active", idx === index);
    });

    images.forEach((img, idx) => {
      if (idx === index) {
        img.classList.add("active");
        const newBgColor = img.getAttribute("data-bg");
        if (newBgColor && sectionFull) {
          sectionFull.style.background = newBgColor;
        }
      } else {
        img.classList.remove("active");
      }
    });
  }

  function nextGroupSlide() {
    const nextIndex = (currentIndex + 1) % items.length;
    showGroupSlide(nextIndex);
  }

  function startAutoPlay() {
    stopAutoPlay();
    groupTimer = setInterval(nextGroupSlide, INTERVAL_TIME);
  }

  function stopAutoPlay() {
    if (groupTimer) clearInterval(groupTimer);
  }

  // Cho phép click vào từng nhóm để chuyển slide
  items.forEach((item, idx) => {
    item.style.cursor = "pointer";
    item.addEventListener("click", () => {
      showGroupSlide(idx);
      startAutoPlay(); // Reset lại chu kỳ 4s
    });
  });

  // Tạm dừng khi rê chuột vào, tiếp tục khi rời chuột
  sliderBox.addEventListener("mouseenter", stopAutoPlay);
  sliderBox.addEventListener("mouseleave", startAutoPlay);

  // Khởi chạy ngay lập tức
  showGroupSlide(currentIndex);
  startAutoPlay();
}

// Chạy an toàn dù DOMContentLoaded đã bắn hay chưa
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGroupSlider);
} else {
  initGroupSlider();
}

/* ================= DỮ LIỆU DEMO (thay bằng dữ liệu từ server khi có) ================= */
var S = {
  password: '123456',
  user: { name: 'Customer', email: 'customer@example.com', phone: '0909456321', dob: '', gender: '', avatar: '' },
  orders: [
    { id: 'DH-102949', date: '27/10/2026', status: 'pending',   ship: 30000, items: [{ n: 'Hộp Album JISOO', q: 1, p: 1200000, img: 'image/jisooalbumbox.jpg' }, { n: 'Album RUBY JENNIE', q: 1, p: 1389000, img: 'image/ruby.jpg' }, { n: 'Album BOMP ILLIT', q: 1, p: 720000, img: 'image/bomp.jpg' }] },
    { id: 'DH-102815', date: '20/10/2026', status: 'shipping',  ship: 30000, items: [{ n: 'Lightstick CORTIS', q: 1, p: 1200000, img: 'image/lightstickcortis.jpg' }] },
    { id: 'DH-102731', date: '12/10/2026', status: 'done',      ship: 30000, items: [{ n: 'ARIRANG - BTS (CD BOX SET)', q: 1, p: 1389000, img: 'image/arirang.jpg' }] },
    { id: 'DH-102650', date: '10/10/2026', status: 'done',      ship: 30000, items: [{ n: 'Áo hoodie ARIRANG BTS', q: 1, p: 6200000, img: 'image/ariranghoodie.jpg' }] },
    { id: 'DH-102500', date: '05/10/2026', status: 'cancelled', ship: 30000, items: [{ n: 'Móc khóa acrylic ENHYPEN', q: 2, p: 90000, img: 'image/enhypenkeyring.jpg' }] }
  ],
  addresses: [
    { id: 1, label: 'Nhà riêng', name: 'Customer', phone: '0909 456 321', text: '45 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh', def: true }
  ],
  wishlist: [
    { id: 1, n: 'Set photocard 9 thẻ NEWJEANS', p: 900000, img: 'image/photocardnewjeans.jpg' },
    { id: 2, n: 'Album DEADLINE BLACKPINK', p: 1129000, img: 'image/deadline.jpg' },
    { id: 3, n: 'Mũ lưỡi trai thêu logo BIGBANG', p: 900000, img: 'image/bigbanghat.jpg' }
  ]
};
var STATUS = {
  pending:   ['Chờ xác nhận', 'status-pending'],
  shipping:  ['Đang giao',    'status-shipping'],
  done:      ['Đã giao',      'status-done'],
  cancelled: ['Đã hủy',       'status-cancelled']
};
var orderFilter = 'all';
var nextAddrId = 2;
var DEMO_TAG = ' (demo)';   /* đặt thành '' nếu không muốn hiện chữ (demo) trong thông báo */
var editingAddr = null;
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ================= TIỆN ÍCH ================= */
function $(id) { return document.getElementById(id); }
function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function fmtVnd(n) { return n.toLocaleString('vi-VN') + 'đ'; }
function fmtPhone(d) { d = String(d).replace(/\D/g, ''); return d.length === 10 ? d.slice(0, 4) + ' ' + d.slice(4, 7) + ' ' + d.slice(7) : d; }
function setMsg(id, text, ok) { var el = $(id); if (!el) return; el.textContent = text || ''; el.className = 'form-msg' + (text ? (ok ? ' ok' : ' err') : ''); }
var toastTimer;
function toast(msg) { var t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2600); }

/* ================= TIỆN ÍCH HEADER USER PROFILE ================= */
function updateHeaderUserStatus() {
  var isLogged = sessionStorage.getItem('kpop_is_logged_in') === 'true';
  var userWrapper = document.getElementById('userMenuWrapper') || document.querySelector('.user-menu-wrapper');
  var nameEl = document.getElementById('headerPopupName');
  var emailEl = document.getElementById('headerPopupEmail');

  if (userWrapper) {
    if (isLogged) {
      userWrapper.classList.add('logged-in');
      var savedName = sessionStorage.getItem('kpop_user_name') || (window.S && S.user ? S.user.name : 'Customer');
      var savedEmail = sessionStorage.getItem('kpop_user_email') || (window.S && S.user ? S.user.email : 'customer@example.com');
      if (nameEl) nameEl.textContent = savedName;
      if (emailEl) emailEl.textContent = savedEmail;
    } else {
      userWrapper.classList.remove('logged-in');
    }
  }
}

/* ================= ĐĂNG NHẬP / ĐĂNG KÝ / ĐĂNG XUẤT ================= */
function enterDashboard() {
  sessionStorage.setItem('kpop_is_logged_in', 'true');
  if (window.S && S.user && S.user.name) sessionStorage.setItem('kpop_user_name', S.user.name);
  if (window.S && S.user && S.user.email) sessionStorage.setItem('kpop_user_email', S.user.email);
  if ($('view-auth-container')) $('view-auth-container').style.display = 'none';
  if ($('view-dashboard')) $('view-dashboard').style.display = 'block';
  applyAll();
  switchTab('tab-overview', document.querySelector('.sidebar-menu-item[data-tab="tab-overview"]'));
  updateHeaderUserStatus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleLogin(e) {
  e.preventDefault();
  /* Bản demo tĩnh: để trống hay nhập gì cũng vào được */
  var email = $('login-email') ? $('login-email').value.trim() : '';
  var pass = $('login-password') ? $('login-password').value : '';
  if (email) S.user.email = email;
  S.password = pass || '123456';
  enterDashboard();
}

function handleRegister(e) {
  e.preventDefault();
  /* Bản demo tĩnh: không bắt buộc ô nào, ô nào có dữ liệu thì dùng */
  var name = $('reg-name') ? $('reg-name').value.trim() : '';
  var phone = $('reg-phone') ? $('reg-phone').value.replace(/\D/g, '') : '';
  var email = $('reg-email') ? $('reg-email').value.trim() : '';
  var addr = $('reg-address') ? $('reg-address').value.trim() : '';
  var pass = $('reg-pass') ? $('reg-pass').value : '';
  if (name) S.user.name = name;
  if (phone) S.user.phone = phone;
  if (email) S.user.email = email;
  if ($('reg-dob') && $('reg-dob').value) S.user.dob = $('reg-dob').value;
  S.password = pass || '123456';
  if (addr) {
    S.addresses.forEach(function (a) { a.def = false; });
    S.addresses.unshift({ id: nextAddrId++, label: 'Nhà riêng', name: S.user.name, phone: fmtPhone(S.user.phone), text: addr, def: true });
  } else {
    S.addresses[0].name = S.user.name; S.addresses[0].phone = fmtPhone(S.user.phone);
  }
  enterDashboard();
}

function handleLogout() {
  sessionStorage.removeItem('kpop_is_logged_in');
  sessionStorage.removeItem('kpop_user_name');
  sessionStorage.removeItem('kpop_user_email');
  if ($('view-dashboard')) $('view-dashboard').style.display = 'none';
  if ($('view-auth-container')) $('view-auth-container').style.display = 'block';
  if ($('login-password')) $('login-password').value = '';
  if (typeof showLoginForm === 'function') showLoginForm();
  updateHeaderUserStatus();
  window.scrollTo({ top: 0 });
  if (!$('view-auth-container')) {
    alert('Đã đăng xuất tài khoản thành công!');
    window.location.reload();
  }
}
function showRegisterForm() { $('view-login').style.display = 'none'; $('view-register').style.display = 'block'; }
function showLoginForm() { $('view-register').style.display = 'none'; $('view-login').style.display = 'block'; }

/* ================= CHUYỂN TAB ================= */
function switchTab(tabId, btn) {
  document.querySelectorAll('.tab-pane').forEach(function (p) { p.classList.remove('active'); });
  $(tabId).classList.add('active');
  document.querySelectorAll('.sidebar-menu-item').forEach(function (i) { i.classList.remove('active'); });
  if (!btn) btn = document.querySelector('.sidebar-menu-item[data-tab="' + tabId + '"]');
  if (btn) btn.classList.add('active');
}
function goTab(tabId, anchorId) {
  switchTab(tabId);
  var target = anchorId ? $(anchorId) : $('view-dashboard');
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* Thu gọn / mở rộng thẻ */
document.addEventListener('click', function (e) {
  var h = e.target.closest('.ms-head');
  if (!h) return;
  var card = h.parentElement;
  card.classList.toggle('collapsed');
  h.setAttribute('aria-expanded', String(!card.classList.contains('collapsed')));
});

/* ================= HIỂN THỊ THÔNG TIN ================= */
function applyAll() {
  $('sb-name').textContent = S.user.name;
  $('sb-email').textContent = S.user.email;
  $('ov-email').textContent = S.user.email;
  $('pf-email').textContent = S.user.email;
  $('sec-email-now').textContent = S.user.email;
  var ph = fmtPhone(S.user.phone);
  $('ov-phone').textContent = ph; $('pf-phone').textContent = ph; $('sec-phone-now').textContent = ph;
  $('inp-name').value = S.user.name;
  $('inp-gender').value = S.user.gender;
  $('inp-dob').value = S.user.dob;
  applyAvatar();
  renderOrders(); renderRecent(); renderAddresses(); renderWishlist();
}

/* ================= ẢNH ĐẠI DIỆN ================= */
function applyAvatar() {
  document.querySelectorAll('.avatar-slot').forEach(function (el) {
    if (S.user.avatar) { el.style.backgroundImage = 'url("' + S.user.avatar + '")'; el.classList.add('has-img'); }
    else { el.style.backgroundImage = ''; el.classList.remove('has-img'); }
  });
}
/* DEMO: không đổi ảnh thật, chỉ báo thành công */
function onAvatarChange(input) {
  if (input.files && input.files[0]) toast('Đã cập nhật ảnh đại diện thành công' + DEMO_TAG + '.');
  input.value = '';
}
function removeAvatar() { toast('Đã xóa ảnh đại diện thành công' + DEMO_TAG + '.'); }

function demoAvatar(act) {
  toast((act === 'remove' ? 'Đã xóa ảnh đại diện thành công' : 'Đã cập nhật ảnh đại diện thành công') + DEMO_TAG + '.');
}

/* ================= THÔNG TIN CÁ NHÂN ================= */
/* DEMO: không lưu dữ liệu, chỉ báo thành công */
function saveProfileInfo(e) {
  e.preventDefault();
  if (!$('inp-name').value.trim()) { setMsg('profile-msg', 'Họ và tên không được để trống.', false); return; }
  setMsg('profile-msg', 'Đã lưu thông tin cá nhân thành công' + DEMO_TAG + '.', true);
}

/* ================= BẢO MẬT: ĐỔI MẬT KHẨU / EMAIL / SĐT ================= */
/* DEMO (3 hàm đổi mật khẩu / email / số điện thoại): không cập nhật thật, chỉ báo thành công */
function changePassword(e) {
  e.preventDefault();
  var n = $('pw-new').value, n2 = $('pw-new2').value, err = '';
  if (n.length < 6) err = 'Mật khẩu mới cần tối thiểu 6 ký tự.';
  else if (n !== n2) err = 'Hai mật khẩu mới chưa khớp nhau.';
  if (err) { setMsg('pw-msg', err, false); return; }
  $('pw-old').value = ''; $('pw-new').value = ''; $('pw-new2').value = '';
  setMsg('pw-msg', 'Đã đổi mật khẩu thành công' + DEMO_TAG + '.', true);
}

function changeEmail(e) {
  e.preventDefault();
  var v = $('em-new').value.trim(), err = '';
  if (!EMAIL_RE.test(v)) err = 'Email chưa đúng định dạng, ví dụ ten@example.com.';
  else if (v.toLowerCase() === S.user.email.toLowerCase()) err = 'Email mới trùng với email hiện tại.';
  if (err) { setMsg('em-msg', err, false); return; }
  $('em-new').value = ''; $('em-pass').value = '';
  setMsg('em-msg', 'Đã cập nhật email đăng nhập thành công' + DEMO_TAG + '.', true);
}

function changePhone(e) {
  e.preventDefault();
  var d = $('ph-new').value.replace(/\D/g, ''), err = '';
  if (!/^0\d{9}$/.test(d)) err = 'Số điện thoại cần 10 số và bắt đầu bằng 0.';
  else if (d === S.user.phone) err = 'Số điện thoại mới trùng với số hiện tại.';
  if (err) { setMsg('ph-msg', err, false); return; }
  $('ph-new').value = ''; $('ph-pass').value = '';
  setMsg('ph-msg', 'Đã cập nhật số điện thoại thành công' + DEMO_TAG + '.', true);
}

/* ================= ĐƠN HÀNG ================= */
function orderTotal(o) { return o.items.reduce(function (a, i) { return a + i.p * i.q; }, 0) + o.ship; }
function setOrderFilter(f) { orderFilter = f; renderOrders(); }

function orderHtml(o) {
  var st = STATUS[o.status];
  var items = o.items.map(function (i) {
    var imgTag = i.img ? '<img src="' + i.img + '" alt="' + esc(i.n) + '" style="width:100%;height:100%;object-fit:cover;border-radius:4px;">' : '';
    return '<div class="order-item"><div class="thumb">' + imgTag + '</div><div><div class="oi-name">' + esc(i.n) + '</div><div class="oi-meta">Số lượng: ' + i.q + '</div></div><div class="oi-price">' + fmtVnd(i.p * i.q) + '</div></div>';
  }).join('');
  
  var act = '';
  // Tùy theo trạng thái đơn hàng mà hiển thị nút phù hợp ở bên cạnh nút "Chi tiết đơn"
  if (o.status === 'pending') {
    act = '<button type="button" class="btn outline btn-sm danger" onclick="orderAction(\'' + o.id + '\',\'cancel\')">Hủy đơn</button>';
  } else if (o.status === 'done') {
    act = '<button type="button" class="btn outline btn-sm" onclick="orderAction(\'' + o.id + '\',\'rebuy\')">Mua lại</button>';
  }
  // Riêng trạng thái 'shipping' (đang giao) thì bỏ hẳn nút hành động ngoài, chỉ cần bấm "Chi tiết đơn" là đủ!

  return '<div class="order-card"><div class="order-head"><strong>#' + o.id + '</strong><span class="badge-status ' + st[1] + '">' + st[0] + '</span></div>' + items +
    '<div class="order-foot"><div>Tổng thanh toán: <strong style="color:var(--pink);">' + fmtVnd(orderTotal(o)) + '</strong><span class="date">Đặt ngày ' + o.date + '</span></div><div class="order-actions"><button type="button" class="btn outline btn-sm" onclick="openOrderModal(\'' + o.id + '\')">Chi tiết đơn</button>' + act + '</div></div></div>';
}

function renderOrders() {
  var tabs = [['all', 'Tất cả'], ['pending', 'Chờ xác nhận'], ['shipping', 'Đang giao'], ['done', 'Đã giao'], ['cancelled', 'Đã hủy']];
  $('order-tabs').innerHTML = tabs.map(function (t) {
    var n = t[0] === 'all' ? S.orders.length : S.orders.filter(function (o) { return o.status === t[0]; }).length;
    return '<button type="button" class="seg' + (orderFilter === t[0] ? ' active' : '') + '" onclick="setOrderFilter(\'' + t[0] + '\')">' + t[1] + '<span>' + n + '</span></button>';
  }).join('');
  var list = S.orders.filter(function (o) { return orderFilter === 'all' || o.status === orderFilter; });
  $('order-list').innerHTML = list.length ? list.map(orderHtml).join('') : '<div class="empty">Chưa có đơn hàng nào ở trạng thái này.</div>';
}

function renderRecent() {
  $('recent-orders').innerHTML = S.orders.slice(0, 2).map(function (o) {
    var st = STATUS[o.status];
    return '<div class="recent"><div><strong>#' + o.id + '</strong><small>Đặt ngày ' + o.date + '</small></div><div class="recent-end"><span>' + fmtVnd(orderTotal(o)) + '</span><span class="badge-status ' + st[1] + '">' + st[0] + '</span></div></div>';
  }).join('');
}

/* DEMO: hủy đơn không đổi trạng thái thật, chỉ báo thành công */
function orderAction(id, act) {
  if (act === 'cancel') {
    if (!confirm('Bạn chắc chắn muốn hủy đơn #' + id + '?')) return;
    toast('Đã hủy đơn #' + id + ' thành công' + DEMO_TAG + '.');
  } else if (act === 'track') {
    toast('Đơn #' + id + ' đang trên đường giao đến bạn.');
  } else {
    toast('Đã thêm sản phẩm vào giỏ hàng' + DEMO_TAG + '.');
  }
}

/* ================= SỔ ĐỊA CHỈ ================= */
function renderAddresses() {
  $('addr-list').innerHTML = S.addresses.length ? S.addresses.map(function (a) {
    return '<div class="addr-item"><div><div class="addr-top"><strong>' + esc(a.label) + '</strong>' + (a.def ? '<span class="tag">Mặc định</span>' : '') + '</div>' +
      '<div class="addr-line">' + esc(a.name) + ' • ' + esc(a.phone) + '</div><div class="addr-text">' + esc(a.text) + '</div></div>' +
      '<div class="addr-actions"><button type="button" class="btn outline btn-sm" onclick="editAddr(' + a.id + ')">Chỉnh sửa</button>' +
      (a.def ? '' : '<button type="button" class="btn outline btn-sm" onclick="setDefaultAddr(' + a.id + ')">Đặt làm mặc định</button>') +
      '<button type="button" class="btn outline btn-sm danger" onclick="removeAddr(' + a.id + ')">Xóa</button></div></div>';
  }).join('') : '<div class="empty">Bạn chưa lưu địa chỉ nào. Hãy thêm địa chỉ đầu tiên ở bên dưới.</div>';
}
/* DEMO: thêm / chỉnh sửa / đặt mặc định / xóa địa chỉ đều không đổi dữ liệu thật, chỉ báo thành công */
function resetAddrForm() {
  editingAddr = null;
  ['addr-text', 'addr-name', 'addr-phone'].forEach(function (i) { $(i).value = ''; });
  $('addr-default').checked = false;
  $('addr-label').selectedIndex = 0;
  $('addr-form-title').textContent = 'Thêm địa chỉ mới';
  $('addr-form-sub').textContent = 'Nhà riêng, công ty, ký túc xá...';
  $('addr-submit').textContent = 'Thêm địa chỉ';
}
function editAddr(id) {
  var a = S.addresses.filter(function (x) { return x.id === id; })[0];
  if (!a) return;
  editingAddr = id;
  $('addr-label').value = a.label; $('addr-name').value = a.name; $('addr-phone').value = a.phone; $('addr-text').value = a.text;
  $('addr-default').checked = a.def;
  $('addr-form-title').textContent = 'Chỉnh sửa địa chỉ';
  $('addr-form-sub').textContent = 'Sửa thông tin rồi bấm "Lưu thay đổi"';
  $('addr-submit').textContent = 'Lưu thay đổi';
  setMsg('addr-msg', '');
  $('addr-form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function addAddress(e) {
  e.preventDefault();
  if (!$('addr-text').value.trim()) { setMsg('addr-msg', 'Bạn chưa nhập địa chỉ nhận hàng.', false); return; }
  var msg = editingAddr ? 'Đã cập nhật địa chỉ thành công' : 'Đã thêm địa chỉ mới thành công';
  resetAddrForm();
  setMsg('addr-msg', msg + DEMO_TAG + '.', true);
}
function setDefaultAddr(id) { toast('Đã đổi địa chỉ mặc định thành công' + DEMO_TAG + '.'); }
function removeAddr(id) {
  if (!confirm('Xóa địa chỉ này khỏi sổ địa chỉ?')) return;
  toast('Đã xóa địa chỉ thành công' + DEMO_TAG + '.');
}

/* ================= YÊU THÍCH ================= */
function renderWishlist() {
  $('wish-list').innerHTML = S.wishlist.length ? '<div class="wish-grid">' + S.wishlist.map(function (w) {
    var imgTag = w.img ? '<img src="' + w.img + '" alt="' + esc(w.n) + '" style="width:100%;height:100%;object-fit:cover;border-radius:6px;">' : '';
    return '<div class="wish"><div class="thumb-lg">' + imgTag + '</div><b>' + esc(w.n) + '</b><span class="cost">' + fmtVnd(w.p) + '</span>' +
      '<div class="wish-actions"><button type="button" class="btn pink btn-sm" onclick="wishToCart(' + w.id + ')">Thêm vào giỏ</button>' +
      '<button type="button" class="btn outline btn-sm" aria-label="Bỏ thích" onclick="removeWish(' + w.id + ')">Bỏ thích</button></div></div>';
  }).join('') + '</div>' : '<div class="empty">Bạn chưa thả tim sản phẩm nào. <a href="products.html">Khám phá sản phẩm</a></div>';
}
function wishToCart() { toast('Đã thêm vào giỏ hàng' + DEMO_TAG + '.'); }
function removeWish(id) { toast('Đã bỏ thích sản phẩm thành công' + DEMO_TAG + '.'); }

/* ================= VOUCHER ================= */
function copyCode(code) {
  // Chỉ hiển thị thông báo thành công ảo, hoàn toàn không gọi lệnh sao chép vào clipboard
  toast('Đã sao chép mã ' + code + '.');
}

/* ================= MỞ THẲNG VÀO DASHBOARD QUA #HASH HOẶC TRẠNG THÁI LOGIN ================= */
(function () {
  var map = { dashboard: 'tab-overview', profile: 'tab-profile', orders: 'tab-orders', address: 'tab-address', wishlist: 'tab-wishlist', vouchers: 'tab-vouchers', security: 'tab-security' };
  var h = location.hash.replace('#', '');
  var isLogged = sessionStorage.getItem('kpop_is_logged_in') === 'true';

  if ($('view-auth-container') && $('view-dashboard')) {
    if (map[h] || isLogged) {
      sessionStorage.setItem('kpop_is_logged_in', 'true');
      $('view-auth-container').style.display = 'none';
      $('view-dashboard').style.display = 'block';
      applyAll();
      if (map[h]) switchTab(map[h]);
    }
  }
  updateHeaderUserStatus();
})();

/* ================= HÀM XỬ LÝ MODAL CHI TIẾT ĐƠN HÀNG ================= */
function openOrderModal(orderId) {
  var order = S.orders.find(function(o) { return o.id === orderId; });
  if (!order) return;

  // 1. Cập nhật tiêu đề & thời gian & người nhận
  $('modalOrderId').textContent = 'Chi tiết đơn hàng #' + order.id;
  $('modalOrderDate').textContent = 'Đặt ngày ' + order.date;
  $('modalCustomerName').textContent = S.user.name || 'Customer';
  $('modalCustomerPhone').textContent = fmtPhone(S.user.phone);

  var stepperContainer = $('modalStepperContainer');
  var carrierNameEl = $('modalCarrierName');
  var trackingCodeEl = $('modalTrackingCode');
  var paymentStatusEl = $('modalPaymentStatus');
  var trackingTitleEl = $('modalTrackingTitle');
  var trackingListEl = $('modalTrackingList');

  var trackingLogs = [];

  // 2. Xử lý Stepper, Thông tin vận chuyển, Thanh toán và Lịch trình theo từng trạng thái
  if (order.status === 'pending') {
    // ===== ĐƠN CHỜ XÁC NHẬN =====
    // Stepper: Chỉ có bước 1 sáng (Đã đặt hàng), các bước sau đang chờ
    if (stepperContainer) {
      stepperContainer.innerHTML =
        '<div class="stepper-wrapper">' +
          '<div class="stepper-item active">' +
            '<div class="step-counter">✓</div>' +
            '<div class="step-name">Đã đặt hàng</div>' +
          '</div>' +
          '<div class="stepper-item">' +
            '<div class="step-counter">2</div>' +
            '<div class="step-name">Chờ xác nhận</div>' +
          '</div>' +
          '<div class="stepper-item">' +
            '<div class="step-counter">3</div>' +
            '<div class="step-name">Đang chuẩn bị</div>' +
          '</div>' +
          '<div class="stepper-item">' +
            '<div class="step-counter">4</div>' +
            '<div class="step-name">Đang vận chuyển</div>' +
          '</div>' +
          '<div class="stepper-item">' +
            '<div class="step-counter">5</div>' +
            '<div class="step-name">Đã nhận hàng</div>' +
          '</div>' +
        '</div>';
    }

    if (carrierNameEl) carrierNameEl.textContent = 'K-Express Standard (Chờ xác nhận đơn)';
    if (trackingCodeEl) {
      trackingCodeEl.style.color = '#888';
      trackingCodeEl.textContent = 'Đang cập nhật (Chờ tạo mã)';
    }
    if (paymentStatusEl) {
      paymentStatusEl.style.color = '#ffb800';
      paymentStatusEl.textContent = 'Tiền mặt (COD) - Thanh toán khi nhận hàng';
    }
    if (trackingTitleEl) trackingTitleEl.textContent = '🗺️ Lịch trình cập nhật đơn hàng';

    trackingLogs = [
      { time: '10:30 - ' + order.date, desc: 'Đơn hàng đã được đặt thành công, đang chờ cửa hàng xác nhận và xử lý', loc: 'Hệ thống K-Pop Store' }
    ];

  } else if (order.status === 'cancelled') {
    // ===== ĐƠN ĐÃ HỦY =====
    // Stepper: Đã đặt hàng -> Yêu cầu hủy -> Đã hủy (màu đỏ)
    if (stepperContainer) {
      stepperContainer.innerHTML =
        '<div style="background: rgba(255, 77, 79, 0.1); border: 1px solid rgba(255, 77, 79, 0.3); border-radius: 8px; padding: 10px 14px; margin-bottom: 12px; color: #ff7875; display: flex; align-items: center; gap: 8px; font-size: 0.85rem;">' +
          '<span style="font-size: 1.1rem; font-weight: bold;">✕</span>' +
          '<div><strong>Đơn hàng đã bị hủy.</strong> Quý khách không phải thanh toán tiền hàng.</div>' +
        '</div>' +
        '<div class="stepper-wrapper">' +
          '<div class="stepper-item completed">' +
            '<div class="step-counter">✓</div>' +
            '<div class="step-name">Đã đặt hàng</div>' +
          '</div>' +
          '<div class="stepper-item completed" style="filter: brightness(0.9);">' +
            '<div class="step-counter">✓</div>' +
            '<div class="step-name">Yêu cầu hủy</div>' +
          '</div>' +
          '<div class="stepper-item active" style="--pink: #ff4d4f;">' +
            '<div class="step-counter" style="background:#ff4d4f; border-color:#ff4d4f; color:#fff;">✕</div>' +
            '<div class="step-name" style="color:#ff4d4f; font-weight:600;">Đã hủy đơn</div>' +
          '</div>' +
        '</div>';
    }

    if (carrierNameEl) carrierNameEl.textContent = 'Không áp dụng (Đơn đã hủy)';
    if (trackingCodeEl) {
      trackingCodeEl.style.color = '#888';
      trackingCodeEl.textContent = 'Không áp dụng';
    }
    if (paymentStatusEl) {
      paymentStatusEl.style.color = '#ff4d4f';
      paymentStatusEl.textContent = 'Tiền mặt (COD) - Đã hủy đơn (Không thu tiền)';
    }
    if (trackingTitleEl) trackingTitleEl.textContent = '🗺️ Lịch sử xử lý đơn hàng';

    trackingLogs = [
      { time: '16:00 - ' + order.date, desc: 'Đơn hàng đã được hủy thành công trên hệ thống', loc: 'Trung tâm hỗ trợ K-Pop Store' },
      { time: '14:20 - ' + order.date, desc: 'Khách hàng gửi yêu cầu hủy đơn hàng', loc: 'Trang cá nhân khách hàng' },
      { time: '09:00 - ' + order.date, desc: 'Đơn hàng được khởi tạo thành công trên website', loc: 'Hệ thống K-Pop Store' }
    ];

  } else if (order.status === 'shipping') {
    // ===== ĐƠN ĐANG GIAO (GIỮ NGUYÊN CHUẨN) =====
    if (stepperContainer) {
      stepperContainer.innerHTML =
        '<div class="stepper-wrapper">' +
          '<div class="stepper-item completed">' +
            '<div class="step-counter">✓</div>' +
            '<div class="step-name">Đã đặt hàng</div>' +
          '</div>' +
          '<div class="stepper-item completed">' +
            '<div class="step-counter">✓</div>' +
            '<div class="step-name">Đã xác nhận</div>' +
          '</div>' +
          '<div class="stepper-item completed">' +
            '<div class="step-counter">✓</div>' +
            '<div class="step-name">Đang chuẩn bị</div>' +
          '</div>' +
          '<div class="stepper-item active">' +
            '<div class="step-counter">🚚</div>' +
            '<div class="step-name">Đang vận chuyển</div>' +
          '</div>' +
          '<div class="stepper-item">' +
            '<div class="step-counter">📦</div>' +
            '<div class="step-name">Đã nhận hàng</div>' +
          '</div>' +
        '</div>';
    }

    if (carrierNameEl) carrierNameEl.textContent = 'K-Express Standard (Chuyển phát nhanh)';
    if (trackingCodeEl) {
      trackingCodeEl.style.color = 'var(--pink)';
      trackingCodeEl.textContent = 'KEX-88940219VN';
    }
    if (paymentStatusEl) {
      paymentStatusEl.style.color = '#00e676';
      paymentStatusEl.textContent = 'Đã thanh toán (Momo / ZaloPay)';
    }
    if (trackingTitleEl) trackingTitleEl.textContent = '🗺️ Lịch trình vận chuyển chi tiết';

    trackingLogs = [
      { time: '08:00 - 29/10/2026', desc: 'Shipper đang giao hàng đến bạn', loc: 'Tài xế Nguyễn Văn B (0912.345.678)' },
      { time: '14:30 - 28/10/2026', desc: 'Bưu cục đã tiếp nhận gói hàng', loc: 'Trung tâm khai thác K-Express (Quận 7, TP.HCM)' },
      { time: '09:15 - 28/10/2026', desc: 'Đơn hàng đã thông quan nhập khẩu thành công', loc: 'Sân bay Quốc tế Tân Sơn Nhất' },
      { time: '21:00 - 27/10/2026', desc: 'Đơn hàng đã rời kho quốc tế', loc: 'Kho Incheon (Hàn Quốc)' },
      { time: '10:00 - 27/10/2026', desc: 'Người gửi đang chuẩn bị hàng', loc: 'Seoul, Hàn Quốc' }
    ];

  } else {
    // ===== ĐƠN ĐÃ GIAO THÀNH CÔNG (done) - GIỮ NGUYÊN CHUẨN =====
    if (stepperContainer) {
      stepperContainer.innerHTML =
        '<div class="stepper-wrapper">' +
          '<div class="stepper-item completed">' +
            '<div class="step-counter">✓</div>' +
            '<div class="step-name">Đã đặt hàng</div>' +
          '</div>' +
          '<div class="stepper-item completed">' +
            '<div class="step-counter">✓</div>' +
            '<div class="step-name">Đã xác nhận</div>' +
          '</div>' +
          '<div class="stepper-item completed">' +
            '<div class="step-counter">✓</div>' +
            '<div class="step-name">Đang chuẩn bị</div>' +
          '</div>' +
          '<div class="stepper-item completed">' +
            '<div class="step-counter">🚚</div>' +
            '<div class="step-name">Đang vận chuyển</div>' +
          '</div>' +
          '<div class="stepper-item active">' +
            '<div class="step-counter">✓</div>' +
            '<div class="step-name">Đã nhận hàng</div>' +
          '</div>' +
        '</div>';
    }

    if (carrierNameEl) carrierNameEl.textContent = 'K-Express Standard (Chuyển phát nhanh)';
    if (trackingCodeEl) {
      trackingCodeEl.style.color = 'var(--pink)';
      trackingCodeEl.textContent = 'KEX-88940219VN';
    }
    if (paymentStatusEl) {
      paymentStatusEl.style.color = '#00e676';
      paymentStatusEl.textContent = 'Đã thanh toán (Momo / ZaloPay)';
    }
    if (trackingTitleEl) trackingTitleEl.textContent = '🗺️ Lịch trình vận chuyển chi tiết';

    trackingLogs = [
      { time: '11:20 - 29/10/2026', desc: 'Giao hàng thành công. Người nhận: Customer', loc: 'Quận 1, TP.HCM' },
      { time: '08:00 - 29/10/2026', desc: 'Shipper đang giao hàng đến bạn', loc: 'Tài xế Nguyễn Văn B (0912.345.678)' },
      { time: '14:30 - 28/10/2026', desc: 'Bưu cục đã tiếp nhận gói hàng', loc: 'Trung tâm khai thác K-Express (Quận 7, TP.HCM)' },
      { time: '09:15 - 28/10/2026', desc: 'Đơn hàng đã thông quan nhập khẩu thành công', loc: 'Sân bay Quốc tế Tân Sơn Nhất' },
      { time: '21:00 - 27/10/2026', desc: 'Đơn hàng đã rời kho quốc tế', loc: 'Kho Incheon (Hàn Quốc)' },
      { time: '10:00 - 27/10/2026', desc: 'Người gửi đang chuẩn bị hàng', loc: 'Seoul, Hàn Quốc' }
    ];
  }

  // 3. Hiển thị Lịch trình chi tiết
  if (trackingListEl) {
    trackingListEl.innerHTML = trackingLogs.map(function(log, index) {
      return '<li class="tracking-item ' + (index === 0 ? 'latest' : '') + '">' +
        '<span class="t-time">' + log.time + '</span>' +
        '<span class="t-desc">' + log.desc + '</span>' +
        '<span class="t-loc">📍 ' + log.loc + '</span>' +
      '</li>';
    }).join('');
  }

  // 4. Danh sách sản phẩm trong Modal
  $('modalProductList').innerHTML = order.items.map(function(i) {
    var imgTag = i.img ? '<img src="' + i.img + '" alt="' + esc(i.n) + '" style="width:48px;height:48px;object-fit:cover;border-radius:6px;margin-right:12px;">' : '';
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">' +
      '<div style="display:flex;align-items:center;">' + imgTag + '<div><strong style="color:#fff;font-size:0.85rem;">' + esc(i.n) + '</strong><br><small style="color:#888;">Số lượng: ' + i.q + '</small></div></div>' +
      '<span style="color:var(--pink);font-weight:600;font-size:0.85rem;">' + fmtVnd(i.p * i.q) + '</span>' +
    '</div>';
  }).join('');

  // 5. Hiển thị Overlay Modal
  $('orderModalOverlay').classList.add('show');
}

function closeOrderModal() {
  $('orderModalOverlay').classList.remove('show');
}

/* ===== XỬ LÝ FULL-WIDTH HERO SLIDER TRÀN VIỀN (5 SLIDE) ===== */
var currentFullIndex = 0;
var totalFullSlides = 5;
var fullTimer = null;

function updateFullSlider() {
  var track = $('fullHeroTrack');
  if (!track) return;
  var slides = track.querySelectorAll('.full-hero-slide');
  if (slides.length) totalFullSlides = slides.length;
  track.style.transform = 'translateX(-' + (currentFullIndex * (100 / totalFullSlides)) + '%)';
  
  var dots = document.querySelectorAll('#fullHeroDots .dot');
  dots.forEach(function(dot, idx) {
    dot.classList.toggle('active', idx === currentFullIndex);
  });
}

function moveFullSlide(direction) {
  currentFullIndex = (currentFullIndex + direction + totalFullSlides) % totalFullSlides;
  updateFullSlider();
  resetFullTimer();
}

function goFullSlide(index) {
  currentFullIndex = index;
  updateFullSlider();
  resetFullTimer();
}

function startFullTimer() {
  stopFullTimer();
  fullTimer = setInterval(function() {
    moveFullSlide(1);
  }, 4500); // 4.5 giây đổi hình 1 lần
}

function stopFullTimer() {
  if (fullTimer) clearInterval(fullTimer);
}

function resetFullTimer() {
  startFullTimer();
}

document.addEventListener('DOMContentLoaded', function() {
  updateHeaderUserStatus();
  var sliderBox = $('fullHeroSlider');
  if (sliderBox) {
    sliderBox.addEventListener('mouseenter', stopFullTimer);
    sliderBox.addEventListener('mouseleave', startFullTimer);
    startFullTimer();
  }
});
