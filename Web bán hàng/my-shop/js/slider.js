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
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("hero-slider");
  if (!slider) return;

  const slides = slider.querySelectorAll(".slider-img");
  const dots = document.querySelectorAll(".slider-dots .dot");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  
  if (slides.length === 0) return;

  let currentIndex = 0;
  let slideInterval;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active");
      slide.style.display = "none"; // Ẩn tất cả ảnh
      if (dots[i]) dots[i].classList.remove("active");
    });

    slides[index].classList.add("active");
    slides[index].style.display = "block";
    if (dots[index]) dots[index].classList.add("active");
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  }

  function startSlider() {
    slideInterval = setInterval(nextSlide, 3000);
  }

  function stopSlider() {
    clearInterval(slideInterval);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      stopSlider();
      startSlider();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      stopSlider();
      startSlider();
    });
  }

  showSlide(currentIndex);
  startSlider();
});