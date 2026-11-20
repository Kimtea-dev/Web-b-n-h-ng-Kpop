/* home.js - dùng chung cho các trang khách hàng:
   - index.html: hero slider, slider nhóm nhạc, 2 carousel sản phẩm
   - login.html: đăng nhập / đăng ký + dashboard tài khoản (dữ liệu MẪU trong S)
   - mọi trang: icon user trên header + nút "Thêm vào giỏ"
   Muốn dùng dữ liệu thật: thay LISTS (sản phẩm) và S (tài khoản) bằng dữ liệu từ server. */

/* ================= TIỆN ÍCH ================= */
const $ = id => document.getElementById(id);
const val = id => ($(id) || {}).value || '';
const set = (id, text) => { const el = $(id); if (el) el.textContent = text; };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtVnd = n => n.toLocaleString('vi-VN') + 'đ';
const fmtPhone = d => { d = String(d).replace(/\D/g, ''); return d.length === 10 ? d.slice(0, 4) + ' ' + d.slice(4, 7) + ' ' + d.slice(7) : d; };
const img = (src, alt, style) => src ? `<img src="${src}" alt="${esc(alt)}" style="${style}">` : '';
const isLogged = () => sessionStorage.getItem('kpop_is_logged_in') === 'true';
const DEMO_TAG = ' (demo)';   /* đặt thành '' nếu không muốn hiện chữ (demo) trong thông báo */

function setMsg(id, text, ok) {
  const el = $(id);
  if (!el) return;
  el.textContent = text || '';
  el.className = 'form-msg' + (text ? (ok ? ' ok' : ' err') : '');
}
let toastTimer;
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}
const demoMsg = m => toast(m + DEMO_TAG + '.');
/* Báo kết quả của form demo: có lỗi thì hiện lỗi, không thì xóa ô nhập và báo thành công */
function formResult(msgId, err, okText, clearIds) {
  if (!err) (clearIds || []).forEach(i => { $(i).value = ''; });
  setMsg(msgId, err || okText + DEMO_TAG + '.', !err);
}

/* Tự chạy theo chu kỳ ms, tạm dừng khi rê chuột / focus bên trong box. Trả về hàm để chạy lại chu kỳ. */
function autoplay(box, tick, ms) {
  let timer, paused = false;
  const start = () => { clearInterval(timer); if (ms) timer = setInterval(() => { if (!paused) tick(); }, ms); };
  ['mouseenter', 'focusin'].forEach(ev => box.addEventListener(ev, () => { paused = true; }));
  ['mouseleave', 'focusout'].forEach(ev => box.addEventListener(ev, () => { paused = false; }));
  start();
  return start;
}

/* ================= SẢN PHẨM + CAROUSEL (trang chủ) ================= */
const LISTS = {
  featured: [
    { id: 1, name: "Lightstick CORTIS", price: 1200000, image: "image/lightstickcortis.jpg" },
    { id: 2, name: "Box merch ARIRANG BTS", price: 5500000, image: "image/btsmerchbox.jpg" },
    { id: 3, name: "Mũ lưỡi trai thêu logo BIGBANG", price: 900000, image: "image/bigbanghat.jpg" },
    { id: 4, name: "Hộp album JISOO", price: 1500000, image: "image/jisooalbumbox.jpg" },
    { id: 5, name: "Album Color outside the line CORTIS", price: 730000, image: "image/cortisalbum.jpg" },
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
const card = p => `
  <article class="p-card">
    <a href="product-detail.html" style="display:block">
      <div class="media"><img src="${p.image}" alt="${p.name}"></div>
    </a>
    <h3><a href="product-detail.html">${p.name}</a></h3>
    <p class="price">${fmtVnd(p.price)}</p>
    <button class="add" data-id="${p.id}">+ Thêm vào giỏ</button>
  </article>`;

/* Mỗi khối .carousel[data-list]: tự chạy, mũi tên bấm được, hết thì quay về đầu */
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('.carousel').forEach(box => {
  const track = box.querySelector('.track');
  track.innerHTML = LISTS[box.dataset.list].map(card).join('');
  function slide(dir) {
    const step = (track.querySelector('.p-card')?.offsetWidth || 260) + 24;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    if (dir > 0 && atEnd) track.scrollTo({ left: 0, behavior: 'smooth' });
    else if (dir < 0 && track.scrollLeft <= 4) track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
    else track.scrollBy({ left: dir * step, behavior: 'smooth' });
  }
  const restart = autoplay(box, () => slide(1), reduceMotion ? 0 : Number(box.dataset.interval) || 3000);
  box.querySelector('.prev').onclick = () => { slide(-1); restart(); };
  box.querySelector('.next').onclick = () => { slide(1); restart(); };
});

/* Nút "Thêm vào giỏ" (số trên icon giỏ hàng giữ nguyên số ghi cứng trong HTML) */
document.addEventListener('click', e => {
  const b = e.target.closest('.add');
  if (!b) return;
  b.textContent = 'Đã thêm ✓';
  setTimeout(() => { b.textContent = '+ Thêm vào giỏ'; }, 1200);
});

/* ================= SLIDER NHÓM NHẠC (accordion + đổi ảnh + đổi màu nền) ================= */
const groupBox = $('groupSlider');
if (groupBox) {
  const items = groupBox.querySelectorAll('.accordion-item');
  const imgs = groupBox.querySelectorAll('.image-preview-container img');
  const section = $('group-carousel-wrapper');
  let cur = 0;
  const show = i => {
    cur = i;
    items.forEach((el, k) => el.classList.toggle('active', k === i));
    imgs.forEach((im, k) => {
      im.classList.toggle('active', k === i);
      if (k === i && im.dataset.bg && section) section.style.background = im.dataset.bg;
    });
  };
  const restart = autoplay(groupBox, () => show((cur + 1) % items.length), 4000);
  items.forEach((el, k) => { el.style.cursor = 'pointer'; el.onclick = () => { show(k); restart(); }; });
  show(0);
}

/* ================= HERO SLIDER TRÀN VIỀN (onclick trong index.html gọi 2 hàm này) ================= */
let heroIndex = 0, heroRestart = () => {};
function goFullSlide(i) {
  const track = $('fullHeroTrack');
  if (!track) return;
  const n = track.querySelectorAll('.full-hero-slide').length || 5;
  heroIndex = (i + n) % n;
  track.style.transform = 'translateX(-' + (heroIndex * 100 / n) + '%)';
  document.querySelectorAll('#fullHeroDots .dot').forEach((d, k) => d.classList.toggle('active', k === heroIndex));
  heroRestart();
}
function moveFullSlide(dir) { goFullSlide(heroIndex + dir); }
if ($('fullHeroSlider')) heroRestart = autoplay($('fullHeroSlider'), () => moveFullSlide(1), 4500);

/* ================= DỮ LIỆU DEMO TÀI KHOẢN (thay bằng dữ liệu từ server khi có) ================= */
const S = {
  user: { name: 'Customer', email: 'customer@example.com', phone: '0909456321', dob: '', gender: '' },
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
const STATUS = {
  pending:   ['Chờ xác nhận', 'status-pending'],
  shipping:  ['Đang giao',    'status-shipping'],
  done:      ['Đã giao',      'status-done'],
  cancelled: ['Đã hủy',       'status-cancelled']
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/* #hash trên login.html -> tab tương ứng (địa chỉ và bảo mật nằm trong tab-profile) */
const TAB_HASH = { dashboard: 'tab-overview', profile: 'tab-profile', address: 'tab-profile', security: 'tab-profile', orders: 'tab-orders', wishlist: 'tab-wishlist', vouchers: 'tab-vouchers' };
let orderFilter = 'all', editingAddr = null;

/* ================= HEADER: ICON USER + POPUP ================= */
function updateHeaderUserStatus() {
  const wrapper = $('userMenuWrapper') || document.querySelector('.user-menu-wrapper');
  if (!wrapper) return;
  wrapper.classList.toggle('logged-in', isLogged());
  if (!isLogged()) return;
  set('headerPopupName', sessionStorage.getItem('kpop_user_name') || S.user.name);
  set('headerPopupEmail', sessionStorage.getItem('kpop_user_email') || S.user.email);
}

/* ================= ĐĂNG NHẬP / ĐĂNG KÝ / ĐĂNG XUẤT ================= */
function showDashboard() {
  $('view-auth-container').style.display = 'none';
  $('view-dashboard').style.display = 'block';
  applyAll();
  switchTab(TAB_HASH[location.hash.slice(1)] || 'tab-overview');
}

function enterDashboard() {
  sessionStorage.setItem('kpop_is_logged_in', 'true');
  sessionStorage.setItem('kpop_user_name', S.user.name);
  sessionStorage.setItem('kpop_user_email', S.user.email);
  /* Đang đặt hàng dở ở giỏ hàng (cart.js lưu kpop_return_to) -> đăng nhập xong quay lại đó */
  const back = sessionStorage.getItem('kpop_return_to');
  if (back) { sessionStorage.removeItem('kpop_return_to'); location.href = back; return; }
  showDashboard();
  updateHeaderUserStatus();
  scrollTo({ top: 0, behavior: 'smooth' });
}

/* Bản demo tĩnh: không bắt buộc ô nào, ô nào có dữ liệu thì dùng */
function handleLogin(e) {
  e.preventDefault();
  if (val('login-email').trim()) S.user.email = val('login-email').trim();
  enterDashboard();
}

function handleRegister(e) {
  e.preventDefault();
  const u = S.user, phone = val('reg-phone').replace(/\D/g, ''), addr = val('reg-address').trim();
  if (val('reg-name').trim()) u.name = val('reg-name').trim();
  if (phone) u.phone = phone;
  if (val('reg-email').trim()) u.email = val('reg-email').trim();
  if (val('reg-dob')) u.dob = val('reg-dob');
  if (addr) {
    S.addresses.forEach(a => { a.def = false; });
    S.addresses.unshift({ id: Date.now(), label: 'Nhà riêng', name: u.name, phone: fmtPhone(u.phone), text: addr, def: true });
  } else {
    S.addresses[0].name = u.name;
    S.addresses[0].phone = fmtPhone(u.phone);
  }
  enterDashboard();
}

function handleLogout() {
  ['kpop_is_logged_in', 'kpop_user_name', 'kpop_user_email'].forEach(k => sessionStorage.removeItem(k));
  updateHeaderUserStatus();
  if ($('view-auth-container')) {            /* đang ở login.html: về lại form đăng nhập */
    $('view-dashboard').style.display = 'none';
    $('view-auth-container').style.display = 'block';
    $('login-password').value = '';
    showLoginForm();
    scrollTo({ top: 0 });
  } else {                                    /* các trang khác: tải lại để cập nhật header */
    alert('Đã đăng xuất tài khoản thành công!');
    location.reload();
  }
}
const showForm = reg => { $('view-login').style.display = reg ? 'none' : 'block'; $('view-register').style.display = reg ? 'block' : 'none'; };
function showRegisterForm() { showForm(true); }
function showLoginForm() { showForm(false); }

/* ================= CHUYỂN TAB + THU GỌN THẺ ================= */
function switchTab(tabId) {
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.toggle('active', p.id === tabId));
  document.querySelectorAll('.sidebar-menu-item').forEach(i => i.classList.toggle('active', i.dataset.tab === tabId));
}
function goTab(tabId, anchorId) {
  switchTab(tabId);
  ((anchorId && $(anchorId)) || $('view-dashboard')).scrollIntoView({ behavior: 'smooth', block: 'start' });
}
document.addEventListener('click', e => {
  const head = e.target.closest('.ms-head');
  if (!head) return;
  const card = head.parentElement;
  card.classList.toggle('collapsed');
  head.setAttribute('aria-expanded', String(!card.classList.contains('collapsed')));
});

/* ================= HIỂN THỊ THÔNG TIN DASHBOARD ================= */
function applyAll() {
  const u = S.user, ph = fmtPhone(u.phone);
  Object.entries({
    'sb-name': u.name, 'sb-email': u.email, 'ov-email': u.email, 'pf-email': u.email, 'sec-email-now': u.email,
    'ov-phone': ph, 'pf-phone': ph, 'sec-phone-now': ph
  }).forEach(([id, text]) => { $(id).textContent = text; });
  $('inp-name').value = u.name;
  $('inp-gender').value = u.gender;
  $('inp-dob').value = u.dob;
  renderOrders(); renderRecent(); renderAddresses(); renderWishlist();
}

/* ================= THÔNG TIN CÁ NHÂN + BẢO MẬT (DEMO: không lưu thật, chỉ báo thành công) ================= */
function demoAvatar(act) { demoMsg(act === 'remove' ? 'Đã xóa ảnh đại diện thành công' : 'Đã cập nhật ảnh đại diện thành công'); }

function saveProfileInfo(e) {
  e.preventDefault();
  formResult('profile-msg', $('inp-name').value.trim() ? '' : 'Họ và tên không được để trống.', 'Đã lưu thông tin cá nhân thành công');
}
function changePassword(e) {
  e.preventDefault();
  const n = $('pw-new').value;
  const err = n.length < 6 ? 'Mật khẩu mới cần tối thiểu 6 ký tự.' : n !== $('pw-new2').value ? 'Hai mật khẩu mới chưa khớp nhau.' : '';
  formResult('pw-msg', err, 'Đã đổi mật khẩu thành công', ['pw-old', 'pw-new', 'pw-new2']);
}
function changeEmail(e) {
  e.preventDefault();
  const v = $('em-new').value.trim();
  const err = !EMAIL_RE.test(v) ? 'Email chưa đúng định dạng, ví dụ ten@example.com.'
    : v.toLowerCase() === S.user.email.toLowerCase() ? 'Email mới trùng với email hiện tại.' : '';
  formResult('em-msg', err, 'Đã cập nhật email đăng nhập thành công', ['em-new', 'em-pass']);
}
function changePhone(e) {
  e.preventDefault();
  const d = $('ph-new').value.replace(/\D/g, '');
  const err = !/^0\d{9}$/.test(d) ? 'Số điện thoại cần 10 số và bắt đầu bằng 0.'
    : d === S.user.phone ? 'Số điện thoại mới trùng với số hiện tại.' : '';
  formResult('ph-msg', err, 'Đã cập nhật số điện thoại thành công', ['ph-new', 'ph-pass']);
}

/* ================= ĐƠN HÀNG ================= */
const orderTotal = o => o.items.reduce((a, i) => a + i.p * i.q, 0) + o.ship;
const ORDER_ACT = { pending: ['cancel', 'Hủy đơn', ' danger'], done: ['rebuy', 'Mua lại', ''] };   /* nút kèm theo "Chi tiết đơn" */
function setOrderFilter(f) { orderFilter = f; renderOrders(); }

function orderHtml(o) {
  const [label, cls] = STATUS[o.status], a = ORDER_ACT[o.status];
  const items = o.items.map(i => `<div class="order-item"><div class="thumb">${img(i.img, i.n, 'width:100%;height:100%;object-fit:cover;border-radius:4px;')}</div><div><div class="oi-name">${esc(i.n)}</div><div class="oi-meta">Số lượng: ${i.q}</div></div><div class="oi-price">${fmtVnd(i.p * i.q)}</div></div>`).join('');
  const act = a ? `<button type="button" class="btn outline btn-sm${a[2]}" onclick="orderAction('${o.id}','${a[0]}')">${a[1]}</button>` : '';
  return `<div class="order-card"><div class="order-head"><strong>#${o.id}</strong><span class="badge-status ${cls}">${label}</span></div>${items}<div class="order-foot"><div>Tổng thanh toán: <strong style="color:var(--pink);">${fmtVnd(orderTotal(o))}</strong><span class="date">Đặt ngày ${o.date}</span></div><div class="order-actions"><a href="order-detail.html?id=${o.id}" class="btn outline btn-sm">Chi tiết đơn</a>${act}</div></div></div>`;
}

function renderOrders() {
  const tabs = [['all', 'Tất cả']].concat(Object.entries(STATUS).map(([k, v]) => [k, v[0]]));
  $('order-tabs').innerHTML = tabs.map(([k, label]) => {
    const n = k === 'all' ? S.orders.length : S.orders.filter(o => o.status === k).length;
    return `<button type="button" class="seg${orderFilter === k ? ' active' : ''}" onclick="setOrderFilter('${k}')">${label}<span>${n}</span></button>`;
  }).join('');
  const list = S.orders.filter(o => orderFilter === 'all' || o.status === orderFilter);
  $('order-list').innerHTML = list.length ? list.map(orderHtml).join('') : '<div class="empty">Chưa có đơn hàng nào ở trạng thái này.</div>';
}

function renderRecent() {
  $('recent-orders').innerHTML = S.orders.slice(0, 2).map(o => {
    const [label, cls] = STATUS[o.status];
    return `<a href="order-detail.html?id=${o.id}" class="recent" style="text-decoration:none; color:inherit; display:flex;"><div><strong>#${o.id}</strong><small>Đặt ngày ${o.date} • Bấm xem chi tiết</small></div><div class="recent-end"><span>${fmtVnd(orderTotal(o))}</span><span class="badge-status ${cls}">${label}</span></div></a>`;
  }).join('');
}

/* DEMO: hủy đơn / mua lại không đổi dữ liệu thật, chỉ báo thành công */
function orderAction(id, act) {
  if (act !== 'cancel') return demoMsg('Đã thêm sản phẩm vào giỏ hàng');
  if (confirm('Bạn chắc chắn muốn hủy đơn #' + id + '?')) demoMsg('Đã hủy đơn #' + id + ' thành công');
}

/* ================= SỔ ĐỊA CHỈ (DEMO: thêm / sửa / mặc định / xóa không đổi dữ liệu thật) ================= */
function renderAddresses() {
  $('addr-list').innerHTML = S.addresses.length ? S.addresses.map(a =>
    `<div class="addr-item"><div><div class="addr-top"><strong>${esc(a.label)}</strong>${a.def ? '<span class="tag">Mặc định</span>' : ''}</div><div class="addr-line">${esc(a.name)} • ${esc(a.phone)}</div><div class="addr-text">${esc(a.text)}</div></div><div class="addr-actions"><button type="button" class="btn outline btn-sm" onclick="editAddr(${a.id})">Chỉnh sửa</button>${a.def ? '' : `<button type="button" class="btn outline btn-sm" onclick="setDefaultAddr(${a.id})">Đặt làm mặc định</button>`}<button type="button" class="btn outline btn-sm danger" onclick="removeAddr(${a.id})">Xóa</button></div></div>`
  ).join('') : '<div class="empty">Bạn chưa lưu địa chỉ nào. Hãy thêm địa chỉ đầu tiên ở bên dưới.</div>';
}
const addrFormTexts = (title, sub, btn) => { set('addr-form-title', title); set('addr-form-sub', sub); set('addr-submit', btn); };

function resetAddrForm() {
  editingAddr = null;
  ['addr-text', 'addr-name', 'addr-phone'].forEach(i => { $(i).value = ''; });
  $('addr-default').checked = false;
  $('addr-label').selectedIndex = 0;
  addrFormTexts('Thêm địa chỉ mới', 'Nhà riêng, công ty, ký túc xá...', 'Thêm địa chỉ');
}
function editAddr(id) {
  const a = S.addresses.find(x => x.id === id);
  if (!a) return;
  editingAddr = id;
  $('addr-label').value = a.label; $('addr-name').value = a.name; $('addr-phone').value = a.phone; $('addr-text').value = a.text;
  $('addr-default').checked = a.def;
  addrFormTexts('Chỉnh sửa địa chỉ', 'Sửa thông tin rồi bấm "Lưu thay đổi"', 'Lưu thay đổi');
  setMsg('addr-msg', '');
  $('addr-form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function addAddress(e) {
  e.preventDefault();
  if (!$('addr-text').value.trim()) return setMsg('addr-msg', 'Bạn chưa nhập địa chỉ nhận hàng.', false);
  const msg = editingAddr ? 'Đã cập nhật địa chỉ thành công' : 'Đã thêm địa chỉ mới thành công';
  resetAddrForm();
  setMsg('addr-msg', msg + DEMO_TAG + '.', true);
}
function setDefaultAddr() { demoMsg('Đã đổi địa chỉ mặc định thành công'); }
function removeAddr() { if (confirm('Xóa địa chỉ này khỏi sổ địa chỉ?')) demoMsg('Đã xóa địa chỉ thành công'); }

/* ================= YÊU THÍCH + VOUCHER (chỉ báo thành công ảo) ================= */
function renderWishlist() {
  $('wish-list').innerHTML = S.wishlist.length ? '<div class="wish-grid">' + S.wishlist.map(w =>
    `<div class="wish"><div class="thumb-lg">${img(w.img, w.n, 'width:100%;height:100%;object-fit:cover;border-radius:6px;')}</div><b>${esc(w.n)}</b><span class="cost">${fmtVnd(w.p)}</span><div class="wish-actions"><button type="button" class="btn pink btn-sm" onclick="wishToCart(${w.id})">Thêm vào giỏ</button><button type="button" class="btn outline btn-sm" aria-label="Bỏ thích" onclick="removeWish(${w.id})">Bỏ thích</button></div></div>`
  ).join('') + '</div>' : '<div class="empty">Bạn chưa thả tim sản phẩm nào. <a href="products.html">Khám phá sản phẩm</a></div>';
}
function wishToCart() { demoMsg('Đã thêm vào giỏ hàng'); }
function removeWish() { demoMsg('Đã bỏ thích sản phẩm thành công'); }
function copyCode(code) { toast('Đã sao chép mã ' + code + '.'); }   /* không copy thật vào clipboard */

/* ================= MODAL CHI TIẾT ĐƠN HÀNG ================= */
/* Stepper: các bước trước `cur` là "completed", bước `cur` là "active"; marks = ký hiệu trong vòng tròn */
const STEP_NAMES = ['Đã đặt hàng', 'Đã xác nhận', 'Đang chuẩn bị', 'Đang vận chuyển', 'Đã nhận hàng'];
const stepper = (cur, marks, names = STEP_NAMES) => '<div class="stepper-wrapper">' + names.map((n, i) =>
  `<div class="stepper-item${i < cur ? ' completed' : i === cur ? ' active' : ''}"><div class="step-counter">${marks[i]}</div><div class="step-name">${n}</div></div>`).join('') + '</div>';

const CANCEL_STEPPER = '<div style="background: rgba(255, 77, 79, 0.1); border: 1px solid rgba(255, 77, 79, 0.3); border-radius: 8px; padding: 10px 14px; margin-bottom: 12px; color: #ff7875; display: flex; align-items: center; gap: 8px; font-size: 0.85rem;"><span style="font-size: 1.1rem; font-weight: bold;">✕</span><div><strong>Đơn hàng đã bị hủy.</strong> Quý khách không phải thanh toán tiền hàng.</div></div><div class="stepper-wrapper"><div class="stepper-item completed"><div class="step-counter">✓</div><div class="step-name">Đã đặt hàng</div></div><div class="stepper-item completed" style="filter: brightness(0.9);"><div class="step-counter">✓</div><div class="step-name">Yêu cầu hủy</div></div><div class="stepper-item active" style="--pink: #ff4d4f;"><div class="step-counter" style="background:#ff4d4f; border-color:#ff4d4f; color:#fff;">✕</div><div class="step-name" style="color:#ff4d4f; font-weight:600;">Đã hủy đơn</div></div></div>';

/* Nhật ký vận chuyển: [thời gian, nội dung, địa điểm], mới nhất ở đầu */
const SHIP_LOGS = [
  ['08:00 - 29/10/2026', 'Shipper đang giao hàng đến bạn', 'Tài xế Nguyễn Văn B (0912.345.678)'],
  ['14:30 - 28/10/2026', 'Bưu cục đã tiếp nhận gói hàng', 'Trung tâm khai thác K-Express (Quận 7, TP.HCM)'],
  ['09:15 - 28/10/2026', 'Đơn hàng đã thông quan nhập khẩu thành công', 'Sân bay Quốc tế Tân Sơn Nhất'],
  ['21:00 - 27/10/2026', 'Đơn hàng đã rời kho quốc tế', 'Kho Incheon (Hàn Quốc)'],
  ['10:00 - 27/10/2026', 'Người gửi đang chuẩn bị hàng', 'Seoul, Hàn Quốc']
];
const SHIPPED = { carrier: 'K-Express Standard (Chuyển phát nhanh)', code: 'KEX-88940219VN', codeColor: 'var(--pink)', pay: 'Đã thanh toán (Momo / ZaloPay)', payColor: '#00e676', title: '🗺️ Lịch trình vận chuyển chi tiết' };
const MODAL = {
  pending: {
    carrier: 'K-Express Standard (Chờ xác nhận đơn)', code: 'Đang cập nhật (Chờ tạo mã)', codeColor: '#888',
    pay: 'Tiền mặt (COD) - Thanh toán khi nhận hàng', payColor: '#ffb800', title: '🗺️ Lịch trình cập nhật đơn hàng',
    stepper: stepper(0, ['✓', 2, 3, 4, 5], ['Đã đặt hàng', 'Chờ xác nhận', 'Đang chuẩn bị', 'Đang vận chuyển', 'Đã nhận hàng']),
    logs: o => [['10:30 - ' + o.date, 'Đơn hàng đã được đặt thành công, đang chờ cửa hàng xác nhận và xử lý', 'Hệ thống K-Pop Store']]
  },
  cancelled: {
    carrier: 'Không áp dụng (Đơn đã hủy)', code: 'Không áp dụng', codeColor: '#888',
    pay: 'Tiền mặt (COD) - Đã hủy đơn (Không thu tiền)', payColor: '#ff4d4f', title: '🗺️ Lịch sử xử lý đơn hàng',
    stepper: CANCEL_STEPPER,
    logs: o => [
      ['16:00 - ' + o.date, 'Đơn hàng đã được hủy thành công trên hệ thống', 'Trung tâm hỗ trợ K-Pop Store'],
      ['14:20 - ' + o.date, 'Khách hàng gửi yêu cầu hủy đơn hàng', 'Trang cá nhân khách hàng'],
      ['09:00 - ' + o.date, 'Đơn hàng được khởi tạo thành công trên website', 'Hệ thống K-Pop Store']
    ]
  },
  shipping: { ...SHIPPED, stepper: stepper(3, ['✓', '✓', '✓', '🚚', '📦']), logs: () => SHIP_LOGS },
  done: {
    ...SHIPPED, stepper: stepper(4, ['✓', '✓', '✓', '🚚', '✓']),
    logs: () => [['11:20 - 29/10/2026', 'Giao hàng thành công. Người nhận: Customer', 'Quận 1, TP.HCM'], ...SHIP_LOGS]
  }
};

function openOrderModal(orderId) {
  const o = S.orders.find(x => x.id === orderId);
  if (!o) return;
  const m = MODAL[o.status] || MODAL.done;
  set('modalOrderId', 'Chi tiết đơn hàng #' + o.id);
  set('modalOrderDate', 'Đặt ngày ' + o.date);
  set('modalCustomerName', S.user.name || 'Customer');
  set('modalCustomerPhone', fmtPhone(S.user.phone));
  $('modalStepperContainer').innerHTML = m.stepper;
  set('modalCarrierName', m.carrier);
  set('modalTrackingCode', m.code);
  $('modalTrackingCode').style.color = m.codeColor;
  set('modalPaymentStatus', m.pay);
  $('modalPaymentStatus').style.color = m.payColor;
  set('modalTrackingTitle', m.title);
  $('modalTrackingList').innerHTML = m.logs(o).map(([time, desc, loc], i) =>
    `<li class="tracking-item ${i === 0 ? 'latest' : ''}"><span class="t-time">${time}</span><span class="t-desc">${desc}</span><span class="t-loc">📍 ${loc}</span></li>`).join('');
  $('modalProductList').innerHTML = o.items.map(i =>
    `<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);"><div style="display:flex;align-items:center;">${img(i.img, i.n, 'width:48px;height:48px;object-fit:cover;border-radius:6px;margin-right:12px;')}<div><strong style="color:#fff;font-size:0.85rem;">${esc(i.n)}</strong><br><small style="color:#888;">Số lượng: ${i.q}</small></div></div><span style="color:var(--pink);font-weight:600;font-size:0.85rem;">${fmtVnd(i.p * i.q)}</span></div>`).join('');
  $('orderModalOverlay').classList.add('show');
}
function closeOrderModal() { $('orderModalOverlay').classList.remove('show'); }

/* ================= KHỞI ĐỘNG ================= */
/* Vào login.html khi đã đăng nhập thì mở thẳng dashboard (theo #hash nếu có). Chưa đăng nhập thì luôn hiện form đăng nhập. */
if (isLogged() && $('view-dashboard')) showDashboard();
updateHeaderUserStatus();