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
  document.getElementById('order-success-modal').style.display = 'flex';
}
