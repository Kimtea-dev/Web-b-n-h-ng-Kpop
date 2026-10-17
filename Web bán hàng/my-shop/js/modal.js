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
