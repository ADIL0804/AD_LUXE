(() => {
"use strict";

const P = {
  "ensemble-scarf": {
    "id": "ensemble-scarf",
    "name": "Ensemble Scarf",
    "price": 180,
    "category": "Vêtements",
    "sku": "ADL-SCARF-001",
    "desc": "Un ensemble féminin facile à porter et à assortir, disponible en marron, bleu, noir et rose.",
    "image": "/assets/products/ensemble-scarf/marron.webp",
    "colors": [
      "Marron",
      "Bleu",
      "Noir",
      "Rose"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ]
  }
};

const p = P[document.body.dataset.productId];
if (!p) return;

const CART_KEY = "adluxe_cart";
const e = (s) => String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const slug = (s) => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/&/g," ").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const imageFor = (color) => {
  if (p.variantImages?.[color]) return p.variantImages[color];
  if (p.fixedImage) return p.image;
  return `/assets/products/${p.id}/${slug(color)}.webp`;
};
const sizeLabel = p.category === "Chaussures" ? "Pointure" : "Taille";

let selectedColor = p.colors[0] || "";
let selectedSize = p.sizes[0] || "";

function syncCartCount() {
  let count = 0;
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    if (Array.isArray(saved)) count = saved.reduce((sum, item) => sum + Math.min(99, Math.max(1, parseInt(item?.qty, 10) || 1)), 0);
  } catch {}
  document.querySelectorAll("[data-cart-count]").forEach((node) => { node.textContent = String(count); });
}

const choiceButtons = (values, kind) => values.map((value, i) =>
  `<button class="adluxe-choice${i===0 ? " is-active" : ""}" type="button" data-${kind}="${e(value)}" aria-pressed="${i===0 ? "true" : "false"}">${e(value)}</button>`
).join("");

const thumbs = () => p.colors.length > 1 ? `<div class="adluxe-product-thumbs" aria-label="Autres couleurs">
  ${p.colors.map((color, i) => `<button class="adluxe-product-thumb${i===0 ? " is-active" : ""}" type="button" data-color="${e(color)}" aria-label="Voir ${e(color)}" aria-pressed="${i===0 ? "true" : "false"}"><img src="${e(imageFor(color))}" alt="${e(p.name)} — ${e(color)}" loading="lazy" decoding="async"></button>`).join("")}
</div>` : "";

function buildWhatsApp() {
  const lines = [
    `Bonjour AD_LUXE, je souhaite commander ${p.name}.`,
    "",
    `Couleur / variante : ${selectedColor || "À préciser"}`
  ];
  if (p.sizes.length) lines.push(`${sizeLabel} : ${selectedSize || "À préciser"}`);
  lines.push("Ville : ", "Nom : ", "Adresse : ", "Téléphone : ");
  return "https://wa.me/212644162453?text=" + encodeURIComponent(lines.join("\n"));
}

function syncWA() {
  const wa = document.querySelector("[data-wa]");
  if (wa) wa.href = buildWhatsApp();
}

function addToCart() {
  let cart = [];
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    if (Array.isArray(saved)) cart = saved;
  } catch {}

  const color = selectedColor || "";
  const size = selectedSize || "";
  const found = cart.find((item) => item?.id === p.id && (item.color || "") === color && (item.size || "") === size);

  if (found) {
    found.qty = Math.min(99, (parseInt(found.qty, 10) || 1) + 1);
    found.image = imageFor(color);
  } else {
    cart.push({
      id: p.id,
      name: p.name,
      price: p.price,
      image: imageFor(color),
      color,
      size,
      qty: 1
    });
  }

  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch {}
  syncCartCount();
  window.dispatchEvent(new Event("adluxe:cart-changed"));

  window.gtag?.("event", "add_to_cart", {
    currency: "MAD",
    value: p.price,
    items: [{
      item_id: p.id,
      item_name: p.name,
      item_brand: "AD_LUXE",
      item_category: p.category,
      item_variant: [color, size ? `${sizeLabel} ${size}` : ""].filter(Boolean).join(" · "),
      price: p.price,
      quantity: 1
    }]
  });

  const button = document.querySelector("[data-add-cart]");
  if (button) {
    const original = "+ Ajouter au panier";
    button.textContent = "✓ Ajouté au panier";
    button.setAttribute("aria-live", "polite");
    clearTimeout(button._resetTimer);
    button._resetTimer = setTimeout(() => { button.textContent = original; }, 1400);
  }
}

function selectColor(color) {
  selectedColor = color;
  const main = document.querySelector(".adluxe-product-main-image");
  if (main) {
    main.classList.add("is-switching");
    main.src = imageFor(color);
    main.alt = `${p.name} — ${color}`;
    setTimeout(() => main.classList.remove("is-switching"), 140);
  }
  document.querySelector("[data-selected-color]")?.replaceChildren(document.createTextNode(color));
  document.querySelectorAll("[data-color]").forEach((button) => {
    const active = button.dataset.color === color;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  syncWA();
}

function selectSize(size) {
  selectedSize = size;
  document.querySelector("[data-selected-size]")?.replaceChildren(document.createTextNode(size));
  document.querySelectorAll("[data-size]").forEach((button) => {
    const active = button.dataset.size === size;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  syncWA();
}

const mount = () => {
  document.body.insertAdjacentHTML("afterbegin", `<a class="skip-link" href="#contenu">Aller au contenu principal</a><div class="announcement">Livraison partout au Maroc · Paiement à la livraison</div><header class="site-header"><nav class="nav container" aria-label="Navigation principale"><a class="brand brand-logo" href="/"><img src="/ad-luxe-logo.svg" alt="AD_LUXE" width="240" height="50"></a><div class="nav-links"><a href="/#produit">Boutique</a><a href="/#livraison">Livraison</a><a href="/legal.html">Conditions</a></div><a class="btn btn-small adluxe-product-cart-link" href="/#panier" aria-label="Voir le panier">🛒 Panier <span data-cart-count>0</span></a></nav></header>`);

  const main = document.getElementById("contenu");
  main.className = "adluxe-product-page";
  main.innerHTML = `<div class="container">
    <nav class="adluxe-product-breadcrumbs" aria-label="Fil d’Ariane"><a href="/">Accueil</a><span>/</span><a href="/#produit">Boutique</a><span>/</span><span>${e(p.name)}</span></nav>
    <article class="adluxe-product-shell" itemscope itemtype="https://schema.org/Product">
      <meta itemprop="sku" content="${e(p.sku)}"><span itemprop="brand" itemscope itemtype="https://schema.org/Brand"><meta itemprop="name" content="AD_LUXE"></span><meta itemprop="category" content="${e(p.category)}">
      <div class="adluxe-product-media">
        <img class="adluxe-product-main-image" itemprop="image" src="${e(imageFor(selectedColor))}" alt="${e(p.name)} — ${e(selectedColor)}" decoding="async" fetchpriority="high">
        ${thumbs()}
      </div>
      <div class="adluxe-product-copy">
        <p class="adluxe-product-kicker">${e(p.category)} · AD_LUXE</p>
        <h1 itemprop="name">${e(p.name)}</h1>
        <p class="adluxe-product-status">✓ En stock</p>
        <p class="adluxe-product-price">${p.price} DH</p>
        <p class="adluxe-product-description" itemprop="description">${e(p.desc)}</p>

        <div class="adluxe-product-block">
          <h2>Couleur / variante : <span data-selected-color>${e(selectedColor)}</span></h2>
          <div class="adluxe-choice-list">${choiceButtons(p.colors, "color")}</div>
        </div>

        ${p.sizes.length ? `<div class="adluxe-product-block">
          <h2>${sizeLabel} : <span data-selected-size>${e(selectedSize)}</span></h2>
          <div class="adluxe-choice-list">${choiceButtons(p.sizes, "size")}</div>
        </div>` : ""}

        <div class="adluxe-product-facts">
          <div itemprop="offers" itemscope itemtype="https://schema.org/Offer"><meta itemprop="url" content="https://ad-luxe.ma/products/${e(p.id)}.html"><meta itemprop="priceCurrency" content="MAD"><meta itemprop="price" content="${p.price}"><link itemprop="availability" href="https://schema.org/InStock"><link itemprop="itemCondition" href="https://schema.org/NewCondition"></div>
          <div class="adluxe-product-fact"><strong>Casablanca</strong><span>20 DH · 24h estimées</span></div>
          <div class="adluxe-product-fact"><strong>Autres villes</strong><span>35 DH · 48–72h estimées</span></div>
          <div class="adluxe-product-fact"><strong>Paiement</strong><span>À la réception</span></div>
        </div>

        <div class="adluxe-product-cta">
          <button class="btn btn-outline" type="button" data-add-cart>+ Ajouter au panier</button>
          <a class="btn" data-wa target="_blank" rel="noopener noreferrer">Commander sur WhatsApp</a>
          <a class="btn btn-outline" href="/#panier">Voir le panier</a>
          <a class="btn btn-outline" href="/#produit">Retour à la boutique</a>
        </div>
        <p class="adluxe-product-small">${p.sizes.length
          ? `Votre couleur et votre ${sizeLabel.toLowerCase()} seront ajoutées automatiquement au panier et au message WhatsApp.`
          : "Votre couleur sera ajoutée automatiquement au panier et au message WhatsApp."}</p>
      </div>
    </article>
  </div>`;

  document.body.insertAdjacentHTML("beforeend", `<footer class="site-footer"><div class="copyright container">© 2026 AD_LUXE — <a href="/legal.html">Conditions & confidentialité</a></div></footer>`);

  document.querySelectorAll("[data-color]").forEach((button) => button.addEventListener("click", () => selectColor(button.dataset.color)));
  document.querySelectorAll("[data-size]").forEach((button) => button.addEventListener("click", () => selectSize(button.dataset.size)));
  document.querySelector("[data-add-cart]")?.addEventListener("click", addToCart);
  document.querySelectorAll('a[href="/#panier"]').forEach(link => link.addEventListener("click", event => { if (window.ADLUXE_CART) { event.preventDefault(); window.ADLUXE_CART.open(); } }));
  syncWA();
  syncCartCount();

  const wa = document.querySelector("[data-wa]");
  wa?.addEventListener("click", () => {
    const details = {
      checkout_type:"product_page", currency:"MAD", value:p.price,
      items:[{item_id:p.id,item_name:p.name,item_brand:"AD_LUXE",item_category:p.category,item_variant:[selectedColor, selectedSize ? sizeLabel+" "+selectedSize : ""].filter(Boolean).join(" · "),price:p.price,quantity:1}]
    };
    window.gtag?.("event","begin_checkout",details);
    window.gtag?.("event","order_whatsapp",details);
  });
  window.gtag?.("event","view_item",{currency:"MAD",value:p.price,items:[{item_id:p.id,item_name:p.name,item_brand:"AD_LUXE",item_category:p.category,price:p.price,quantity:1}]});
};

document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", mount, {once:true}) : mount();
})();
