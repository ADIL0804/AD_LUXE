(() => {
  "use strict";

  function fixProductLinks() {
    document.querySelectorAll('a[href="/products/ensemble-scarf-v2.html"], a[href$="/products/ensemble-scarf-v2.html"]').forEach((link) => {
      link.setAttribute("href", "/products/ensemble-scarf.html");
    });
  }

  function hideEmptyCategories() {
    const available = new Set(
      [...document.querySelectorAll(".product-card[data-category]")]
        .map((card) => card.dataset.category)
        .filter(Boolean)
    );

    document.querySelectorAll(".adluxe-filter[data-filter]").forEach((control) => {
      const category = control.dataset.filter;
      if (!category || category === "all") return;
      const hasProducts = available.has(category);
      control.hidden = !hasProducts;
      control.setAttribute("aria-hidden", String(!hasProducts));
    });

    document.querySelectorAll("[data-menu-filter]").forEach((control) => {
      const category = control.dataset.menuFilter;
      if (!category || category === "all") return;
      const hasProducts = available.has(category);
      control.hidden = !hasProducts;
      control.setAttribute("aria-hidden", String(!hasProducts));
    });
  }

  function init() {
    fixProductLinks();
    hideEmptyCategories();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
