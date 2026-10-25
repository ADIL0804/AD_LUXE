(() => {
  "use strict";


  function hideEmptyCategories() {
    const available = new Set(
      [...document.querySelectorAll(".product-card[data-category]")]
        .map((card) => card.dataset.category)
        .filter(Boolean)
    );

    document.querySelectorAll(".adluxe-filter[data-filter]").forEach((control) => {
      const category = control.dataset.filter;
      if (!category || category === "all") return;
      const hasProducts = category === "vetements" ? available.size > 0 : available.has(category);
      control.hidden = !hasProducts;
      control.setAttribute("aria-hidden", String(!hasProducts));
    });

    document.querySelectorAll("[data-menu-filter]").forEach((control) => {
      const category = control.dataset.menuFilter;
      if (!category || category === "all") return;
      const hasProducts = category === "vetements" ? available.size > 0 : available.has(category);
      control.hidden = !hasProducts;
      control.setAttribute("aria-hidden", String(!hasProducts));
    });
  }

  function init() {
    hideEmptyCategories();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

