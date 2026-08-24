(() => {
  "use strict";

  const MEASUREMENT_ID = "G-2T1YXQQBLF";
  const CONSENT_KEY = "adluxe_analytics_consent";

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };

  let storedConsent = "denied";
  try {
    if (localStorage.getItem(CONSENT_KEY) === "granted") storedConsent = "granted";
  } catch {}

  window.gtag("consent", "default", {
    analytics_storage: storedConsent,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500
  });
  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID, {
    allow_google_signals: false
  });

  const PRODUCTS = [{"id":"baskets-urban-chic","name":"Baskets Urban Chic","category":"chaussures","price":180,"description":"Un modèle tendance et facile à porter au quotidien, avec une semelle confortable et un design moderne qui s’adapte aussi bien à un look casual qu’à une tenue plus habillée.","images":[{"color":"Gris","src":"assets/products/baskets-urban-chic/gris.webp"},{"color":"Blanc & noir","src":"assets/products/baskets-urban-chic/blanc-noir.webp"},{"color":"Beige","src":"assets/products/baskets-urban-chic/beige.webp"},{"color":"Noir","src":"assets/products/baskets-urban-chic/noir.webp"}],"sizes":["36","37","38","39","40"]},{"id":"sandales-elegance","name":"Sandales Élégance Confort","category":"chaussures","price":149,"description":"Un modèle chic et confortable, parfait pour les sorties de tous les jours comme pour les looks plus habillés. Sa semelle légère et sa finition élégante apportent une touche féminine à vos tenues.","images":[{"color":"Camel","src":"assets/products/sandales-elegance/sandale-01.png"},{"color":"Marron","src":"assets/products/sandales-elegance/sandale-02.png"},{"color":"Camel","src":"assets/products/sandales-elegance/sandale-03.png"},{"color":"Noir","src":"assets/products/sandales-elegance/sandale-04.png"},{"color":"Marron","src":"assets/products/sandales-elegance/sandale-05.png"},{"color":"Camel","src":"assets/products/sandales-elegance/sandale-06.png"},{"color":"Beige","src":"assets/products/sandales-elegance/sandale-07.png"},{"color":"Beige","src":"assets/products/sandales-elegance/sandale-08.png"}],"sizes":["37","38","39"]},{"id":"rose-berry-trio","name":"Rose Berry Trio","category":"parfumerie","price":100,"description":"Un coffret beauté complet signé Rose Berry réunissant blush liquide, highlighter lumineux et lipgloss mat. Idéal pour créer un look frais et harmonieux en quelques gestes.","images":[{"color":"Coffret","src":"assets/products/parfumerie/rose-berry-trio.jpg"}],"sizes":[]},{"id":"rose-berry-nude-pink","name":"Rose Berry Nude Pink Lip Duo","category":"parfumerie","price":100,"description":"Un coffret lèvres nude pink élégant qui réunit crayon contour, gloss et rouge à lèvres mat. Parfait pour dessiner, définir et sublimer les lèvres avec un fini chic et naturel.","images":[{"color":"Nude Pink","src":"assets/products/parfumerie/rose-berry-nude-pink.jpg"}],"sizes":[]},{"id":"sac-elegance-signature","name":"Sac Élégance Signature","category":"sacs","price":200,"description":"Un sac à main structuré au style chic et intemporel, rehaussé de finitions dorées et accompagné d’une bandoulière amovible. Spacieux et élégant, il accompagne facilement vos journées et vos sorties.","images":[{"color":"Noir","src":"assets/products/sac-elegance-signature/noir.jpg"},{"color":"Crème","src":"assets/products/sac-elegance-signature/creme.jpg"},{"color":"Bleu ciel","src":"assets/products/sac-elegance-signature/bleu-ciel.jpg"},{"color":"Bordeaux","src":"assets/products/sac-elegance-signature/bordeaux.jpg"},{"color":"Marron","src":"assets/products/sac-elegance-signature/marron.jpg"},{"color":"Beige","src":"assets/products/sac-elegance-signature/beige.jpg"},{"color":"Gris","src":"assets/products/sac-elegance-signature/gris.jpg"},{"color":"Blanc","src":"assets/products/sac-elegance-signature/blanc.jpg"},{"color":"Rose poudré","src":"assets/products/sac-elegance-signature/rose-poudre.jpg"},{"color":"Camel","src":"assets/products/sac-elegance-signature/camel.jpg"}],"sizes":[]},{"id":"sac-bandouliere-elegance","name":"Sac Bandoulière Élégance","category":"sacs","price":170,"description":"Un sac bandoulière compact et raffiné, doté d’un fermoir doré, d’une sangle large réglable et d’une seconde anse pour varier les portés. Son format pratique accueille vos essentiels tout en ajoutant une touche chic.","images":[{"color":"Rouge","src":"assets/products/sac-bandouliere-elegance/rouge.jpg"},{"color":"Bordeaux","src":"assets/products/sac-bandouliere-elegance/bordeaux.jpg"},{"color":"Cognac","src":"assets/products/sac-bandouliere-elegance/cognac.jpg"},{"color":"Crème","src":"assets/products/sac-bandouliere-elegance/creme.jpg"},{"color":"Blanc","src":"assets/products/sac-bandouliere-elegance/blanc.jpg"},{"color":"Noir","src":"assets/products/sac-bandouliere-elegance/noir.jpg"},{"color":"Marron","src":"assets/products/sac-bandouliere-elegance/marron.jpg"},{"color":"Beige","src":"assets/products/sac-bandouliere-elegance/beige.jpg"},{"color":"Camel","src":"assets/products/sac-bandouliere-elegance/camel.jpg"}],"sizes":[]},{"id":"sac-trio-elegance","name":"Sac Trio Élégance","category":"sacs","price":200,"description":"Ensemble élégant 3 pièces avec grand sac à main structuré, pochette assortie et portefeuille. Finitions dorées, bandoulière amovible et plusieurs coloris disponibles.","images":[{"color":"Noir & bordeaux","src":"assets/products/sac-trio-elegance/noir-bordeaux.jpeg"},{"color":"Blanc & noir","src":"assets/products/sac-trio-elegance/blanc-noir.jpeg"},{"color":"Bleu marine & crème","src":"assets/products/sac-trio-elegance/bleu-marine-creme.jpeg"},{"color":"Bordeaux & noir","src":"assets/products/sac-trio-elegance/bordeaux-noir.jpeg"},{"color":"Crème & bleu marine","src":"assets/products/sac-trio-elegance/creme-bleu-marine.jpeg"},{"color":"Camel & noir","src":"assets/products/sac-trio-elegance/camel-noir.jpeg"},{"color":"Rose & noir","src":"assets/products/sac-trio-elegance/rose-noir.jpeg"}],"sizes":[]}];

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
        <img src="${esc(item.src)}" alt="${esc(product.name)} — ${esc(item.color)}"
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
