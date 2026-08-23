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
      { color: "Gris", src: "assets/products/baskets-urban-chic/2d06b7b9-3733-4dbe-a02e-e836bdf7f3b3.png" },
      { color: "Blanc & noir", src: "assets/products/baskets-urban-chic/dff913f0-1f5a-46bd-8ec1-e632c97b4b06.png" },
      { color: "Beige", src: "assets/products/baskets-urban-chic/f7421536-b5f4-47c9-b4e4-7eb2d1d2a521.png" },
      { color: "Noir", src: "assets/products/baskets-urban-chic/ecae56a3-1074-4609-ac62-8c3b2a683401.png" }
    ],
    sizes: ["36", "37", "38", "39", "40"]
  });

  const SANDALS = Object.freeze({
    id: "sandales-elegance",
    name: "Sandales Élégance Confort",
    price: 149,
    defaultColor: "Camel",
    defaultSize: "37",
    images: [
      { color: "Camel", src: "assets/products/sandales-elegance/sandale-01.png" },
      { color: "Marron", src: "assets/products/sandales-elegance/sandale-02.png" },
      { color: "Camel", src: "assets/products/sandales-elegance/sandale-03.png" },
      { color: "Noir", src: "assets/products/sandales-elegance/sandale-04.png" },
      { color: "Marron", src: "assets/products/sandales-elegance/sandale-05.png" },
      { color: "Camel", src: "assets/products/sandales-elegance/sandale-06.png" },
      { color: "Beige", src: "assets/products/sandales-elegance/sandale-07.png" },
      { color: "Beige", src: "assets/products/sandales-elegance/sandale-08.png" }
    ],
    sizes: ["37", "38", "39"]
  });

  const PARFUMERIE = Object.freeze([
    {
      id: "rose-berry-trio",
      name: "Rose Berry Trio",
      price: 100,
      image: "assets/products/parfumerie/rose-berry-trio.jpg",
      description: "Un coffret beauté complet signé Rose Berry réunissant blush liquide, highlighter lumineux et lipgloss mat. Idéal pour créer un look frais et harmonieux en quelques gestes, avec trois essentiels faciles à glisser dans votre routine."
    },
    {
      id: "rose-berry-nude-pink",
      name: "Rose Berry Nude Pink Lip Duo",
      price: 100,
      image: "assets/products/parfumerie/rose-berry-nude-pink.jpg",
      description: "Un coffret lèvres nude pink élégant qui réunit crayon contour, gloss et rouge à lèvres mat. Parfait pour dessiner, définir et sublimer les lèvres avec un fini chic et naturel, du quotidien aux occasions."
    }
  ]);

  const BAG = Object.freeze({
    id: "sac-elegance-signature",
    name: "Sac Élégance Signature",
    price: 200,
    defaultColor: "Noir",
    description: "Un sac à main structuré au style chic et intemporel, rehaussé de finitions dorées et accompagné d’une bandoulière amovible. Spacieux et élégant, il accompagne facilement vos journées, vos sorties et vos tenues habillées.",
    images: [
      { color: "Noir", src: "assets/products/sac-elegance-signature/noir.jpg" },
      { color: "Crème", src: "assets/products/sac-elegance-signature/creme.jpg" },
      { color: "Bleu ciel", src: "assets/products/sac-elegance-signature/bleu-ciel.jpg" },
      { color: "Bordeaux", src: "assets/products/sac-elegance-signature/bordeaux.jpg" },
      { color: "Marron", src: "assets/products/sac-elegance-signature/marron.jpg" },
      { color: "Beige", src: "assets/products/sac-elegance-signature/beige.jpg" },
      { color: "Gris", src: "assets/products/sac-elegance-signature/gris.jpg" },
      { color: "Blanc", src: "assets/products/sac-elegance-signature/blanc.jpg" },
      { color: "Rose poudré", src: "assets/products/sac-elegance-signature/rose-poudre.jpg" },
      { color: "Camel", src: "assets/products/sac-elegance-signature/camel.jpg" }
    ]
  });

  const CROSSBODY_BAG = Object.freeze({
    id: "sac-bandouliere-elegance",
    name: "Sac Bandoulière Élégance",
    price: 170,
    defaultColor: "Rouge",
    description: "Un sac bandoulière compact et raffiné, doté d’un fermoir doré, d’une sangle large réglable et d’une seconde anse pour varier les portés. Son format pratique accueille vos essentiels tout en ajoutant une touche chic à vos tenues du quotidien.",
    images: [
      { color: "Rouge", src: "assets/products/sac-bandouliere-elegance/rouge.jpg" },
      { color: "Bordeaux", src: "assets/products/sac-bandouliere-elegance/bordeaux.jpg" },
      { color: "Cognac", src: "assets/products/sac-bandouliere-elegance/cognac.jpg" },
      { color: "Crème", src: "assets/products/sac-bandouliere-elegance/creme.jpg" },
      { color: "Blanc", src: "assets/products/sac-bandouliere-elegance/blanc.jpg" },
      { color: "Noir", src: "assets/products/sac-bandouliere-elegance/noir.jpg" },
      { color: "Marron", src: "assets/products/sac-bandouliere-elegance/marron.jpg" },
      { color: "Beige", src: "assets/products/sac-bandouliere-elegance/beige.jpg" },
      { color: "Camel", src: "assets/products/sac-bandouliere-elegance/camel.jpg" }
    ]
  });

  function addBasketsStyles() {
    if (document.querySelector('link[href^="baskets.css"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "baskets.css?v=20260822-2";
    document.head.append(link);
  }

  function addProductSchema(product, type) {
    const schemaId = "adluxe-" + product.id + "-schema";
    if (document.getElementById(schemaId)) return;
    const schema = document.createElement("script");
    schema.id = schemaId;
    schema.type = "application/ld+json";
    const images = product.images ? product.images.map((item) => "https://ad-luxe.ma/" + item.src) : ["https://ad-luxe.ma/" + product.image];
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": "https://ad-luxe.ma/#" + product.id,
      name: product.name,
      description: product.description || (type === "shoe" ? "Chaussures femme tendance disponibles chez AD_LUXE." : "Produit beauté Rose Berry disponible chez AD_LUXE."),
      image: images,
      brand: { "@type": "Brand", name: "AD_LUXE" },
      offers: {
        "@type": "Offer",
        url: "https://ad-luxe.ma/#produit",
        priceCurrency: "MAD",
        price: String(product.price),
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@id": "https://ad-luxe.ma/#store" }
      }
    });
    document.head.append(schema);
  }

  function createShoeProduct(product) {
    const list = document.querySelector(".product-list");
    const articleId = "adluxe-" + product.id;
    if (!list || document.getElementById(articleId)) return;

    const article = document.createElement("article");
    article.className = "product-card shoe-product";
    article.id = articleId;
    article.dataset.productId = product.id;
    article.dataset.category = "chaussures";
    article.dataset.name = product.name;
    article.dataset.price = String(product.price);
    article.dataset.defaultColor = product.defaultColor;
    article.dataset.defaultSize = product.defaultSize;
    article.dataset.defaultImage = product.images[0].src;

    const thumbnails = product.images.map((item, index) => `
      <button class="shoe-thumb${index === 0 ? " is-active" : ""}" type="button" data-shoe-color="${item.color}" data-shoe-image="${item.src}" aria-label="Voir le modèle ${item.color}" aria-pressed="${index === 0}">
        <img src="${item.src}" alt="${product.name} ${item.color}" loading="lazy" decoding="async">
      </button>`).join("");

    const sizes = product.sizes.map((size, index) => `
      <button class="shoe-size-btn${index === 0 ? " is-active" : ""}" type="button" data-shoe-size="${size}" aria-pressed="${index === 0}">${size}</button>`).join("");

    const description = product.id === "baskets-urban-chic"
      ? "Un modèle tendance et facile à porter au quotidien, avec une semelle confortable et un design moderne qui s’adapte aussi bien à un look casual qu’à une tenue plus habillée. Disponibles en plusieurs coloris pour matcher facilement avec votre style."
      : "Un modèle chic et confortable, parfait pour les sorties de tous les jours comme pour les looks plus habillés. Sa semelle légère, sa finition élégante et ses couleurs faciles à assortir apportent une touche féminine et raffinée à toutes vos tenues.";

    article.innerHTML = `
      <div class="gallery shoe-gallery">
        <div class="main-photo">
          <img class="main-product-image shoe-main-image" src="${product.images[0].src}" alt="${product.name} ${product.defaultColor}" width="1122" height="1402">
          <span class="photo-label shoe-photo-label">${product.defaultColor}</span>
        </div>
        <div class="shoe-thumbnails" aria-label="Choisir un coloris">${thumbnails}</div>
      </div>
      <div class="product-info">
        <span class="stock">En stock</span>
        <h3>${product.name}</h3>
        <p class="product-subtitle">${description}</p>
        <p class="price">${product.price} DH</p>
        <p class="option-title">Pointure choisie : <span class="shoe-selected-size">${product.defaultSize}</span></p>
        <div class="shoe-size-options" aria-label="Choisir la pointure">${sizes}</div>
        <div class="product-actions">
          <button class="btn btn-outline adluxe-add-cart" type="button">🛒 Ajouter au panier</button>
          <a class="btn order-btn shoe-order-btn" href="https://wa.me/212644162453" target="_blank" rel="noopener">Commander sur WhatsApp</a>
        </div>
        <p class="order-note">Pointures disponibles : ${product.sizes.join(" · ")}</p>
      </div>`;

    list.append(article);
    initShoeProduct(article, product);
    addProductSchema(product, "shoe");
  }

  function initShoeProduct(card, product) {
    const main = card.querySelector(".shoe-main-image");
    const label = card.querySelector(".shoe-photo-label");
    const selectedSize = card.querySelector(".shoe-selected-size");
    const order = card.querySelector(".shoe-order-btn");
    const thumbs = [...card.querySelectorAll(".shoe-thumb")];
    const sizes = [...card.querySelectorAll(".shoe-size-btn")];
    let color = product.defaultColor;
    let size = product.defaultSize;

    const updateOrder = () => {
      if (!order) return;
      const city = (document.getElementById("deliveryCity")?.value || "").trim();
      const message =
        "Bonjour AD_LUXE, je souhaite commander " + product.name + ".\n\n" +
        "Prix : " + product.price + " DH\n" +
        "Couleur : " + color + "\n" +
        "Pointure : " + size + "\n" +
        "Ville : " + city + "\n\n" +
        "Nom : \nAdresse : \nTéléphone : ";
      order.href = WA + encodeURIComponent(message);
    };

    thumbs.forEach((button) => {
      button.addEventListener("click", () => {
        color = button.dataset.shoeColor || product.defaultColor;
        const image = button.dataset.shoeImage || product.images[0].src;
        if (main) {
          main.src = image;
          main.alt = product.name + " — " + color;
        }
        if (label) label.textContent = color;
        thumbs.forEach((item) => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        window.gtag("event", "select_item", { item_id: product.id, item_name: product.name, item_variant: color });
        updateOrder();
      });
    });

    sizes.forEach((button) => {
      button.addEventListener("click", () => {
        size = button.dataset.shoeSize || product.defaultSize;
        if (selectedSize) selectedSize.textContent = size;
        sizes.forEach((item) => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        window.gtag("event", "select_item", { item_id: product.id, item_name: product.name, item_variant: "Pointure " + size });
        updateOrder();
      });
    });

    document.getElementById("deliveryCity")?.addEventListener("input", updateOrder);
    updateOrder();
  }

  function createParfumerieProduct(product) {
    const list = document.querySelector(".product-list");
    const articleId = "adluxe-" + product.id;
    if (!list || document.getElementById(articleId)) return;

    const article = document.createElement("article");
    article.className = "product-card";
    article.id = articleId;
    article.dataset.productId = product.id;
    article.dataset.category = "parfumerie";
    article.dataset.name = product.name;
    article.dataset.price = String(product.price);
    article.dataset.defaultImage = product.image;

    article.innerHTML = `
      <div class="gallery">
        <div class="main-photo">
          <img class="main-product-image" src="${product.image}" alt="${product.name}" width="300" height="300" loading="lazy" decoding="async">
        </div>
      </div>
      <div class="product-info">
        <span class="stock">En stock</span>
        <h3>${product.name}</h3>
        <p class="product-subtitle">${product.description}</p>
        <p class="price">${product.price} DH</p>
        <div class="product-actions">
          <button class="btn btn-outline adluxe-add-cart" type="button">🛒 Ajouter au panier</button>
          <a class="btn order-btn perfume-order-btn" href="https://wa.me/212644162453" target="_blank" rel="noopener">Commander sur WhatsApp</a>
        </div>
      </div>`;

    list.append(article);
    const order = article.querySelector(".perfume-order-btn");
    const updateOrder = () => {
      if (!order) return;
      const city = (document.getElementById("deliveryCity")?.value || "").trim();
      const message =
        "Bonjour AD_LUXE, je souhaite commander " + product.name + ".\n\n" +
        "Prix : " + product.price + " DH\n" +
        "Ville : " + city + "\n\n" +
        "Nom : \nAdresse : \nTéléphone : ";
      order.href = WA + encodeURIComponent(message);
    };
    document.getElementById("deliveryCity")?.addEventListener("input", updateOrder);
    updateOrder();
    addProductSchema(product, "beauty");
  }

  function createBagProduct(product) {
    const list = document.querySelector(".product-list");
    const articleId = "adluxe-" + product.id;
    if (!list || document.getElementById(articleId)) return;

    const article = document.createElement("article");
    article.className = "product-card shoe-product";
    article.id = articleId;
    article.dataset.productId = product.id;
    article.dataset.category = "sacs";
    article.dataset.name = product.name;
    article.dataset.price = String(product.price);
    article.dataset.defaultColor = product.defaultColor;
    article.dataset.defaultImage = product.images[0].src;

    const thumbnails = product.images.map((item, index) => `
      <button class="shoe-thumb${index === 0 ? " is-active" : ""}" type="button" data-shoe-color="${item.color}" data-shoe-image="${item.src}" aria-label="Voir le sac ${item.color}" aria-pressed="${index === 0}">
        <img src="${item.src}" alt="${product.name} ${item.color}" loading="lazy" decoding="async">
      </button>`).join("");

    article.innerHTML = `
      <div class="gallery shoe-gallery">
        <div class="main-photo">
          <img class="main-product-image shoe-main-image" src="${product.images[0].src}" alt="${product.name} ${product.defaultColor}" width="1117" height="1408">
          <span class="photo-label shoe-photo-label">${product.defaultColor}</span>
        </div>
        <div class="shoe-thumbnails" aria-label="Choisir une couleur">${thumbnails}</div>
      </div>
      <div class="product-info">
        <span class="stock">En stock</span>
        <h3>${product.name}</h3>
        <p class="product-subtitle">${product.description}</p>
        <p class="price">${product.price} DH</p>
        <p class="option-title">${product.images.length} couleurs disponibles</p>
        <div class="product-actions">
          <button class="btn btn-outline adluxe-add-cart" type="button">🛒 Ajouter au panier</button>
          <a class="btn order-btn bag-order-btn" href="https://wa.me/212644162453" target="_blank" rel="noopener">Commander sur WhatsApp</a>
        </div>
        <p class="order-note">Choisissez la couleur souhaitée avant de commander.</p>
      </div>`;

    list.append(article);
    const main = article.querySelector(".shoe-main-image");
    const label = article.querySelector(".shoe-photo-label");
    const order = article.querySelector(".bag-order-btn");
    const thumbs = [...article.querySelectorAll(".shoe-thumb")];
    let color = product.defaultColor;

    const updateOrder = () => {
      if (!order) return;
      const city = (document.getElementById("deliveryCity")?.value || "").trim();
      const message =
        "Bonjour AD_LUXE, je souhaite commander " + product.name + ".\n\n" +
        "Prix : " + product.price + " DH\n" +
        "Couleur : " + color + "\n" +
        "Ville : " + city + "\n\n" +
        "Nom : \nAdresse : \nTéléphone : ";
      order.href = WA + encodeURIComponent(message);
    };

    thumbs.forEach((button) => button.addEventListener("click", () => {
      color = button.dataset.shoeColor || product.defaultColor;
      const image = button.dataset.shoeImage || product.images[0].src;
      if (main) { main.src = image; main.alt = product.name + " — " + color; }
      if (label) label.textContent = color;
      thumbs.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      window.gtag("event", "select_item", { item_id: product.id, item_name: product.name, item_variant: color });
      updateOrder();
    }));

    document.getElementById("deliveryCity")?.addEventListener("input", updateOrder);
    updateOrder();
    addProductSchema(product, "bag");
  }

  function createProducts() {
    createShoeProduct(BASKETS);
    createShoeProduct(SANDALS);
    createBagProduct(BAG);
    createBagProduct(CROSSBODY_BAG);
    PARFUMERIE.forEach(createParfumerieProduct);
  }

  addBasketsStyles();
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", createProducts, { once: true })
    : createProducts();
})();
