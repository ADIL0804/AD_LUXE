(() => {
"use strict";

const P = {
  "ensemble-scarf": {
    id:"ensemble-scarf", name:"Ensemble Scarf", price:180, category:"Vêtements", sku:"ADL-SCARF-001",
    desc:"Un ensemble féminin facile à porter et à assortir, disponible en marron, bleu, noir et rose.",
    image:"/assets/products/ensemble-scarf/marron.webp",
    colors:["Marron","Bleu","Noir","Rose"], sizes:["S","M","L","XL"]
  },
  "parure-florea": {
    id:"parure-florea", name:"Parure Floréa — Collier & Bracelet", price:155, category:"Bijoux", sku:"ADL-BIJ-FLOREA-001",
    desc:"Duo collier et bracelet aux motifs floraux, avec finitions dorées et détails lumineux, disponible en plusieurs couleurs.",
    image:"/assets/products/parure-florea/noir.webp",
    colors:["Noir","Rouge","Marron","Vert","Rose","Bleu"], sizes:[]
  },
  "parure-eliane": {
    id:"parure-eliane", name:"Parure Éliane — Collier & Bracelet", price:80, category:"Bijoux", sku:"ADL-BIJ-ELIANE-001",
    desc:"Duo collier et bracelet au dessin végétal, orné de pierres lumineuses et disponible en dix déclinaisons.",
    image:"/assets/products/parure-eliane/vert-emeraude.webp",
    colors:["Vert émeraude","Rouge & vert","Argent bleu & blanc","Rose & bleu","Blanc & vert","Argent bleu & rose","Blanc","Violet & vert","Bleu ciel","Rouge"], sizes:[]
  },
  "sandales-confort-elegance": {
    id:"sandales-confort-elegance", name:"Sandales Confort Élégance", price:150, category:"Chaussures", sku:"ADL-CH-SCE-001",
    desc:"Sandales compensées légères et confortables, disponibles en noir et beige.",
    image:"/assets/products/sandales-confort-elegance/noir.webp",
    colors:["Noir","Beige"], sizes:["37","38","39","40"]
  },
  "mules-perla-elegance": {
    id:"mules-perla-elegance", name:"Mules Perla Élégance", price:180, category:"Chaussures", sku:"ADL-CH-MPE-001",
    desc:"Mules à talon carré avec tulle brodé et perles délicates, disponibles en marron et noir.",
    image:"/assets/products/mules-perla-elegance/marron.webp",
    colors:["Marron","Noir"], sizes:["36","37","38","39"]
  },
  "mules-velours-croisees": {
    id:"mules-velours-croisees", name:"Mules Velours Croisées", price:180, category:"Chaussures", sku:"ADL-CH-MVC-001",
    desc:"Mules compensées au toucher velours, brides croisées et plateforme stable, disponibles en noir et camel.",
    image:"/assets/products/mules-velours-croisees/noir.webp",
    colors:["Noir","Camel"], sizes:["36","37","38","39"]
  },
  "baskets-urban-chic": {
    id:"baskets-urban-chic", name:"Baskets Urban Chic", price:180, category:"Chaussures", sku:"ADL-CH-BUC-001",
    desc:"Baskets femme tendance et confortables pour le quotidien, disponibles en plusieurs coloris.",
    image:"/assets/products/baskets-urban-chic/gris.webp",
    colors:["Gris","Blanc & noir","Beige","Noir"], sizes:["36","37","38","39","40"]
  },
  "sandales-elegance": {
    id:"sandales-elegance", name:"Sandales Élégance Confort", price:149, category:"Chaussures", sku:"ADL-CH-SEC-001",
    desc:"Sandales femme chic et confortables avec semelle légère, disponibles en plusieurs coloris.",
    image:"/assets/products/sandales-elegance/sandale-01.webp",
    colors:["Camel","Marron","Noir","Beige"], sizes:["37","38","39"],
    variantImages:{
      "Camel":"/assets/products/sandales-elegance/sandale-01.webp",
      "Marron":"/assets/products/sandales-elegance/sandale-02.webp",
      "Noir":"/assets/products/sandales-elegance/sandale-03.webp",
      "Beige":"/assets/products/sandales-elegance/sandale-04.webp"
    }
  },
  "rose-berry-trio": {
    id:"rose-berry-trio", name:"Rose Berry Trio", price:100, category:"Parfumerie & beauté", sku:"ADL-BEA-RBT-001",
    desc:"Coffret beauté Rose Berry réunissant blush liquide, highlighter lumineux et lipgloss mat.",
    image:"/assets/products/parfumerie/rose-berry-trio.webp",
    colors:["Coffret"], sizes:[], fixedImage:true
  },
  "rose-berry-nude-pink": {
    id:"rose-berry-nude-pink", name:"Rose Berry Nude Pink Lip Duo", price:100, category:"Parfumerie & beauté", sku:"ADL-BEA-RBNP-001",
    desc:"Coffret lèvres nude pink avec crayon contour, gloss et rouge à lèvres mat.",
    image:"/assets/products/parfumerie/rose-berry-nude-pink.webp",
    colors:["Nude Pink"], sizes:[], fixedImage:true
  },
  "sac-elegance-signature": {
    id:"sac-elegance-signature", name:"Sac Élégance Signature", price:200, category:"Sacs", sku:"ADL-SAC-SES-001",
    desc:"Sac à main structuré au style chic avec finitions dorées et bandoulière amovible.",
    image:"/assets/products/sac-elegance-signature/noir.webp",
    colors:["Noir","Crème","Bleu ciel","Bordeaux","Marron","Beige","Gris","Blanc","Rose poudré","Camel"], sizes:[]
  },
  "sac-bandouliere-elegance": {
    id:"sac-bandouliere-elegance", name:"Sac Bandoulière Élégance", price:170, category:"Sacs", sku:"ADL-SAC-SBE-001",
    desc:"Sac bandoulière compact et raffiné avec fermoir doré et sangle réglable.",
    image:"/assets/products/sac-bandouliere-elegance/rouge.webp",
    colors:["Rouge","Bordeaux","Cognac","Crème","Blanc","Noir","Marron","Beige","Camel"], sizes:[]
  },
  "sac-trio-elegance": {
    id:"sac-trio-elegance", name:"Sac Trio Élégance", price:200, category:"Sacs", sku:"ADL-SAC-TRIO-001",
    desc:"Ensemble élégant 3 pièces avec grand sac à main, pochette assortie et portefeuille.",
    image:"/assets/products/sac-trio-elegance/noir-bordeaux.webp",
    colors:["Noir & bordeaux","Blanc & noir","Bleu marine & crème","Bordeaux & noir","Crème & bleu marine","Camel & noir","Rose & noir"], sizes:[]
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
        <p class="adluxe-product-small">Votre couleur${p.sizes.length ? ` et votre ${sizeLabel.toLowerCase()}` : ""} seront ajoutées automatiquement au panier et au message WhatsApp.</p>
      </div>
    </article>
  </div>`;

  document.body.insertAdjacentHTML("beforeend", `<footer class="site-footer"><div class="copyright container">© 2026 AD_LUXE — <a href="/legal.html">Conditions & confidentialité</a></div></footer>`);

  document.querySelectorAll("[data-color]").forEach((button) => button.addEventListener("click", () => selectColor(button.dataset.color)));
  document.querySelectorAll("[data-size]").forEach((button) => button.addEventListener("click", () => selectSize(button.dataset.size)));
  document.querySelector("[data-add-cart]")?.addEventListener("click", addToCart);
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