(() => {
  "use strict";

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", "G-2T1YXQQBLF");

  const WA = "https://wa.me/212644162453?text=";
  const BASKETS = Object.freeze({
    id: "baskets-urban-chic",
    name: "Baskets Urban Chic",
    price: 180,
    defaultColor: "Gris",
    defaultSize: "36",
    images: [
      { color: "Gris", src: "assets/products/baskets-urban-chic/gris.webp" },
      { color: "Blanc & noir", src: "assets/products/baskets-urban-chic/blanc-noir.webp" },
      { color: "Beige", src: "assets/products/baskets-urban-chic/beige.webp" },
      { color: "Noir", src: "assets/products/baskets-urban-chic/noir.webp" }
    ],
    sizes: ["36", "37", "38", "39", "40"]
  });

  function addBasketsStyles() {
    if (document.querySelector('link[href^="baskets.css"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "baskets.css?v=20260822-1";
    document.head.append(link);
  }

  function addBasketsSchema() {
    if (document.getElementById("adluxe-baskets-schema")) return;
    const schema = document.createElement("script");
    schema.id = "adluxe-baskets-schema";
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": "https://ad-luxe.ma/#baskets-urban-chic",
      name: BASKETS.name,
      description: "Baskets femme au design moderne et confortable, disponibles du 36 au 40 en plusieurs coloris.",
      image: BASKETS.images.map((item) => "https://ad-luxe.ma/" + item.src),
      sku: "ADL-CHA-URBAN-001",
      brand: { "@type": "Brand", name: "AD_LUXE" },
      color: BASKETS.images.map((item) => item.color),
      size: BASKETS.sizes,
      offers: {
        "@type": "Offer",
        url: "https://ad-luxe.ma/#produit",
        priceCurrency: "MAD",
        price: String(BASKETS.price),
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@id": "https://ad-luxe.ma/#store" }
      }
    });
    document.head.append(schema);
  }

  function createBasketsProduct() {
    const list = document.querySelector(".product-list");
    if (!list || document.getElementById("adluxe-baskets-urban")) return;

    const article = document.createElement("article");
    article.className = "product-card shoe-product";
    article.id = "adluxe-baskets-urban";
    article.dataset.productId = BASKETS.id;
    article.dataset.category = "chaussures";
    article.dataset.name = BASKETS.name;
    article.dataset.price = String(BASKETS.price);
    article.dataset.defaultColor = BASKETS.defaultColor;
    article.dataset.defaultImage = BASKETS.images[0].src;

    const thumbnails = BASKETS.images.map((item, index) => `
      <button class="shoe-thumb${index === 0 ? " is-active" : ""}" type="button" data-shoe-color="${item.color}" data-shoe-image="${item.src}" aria-label="Voir le modèle ${item.color}" aria-pressed="${index === 0}">
        <img src="${item.src}" alt="Baskets Urban Chic ${item.color}" loading="lazy" decoding="async">
      </button>`).join("");

    const sizes = BASKETS.sizes.map((size, index) => `
      <button class="shoe-size-btn${index === 0 ? " is-active" : ""}" type="button" data-shoe-size="${size}" aria-pressed="${index === 0}">${size}</button>`).join("");

    article.innerHTML = `
      <div class="gallery shoe-gallery">
        <div class="main-photo">
          <img class="main-product-image shoe-main-image" src="${BASKETS.images[0].src}" alt="Baskets Urban Chic ${BASKETS.defaultColor}" width="768" height="960">
          <span class="photo-label shoe-photo-label">${BASKETS.defaultColor}</span>
        </div>
        <div class="shoe-thumbnails" aria-label="Choisir un coloris">${thumbnails}</div>
      </div>
      <div class="product-info">
        <span class="stock">En stock</span>
        <h3>Baskets Urban Chic</h3>
        <p class="product-subtitle">Un modèle tendance et facile à porter au quotidien, avec une semelle confortable et un design moderne qui s’adapte aussi bien à un look casual qu’à une tenue plus habillée. Disponibles en plusieurs coloris pour matcher facilement avec votre style.</p>
        <p class="price">180 DH</p>
        <p class="option-title">Pointure choisie : <span class="shoe-selected-size">36</span></p>
        <div class="shoe-size-options" aria-label="Choisir la pointure">${sizes}</div>
        <div class="product-actions">
          <a class="btn order-btn shoe-order-btn" href="https://wa.me/212644162453" target="_blank" rel="noopener">Commander sur WhatsApp</a>
        </div>
        <p class="order-note">Pointures disponibles : 36 · 37 · 38 · 39 · 40</p>
      </div>`;

    list.append(article);
    initBasketsProduct(article);
    addBasketsSchema();
  }

  function initBasketsProduct(card) {
    const main = card.querySelector(".shoe-main-image");
    const label = card.querySelector(".shoe-photo-label");
    const selectedSize = card.querySelector(".shoe-selected-size");
    const order = card.querySelector(".shoe-order-btn");
    const thumbs = [...card.querySelectorAll(".shoe-thumb")];
    const sizes = [...card.querySelectorAll(".shoe-size-btn")];
    let color = BASKETS.defaultColor;
    let size = BASKETS.defaultSize;

    const updateOrder = () => {
      if (!order) return;
      const city = (document.getElementById("deliveryCity")?.value || "").trim();
      const message =
        "Bonjour AD_LUXE, je souhaite commander les Baskets Urban Chic.\n\n" +
        "Prix : 180 DH\n" +
        "Couleur : " + color + "\n" +
        "Pointure : " + size + "\n" +
        "Ville : " + city + "\n\n" +
        "Nom : \nAdresse : \nTéléphone : ";
      order.href = WA + encodeURIComponent(message);
    };

    thumbs.forEach((button) => {
      button.addEventListener("click", () => {
        color = button.dataset.shoeColor || BASKETS.defaultColor;
        const image = button.dataset.shoeImage || BASKETS.images[0].src;
        if (main) {
          main.src = image;
          main.alt = BASKETS.name + " — " + color;
        }
        if (label) label.textContent = color;
        thumbs.forEach((item) => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        window.gtag("event", "select_item", { item_id: BASKETS.id, item_name: BASKETS.name, item_variant: color });
        updateOrder();
      });
    });

    sizes.forEach((button) => {
      button.addEventListener("click", () => {
        size = button.dataset.shoeSize || BASKETS.defaultSize;
        if (selectedSize) selectedSize.textContent = size;
        sizes.forEach((item) => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        window.gtag("event", "select_item", { item_id: BASKETS.id, item_name: BASKETS.name, item_variant: "Pointure " + size });
        updateOrder();
      });
    });

    document.getElementById("deliveryCity")?.addEventListener("input", updateOrder);
    updateOrder();
  }

  addBasketsStyles();
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", createBasketsProduct, { once: true })
    : createBasketsProduct();
})();
