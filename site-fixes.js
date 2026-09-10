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

  function fixProductCopy(root = document) {
    root.querySelectorAll?.(".adluxe-product-small").forEach((node) => {
      const text = node.textContent.trim();
      if (text.startsWith("Votre couleur seront ajoutées")) {
        node.textContent = "Votre couleur sera ajoutée automatiquement au panier et au message WhatsApp.";
      }
    });
  }

  function observeProductCopy() {
    fixProductCopy();
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;
          if (node.matches?.(".adluxe-product-small")) fixProductCopy(node.parentElement || document);
          else fixProductCopy(node);
        }
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  function init() {
    fixProductLinks();
    hideEmptyCategories();
    observeProductCopy();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
