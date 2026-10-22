/* modal.js  (N4) - Mở/đóng popup, dùng chung cho 3 trang admin
   QUY ƯỚC (cả nhóm biết):
     - Nút mở modal:  <button data-open="addProductModal">
     - Nút đóng:      <button data-close>
     - Modal:         <div class="modal" id="addProductModal">
   Việc cần làm:
   1. Với mỗi phần tử có [data-open]: khi click -> lấy id trong data-open -> thêm class 'show' cho modal có id đó.
   2. Với mỗi phần tử có [data-close]: khi click -> xóa class 'show' của modal chứa nó (dùng closest('.modal')).
   3. Khi click ra vùng nền mờ (chính là .modal, không phải .modal-box) -> cũng đóng.
*/

document.addEventListener('DOMContentLoaded', () => {
  const openButtons = document.querySelectorAll('[data-open]');
  const closeButtons = document.querySelectorAll('[data-close]');

  openButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const modalId = button.getAttribute('data-open');
      const modal = document.getElementById(modalId);

      if (modal) {
        modal.classList.add('show');
      }
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');

      if (modal) {
        modal.classList.remove('show');
      }
    });
  });

  document.querySelectorAll('.modal').forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.classList.remove('show');
      }
    });
  });
});
