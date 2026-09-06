(() => {
  "use strict";

  const CONSENT_KEY = "adluxe_analytics_consent";
  const PRODUCT_PAGES = {"ensemble-scarf":"/products/ensemble-scarf.html","parure-florea":"/products/parure-florea.html","parure-eliane":"/products/parure-eliane.html","sandales-confort-elegance":"/products/sandales-confort-elegance.html","mules-perla-elegance":"/products/mules-perla-elegance.html","mules-velours-croisees":"/products/mules-velours-croisees.html","baskets-urban-chic":"/products/baskets-urban-chic.html","sandales-elegance":"/products/sandales-elegance.html","rose-berry-trio":"/products/rose-berry-trio.html","rose-berry-nude-pink":"/products/rose-berry-nude-pink.html","sac-elegance-signature":"/products/sac-elegance-signature.html","sac-bandouliere-elegance":"/products/sac-bandouliere-elegance.html","sac-trio-elegance":"/products/sac-trio-elegance.html"};

  function track(name, params = {}) {
    if (typeof window.gtag === "function") window.gtag("event", name, params);
  }

  function ensureStyles() {
    if (document.querySelector('link[data-adluxe-upgrade]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/upgrade.css?v=20260824-1";
    link.dataset.adluxeUpgrade = "true";
    document.head.append(link);
  }

  function itemFromCard(card, index = 0) {
    const price = Number(card.dataset.price || 0);
    const variant = card.querySelector(".selected-color, #selectedColor, .shoe-photo-label")?.textContent?.trim() || card.dataset.defaultColor || "";
    const size = card.querySelector(".selected-size, .shoe-selected-size")?.textContent?.trim() || card.dataset.defaultSize || "";
    return {
      item_id: card.dataset.productId || "",
      item_name: card.dataset.name || card.querySelector("h3")?.textContent?.trim() || "",
      item_brand: "AD_LUXE",
      item_category: card.dataset.category || "",
      item_variant: [variant, size ? "Pointure " + size : ""].filter(Boolean).join(" · "),
      price,
      quantity: 1,
      index
    };
  }

  function enhanceProducts() {
    const cards = [...document.querySelectorAll(".product-card[data-product-id]")];
    cards.forEach((card) => {
      card.querySelectorAll("img").forEach((img) => {
        if (!img.closest(".hero")) {
          img.loading = "lazy";
          img.decoding = "async";
          img.fetchPriority = "low";
        }
      });

      const id = card.dataset.productId;
      const target = PRODUCT_PAGES[id];
      if (!target || card.querySelector(".adluxe-product-detail-link")) return;
      const link = document.createElement("a");
      link.className = "adluxe-product-detail-link";
      link.href = target;
      link.textContent = "Voir la fiche complète";
      link.setAttribute("aria-label", "Voir la fiche complète de " + (card.dataset.name || "ce produit"));
      const note = card.querySelector(".order-note");
      if (note) note.insertAdjacentElement("afterend", link);
      else card.querySelector(".product-info")?.append(link);
    });

    if (cards.length) {
      track("view_item_list", {
        item_list_id: "adluxe_selection",
        item_list_name: "La sélection AD_LUXE",
        items: cards.map(itemFromCard)
      });

      if ("IntersectionObserver" in window) {
        const seen = new Set();
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting || entry.intersectionRatio < 0.55) return;
            const card = entry.target;
            const id = card.dataset.productId;
            if (!id || seen.has(id)) return;
            seen.add(id);
            const item = itemFromCard(card);
            track("view_item", {
              currency: "MAD",
              value: item.price,
              items: [item]
            });
            observer.unobserve(card);
          });
        }, { threshold: [0.55] });
        cards.forEach((card) => observer.observe(card));
      }
    }
  }

  function addTrustNotice() {
    const strip = document.querySelector(".trust-strip");
    if (!strip || document.querySelector(".adluxe-security-strip")) return;
    const section = document.createElement("section");
    section.className = "adluxe-security-strip";
    section.setAttribute("aria-label", "Commande en confiance");
    section.innerHTML = `
      <div class="container adluxe-security-grid">
        <span><strong>Canal officiel</strong> WhatsApp 06 44 16 24 53</span>
        <span><strong>Aucun paiement en ligne</strong> règlement à la réception</span>
        <span><strong>Échange sous 48h</strong> <a href="/legal.html#echange">voir les conditions</a></span>
      </div>`;
    strip.insertAdjacentElement("afterend", section);
  }

  function consentValue() {
    try { return localStorage.getItem(CONSENT_KEY); } catch { return null; }
  }

  function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch {}
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: value === "granted" ? "granted" : "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied"
      });
      if (value === "granted") track("analytics_consent_granted");
    }
    document.querySelector(".adluxe-consent")?.remove();
  }

  function showConsent(force = false) {
    if (!force && consentValue()) return;
    document.querySelector(".adluxe-consent")?.remove();

    const banner = document.createElement("section");
    banner.className = "adluxe-consent";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Préférences de mesure d’audience");
    banner.innerHTML = `
      <div class="adluxe-consent-copy">
        <strong>Mesure d’audience</strong>
        <p>AD_LUXE utilise Google Analytics pour comprendre les visites et améliorer la boutique. Vous pouvez accepter ou refuser cette mesure.</p>
        <a href="/legal.html#confidentialite">Confidentialité</a>
      </div>
      <div class="adluxe-consent-actions">
        <button type="button" class="btn btn-outline" data-consent="denied">Refuser</button>
        <button type="button" class="btn" data-consent="granted">Accepter</button>
      </div>`;
    banner.addEventListener("click", (event) => {
      const button = event.target.closest("[data-consent]");
      if (button) setConsent(button.dataset.consent);
    });
    document.body.append(banner);
    banner.querySelector('[data-consent="granted"]')?.focus({ preventScroll: true });
  }

  function addConsentManager() {
    const footer = document.querySelector(".site-footer .copyright");
    if (!footer || footer.querySelector(".adluxe-consent-manage")) return;
    const button = document.createElement("button");
    button.className = "adluxe-consent-manage";
    button.type = "button";
    button.textContent = "Gérer la mesure d’audience";
    button.addEventListener("click", () => showConsent(true));
    footer.append(" · ", button);
  }

  function addInteractionTracking() {
    document.addEventListener("click", (event) => {
      const detail = event.target.closest(".adluxe-product-detail-link");
      if (detail) {
        const card = detail.closest(".product-card");
        track("product_detail_click", card ? { item_id: card.dataset.productId, item_name: card.dataset.name } : {});
        return;
      }

      const wa = event.target.closest(".order-btn, #adluxe-cart-wa");
      if (wa && wa.getAttribute("aria-disabled") !== "true") {
        const card = wa.closest(".product-card");
        track("whatsapp_order_click", {
          checkout_type: card ? "direct" : "cart",
          item_id: card?.dataset.productId || "",
          item_name: card?.dataset.name || "",
          currency: "MAD",
          value: card ? Number(card.dataset.price || 0) : undefined
        });
      }
    }, true);

    const search = document.getElementById("adluxe-search");
    if (search) {
      let timer;
      search.addEventListener("input", () => {
        clearTimeout(timer);
        const term = search.value.trim();
        if (!term) return;
        timer = setTimeout(() => track("search", { search_term: term }), 650);
      });
    }
  }

  function hardenExternalLinks() {
    document.querySelectorAll('a[target="_blank"]').forEach((link) => {
      const rel = new Set((link.getAttribute("rel") || "").split(/\s+/).filter(Boolean));
      rel.add("noopener");
      rel.add("noreferrer");
      link.setAttribute("rel", [...rel].join(" "));
    });
  }

  function init() {
    addTrustNotice();
    enhanceProducts();
    addConsentManager();
    addInteractionTracking();
    hardenExternalLinks();
    showConsent(false);
  }

  ensureStyles();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
