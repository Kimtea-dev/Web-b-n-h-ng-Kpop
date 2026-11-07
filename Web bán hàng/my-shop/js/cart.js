function demoNotice() {
  alert("Tính năng demo giao diện!");
}

function selectAddressMode(mode) {
  var d = document.getElementById('label-addr-default');
  var n = document.getElementById('label-addr-new');
  var input = document.getElementById('checkout-custom-address');
  if (mode === 'default') {
    document.getElementById('addr-type-default').checked = true;
    d.classList.add('selected'); n.classList.remove('selected');
    input.style.display = 'none';
  } else {
    document.getElementById('addr-type-new').checked = true;
    n.classList.add('selected'); d.classList.remove('selected');
    input.style.display = 'block';
    input.focus();
  }
}

function selectPaymentMethod(method) {
  var c = document.getElementById('label-pay-cod');
  var o = document.getElementById('label-pay-online');
  if (method === 'cod') {
    document.getElementById('pay-cod').checked = true;
    c.classList.add('selected'); o.classList.remove('selected');
  } else {
    document.getElementById('pay-online').checked = true;
    o.classList.add('selected'); c.classList.remove('selected');
  }
}

function openOrderModal() {
  var useNew = document.getElementById('addr-type-new').checked;
  var custom = document.getElementById('checkout-custom-address').value.trim();
  var addr = (useNew && custom) ? custom : document.getElementById('checkout-default-address').textContent.trim();
  document.getElementById('inv-order-address').textContent = addr;
  document.getElementById('inv-order-payment').textContent =
    document.getElementById('pay-online').checked ? 'Trực tuyến (Mã QR / Ví)' : 'Tiền mặt (COD)';
  sessionStorage.setItem('kpop_is_logged_in', 'true');
  updateHeaderUserStatus();
  document.getElementById('order-success-modal').style.display = 'flex';
}

/* ================= ĐỒNG BỘ TRẠNG THÁI USER HEADER TẠI CART ================= */
function updateHeaderUserStatus() {
  var isLogged = sessionStorage.getItem('kpop_is_logged_in') === 'true';
  var userWrapper = document.getElementById('userMenuWrapper') || document.querySelector('.user-menu-wrapper');
  var nameEl = document.getElementById('headerPopupName');
  var emailEl = document.getElementById('headerPopupEmail');

  if (userWrapper) {
    if (isLogged) {
      userWrapper.classList.add('logged-in');
      var savedName = sessionStorage.getItem('kpop_user_name') || 'Customer';
      var savedEmail = sessionStorage.getItem('kpop_user_email') || 'customer@example.com';
      if (nameEl) nameEl.textContent = savedName;
      if (emailEl) emailEl.textContent = savedEmail;
    } else {
      userWrapper.classList.remove('logged-in');
    }
  }
}

function handleLogout() {
  sessionStorage.removeItem('kpop_is_logged_in');
  sessionStorage.removeItem('kpop_user_name');
  sessionStorage.removeItem('kpop_user_email');
  updateHeaderUserStatus();
  alert('Đã đăng xuất tài khoản thành công!');
  window.location.reload();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateHeaderUserStatus);
} else {
  updateHeaderUserStatus();
}
