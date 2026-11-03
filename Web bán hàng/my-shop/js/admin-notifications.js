document.addEventListener('DOMContentLoaded', function () {
  var toast = document.createElement('div');
  toast.className = 'admin-demo-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.setAttribute('aria-atomic', 'true');
  document.body.appendChild(toast);

  var toastTimer;

  function showActionNotice(action) {
    toast.textContent = action + ' thành công';
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove('show');
    }, 3500);
  }

  function showNotice(message) {
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove('show');
    }, 3500);
  }

  document.addEventListener('click', function (event) {
    var target = event.target;
    if (!(target instanceof Element)) return;

    var notificationControl = target.closest('[data-notification]');
    if (notificationControl) {
      showNotice(notificationControl.dataset.notification);
      return;
    }

    var control = target.closest('.admin-main button, .admin-main input[type="button"], .admin-main input[type="submit"], .modal button');
    if (
      !control ||
      control.matches('[data-open], [data-close], [onclick*="window.location"], :disabled') ||
      control.closest('.pagination')
    ) return;

    var form = control.closest('form');
    if (form && !form.reportValidity()) return;

    var action = (control.innerText || control.value || '').replace(/\s+/g, ' ').trim();
    if (!action) return;

    showActionNotice(action);
  });
});
