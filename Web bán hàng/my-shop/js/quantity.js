/* quantity.js  (N2) - Trang chi tiết sản phẩm
   Việc cần làm:
   1. Nút "+": lấy số trong ô số lượng, cộng 1, ghi lại.
   2. Nút "-": trừ 1 NHƯNG không để nhỏ hơn 1.
   3. Nút Ver 1 / Ver 2: khi bấm, xóa class 'active' ở tất cả nút, gắn 'active' cho nút vừa bấm.
   Gợi ý:  btn.addEventListener('click', function () { ... });
*/
document.addEventListener("DOMContentLoaded", () => {
  const btnMinus = document.getElementById("btn-minus");
  const btnPlus = document.getElementById("btn-plus");
  const quantityInput = document.getElementById("quantity-input");

  if (btnMinus && btnPlus && quantityInput) {
    btnMinus.addEventListener("click", () => {
      let currentVal = parseInt(quantityInput.value) || 1;
      if (currentVal > 1) {
        quantityInput.value = currentVal - 1;
      }
    });

    btnPlus.addEventListener("click", () => {
      let currentVal = parseInt(quantityInput.value) || 1;
      quantityInput.value = currentVal + 1;
    });
  }
});

<div class="option-group">
  <label>Phân loại</label>
  <div class="version-options">
    <button type="button" class="version-btn active" data-version="cd">CD BOX SET</button>
    <button type="button" class="version-btn" data-version="vinyl">VINYL</button>
  </div>
</div>