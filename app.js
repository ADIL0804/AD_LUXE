(() => {
  "use strict";

  const WHATSAPP_BASE = "https://wa.me/212644162453?text=";
  const SCARF = Object.freeze({
    name: "Ensemble Scarf",
    price: 180,
    image: "WhatsApp Image 2026-08-13 at 16.16.19.jpeg"
  });
  const SCARF_COLORS = new Set(["Marron", "Bleu", "Noir", "Rose"]);
  let cart = [];

  function loadExtraStyles() {
    ["professional-upgrades.css", "jewelry.css", "reviews-fix.css?v=3"].forEach((href) => {
      if (document.querySelector('link[href="' + href + '"]')) return;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.append(link);
    });
  }

  function setWhatsappLink(el, message) {
    if (el) el.href = WHATSAPP_BASE + encodeURIComponent(message);
  }

  function addProductStructuredData() {
    if (document.getElementById("adluxe-product-schema")) return;
    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": "https://ad-luxe.ma/#ensemble-scarf",
      name: SCARF.name,
      description: "Ensemble féminin AD_LUXE disponible en marron, bleu, noir et rose, avec livraison partout au Maroc et paiement à la livraison.",
      image: [
        "https://ad-luxe.ma/WhatsApp%20Image%202026-08-13%20at%2016.16.19.jpeg",
        "https://ad-luxe.ma/WhatsApp%20Image%202026-08-13%20at%2016.16.20%20(1).jpeg",
        "https://ad-luxe.ma/WhatsApp%20Image%202026-08-13%20at%2016.16.20%20(2).jpeg",
        "https://ad-luxe.ma/WhatsApp%20Image%202026-08-13%20at%2016.16.20.jpeg"
      ],
      brand: { "@type": "Brand", name: "AD_LUXE" },
      offers: {
        "@type": "Offer",
        url: "https://ad-luxe.ma/#produit",
        priceCurrency: "MAD",
        price: String(SCARF.price),
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@type": "Organization", name: "AD_LUXE" }
      }
    };
    const script = document.createElement("script");
    script.id = "adluxe-product-schema";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.append(script);
  }

  function improveImagePerformance() {
    const hero = document.querySelector(".hero-image-wrap img");
    if (hero) {
      hero.decoding = "async";
      hero.fetchPriority = "high";
    }
    document.querySelectorAll(".thumb img").forEach((img) => {
      img.loading = "lazy";
      img.decoding = "async";
    });
  }

  function addJewelryProduct() {
    if (document.getElementById("adluxe-jewelry-product")) return;
    const scarf = document.getElementById("adluxe-product");
    const empty = document.getElementById("adluxe-empty-category");
    const parent = scarf?.parentElement || empty?.parentElement;
    if (!parent) return;

    const colors = ["Rouge", "Bleu", "Noir", "Blanc", "Rouge", "Rose", "Vert", "Marron", "Marron"];
    const photos = colors.map((color, index) => `
      <button class="jewelry-photo${index === 0 ? " is-active" : ""}" type="button"
        data-jewelry-color="${color}" aria-label="Voir le modèle ${color}" aria-pressed="${index === 0}">
        <span class="jewelry-sprite jewelry-pos-${index + 1}" aria-hidden="true"></span>
        <span class="jewelry-photo-label">${color}</span>
      </button>`).join("");

    const article = document.createElement("article");
    article.className = "product-card jewelry-product";
    article.id = "adluxe-jewelry-product";
    article.dataset.category = "bijoux";
    article.dataset.name = "Collier Bracelet Floral Acier Inoxydable";
    article.innerHTML = `
      <div class="jewelry-gallery">
        <div class="jewelry-grid" aria-label="9 photos du collier et bracelet floral">${photos}</div>
      </div>
      <div class="product-info jewelry-info">
        <span class="stock">En stock</span>
        <h3>Collier &amp; Bracelet Floral</h3>
        <span class="jewelry-material">Acier inoxydable</span>
        <p class="product-subtitle">Un ensemble élégant composé d’un collier avec pendentif floral et d’un bracelet assorti, sublimés par des détails dorés, des touches colorées et de délicats cristaux scintillants.</p>
        <ul class="jewelry-details">
          <li>Acier inoxydable résistant et durable</li>
          <li>Finition dorée élégante</li>
          <li>Motifs floraux raffinés</li>
          <li>Cristaux brillants</li>
          <li>Collier + bracelet assorti</li>
          <li>Plusieurs couleurs disponibles</li>
          <li>Idéal à offrir ou à se faire plaisir</li>
        </ul>
        <p class="jewelry-price-note">Prix sur demande</p>
        <p class="option-title">Modèle choisi : <span id="jewelrySelectedColor">Rouge</span></p>
        <a class="btn order-btn" id="jewelryOrderButton" href="#" target="_blank" rel="noopener">Commander sur WhatsApp</a>
        <p class="order-note">Confirmez la couleur et la disponibilité directement avec AD_LUXE.</p>
      </div>`;

    if (empty) parent.insertBefore(article, empty);
    else parent.append(article);
  }

  function initializeJewelryGallery() {
    const buttons = [...document.querySelectorAll(".jewelry-photo")];
    const selected = document.getElementById("jewelrySelectedColor");
    const order = document.getElementById("jewelryOrderButton");
    if (!buttons.length || !selected || !order) return;

    const choose = (button) => {
      const color = button.dataset.jewelryColor || "Modèle";
      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      selected.textContent = color;
      setWhatsappLink(order, "Bonjour AD_LUXE, je souhaite commander l'ensemble Collier & Bracelet Floral en acier inoxydable. Couleur : " + color + ". Pouvez-vous me confirmer le prix et la disponibilité ?");
    };

    buttons.forEach((button) => button.addEventListener("click", () => choose(button)));
    choose(buttons[0]);
  }

  function addReviewsSection() {
    document.getElementById("avis-clients")?.remove();
    const faq = document.getElementById("faq");
    if (!faq?.parentElement) return;

    const section = document.createElement("section");
    section.className = "adluxe-reviews";
    section.id = "avis-clients";
    section.setAttribute("aria-labelledby", "adluxe-reviews-title");
    section.innerHTML = `
      <div class="container adluxe-reviews-shell">
        <div class="adluxe-reviews-intro">
          <p class="eyebrow">Votre expérience compte</p>
          <h2 id="adluxe-reviews-title">Avis clients</h2>
          <p>Notez votre expérience directement ici. Aucun passage par WhatsApp n’est nécessaire.</p>
        </div>
        <div class="adluxe-review-box">
          <div class="adluxe-rating" id="adluxe-rating" aria-label="Choisir une note sur 5">
            ${[1,2,3,4,5].map((n) => `<button class="adluxe-star" type="button" data-rating="${n}" aria-label="${n} étoile${n > 1 ? "s" : ""}">★</button>`).join("")}
          </div>
          <form class="adluxe-review-form" id="adluxe-review-form">
            <input id="adluxe-review-name" type="text" maxlength="40" placeholder="Votre prénom" required>
            <textarea id="adluxe-review-text" maxlength="400" placeholder="Écrivez votre avis..." required></textarea>
            <button class="btn" type="submit">Publier mon avis</button>
            <p class="adluxe-review-status" id="adluxe-review-status" role="status"></p>
          </form>
          <div class="adluxe-review-list" id="adluxe-review-list"></div>
        </div>
      </div>`;
    faq.parentElement.insertBefore(section, faq);
  }

  function initializeReviews() {
    const stars = [...document.querySelectorAll(".adluxe-star")];
    const form = document.getElementById("adluxe-review-form");
    const nameInput = document.getElementById("adluxe-review-name");
    const textInput = document.getElementById("adluxe-review-text");
    const list = document.getElementById("adluxe-review-list");
    const status = document.getElementById("adluxe-review-status");
    if (!stars.length || !form || !nameInput || !textInput || !list || !status) return;

    let rating = 0;
    let reviews = [];
    try {
      const saved = JSON.parse(localStorage.getItem("adluxe_reviews") || "[]");
      if (Array.isArray(saved)) reviews = saved.slice(0, 20);
    } catch {}

    const paintStars = () => stars.forEach((star) => star.classList.toggle("is-active", Number(star.dataset.rating) <= rating));
    const render = () => {
      list.replaceChildren();
      reviews.forEach((review) => {
        const item = document.createElement("article");
        item.className = "adluxe-review-item";
        const head = document.createElement("div");
        head.className = "adluxe-review-item-head";
        const name = document.createElement("strong");
        name.textContent = review.name;
        const score = document.createElement("span");
        score.className = "adluxe-review-item-stars";
        score.textContent = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
        head.append(name, score);
        const text = document.createElement("p");
        text.textContent = review.text;
        const date = document.createElement("small");
        date.textContent = review.date;
        item.append(head, text, date);
        list.append(item);
      });
    };

    stars.forEach((star) => star.addEventListener("click", () => {
      rating = Number(star.dataset.rating) || 0;
      paintStars();
      status.textContent = rating + "/5 sélectionné";
    }));

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = nameInput.value.trim();
      const text = textInput.value.trim();
      if (!rating) {
        status.textContent = "Choisissez d’abord une note.";
        return;
      }
      if (!name || !text) {
        status.textContent = "Ajoutez votre prénom et votre avis.";
        return;
      }
      reviews.unshift({ name, text, rating, date: new Date().toLocaleDateString("fr-MA") });
      reviews = reviews.slice(0, 20);
      try { localStorage.setItem("adluxe_reviews", JSON.stringify(reviews)); } catch {}
      render();
      form.reset();
      rating = 0;
      paintStars();
      status.textContent = "Merci, votre avis a été ajouté sur cet appareil.";
    });

    render();
  }

  function loadCart() {
    try {
      const parsed = JSON.parse(localStorage.getItem("adluxe_cart") || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((item) => item && item.name === SCARF.name && SCARF_COLORS.has(item.color)).map((item) => ({
        ...SCARF,
        color: item.color,
        qty: Math.min(99, Math.max(1, Number.parseInt(item.qty, 10) || 1))
      }));
    } catch {
      return [];
    }
  }

  function saveCart() {
    try { localStorage.setItem("adluxe_cart", JSON.stringify(cart)); } catch {}
    renderCart();
  }

  function createCartItem(item, index) {
    const row = document.createElement("div");
    row.className = "adluxe-cart-item";
    row.innerHTML = `<img src="${item.image}" alt="${item.name}" loading="lazy"><div><strong>${item.name}</strong><div>Couleur : ${item.color}</div><div>${item.price} DH × ${item.qty}</div><div class="adluxe-cart-qty"><button type="button" data-cart-index="${index}" data-cart-delta="-1" aria-label="Diminuer la quantité">−</button> <b>${item.qty}</b> <button type="button" data-cart-index="${index}" data-cart-delta="1" aria-label="Augmenter la quantité">+</button></div></div>`;
    return row;
  }

  function renderCart() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const countEl = document.getElementById("adluxe-cart-count");
    if (countEl) countEl.textContent = String(count);
    const box = document.getElementById("adluxe-cart-items");
    const totalEl = document.getElementById("adluxe-cart-total");
    const wa = document.getElementById("adluxe-cart-wa");
    if (!box || !totalEl) return;
    box.replaceChildren();
    if (!cart.length) {
      box.innerHTML = '<div class="adluxe-cart-empty">Votre panier est vide.</div>';
      totalEl.textContent = "0 DH";
      setWhatsappLink(wa, "Bonjour AD_LUXE, je souhaite avoir plus d'informations.");
      return;
    }
    cart.forEach((item, i) => box.append(createCartItem(item, i)));
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    totalEl.textContent = total + " DH";
    setWhatsappLink(wa, "Bonjour AD_LUXE, je souhaite commander :\n" + cart.map((item) => `${item.name} (${item.color}) x${item.qty} — ${item.price * item.qty} DH`).join("\n") + `\n\nTotal produits : ${total} DH\nLivraison : Casablanca 20 DH / hors Casablanca 35 DH\nPaiement à la livraison.`);
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
    },
    close() {
      const overlay = document.getElementById("adluxe-cart-overlay");
      overlay?.classList.remove("open");
      overlay?.setAttribute("aria-hidden", "true");
      document.body.classList.remove("cart-open");
      document.querySelector(".adluxe-cart-trigger")?.setAttribute("aria-expanded", "false");
    },
    add() {
      const chosen = document.getElementById("selectedColor")?.textContent || "Marron";
      const color = SCARF_COLORS.has(chosen) ? chosen : "Marron";
      const found = cart.find((item) => item.color === color);
      if (found) found.qty = Math.min(99, found.qty + 1);
      else cart.push({ ...SCARF, color, qty: 1 });
      saveCart();
      this.open();
    },
    change(index, delta) {
      if (!cart[index] || ![-1, 1].includes(delta)) return;
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
    },
    close() {
      const overlay = document.getElementById("adluxe-menu-overlay");
      overlay?.classList.remove("open");
      overlay?.setAttribute("aria-hidden", "true");
      document.querySelector(".adluxe-menu-trigger")?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("adluxe-menu-open");
    },
    showCategory(filter) {
      const target = document.querySelector(`.adluxe-filter[data-filter="${filter}"]`) || document.querySelector('.adluxe-filter[data-filter="all"]');
      target?.click();
      this.close();
      document.getElementById("produit")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  function initializeProductColors() {
    const thumbs = [...document.querySelectorAll(".thumb")];
    const colorButtons = [...document.querySelectorAll(".color-btn")];
    const main = document.getElementById("mainProductImage");
    const label = document.getElementById("photoLabel");
    const selected = document.getElementById("selectedColor");
    const order = document.getElementById("orderButton");
    const images = Object.fromEntries(thumbs.map((button) => [button.dataset.color, button.dataset.image]));
    const choose = (color) => {
      if (!images[color] || !main || !label || !selected || !order) return;
      main.src = images[color];
      main.alt = "Ensemble Scarf " + color.toLowerCase() + " AD_LUXE";
      label.textContent = color;
      selected.textContent = color;
      thumbs.forEach((button) => {
        const active = button.dataset.color === color;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      colorButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.colorTarget === color));
      setWhatsappLink(order, `Bonjour AD_LUXE, je souhaite commander l'Ensemble Scarf à 180 DH. Couleur : ${color}`);
    };
    thumbs.forEach((button) => button.addEventListener("click", () => choose(button.dataset.color)));
    colorButtons.forEach((button) => button.addEventListener("click", () => choose(button.dataset.colorTarget)));
  }

  function initializeFilters() {
    const input = document.getElementById("adluxe-search");
    const filters = [...document.querySelectorAll(".adluxe-filter")];
    const empty = document.getElementById("adluxe-empty-category");
    const apply = () => {
      const cards = [...document.querySelectorAll(".product-card")];
      const query = (input?.value || "").toLowerCase().trim();
      const filter = document.querySelector(".adluxe-filter.active")?.dataset.filter || "all";
      let visible = 0;
      cards.forEach((card) => {
        const matches = (!query || (card.dataset.name || "").toLowerCase().includes(query)) && (filter === "all" || card.dataset.category === filter);
        card.hidden = !matches;
        if (matches) visible++;
      });
      if (empty) empty.hidden = visible !== 0;
    };
    input?.addEventListener("input", apply);
    filters.forEach((button) => button.addEventListener("click", () => {
      filters.forEach((item) => { item.classList.remove("active"); item.setAttribute("aria-pressed", "false"); });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");
      apply();
    }));
    apply();
  }

  function initializeControls() {
    document.querySelector(".adluxe-cart-trigger")?.addEventListener("click", () => window.ADLUXE_CART.open());
    document.querySelector(".adluxe-cart-close")?.addEventListener("click", () => window.ADLUXE_CART.close());
    document.querySelector(".adluxe-menu-trigger")?.addEventListener("click", () => window.ADLUXE_MENU.open());
    document.querySelector(".adluxe-menu-close")?.addEventListener("click", () => window.ADLUXE_MENU.close());
    document.getElementById("adluxe-menu-overlay")?.addEventListener("click", (e) => { if (e.target.id === "adluxe-menu-overlay") window.ADLUXE_MENU.close(); });
    document.getElementById("adluxe-cart-overlay")?.addEventListener("click", (e) => { if (e.target.id === "adluxe-cart-overlay") window.ADLUXE_CART.close(); });
    document.querySelectorAll("[data-menu-filter]").forEach((button) => button.addEventListener("click", () => window.ADLUXE_MENU.showCategory(button.dataset.menuFilter || "all")));
    document.querySelectorAll(".adluxe-menu-links a").forEach((link) => link.addEventListener("click", () => window.ADLUXE_MENU.close()));
    document.getElementById("adluxe-cart-items")?.addEventListener("click", (e) => {
      const button = e.target.closest("[data-cart-index][data-cart-delta]");
      if (!button) return;
      window.ADLUXE_CART.change(Number(button.dataset.cartIndex), Number(button.dataset.cartDelta));
    });
    const order = document.getElementById("orderButton");
    if (order?.parentElement && !document.querySelector(".adluxe-add-cart")) {
      const add = document.createElement("button");
      add.type = "button";
      add.className = "btn btn-outline adluxe-add-cart";
      add.textContent = "🛒 Ajouter au panier";
      add.addEventListener("click", () => window.ADLUXE_CART.add());
      order.parentElement.insertBefore(add, order);
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        window.ADLUXE_CART.close();
        window.ADLUXE_MENU.close();
      }
    });
  }

  function init() {
    loadExtraStyles();
    addProductStructuredData();
    improveImagePerformance();
    addJewelryProduct();
    initializeJewelryGallery();
    addReviewsSection();
    initializeReviews();
    cart = loadCart();
    initializeProductColors();
    initializeFilters();
    initializeControls();
    renderCart();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();