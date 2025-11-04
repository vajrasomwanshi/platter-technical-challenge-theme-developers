document.addEventListener("DOMContentLoaded", () => {
  // Scrollbar functionality for desktop
  function initDesktopScrollbar() {
    const scrollContainer = document.querySelector(".best-seller-inner-wrapper");
    const scrollbar = document.querySelector(".scroll-bar");

    if (!scrollContainer || !scrollbar) return;

    // Prevent duplicate thumbs if function re-runs
    scrollbar.innerHTML = "";

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
  }

  function destroyScrollbar() {
    const scrollbar = document.querySelector(".scroll-bar");
    if (scrollbar) scrollbar.innerHTML = ""; // remove thumb
  }

  // Handle responsive check
  function handleResize() {
    if (window.innerWidth >= 768) {
      destroyScrollbar();
      initDesktopScrollbar();
    } else {
      destroyScrollbar();
    }
  }

  // Run on load
  handleResize();

  // Re-run on resize
  window.addEventListener("resize", handleResize);

  // End of desktop scrollbar functionality

  // Load more button functionality for mobile
  const showMoreBtn = document.querySelector(".show-more-btn");
  const bestSellerItems = document.querySelectorAll(".best-seller-item");
  const section = document.querySelector(".best-seller-section");

  function isMobile() {
    return window.innerWidth < 768; // Tailwind's md breakpoint
  }

  function hideItemsSmoothly() {
    bestSellerItems.forEach((item, index) => {
      if (index >= 4) {
        item.style.opacity = "0";
        item.style.transform = "translateY(10px)";
        setTimeout(() => {
          item.style.display = "none";
        }, 300);
      }
    });
  }

  function showItemsSmoothly() {
    bestSellerItems.forEach((item, index) => {
      if (index >= 4) {
        item.style.display = "block";
        setTimeout(() => {
          item.style.opacity = "1";
          item.style.transform = "translateY(0)";
        }, 60 * (index - 3)); // staggered animation
      }
    });

    // Smooth scroll to the newly revealed items
    setTimeout(() => {
      const lastItem = bestSellerItems[bestSellerItems.length - 1];
      if (lastItem) {
        lastItem.scrollIntoView({
          behavior: "smooth",
          block: "end"
        });
      }
    }, 400);
  }

  function showFirstFourInstant() {
    bestSellerItems.forEach((item, index) => {
      item.style.display = index < 4 ? "block" : "none";
      item.style.opacity = "1";
      item.style.transform = "translateY(0)";
    });
  }

  function showAllInstant() {
    bestSellerItems.forEach((item) => {
      item.style.display = "block";
      item.style.opacity = "1";
      item.style.transform = "translateY(0)";
    });
  }

  function setupShowMore() {
    if (isMobile()) {
      // Apply transition styling
      bestSellerItems.forEach((item) => {
        item.style.transition = "opacity 0.3s ease, transform 0.3s ease";
      });

      if (bestSellerItems.length > 4) {
        showMoreBtn.style.display = "block";
        showFirstFourInstant();
      } else {
        showMoreBtn.style.display = "none";
      }

      // Handle click toggle
      showMoreBtn.addEventListener("click", function () {
        const isExpanded = showMoreBtn.classList.toggle("expanded");

        if (isExpanded) {
          showItemsSmoothly();
          showMoreBtn.textContent = "Show Less";
        } else {
          hideItemsSmoothly();

          // Smoothly scroll back to top of section
          section.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

          showMoreBtn.textContent = "Show More";
        }
      });
    } else {
      // Desktop: always show all
      showAllInstant();
      showMoreBtn.style.display = "none";
    }
  }

  setupShowMore();

  // Re-run on resize (mobile ↔ desktop)
  window.addEventListener("resize", () => {
    showMoreBtn.classList.remove("expanded");
    showMoreBtn.textContent = "Show More";
    setupShowMore();
  });
  // END- Load more button functionality for mobile

});