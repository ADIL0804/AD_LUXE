(() => {
  "use strict";

  const PRODUCTS = [];

  function esc(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function uniqueColors(images) {
    return [...new Set(images.map((item) => item.color))];
  }

  function thumbSrc(src) {
    return src.endsWith('.webp') ? src.replace(/\.webp$/, '-thumb.webp') : src;
  }

  function createCard(product) {
    const list = document.querySelector(".product-list");
    const articleId = "adluxe-" + product.id;
    if (!list || document.getElementById(articleId) || document.querySelector('[data-product-id="' + product.id + '"]')) return;

    const first = product.images[0];
    const colors = uniqueColors(product.images);
    const article = document.createElement("article");
    article.className = "product-card";
    article.id = articleId;
    article.dataset.productId = product.id;
    article.dataset.category = product.category;
    article.dataset.name = product.name;
    article.dataset.price = String(product.price);
    article.dataset.defaultColor = first.color;
    article.dataset.defaultImage = first.src;
    if (product.sizes.length) article.dataset.defaultSize = product.sizes[0];

    const thumbs = product.images.map((item, index) => `
      <button class="thumb${index === 0 ? " is-active" : ""}" type="button"
        data-color="${esc(item.color)}" data-image="${esc(item.src)}"
        aria-label="Voir ${esc(item.color)}" aria-pressed="${index === 0}">
        <img src="${esc(thumbSrc(item.src))}" alt="${esc(product.name)} — ${esc(item.color)}"
          loading="lazy" decoding="async" fetchpriority="low">
      </button>`).join("");

    const colorButtons = colors.map((color, index) => `
      <button class="color-btn${index === 0 ? " is-active" : ""}" type="button"
        data-color-target="${esc(color)}" aria-pressed="${index === 0}">${esc(color)}</button>`).join("");

    const sizes = product.sizes.map((size, index) => `
      <button class="size-btn${index === 0 ? " is-active" : ""}" type="button"
        data-size="${esc(size)}" aria-pressed="${index === 0}">${esc(size)}</button>`).join("");

    article.innerHTML = `
      <div class="gallery">
        <div class="main-photo">
          <img class="main-product-image" src="${esc(first.src)}" alt="${esc(product.name)} — ${esc(first.color)}"
            loading="lazy" decoding="async" fetchpriority="low">
          <span class="photo-label">${esc(first.color)}</span>
        </div>
        <div class="thumbnails" aria-label="Choisir une variante">${thumbs}</div>
      </div>
      <div class="product-info">
        <span class="stock">En stock</span>
        <h3>${esc(product.name)}</h3>
        <p class="product-subtitle">${esc(product.description)}</p>
        <p class="price">${product.price} DH</p>
        <p class="option-title">Choix : <span class="selected-color">${esc(first.color)}</span></p>
        <div class="color-options" aria-label="Couleurs disponibles">${colorButtons}</div>
        ${product.sizes.length ? `<p class="option-title">Pointure choisie : <span class="selected-size">${esc(product.sizes[0])}</span></p><div class="size-options" aria-label="Pointures disponibles">${sizes}</div>` : ""}
        <div class="product-actions">
          <button class="btn btn-outline adluxe-add-cart" type="button">🛒 Ajouter au panier</button>
          <a class="btn order-btn" href="#" target="_blank" rel="noopener">Commander sur WhatsApp</a>
        </div>
        <p class="order-note">La variante choisie sera ajoutée automatiquement au message.</p>
      </div>`;

    list.append(article);
  }

  function createProducts() {
    PRODUCTS.forEach(createCard);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createProducts, { once: true });
  } else {
    createProducts();
  }
})();
