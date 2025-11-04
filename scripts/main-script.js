document.addEventListener("DOMContentLoaded", () => {
  const scrollContainer = document.querySelector(".best-seller-inner-wrapper");
  const scrollbar = document.querySelector(".scroll-bar");

  // Create custom thumb
  const thumb = document.createElement("div");
  thumb.classList.add("scroll-bar-thumb");
  scrollbar.appendChild(thumb);

  // Function to update thumb size & position
  const updateThumb = () => {
    const scrollWidth = scrollContainer.scrollWidth;
    const clientWidth = scrollContainer.clientWidth;
    const scrollLeft = scrollContainer.scrollLeft;

    const thumbWidth = (clientWidth / scrollWidth) * scrollbar.clientWidth;
    const thumbLeft = (scrollLeft / scrollWidth) * scrollbar.clientWidth;

    thumb.style.width = `${thumbWidth}px`;
    thumb.style.left = `${thumbLeft}px`;
  };

  // Update on scroll or resize
  scrollContainer.addEventListener("scroll", updateThumb);
  window.addEventListener("resize", updateThumb);

  // Smooth dragging
  let isDragging = false;
  let startX, startScrollLeft;

  thumb.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    startScrollLeft = scrollContainer.scrollLeft;
    document.body.style.userSelect = "none";
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const scrollRatio = scrollContainer.scrollWidth / scrollbar.clientWidth;
    scrollContainer.scrollTo({
      left: startScrollLeft + deltaX * scrollRatio,
      behavior: "smooth"
    });
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
    document.body.style.userSelect = "";
  });

  // Allow clicking on scrollbar track to scroll
  scrollbar.addEventListener("click", (e) => {
    if (e.target === thumb) return; // skip if clicking on thumb
    const rect = scrollbar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const scrollRatio = scrollContainer.scrollWidth / scrollbar.clientWidth;
    const newScrollLeft = clickX * scrollRatio - scrollContainer.clientWidth / 2;
    scrollContainer.scrollTo({
      left: newScrollLeft,
      behavior: "smooth"
    });
  });

  // Initialize position
  updateThumb();
});