/* slider.js  (N2) - Banner chạy hình ở trang chủ
   Việc cần làm (làm theo thứ tự):
   1. Lấy các phần tử:  const slides = document.querySelectorAll('.slide');
                         const dots   = document.querySelectorAll('.dot');
                         const prev = document.querySelector('.prev'); const next = document.querySelector('.next');
   2. Tạo biến  let current = 0;
   3. Viết hàm showSlide(index): ẩn mọi slide, chỉ hiện slide thứ index; đổi class 'active' của dot.
   4. Bấm next:  current = (current + 1) % slides.length;  showSlide(current);
   5. Bấm prev:  current = (current - 1 + slides.length) % slides.length;  showSlide(current);
   6. Bấm dot:   showSlide(vị trí dot)
*/
