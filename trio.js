(() => {
  "use strict";

  const PRODUCT = {
    id: "sac-trio-elegance",
    name: "Sac Trio Élégance",
    price: 200,
    sku: "ADL-SAC-TRIO-001",
    defaultColor: "Noir & bordeaux",
    description: "Ensemble élégant 3 pièces avec grand sac à main structuré, pochette assortie et portefeuille. Finitions dorées, bandoulière amovible et plusieurs coloris disponibles.",
    images: [
      { color: "Noir & bordeaux", src: "assets/products/sac-trio-elegance/noir-bordeaux.jpeg" },
      { color: "Blanc & noir", src: "assets/products/sac-trio-elegance/blanc-noir.jpeg" },
      { color: "Bleu marine & crème", src: "assets/products/sac-trio-elegance/bleu-marine-creme.jpeg" },
      { color: "Bordeaux & noir", src: "assets/products/sac-trio-elegance/bordeaux-noir.jpeg" },
      { color: "Crème & bleu marine", src: "assets/products/sac-trio-elegance/creme-bleu-marine.jpeg" },
      { color: "Camel & noir", src: "assets/products/sac-trio-elegance/camel-noir.jpeg" },
      { color: "Rose & noir", src: "assets/products/sac-trio-elegance/rose-noir.jpeg" }
    ]
  };

  function mount() {
    const list = document.querySelector(".product-list");
    if (!list || document.getElementById("adluxe-" + PRODUCT.id)) return;

    const article = document.createElement("article");
    article.className = "product-card";
    article.id = "adluxe-" + PRODUCT.id;
    article.dataset.productId = PRODUCT.id;
    article.dataset.category = "sacs";
    article.dataset.name = PRODUCT.name;
    article.dataset.price = String(PRODUCT.price);
    article.dataset.defaultColor = PRODUCT.defaultColor;
    article.dataset.defaultImage = PRODUCT.images[0].src;

    const thumbs = PRODUCT.images.map((item, index) => `
      <button class="thumb${index === 0 ? " is-active" : ""}" type="button" data-color="${item.color}" data-image="${item.src}" aria-label="Voir ${item.color}" aria-pressed="${index === 0}">
        <img src="${item.src}" alt="${PRODUCT.name} — ${item.color}" loading="lazy" decoding="async">
      </button>`).join("");

    const colors = PRODUCT.images.map((item, index) => `
      <button class="color-btn${index === 0 ? " is-active" : ""}" type="button" data-color-target="${item.color}" aria-pressed="${index === 0}">${item.color}</button>`).join("");

    article.innerHTML = `
      <div class="gallery">
        <div class="main-photo">
          <img class="main-product-image" src="${PRODUCT.images[0].src}" alt="${PRODUCT.name} — ${PRODUCT.defaultColor}" loading="lazy" decoding="async">
          <span class="photo-label">${PRODUCT.defaultColor}</span>
        </div>
        <div class="thumbnails" aria-label="Choisir une couleur du Sac Trio Élégance">${thumbs}</div>
      </div>
      <div class="product-info">
        <span class="stock">En stock</span>
        <h3>${PRODUCT.name}</h3>
        <p class="product-subtitle">${PRODUCT.description}</p>
        <p class="price">${PRODUCT.price} DH</p>
        <p class="option-title">Couleur choisie : <span class="selected-color">${PRODUCT.defaultColor}</span></p>
        <div class="color-options" aria-label="Couleurs disponibles">${colors}</div>
        <div class="product-actions">
          <button class="btn btn-outline adluxe-add-cart" type="button">🛒 Ajouter au panier</button>
          <a class="btn order-btn" href="#" target="_blank" rel="noopener">Commander cette couleur</a>
        </div>
        <p class="order-note">La couleur choisie sera ajoutée automatiquement au message.</p>
      </div>`;

    list.append(article);

    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": "https://ad-luxe.ma/#sac-trio-elegance",
      name: PRODUCT.name,
      description: PRODUCT.description,
      sku: PRODUCT.sku,
      image: PRODUCT.images.map((item) => "https://ad-luxe.ma/" + item.src),
      color: PRODUCT.images.map((item) => item.color),
      brand: { "@type": "Brand", name: "AD_LUXE" },
      offers: {
        "@type": "Offer",
        url: "https://ad-luxe.ma/#produit",
        priceCurrency: "MAD",
        price: String(PRODUCT.price),
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@id": "https://ad-luxe.ma/#store" }
      }
    });
    document.head.append(schema);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})();