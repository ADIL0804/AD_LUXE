(() => {
  "use strict";

  const PRODUCT = {
    id: "sac-trio-elegance",
    name: "Sac Trio Élégance",
    price: 200,
    defaultColor: "Noir & bordeaux",
    description: "Ensemble élégant 3 pièces avec grand sac à main structuré, pochette assortie et portefeuille. Finitions dorées, bandoulière amovible et plusieurs coloris disponibles.",
    images: [
      { color: "Noir & bordeaux", src: "assets/products/0FEABE02-C38B-4AB1-809B-6BD7671ECF08(5).jpeg" },
      { color: "Blanc & noir", src: "assets/products/30B637D5-5342-4A35-AD2F-BD8590D7B8AA(4).jpeg" },
      { color: "Bleu marine & crème", src: "assets/products/61D733B2-B6FE-44C3-BF95-F3D0AC6815CC(2).jpeg" },
      { color: "Bordeaux & noir", src: "assets/products/6FFA15A7-10A6-44A3-982F-5E517F103488(5).jpeg" },
      { color: "Crème & bleu marine", src: "assets/products/9529B4F8-029C-4896-A4F3-FEBEE6B4E2D6(6).jpeg" },
      { color: "Camel & noir", src: "assets/products/CE6E40DA-0783-4EC4-B735-9CCDD3D2CD5D(7).jpeg" },
      { color: "Rose & noir", src: "assets/products/F0D1B6A9-6C15-4331-BE08-DA8975BBD56C.jpeg" }
    ]
  };

  const WA = "https://wa.me/212644162453?text=";

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
      <button class="thumb${index === 0 ? " is-active" : ""}" type="button" data-trio-color="${item.color}" data-trio-image="${item.src}" aria-label="Voir ${item.color}" aria-pressed="${index === 0}">
        <img src="${item.src}" alt="${PRODUCT.name} — ${item.color}" loading="lazy" decoding="async">
      </button>`).join("");

    const colors = PRODUCT.images.map((item, index) => `
      <button class="color-btn${index === 0 ? " is-active" : ""}" type="button" data-trio-color="${item.color}" data-trio-image="${item.src}" aria-pressed="${index === 0}">${item.color}</button>`).join("");

    article.innerHTML = `
      <div class="gallery">
        <div class="main-photo">
          <img class="main-product-image trio-main-image" src="${PRODUCT.images[0].src}" alt="${PRODUCT.name} — ${PRODUCT.defaultColor}">
          <span class="photo-label trio-photo-label">${PRODUCT.defaultColor}</span>
        </div>
        <div class="thumbnails" aria-label="Photos du Sac Trio Élégance">${thumbs}</div>
      </div>
      <div class="product-info">
        <span class="stock">En stock</span>
        <h3>${PRODUCT.name}</h3>
        <p class="product-subtitle">${PRODUCT.description}</p>
        <p class="price">${PRODUCT.price} DH</p>
        <p class="option-title">Couleur choisie : <span class="trio-selected-color">${PRODUCT.defaultColor}</span></p>
        <div class="color-options" aria-label="Choisir la couleur">${colors}</div>
        <div class="product-actions">
          <button class="btn btn-outline adluxe-add-cart" type="button">🛒 Ajouter au panier</button>
          <a class="btn order-btn trio-order-btn" href="#" target="_blank" rel="noopener">Commander sur WhatsApp</a>
        </div>
      </div>`;

    list.append(article);

    const main = article.querySelector(".trio-main-image");
    const label = article.querySelector(".trio-photo-label");
    const selected = article.querySelector(".trio-selected-color");
    const order = article.querySelector(".trio-order-btn");
    let color = PRODUCT.defaultColor;
    let image = PRODUCT.images[0].src;

    const updateOrder = () => {
      const city = (document.getElementById("deliveryCity")?.value || "").trim();
      const message = `Bonjour AD_LUXE, je souhaite commander ${PRODUCT.name}.\n\nPrix : ${PRODUCT.price} DH\nCouleur : ${color}\nVille : ${city}\n\nNom : \nAdresse : \nTéléphone : `;
      order.href = WA + encodeURIComponent(message);
      article.dataset.defaultColor = color;
      article.dataset.defaultImage = image;
    };

    const selectVariant = (button) => {
      color = button.dataset.trioColor || PRODUCT.defaultColor;
      image = button.dataset.trioImage || PRODUCT.images[0].src;
      main.src = image;
      main.alt = `${PRODUCT.name} — ${color}`;
      label.textContent = color;
      selected.textContent = color;
      article.querySelectorAll("[data-trio-color]").forEach((el) => {
        const active = el.dataset.trioColor === color;
        el.classList.toggle("is-active", active);
        el.setAttribute("aria-pressed", String(active));
      });
      updateOrder();
    };

    article.querySelectorAll("[data-trio-color]").forEach((button) => button.addEventListener("click", () => selectVariant(button)));
    document.getElementById("deliveryCity")?.addEventListener("input", updateOrder);
    updateOrder();

    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": "https://ad-luxe.ma/#sac-trio-elegance",
      name: PRODUCT.name,
      description: PRODUCT.description,
      image: PRODUCT.images.map((item) => "https://ad-luxe.ma/" + item.src),
      brand: { "@type": "Brand", name: "AD_LUXE" },
      offers: { "@type": "Offer", url: "https://ad-luxe.ma/#produit", priceCurrency: "MAD", price: "200", availability: "https://schema.org/InStock" }
    });
    document.head.append(schema);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})();