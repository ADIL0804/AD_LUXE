(() => {
  "use strict";

  const PRODUCT = Object.freeze({
    name: "Ensemble Scarf",
    price: 180,
    image: "WhatsApp Image 2026-08-13 at 16.16.19.jpeg"
  });
  const ALLOWED_COLORS = new Set(["Marron", "Bleu", "Noir", "Rose"]);
  const WHATSAPP_BASE = "https://wa.me/212644162453?text=";
  let cart = [];

  function loadCart() {
    try {
      const parsed = JSON.parse(localStorage.getItem("adluxe_cart") || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((item) => item && item.name === PRODUCT.name && ALLOWED_COLORS.has(item.color))
        .map((item) => ({
          ...PRODUCT,
          color: item.color,
          qty: Math.min(99, Math.max(1, Number.parseInt(item.qty, 10) || 1))
        }));
    } catch {
      localStorage.removeItem("adluxe_cart");
      return [];
    }
  }

  function setWhatsappLink(element, message) {
    if (element) element.href = WHATSAPP_BASE + encodeURIComponent(message);
  }

  function createCartItem(item, index) {
    const row = document.createElement("div");
    row.className = "adluxe-cart-item";

    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.name;

    const details = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = item.name;
    const color = document.createElement("div");
    color.textContent = "Couleur : " + item.color;
    const price = document.createElement("div");
    price.textContent = item.price + " DH × " + item.qty;

    const quantity = document.createElement("div");
    quantity.className = "adluxe-cart-qty";
    const minus = document.createElement("button");
    minus.type = "button";
    minus.dataset.cartIndex = String(index);
    minus.dataset.cartDelta = "-1";
    minus.setAttribute("aria-label", "Diminuer la quantité");
    minus.textContent = "−";
    const amount = document.createElement("b");
    amount.textContent = String(item.qty);
    const plus = document.createElement("button");
    plus.type = "button";
    plus.dataset.cartIndex = String(index);
    plus.dataset.cartDelta = "1";
    plus.setAttribute("aria-label", "Augmenter la quantité");
    plus.textContent = "+";
    quantity.append(minus, document.createTextNode(" "), amount, document.createTextNode(" "), plus);

    details.append(name, color, price, quantity);
    row.append(image, details);
    return row;
  }

  function renderCart() {
    const count = cart.reduce((total, item) => total + item.qty, 0);
    const countElement = document.getElementById("adluxe-cart-count");
    if (countElement) countElement.textContent = String(count);

    const box = document.getElementById("adluxe-cart-items");
    const totalElement = document.getElementById("adluxe-cart-total");
    const whatsapp = document.getElementById("adluxe-cart-wa");
    if (!box || !totalElement) return;

    box.replaceChildren();
    if (!cart.length) {
      const empty = document.createElement("div");
      empty.className = "adluxe-cart-empty";
      empty.textContent = "Votre panier est vide.";
      box.append(empty);
      totalElement.textContent = "0 DH";
      setWhatsappLink(whatsapp, "Bonjour AD_LUXE, je souhaite avoir plus d'informations.");
      return;
    }

    cart.forEach((item, index) => box.append(createCartItem(item, index)));
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    totalElement.textContent = total + " DH";
    const message =
      "Bonjour AD_LUXE, je souhaite commander :\n" +
      cart.map((item) => item.name + " (" + item.color + ") x" + item.qty + " — " + (item.price * item.qty) + " DH").join("\n") +
      "\n\nTotal produits : " + total +
      " DH\nLivraison : Casablanca 20 DH / hors Casablanca 35 DH\nPaiement à la livraison.";
    setWhatsappLink(whatsapp, message);
  }

  function saveCart() {
    try {
      localStorage.setItem("adluxe_cart", JSON.stringify(cart));
    } catch {}
    renderCart();
  }

  window.ADLUXE_CART = {
    open() {
      const overlay = document.getElementById("adluxe-cart-overlay");
      if (!overlay) return;
      overlay.classList.add("open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("cart-open");
      document.querySelector(".adluxe-cart-trigger")?.setAttribute("aria-expanded", "true");
      renderCart();
      document.querySelector(".adluxe-cart-close")?.focus();
    },
    close() {
      const overlay = document.getElementById("adluxe-cart-overlay");
      if (!overlay) return;
      overlay.classList.remove("open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("cart-open");
      document.querySelector(".adluxe-cart-trigger")?.setAttribute("aria-expanded", "false");
    },
    add() {
      const selected = document.getElementById("selectedColor")?.textContent || "Marron";
      const color = ALLOWED_COLORS.has(selected) ? selected : "Marron";
      const found = cart.find((item) => item.name === PRODUCT.name && item.color === color);
      if (found) found.qty = Math.min(99, found.qty + 1);
      else cart.push({ ...PRODUCT, color, qty: 1 });
      saveCart();
      this.open();
    },
    change(index, delta) {
      if (!Number.isInteger(index) || ![-1, 1].includes(delta) || !cart[index]) return;
      cart[index].qty += delta;
      if (cart[index].qty <= 0) cart.splice(index, 1);
      saveCart();
    }
  };

  window.ADLUXE_MENU = {
    open() {
      window.ADLUXE_CART.close();
      const overlay = document.getElementById("adluxe-menu-overlay");
      overlay?.classList.add("open");
      overlay?.setAttribute("aria-hidden", "false");
      document.querySelector(".adluxe-menu-trigger")?.setAttribute("aria-expanded", "true");
      document.body.classList.add("adluxe-menu-open");
      window.setTimeout(() => document.querySelector(".adluxe-menu-close")?.focus(), 80);
    },
    close() {
      const overlay = document.getElementById("adluxe-menu-overlay");
      overlay?.classList.remove("open");
      overlay?.setAttribute("aria-hidden", "true");
      document.querySelector(".adluxe-menu-trigger")?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("adluxe-menu-open");
    },
    showCategory(filter) {
      const target =
        document.querySelector('.adluxe-filter[data-filter="' + filter + '"]') ||
        document.querySelector('.adluxe-filter[data-filter="all"]');
      target?.click();
      this.close();
      document.getElementById("produit")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  function initializeProductColors() {
    const thumbnails = [...document.querySelectorAll(".thumb")];
    const colorButtons = [...document.querySelectorAll(".color-btn")];
    const mainImage = document.getElementById("mainProductImage");
    const photoLabel = document.getElementById("photoLabel");
    const selectedColor = document.getElementById("selectedColor");
    const orderButton = document.getElementById("orderButton");
    const productImages = Object.fromEntries(
      thumbnails.map((button) => [button.dataset.color, button.dataset.image])
    );

    function selectColor(color) {
      const image = productImages[color];
      if (!image || !mainImage || !photoLabel || !selectedColor || !orderButton) return;

      mainImage.classList.add("is-switching");
      mainImage.src = image;
      mainImage.alt = "Ensemble Scarf " + color.toLowerCase();
      photoLabel.textContent = color;
      selectedColor.textContent = color;
      window.setTimeout(() => mainImage.classList.remove("is-switching"), 120);

      thumbnails.forEach((button) => {
        const active = button.dataset.color === color;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      colorButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.colorTarget === color);
      });

      setWhatsappLink(
        orderButton,
        "Bonjour AD_LUXE, je souhaite commander l'Ensemble Scarf à 180 DH. Couleur : " + color
      );
    }

    thumbnails.forEach((button) => button.addEventListener("click", () => selectColor(button.dataset.color)));
    colorButtons.forEach((button) => button.addEventListener("click", () => selectColor(button.dataset.colorTarget)));
  }

  function alFilter(category, btn) {
    document.querySelectorAll(".adluxe-filter").forEach((button) => {
      button.classList.remove("active");
      button.setAttribute("aria-pressed", "false");
    });

    if (btn) {
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
    }

    document.querySelectorAll(".product-card").forEach((card) => {
      card.hidden = !(category === "all" || card.dataset.category === category);
    });
  }

  function initializeFilters() {
    const input = document.getElementById("adluxe-search");
    const filters = [...document.querySelectorAll(".adluxe-filter")];
    const cards = [...document.querySelectorAll(".product-card")];
    const empty = document.getElementById("adluxe-empty-category");

    function apply() {
      const query = (input?.value || "").toLowerCase().trim();
      const filter = document.querySelector(".adluxe-filter.active")?.dataset.filter || "all";
      let visible = 0;
      cards.forEach((card) => {
        const matches =
          (!query || (card.dataset.name || "").toLowerCase().includes(query)) &&
          (filter === "all" || card.dataset.category === filter);
        card.hidden = !matches;
        if (matches) visible += 1;
      });
      if (empty) empty.hidden = visible !== 0;
    }

    input?.addEventListener("input", apply);
    filters.forEach((button) => {
      button.addEventListener("click", () => {
        alFilter(button.dataset.filter || "all", button);
        apply();
      });
    });
    apply();
  }

  function initializeControls() {
    document.querySelector(".adluxe-cart-trigger")?.addEventListener("click", () => window.ADLUXE_CART.open());
    document.querySelector(".adluxe-cart-close")?.addEventListener("click", () => window.ADLUXE_CART.close());
    document.querySelector(".adluxe-menu-trigger")?.addEventListener("click", () => window.ADLUXE_MENU.open());
    document.querySelector(".adluxe-menu-close")?.addEventListener("click", () => window.ADLUXE_MENU.close());

    const menuOverlay = document.getElementById("adluxe-menu-overlay");
    menuOverlay?.addEventListener("click", (event) => {
      if (event.target === menuOverlay) window.ADLUXE_MENU.close();
    });
    const cartOverlay = document.getElementById("adluxe-cart-overlay");
    cartOverlay?.addEventListener("click", (event) => {
      if (event.target === cartOverlay) window.ADLUXE_CART.close();
    });

    document.querySelectorAll("[data-menu-filter]").forEach((button) => {
      button.addEventListener("click", () => window.ADLUXE_MENU.showCategory(button.dataset.menuFilter || "all"));
    });
    document.querySelectorAll(".adluxe-menu-links a").forEach((link) => {
      link.addEventListener("click", () => window.ADLUXE_MENU.close());
    });

    document.getElementById("adluxe-cart-items")?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-cart-index][data-cart-delta]");
      if (!button) return;
      window.ADLUXE_CART.change(Number(button.dataset.cartIndex), Number(button.dataset.cartDelta));
    });

    const card = document.getElementById("adluxe-product");
    const orderButton = document.getElementById("orderButton");
    if (card && orderButton?.parentElement) {
      const addButton = document.createElement("button");
      addButton.type = "button";
      addButton.className = "btn btn-outline adluxe-add-cart";
      addButton.textContent = "🛒 Ajouter au panier";
      addButton.addEventListener("click", () => window.ADLUXE_CART.add());
      orderButton.parentElement.insertBefore(addButton, orderButton);
    }

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (document.getElementById("adluxe-cart-overlay")?.classList.contains("open")) window.ADLUXE_CART.close();
      if (document.getElementById("adluxe-menu-overlay")?.classList.contains("open")) window.ADLUXE_MENU.close();
    });
  }

  function init() {
    cart = loadCart();
    initializeProductColors();
    initializeFilters();
    initializeControls();
    renderCart();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
