(() => {
  "use strict";

  const BASE = "https://ad-luxe.ma";

  function whenReady(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn, { once: true });
    else fn();
  }

  function existingStructuredIds() {
    const ids = new Set();
    document.querySelectorAll('script[type="application/ld+json"]').forEach((node) => {
      try {
        const data = JSON.parse(node.textContent || "{}");
        const entries = Array.isArray(data) ? data : [data];
        entries.forEach((entry) => {
          if (entry && typeof entry === "object" && entry["@id"]) ids.add(entry["@id"]);
        });
      } catch {}
    });
    return ids;
  }

  function productPageUrl(card) {
    const detail = card.querySelector(".adluxe-product-detail-link");
    if (detail) return new URL(detail.getAttribute("href"), location.origin).href;
    return BASE + "/#produit";
  }

  function imageUrls(card) {
    const urls = [];
    card.querySelectorAll(".thumb img, .main-product-image, #mainProductImage").forEach((img) => {
      const raw = img.getAttribute("src");
      if (!raw) return;
      const absolute = new URL(raw, location.origin).href;
      if (!urls.includes(absolute)) urls.push(absolute);
    });
    return urls.slice(0, 8);
  }

  function selectedVariants(card) {
    const colors = [...card.querySelectorAll(".color-btn")]
      .map((button) => button.textContent.trim())
      .filter(Boolean);
    const sizes = [...card.querySelectorAll(".size-btn")]
      .map((button) => button.textContent.trim())
      .filter(Boolean);
    return { colors: [...new Set(colors)], sizes: [...new Set(sizes)] };
  }

  function addProductStructuredData() {
    const known = existingStructuredIds();
    document.querySelectorAll(".product-card[data-product-id]").forEach((card) => {
      const id = card.dataset.productId;
      if (!id) return;
      const schemaId = BASE + "/#" + id;
      if (known.has(schemaId) || document.getElementById("schema-" + id)) return;

      const name = card.dataset.name || card.querySelector("h3")?.textContent?.trim() || id;
      const description = card.querySelector(".product-subtitle")?.textContent?.trim() || "Produit AD_LUXE disponible avec livraison partout au Maroc.";
      const price = Number(card.dataset.price || 0);
      const variants = selectedVariants(card);
      const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": schemaId,
        name,
        description,
        image: imageUrls(card),
        sku: "ADL-" + id.toUpperCase().replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, ""),
        brand: { "@type": "Brand", name: "AD_LUXE" },
        offers: {
          "@type": "Offer",
          url: productPageUrl(card),
          priceCurrency: "MAD",
          price: String(price),
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@id": BASE + "/#store" }
        }
      };
      if (variants.colors.length) schema.color = variants.colors;
      if (variants.sizes.length) schema.size = variants.sizes;

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "schema-" + id;
      script.textContent = JSON.stringify(schema);
      document.head.append(script);
      known.add(schemaId);
    });
  }

  function cartItemsFromDom() {
    return [...document.querySelectorAll(".adluxe-cart-item")].map((row, index) => {
      const name = row.querySelector("strong")?.textContent?.trim() || "Article AD_LUXE";
      const text = row.textContent || "";
      const priceMatch = text.match(/(\d+(?:[.,]\d+)?)\s*DH/);
      const qtyMatch = text.match(/×\s*(\d+)/);
      return {
        item_name: name,
        item_brand: "AD_LUXE",
        price: priceMatch ? Number(priceMatch[1].replace(",", ".")) : undefined,
        quantity: qtyMatch ? Number(qtyMatch[1]) : 1,
        index
      };
    });
  }

  function addCheckoutTracking() {
    document.addEventListener("click", (event) => {
      const link = event.target.closest(".order-btn, #adluxe-cart-wa");
      if (!link || link.getAttribute("aria-disabled") === "true") return;
      if (typeof window.gtag !== "function") return;

      const card = link.closest(".product-card[data-product-id]");
      let items = [];
      let value;
      if (card) {
        const price = Number(card.dataset.price || 0);
        const variant = card.querySelector(".selected-color, #selectedColor, .shoe-photo-label")?.textContent?.trim() || card.dataset.defaultColor || "";
        const size = card.querySelector(".selected-size, .shoe-selected-size")?.textContent?.trim() || card.dataset.defaultSize || "";
        items = [{
          item_id: card.dataset.productId,
          item_name: card.dataset.name,
          item_brand: "AD_LUXE",
          item_category: card.dataset.category || "",
          item_variant: [variant, size ? "Pointure " + size : ""].filter(Boolean).join(" · "),
          price,
          quantity: 1
        }];
        value = price;
      } else {
        items = cartItemsFromDom();
        const totalText = document.getElementById("adluxe-cart-total")?.textContent || "";
        const totalMatch = totalText.match(/(\d+(?:[.,]\d+)?)\s*DH/);
        value = totalMatch ? Number(totalMatch[1].replace(",", ".")) : undefined;
      }

      window.gtag("event", "begin_checkout", {
        currency: "MAD",
        value,
        items,
        checkout_channel: "whatsapp"
      });
    }, { capture: true });
  }

  function strengthenImageHints() {
    document.querySelectorAll(".product-card img").forEach((img) => {
      if (!img.hasAttribute("decoding")) img.decoding = "async";
      if (img.closest(".thumbnails, .shoe-thumbnails")) {
        img.loading = "lazy";
        img.fetchPriority = "low";
      }
    });
  }

  whenReady(() => {
    addProductStructuredData();
    addCheckoutTracking();
    strengthenImageHints();
  });
})();
