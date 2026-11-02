document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll("[data-thousand-separator]");

  inputs.forEach((input) => {
    const formatValue = (preserveCaret) => {
      const cursor = preserveCaret ? input.selectionStart : null;
      const digitsBeforeCursor = cursor === null
        ? 0
        : input.value.slice(0, cursor).replace(/\D/g, "").length;
      const digits = input.value.replace(/\D/g, "");
      const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

      input.value = formatted;

      if (preserveCaret && cursor !== null) {
        let digitsSeen = 0;
        let newCursor = 0;

        while (newCursor < formatted.length && digitsSeen < digitsBeforeCursor) {
          if (/\d/.test(formatted[newCursor])) {
            digitsSeen += 1;
          }
          newCursor += 1;
        }

        input.setSelectionRange(newCursor, newCursor);
      }
    };

    formatValue(false);
    input.addEventListener("input", () => formatValue(true));
  });
});
