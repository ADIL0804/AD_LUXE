(() => {
  "use strict";
  const WA = "https://wa.me/212644162453?text=";
  const KEY = "adluxe_cart";
  const REF_KEY = "adluxe_order_reference";
  const FOCUSABLE = 'a[href]:not([aria-disabled="true"]), button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let cart = [];
  let cartReturnFocus = null;
  let menuReturnFocus = null;
  const cards = () => [...document.querySelectorAll(".product-card[data-product-id]")];
  const product = (card) => ({ id: card.dataset.productId, name: card.dataset.name, price: Number(card.dataset.price), image: card.dataset.defaultImage });
  const selected = (card) => card.querySelector(".selected-color, #selectedColor")?.textContent || card.dataset.defaultColor;
  const setWA = (link, message) => { if (link) link.href = WA + encodeURIComponent(message); };

  function track(event, details = {}) {
    if (typeof window.gtag === "function") {
      window.gtag("event", event, details);
      return;
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...details });
  }

  function orderReference() {
    try {
      const saved = sessionStorage.getItem(REF_KEY);
      if (saved) return saved;
      const stamp = new Date().toISOString().slice(2, 10).replace(/-/g, "");
      const random = new Uint8Array(2);
      crypto.getRandomValues(random);
      const suffix = Array.from(random, (value) => value.toString(16).padStart(2, "0")).join("").toUpperCase();
      const reference = "ADL-" + stamp + "-" + suffix;
      sessionStorage.setItem(REF_KEY, reference);
      return reference;
    } catch {
      return "ADL-" + Date.now().toString(36).toUpperCase();
    }
  }

  const cityInputs = () => [document.getElementById("deliveryCity"), document.getElementById("cartDeliveryCity")].filter(Boolean);

  function delivery() {
    const city = (cityInputs().find((input) => input.value.trim())?.value || "").trim();
    if (!city) return null;
    const normalized = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
    const casa = new Set(["casablanca", "casa", "dar el beida", "dar al beida", "الدار البيضاء", "الدارالبيضاء", "كازا"]).has(normalized);
    return { city, price: casa ? 20 : 35, delay: casa ? "24h" : "48 à 72h" };
  }

  function showDelivery() {
    const value = delivery();
    [document.getElementById("deliveryPrice"), document.getElementById("cartDeliveryPrice")].forEach((price) => { if (price) price.textContent = value ? value.price + " DH" : "À calculer"; });
    [document.getElementById("deliveryDelay"), document.getElementById("cartDeliveryDelay")].forEach((delay) => { if (delay) delay.textContent = value ? value.delay : "—"; });
    [document.getElementById("deliveryCityHelp"), document.getElementById("cartDeliveryCityHelp")].forEach((help) => { if (help) help.textContent = value ? "Livraison calculée pour " + value.city + "." : "Écrivez votre ville pour calculer la livraison."; });
    if (value) cityInputs().forEach((input) => input.removeAttribute("aria-invalid"));
    return value;
  }

  function availability(link, ready) {
    if (!link) return;
    link.setAttribute("aria-disabled", String(!ready));
    link.classList.toggle("is-disabled", !ready);
  }

  function directMessage(card) {
    const item = product(card);
    const color = selected(card);
    const link = card.querySelector(".order-btn");
    const ship = showDelivery();
    availability(link, Boolean(ship));
    if (!ship) return setWA(link, "Bonjour AD_LUXE, je souhaite commander " + item.name + ". Ville : ");
    setWA(link, "Bonjour AD_LUXE, je souhaite confirmer cette commande :\n\nRÉCAPITULATIF\n" +
      "Référence : " + orderReference() + "\nProduit : " + item.name + "\nCouleur : " + color + "\nPrix : " + item.price + " DH\nVille : " + ship.city +
      "\nLivraison : " + ship.price + " DH\nTotal à payer : " + (item.price + ship.price) + " DH\nDélai estimé : " + ship.delay +
      "\nPaiement : à la réception\nÉchange : sous 48h\n\nNom : \nAdresse : \nTéléphone : ");
  }

  function loadCart() {
    try {
      const catalog = new Map(cards().map((card) => [card.dataset.productId, product(card)]));
      const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (!Array.isArray(saved)) return [];
      return saved.flatMap((item) => catalog.has(item?.id) && item.color ? [{ ...catalog.get(item.id), color: String(item.color), image: item.image || catalog.get(item.id).image, qty: Math.min(99, Math.max(1, parseInt(item.qty, 10) || 1)) }] : []);
    } catch { localStorage.removeItem(KEY); return []; }
  }

  function cartRow(item, index) {
    const row = document.createElement("div"); row.className = "adluxe-cart-item";
    const image = document.createElement("img"); image.src = item.image; image.alt = item.name + " — " + item.color;
    const info = document.createElement("div");
    const name = document.createElement("strong"); name.textContent = item.name;
    const color = document.createElement("div"); color.textContent = "Couleur : " + item.color;
    const price = document.createElement("div"); price.textContent = item.price + " DH × " + item.qty;
    const qty = document.createElement("div"); qty.className = "adluxe-cart-qty";
    const minus = document.createElement("button"); minus.type = "button"; minus.dataset.cartIndex = index; minus.dataset.cartDelta = -1; minus.ariaLabel = "Diminuer la quantité"; minus.textContent = "−";
    const number = document.createElement("b"); number.textContent = item.qty;
    const plus = document.createElement("button"); plus.type = "button"; plus.dataset.cartIndex = index; plus.dataset.cartDelta = 1; plus.ariaLabel = "Augmenter la quantité"; plus.textContent = "+";
    qty.append(minus, " ", number, " ", plus); info.append(name, color, price, qty); row.append(image, info); return row;
  }

  function renderCart() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const badge = document.getElementById("adluxe-cart-count"); if (badge) badge.textContent = count;
    const box = document.getElementById("adluxe-cart-items");
    const total = document.getElementById("adluxe-cart-total");
    const link = document.getElementById("adluxe-cart-wa");
    const referenceWrap = document.getElementById("adluxe-order-reference-wrap");
    const referenceText = document.getElementById("adluxe-order-reference");
    if (!box || !total) return;
    const ship = showDelivery(); box.replaceChildren();
    if (!cart.length) {
      const empty = document.createElement("div"); empty.className = "adluxe-cart-empty"; empty.textContent = "Votre panier est vide."; box.append(empty);
      total.textContent = "0 DH"; if (referenceWrap) referenceWrap.hidden = true; availability(link, false); return setWA(link, "Bonjour AD_LUXE, je souhaite avoir plus d'informations.\n\nNom : \nVille : ");
    }
    const reference = orderReference();
    if (referenceText) referenceText.textContent = reference;
    if (referenceWrap) referenceWrap.hidden = false;
    cart.forEach((item, index) => box.append(cartRow(item, index)));
    const productsTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    total.textContent = ship ? productsTotal + ship.price + " DH" : productsTotal + " DH + livraison";
    availability(link, Boolean(ship));
    if (!ship) return setWA(link, "Bonjour AD_LUXE, je souhaite commander ces articles. Ville : ");
    setWA(link, "Bonjour AD_LUXE, je souhaite confirmer cette commande :\n\nRÉCAPITULATIF\nRéférence : " + reference + "\n" + cart.map((item) => item.name + " — " + item.color + " × " + item.qty + " : " + item.price * item.qty + " DH").join("\n") +
      "\n\nTotal produits : " + productsTotal + " DH\nVille : " + ship.city + "\nLivraison : " + ship.price + " DH\nTotal à payer : " + (productsTotal + ship.price) + " DH\nDélai estimé : " + ship.delay + "\nPaiement : à la réception\nÉchange : sous 48h\n\nNom : \nAdresse : \nTéléphone : ");
  }

  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch {} renderCart(); }
  window.ADLUXE_CART = {
    open() { const overlay = document.getElementById("adluxe-cart-overlay"); if (!overlay) return; cartReturnFocus = document.activeElement; overlay.classList.add("open"); overlay.setAttribute("aria-hidden", "false"); document.body.classList.add("cart-open"); document.querySelector(".adluxe-cart-trigger")?.setAttribute("aria-expanded", "true"); renderCart(); document.querySelector(".adluxe-cart-close")?.focus(); },
    close() { const overlay = document.getElementById("adluxe-cart-overlay"); if (!overlay) return; const wasOpen = overlay.classList.contains("open"); overlay.classList.remove("open"); overlay.setAttribute("aria-hidden", "true"); document.body.classList.remove("cart-open"); document.querySelector(".adluxe-cart-trigger")?.setAttribute("aria-expanded", "false"); if (wasOpen && cartReturnFocus instanceof HTMLElement) cartReturnFocus.focus(); },
    add(card) { const item = product(card); const color = selected(card); const image = card.querySelector(".main-product-image, #mainProductImage")?.src || item.image; const found = cart.find((line) => line.id === item.id && line.color === color); if (found) found.qty = Math.min(99, found.qty + 1); else cart.push({ ...item, color, image, qty: 1 }); track("add_to_cart", { item_id: item.id, item_name: item.name, item_variant: color, price: item.price, currency: "MAD" }); save(); this.open(); },
    change(index, delta) { if (!cart[index] || ![-1, 1].includes(delta)) return; const item = cart[index]; item.qty += delta; track(delta > 0 ? "add_to_cart" : "remove_from_cart", { item_id: item.id, item_name: item.name, item_variant: item.color, price: item.price, currency: "MAD" }); if (item.qty <= 0) cart.splice(index, 1); save(); }
  };

  window.ADLUXE_MENU = {
    open() { window.ADLUXE_CART.close(); menuReturnFocus = document.activeElement; const overlay = document.getElementById("adluxe-menu-overlay"); overlay?.classList.add("open"); overlay?.setAttribute("aria-hidden", "false"); document.body.classList.add("adluxe-menu-open"); document.querySelector(".adluxe-menu-trigger")?.setAttribute("aria-expanded", "true"); document.querySelector(".adluxe-menu-close")?.focus(); },
    close() { const overlay = document.getElementById("adluxe-menu-overlay"); const wasOpen = overlay?.classList.contains("open"); overlay?.classList.remove("open"); overlay?.setAttribute("aria-hidden", "true"); document.body.classList.remove("adluxe-menu-open"); document.querySelector(".adluxe-menu-trigger")?.setAttribute("aria-expanded", "false"); if (wasOpen && menuReturnFocus instanceof HTMLElement) menuReturnFocus.focus(); },
    showCategory(filter) { (document.querySelector('.adluxe-filter[data-filter="' + filter + '"]') || document.querySelector('.adluxe-filter[data-filter="all"]'))?.click(); this.close(); document.getElementById("produit")?.scrollIntoView({ behavior: "smooth" }); }
  };

  function initProduct(card) {
    const thumbs = [...card.querySelectorAll(".thumb")]; const colors = [...card.querySelectorAll(".color-btn")];
    const main = card.querySelector(".main-product-image, #mainProductImage"); const label = card.querySelector(".photo-label"); const choice = card.querySelector(".selected-color, #selectedColor");
    const pick = (color, requested) => {
      const image = requested || thumbs.find((button) => button.dataset.color === color)?.dataset.image; if (!image || !main || !label || !choice) return;
      main.classList.add("is-switching"); main.src = image; main.alt = card.dataset.name + " — " + color; label.textContent = color; choice.textContent = color; setTimeout(() => main.classList.remove("is-switching"), 120);
      thumbs.forEach((button) => { const active = button.dataset.image === image; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); }); colors.forEach((button) => { const active = button.dataset.colorTarget === color; button.classList.toggle("is-active", active); button.setAttribute("aria-pressed", String(active)); }); directMessage(card);
    };
    thumbs.forEach((button) => button.addEventListener("click", () => { pick(button.dataset.color, button.dataset.image); track("select_item", { item_id: card.dataset.productId, item_name: card.dataset.name, item_variant: button.dataset.color }); })); colors.forEach((button) => button.addEventListener("click", () => { pick(button.dataset.colorTarget); track("select_item", { item_id: card.dataset.productId, item_name: card.dataset.name, item_variant: button.dataset.colorTarget }); }));
    card.querySelector(".adluxe-add-cart")?.addEventListener("click", () => window.ADLUXE_CART.add(card)); pick(card.dataset.defaultColor);
  }

  function initFilters() {
    const input = document.getElementById("adluxe-search"); const buttons = [...document.querySelectorAll(".adluxe-filter")]; const empty = document.getElementById("adluxe-empty-category");
    const apply = () => { const query = (input?.value || "").toLowerCase().trim(); const filter = document.querySelector(".adluxe-filter.active")?.dataset.filter || "all"; let visible = 0; cards().forEach((card) => { const match = (!query || card.dataset.name.toLowerCase().includes(query)) && (filter === "all" || card.dataset.category === filter); card.hidden = !match; if (match) visible++; }); if (empty) empty.hidden = visible > 0; };
    input?.addEventListener("input", apply); buttons.forEach((button) => button.addEventListener("click", () => { buttons.forEach((other) => { other.classList.remove("active"); other.setAttribute("aria-pressed", "false"); }); button.classList.add("active"); button.setAttribute("aria-pressed", "true"); track("select_category", { category: button.dataset.filter || "all" }); apply(); })); apply();
  }

  function trapFocus(event) {
    if (event.key !== "Tab") return;
    const overlay = document.querySelector(".adluxe-cart-overlay.open, .adluxe-menu-overlay.open");
    if (!overlay) return;
    const focusable = [...overlay.querySelectorAll(FOCUSABLE)].filter((element) => element.getClientRects().length);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || !overlay.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && (document.activeElement === last || !overlay.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
  }

  function initControls() {
    document.querySelector(".adluxe-cart-trigger")?.addEventListener("click", window.ADLUXE_CART.open); document.querySelector(".adluxe-cart-close")?.addEventListener("click", window.ADLUXE_CART.close); document.querySelector(".adluxe-menu-trigger")?.addEventListener("click", window.ADLUXE_MENU.open); document.querySelector(".adluxe-menu-close")?.addEventListener("click", window.ADLUXE_MENU.close);
    cityInputs().forEach((input) => input.addEventListener("input", () => { cityInputs().forEach((other) => { if (other !== input) other.value = input.value; }); cards().forEach(directMessage); renderCart(); }));
    document.querySelectorAll(".order-btn, #adluxe-cart-wa").forEach((link) => link.addEventListener("click", (event) => {
      if (link.getAttribute("aria-disabled") !== "true") {
        const card = link.closest(".product-card");
        track("begin_checkout", { checkout_type: card ? "direct" : "cart", order_reference: orderReference(), item_count: card ? 1 : cart.reduce((sum, item) => sum + item.qty, 0), currency: "MAD" });
        return;
      }
      event.preventDefault(); const card = link.closest(".product-card"); if (card) window.ADLUXE_CART.add(card); const city = document.getElementById("cartDeliveryCity"); city?.focus(); city?.setAttribute("aria-invalid", "true"); const help = document.getElementById("cartDeliveryCityHelp"); if (help) help.textContent = "Indiquez votre ville avant de confirmer la commande.";
    }));
    document.querySelectorAll('a[href*="wa.me"]:not(.order-btn):not(#adluxe-cart-wa)').forEach((link) => link.addEventListener("click", () => track("whatsapp_contact", { location: link.className || "content" })));
    document.querySelectorAll("[data-menu-filter]").forEach((button) => button.addEventListener("click", () => window.ADLUXE_MENU.showCategory(button.dataset.menuFilter || "all")));
    document.getElementById("adluxe-cart-items")?.addEventListener("click", (event) => { const button = event.target.closest("[data-cart-index]"); if (button) window.ADLUXE_CART.change(Number(button.dataset.cartIndex), Number(button.dataset.cartDelta)); });
    document.getElementById("adluxe-menu-overlay")?.addEventListener("click", (event) => { if (event.target.id === "adluxe-menu-overlay") window.ADLUXE_MENU.close(); }); document.getElementById("adluxe-cart-overlay")?.addEventListener("click", (event) => { if (event.target.id === "adluxe-cart-overlay") window.ADLUXE_CART.close(); });
    document.addEventListener("keydown", (event) => { trapFocus(event); if (event.key === "Escape") { window.ADLUXE_CART.close(); window.ADLUXE_MENU.close(); } });
  }
  function init() { cart = loadCart(); cards().forEach(initProduct); initFilters(); initControls(); renderCart(); }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", init, { once: true }) : init();
})();
