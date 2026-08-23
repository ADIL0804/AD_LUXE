(() => {
  "use strict";

  const root = document.querySelector("[data-adluxe-chatbot]");
  if (!root) return;

  const launcher = root.querySelector(".adluxe-chat-launcher");
  const panel = root.querySelector(".adluxe-chat-panel");
  const closeButton = root.querySelector(".adluxe-chat-close");
  const messages = root.querySelector(".adluxe-chat-messages");
  const form = root.querySelector(".adluxe-chat-form");
  const input = root.querySelector(".adluxe-chat-input");
  const topicButtons = root.querySelectorAll("[data-chat-topic]");

  const whatsappUrl = (message) =>
    `https://wa.me/212644162453?text=${encodeURIComponent(message)}`;

  const topics = {
    order: {
      text: "Choisissez l’article, la couleur et la pointure, puis cliquez sur « Ajouter au panier » ou « Commander ». Votre récapitulatif s’ouvrira automatiquement sur WhatsApp.",
      actions: [
        { label: "Voir les produits", href: "#produit" },
        {
          label: "Commander sur WhatsApp",
          href: whatsappUrl("Bonjour AD_LUXE, je souhaite passer une commande.\n\nNom : \nVille : "),
          external: true,
        },
      ],
    },
    delivery: {
      text: "La livraison coûte 20 DH à Casablanca et 35 DH dans les autres villes du Maroc. Vous payez seulement à la réception.",
    },
    delay: {
      text: "Le délai annoncé est de 24h à Casablanca et de 48 à 72h pour les autres villes. Le livreur vous contacte avant son passage.",
    },
    payment: {
      text: "Aucun paiement en ligne n’est demandé. Vous réglez votre commande en espèces au livreur, au moment de la réception.",
    },
    exchange: {
      text: "Vous pouvez demander un échange sous 48h après réception. L’article doit rester intact, non porté et avec ses étiquettes.",
      actions: [
        {
          label: "Demander un échange",
          href: whatsappUrl("Bonjour AD_LUXE, je souhaite demander un échange.\n\nRéférence : \nArticle : \nMotif : "),
          external: true,
        },
      ],
    },
    tracking: {
      text: "Gardez la référence AD_LUXE reçue avec votre récapitulatif. Envoyez-la sur WhatsApp pour connaître l’état de votre colis.",
      actions: [
        {
          label: "Suivre ma commande",
          href: whatsappUrl("Bonjour AD_LUXE, je souhaite suivre ma commande.\n\nRéférence : \nNom : \nVille : "),
          external: true,
        },
      ],
    },
    categories: {
      text: "Vous trouverez des vêtements, accessoires, bijoux, sacs, chaussures et parfumerie. Les articles disponibles sont regroupés dans la section Nouveautés.",
      actions: [{ label: "Découvrir les articles", href: "#produit" }],
    },
    human: {
      text: "Bien sûr. Écrivez directement à l’équipe AD_LUXE sur WhatsApp ; elle pourra vous conseiller et confirmer votre commande.",
      actions: [
        {
          label: "Parler à l’équipe",
          href: whatsappUrl("Bonjour AD_LUXE, j’ai besoin d’aide.\n\nNom : \nVille : "),
          external: true,
        },
      ],
    },
    hello: {
      text: "Salam 👋 Bienvenue chez AD_LUXE. Je peux vous renseigner sur les produits, la livraison, le paiement, le suivi ou les échanges.",
    },
  };

  const normalise = (value) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’']/g, " ")
      .trim();

  const uniqueValues = (values) => [...new Set(values.filter(Boolean))];

  const readProducts = () => Array.from(document.querySelectorAll(".product-card"))
    .map((card) => {
      const colors = uniqueValues([
        ...Array.from(card.querySelectorAll(".color-btn[data-color-target]"), (button) =>
          button.dataset.colorTarget?.trim()
        ),
        ...Array.from(card.querySelectorAll(".shoe-thumb[data-shoe-color]"), (button) =>
          button.dataset.shoeColor?.trim()
        ),
      ]);
      const sizes = uniqueValues([
        ...Array.from(card.querySelectorAll(".size-btn[data-size]"), (button) =>
          button.dataset.size?.trim()
        ),
        ...Array.from(card.querySelectorAll(".shoe-size-btn[data-shoe-size]"), (button) =>
          button.dataset.shoeSize?.trim()
        ),
      ]);
      return {
      name: card.dataset.name || card.querySelector("h3")?.textContent.trim() || "Article AD_LUXE",
      category: card.dataset.category || "",
      price: Number(card.dataset.price || 0),
      description: card.querySelector(".product-subtitle")?.textContent.trim() || "",
      colors: colors.length ? colors : uniqueValues([card.dataset.defaultColor]),
      sizes: sizes.length ? sizes : uniqueValues([card.dataset.defaultSize]),
    };
    })
    .filter((product) => product.name && product.price > 0)
    .map((product) => ({ ...product, searchName: normalise(product.name) }));

  let products = [];
  let knownColors = [];

  const refreshCatalog = () => {
    products = readProducts();
    knownColors = uniqueValues(products.flatMap((item) => item.colors)).sort(
      (a, b) => b.length - a.length
    );
  };

  refreshCatalog();

  const categoryLabels = {
    vetements: "Vêtements",
    accessoires: "Accessoires",
    bijoux: "Bijoux",
    sacs: "Sacs",
    chaussures: "Chaussures",
    parfumerie: "Parfumerie",
  };

  const findRequestedColor = (text) =>
    knownColors.find((color) => {
      const searchColor = normalise(color);
      return text.includes(searchColor) ||
        (searchColor.includes(" ") && text.includes(searchColor.split(" ")[0]));
    }) || null;

  const categoryPatterns = [
    { id: "vetements", pattern: /(vetement|habit|robe|ensemble|top|pantalon|lbsa|7wayj|ملابس|لباس)/ },
    { id: "accessoires", pattern: /(accessoire|lunette|ceinture|montre|اكسسوار|نظارات|ساعة)/ },
    { id: "bijoux", pattern: /(bijou|collier|bracelet|parure|chaine|خاتم|قلادة|سوار|مجوهرات)/ },
    { id: "sacs", pattern: /(sac|cabas|bandouliere|شنطة|حقيبة)/ },
    { id: "chaussures", pattern: /(chaussure|sandale|mule|basket|talon|sbat|صندل|حذاء)/ },
    { id: "parfumerie", pattern: /(parfum|brume|coffret|3طر|عطر|عطور)/ },
  ];

  const cityPatterns = [
    { name: "Casablanca", pattern: /(casablanca|casa|كازا|الدار البيضاء)/, casa: true },
    { name: "Rabat", pattern: /(rabat|الرباط)/ },
    { name: "Marrakech", pattern: /(marrakech|marrakesh|مراكش)/ },
    { name: "Fès", pattern: /(^|\s)(fes|fès|فاس)(\s|$)/ },
    { name: "Tanger", pattern: /(tanger|tangier|طنجة)/ },
    { name: "Agadir", pattern: /(agadir|أكادير|اكادير)/ },
    { name: "Meknès", pattern: /(meknes|مكناس)/ },
    { name: "Oujda", pattern: /(oujda|وجدة)/ },
    { name: "Kénitra", pattern: /(kenitra|القنيطرة)/ },
    { name: "Tétouan", pattern: /(tetouan|تطوان)/ },
    { name: "El Jadida", pattern: /(el jadida|الجديدة)/ },
    { name: "Mohammedia", pattern: /(mohammedia|المحمدية)/ },
    { name: "Safi", pattern: /(^|\s)(safi|آسفي|اسفي)(\s|$)/ },
    { name: "Béni Mellal", pattern: /(beni mellal|بني ملال)/ },
    { name: "Nador", pattern: /(nador|الناظور)/ },
  ];

  let activeProduct = null;

  const productActions = (product) => [
    { label: "Voir les produits", href: "#produit" },
    {
      label: `Commander ${product.name}`,
      href: whatsappUrl(
        `Bonjour AD_LUXE, je souhaite commander : ${product.name}.\n\n${product.colors.length ? "Couleur : \n" : ""}${product.sizes.length ? "Pointure : \n" : ""}Nom : \nVille : `
      ),
      external: true,
    },
  ];

  const findProduct = (text) => {
    const direct = products.find((product) => text.includes(product.searchName));
    if (direct) return direct;

    const aliases = [
      ["scarf", "scarf"],
      ["florea", "florea"],
      ["eliane", "eliane"],
      ["baskets urban", "baskets urban chic"],
      ["urban chic", "baskets urban chic"],
      ["rose berry trio", "rose berry trio"],
      ["nude pink", "nude pink"],
      ["sandales elegance", "sandales elegance confort"],
      ["sandales confort", "sandales confort elegance"],
      ["perla", "perla"],
      ["velours", "velours"],
      ["croisees", "croisees"],
    ];

    for (const [alias, productName] of aliases) {
      if (text.includes(alias)) {
        const match = products.find((product) => product.searchName.includes(productName));
        if (match) return match;
      }
    }
    return null;
  };

  const findCategory = (text) => categoryPatterns.find((category) => category.pattern.test(text))?.id || null;

  const listProducts = (items) =>
    items.map((product) => `${product.name} — ${product.price} DH`).join("\n");

  const productSummary = (product) => {
    const details = [`${product.name} coûte ${product.price} DH.`];
    if (product.description) details.push(product.description);
    if (product.colors.length) details.push(`Couleurs : ${product.colors.join(", ")}.`);
    if (product.sizes.length) details.push(`Pointures : ${product.sizes.join(", ")}.`);
    details.push("Disponible en stock.");
    return details.join("\n");
  };

  const buildKnowledgeAnswer = (value) => {
    refreshCatalog();
    const text = normalise(value);
    const requestedColor = findRequestedColor(text);
    const wantsPrice = /(prix|price|coute|combien|tman|taman|thaman|chhal|الثمن|ثمن)/.test(text);
    const wantsColor = /(couleur|color|loun|لون|الوان|الألوان)/.test(text) || Boolean(requestedColor);
    const wantsSize = /(pointure|taille|size|numero|nmra|قياس|مقاس)/.test(text);
    const wantsStock = /(dispo|disponible|stock|mazal|متوفر|موجود)/.test(text);
    const wantsDescription = /(description|detail|information|c est quoi|chno howa|شنو هو|تفاصيل)/.test(text);
    const wantsOrder = /(commander|commande|acheter|ncommandi|nkomondi|nchri|طلب|كوموند|نشري)/.test(text);
    const logisticsIntent = /(livraison|livrer|frais|transport|delai|katwslo|katoslo|tawsil|التوصيل)/.test(text);
    const genericCatalogQuery = /(chi haja|article|produit|3ndkom|عندكم|شي حاجة)/.test(text);
    const productIntent = wantsPrice || wantsColor || wantsSize || wantsStock || wantsDescription || wantsOrder;
    const explicitProduct = findProduct(text);
    const product = explicitProduct ||
      (productIntent && !logisticsIntent && !genericCatalogQuery ? activeProduct : null);

    const city = cityPatterns.find((item) => item.pattern.test(text));
    if (city && /(livraison|livrer|frais|delai|katwslo|katoslo|tawsil|التوصيل|شحال)/.test(text)) {
      return city.casa
        ? { text: "À Casablanca, la livraison coûte 20 DH et le délai annoncé est de 24h. Le paiement se fait à la réception." }
        : { text: `Oui, nous livrons à ${city.name}. La livraison coûte 35 DH et prend généralement 48 à 72h. Le paiement se fait à la réception.` };
    }

    if (product) {
      activeProduct = product;
      if (wantsOrder) {
        return {
          text: `${product.name} est disponible à ${product.price} DH. Choisissez votre couleur${product.sizes.length ? " et votre pointure" : ""}, puis envoyez la demande sur WhatsApp.`,
          actions: productActions(product),
        };
      }
      if (wantsColor) {
        if (requestedColor) {
          const colorName = normalise(requestedColor);
          const isAvailable = product.colors.some((color) => {
            const available = normalise(color);
            return available.includes(colorName) || colorName.includes(available);
          });
          return {
            text: isAvailable
              ? `Oui, ${product.name} est disponible en ${requestedColor}.`
              : `${product.name} n’est pas affiché en ${requestedColor}. Couleurs disponibles : ${product.colors.join(", ")}.`,
          };
        }
        return {
          text: product.colors.length
            ? `${product.name} est disponible en : ${product.colors.join(", ")}.`
            : `Aucune couleur supplémentaire n’est indiquée pour ${product.name}.`,
        };
      }
      if (wantsSize) {
        return {
          text: product.sizes.length
            ? `Les pointures disponibles pour ${product.name} sont : ${product.sizes.join(", ")}.`
            : `${product.name} n’a pas de pointure à sélectionner.`,
        };
      }
      if (wantsPrice) return { text: `${product.name} coûte ${product.price} DH.` };
      if (wantsStock) return { text: `Oui, ${product.name} est actuellement disponible en stock à ${product.price} DH.` };
      return { text: productSummary(product), actions: productActions(product) };
    }

    if (requestedColor) {
      const colorName = normalise(requestedColor);
      const matches = products.filter((item) =>
        item.colors.some((color) => {
          const available = normalise(color);
          return available.includes(colorName) || colorName.includes(available);
        })
      );
      if (matches.length) {
        return {
          text: `Articles disponibles avec la couleur ${requestedColor} :\n${listProducts(matches)}`,
          actions: [{ label: "Voir les articles", href: "#produit" }],
        };
      }
    }

    const sizeMatch = text.match(/\b(3[6-9]|40)\b/);
    if (sizeMatch && (wantsSize || /(kayn|dispo|بغيت|كاين)/.test(text))) {
      const matches = products.filter((item) => item.sizes.includes(sizeMatch[1]));
      return matches.length
        ? {
            text: `La pointure ${sizeMatch[1]} est disponible pour :\n${listProducts(matches)}`,
            actions: [{ label: "Voir les chaussures", href: "#produit" }],
          }
        : { text: `Je ne vois aucun article disponible en pointure ${sizeMatch[1]} pour le moment.` };
    }

    const amountMatch = text.match(/(\d{2,4})\s*(?:dh|dhs|dirham)?/);
    if (amountMatch && /(budget|moins de|maximum|max|taht|ta7t|f had|بميزانية|تحت|بغيت شي حاجة)/.test(text)) {
      const amount = Number(amountMatch[1]);
      const matches = products.filter((item) => item.price <= amount).sort((a, b) => a.price - b.price);
      return matches.length
        ? {
            text: `Avec un budget de ${amount} DH, voici les articles disponibles :\n${listProducts(matches)}`,
            actions: [{ label: "Voir les articles", href: "#produit" }],
          }
        : { text: `Je ne vois aucun article à ${amount} DH ou moins pour le moment.` };
    }

    if (/(moins cher|le moins cher|cheapest|arkhas|rkhis|ارخص|أرخص)/.test(text) && products.length) {
      const lowestPrice = Math.min(...products.map((item) => item.price));
      const matches = products.filter((item) => item.price === lowestPrice);
      return {
        text: `L’article le moins cher actuellement est :\n${listProducts(matches)}`,
        actions: [{ label: "Voir l’article", href: "#produit" }],
      };
    }

    if (/(conseille|conseil|recommande|suggestion|nqtrh|n9trh|شنو تنصح|اقتراح)/.test(text) && products.length) {
      const suggestions = [...products].sort((a, b) => a.price - b.price).slice(0, 3);
      return {
        text: `Voici 3 suggestions disponibles :\n${listProducts(suggestions)}\nDites-moi le nom d’un article pour connaître ses couleurs ou ses pointures.`,
        actions: [{ label: "Voir les suggestions", href: "#produit" }],
      };
    }

    const category = findCategory(text);
    if (category) {
      const matches = products.filter((item) => item.category === category);
      return matches.length
        ? {
            text: `${categoryLabels[category]} disponibles :\n${listProducts(matches)}`,
            actions: [{ label: `Voir ${categoryLabels[category].toLowerCase()}`, href: "#produit" }],
          }
        : {
            text: `La catégorie ${categoryLabels[category]} arrive prochainement. Aucun article n’est encore affiché dans cette catégorie.`,
            actions: [{ label: "Voir les articles disponibles", href: "#produit" }],
          };
    }

    if (city) {
      return city.casa
        ? { text: "Nous livrons à Casablanca : 20 DH, avec un délai annoncé de 24h." }
        : { text: `Nous livrons bien à ${city.name} : 35 DH, généralement sous 48 à 72h.` };
    }

    return null;
  };

  const detectTopic = (value) => {
    const text = normalise(value);
    if (/(suivi|suivre|colis|reference|fin.*(commande|komond)|فين.*كوموند|commande.*fin)/.test(text)) return "tracking";
    if (/(echange|echanger|retour|rembour|nbdel|nbedel|nrj3|بدل|تبديل|رجع)/.test(text)) return "exchange";
    if (/(delai|duree|temps|combien.*jour|chhal.*(wa9t|waqt|nhar)|imta|24h|48h|72h|شحال.*وقت|فوقاش)/.test(text)) return "delay";
    if (/(livraison|livrer|frais|transport|casablanca|katwslo|katoslo|tawsil|المدينة|التوصيل)/.test(text)) return "delivery";
    if (/(paiement|payer|cash|especes|reception|nkhls|nkheles|nkhlles|khalas|flous|n?خلص|الدفع|الخلاص)/.test(text)) return "payment";
    if (/(categorie|produit|article|vetement|bijou|sac|chaussure|parfum|chno.*kayn|achno.*kayn|شنو.*كاين|المنتوج)/.test(text)) return "categories";
    if (/(commander|commande|acheter|panier|ncommandi|nkomondi|nchri|bghit.*(commande|komond)|طلب|كوموند|نشري)/.test(text)) return "order";
    if (/(conseiller|vendeur|equipe|personne|whatsapp|nhedr|nhdr|انسان|نهضر)/.test(text)) return "human";
    if (/(salam|bonjour|bonsoir|hello|slt|sbah|سلام|مرحبا)/.test(text)) return "hello";
    return null;
  };

  const addMessage = (type, text, actions = []) => {
    const message = document.createElement("div");
    message.className = `adluxe-chat-message is-${type}`;

    const bubble = document.createElement("div");
    bubble.className = "adluxe-chat-bubble";
    bubble.textContent = text;
    message.appendChild(bubble);

    if (actions.length) {
      const actionList = document.createElement("div");
      actionList.className = "adluxe-chat-actions";
      actions.forEach((action) => {
        const link = document.createElement("a");
        link.className = "adluxe-chat-action";
        link.href = action.href;
        link.textContent = action.label;
        if (action.external) {
          link.target = "_blank";
          link.rel = "noopener";
        }
        link.addEventListener("click", () => {
          if (!action.external) closeChat();
        });
        actionList.appendChild(link);
      });
      message.appendChild(actionList);
    }

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  };

  const answerTopic = (topic, userLabel = "") => {
    if (userLabel) addMessage("user", userLabel);
    const answer = topics[topic];
    window.setTimeout(() => addMessage("assistant", answer.text, answer.actions || []), 180);
  };

  const openChat = () => {
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
    root.classList.add("is-open");
    window.setTimeout(() => input.focus(), 80);
  };

  const closeChat = () => {
    launcher.setAttribute("aria-expanded", "false");
    root.classList.remove("is-open");
    window.setTimeout(() => {
      if (!root.classList.contains("is-open")) panel.hidden = true;
    }, 180);
    launcher.focus();
  };

  launcher.addEventListener("click", () => {
    if (root.classList.contains("is-open")) closeChat();
    else openChat();
  });

  closeButton.addEventListener("click", closeChat);

  topicButtons.forEach((button) => {
    button.addEventListener("click", () => {
      answerTopic(button.dataset.chatTopic, button.textContent.trim());
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) return;

    addMessage("user", value);
    input.value = "";

    const knowledgeAnswer = buildKnowledgeAnswer(value);
    if (knowledgeAnswer) {
      window.setTimeout(
        () => addMessage("assistant", knowledgeAnswer.text, knowledgeAnswer.actions || []),
        180
      );
      return;
    }

    const topic = detectTopic(value);
    if (topic) {
      const answer = topics[topic];
      window.setTimeout(() => addMessage("assistant", answer.text, answer.actions || []), 180);
      return;
    }

    window.setTimeout(
      () =>
        addMessage(
          "assistant",
          "Je n’ai pas encore la réponse exacte. Essayez avec le nom d’un article, par exemple : « prix Scarf », « couleurs Floréa », « pointure 39 », « articles à moins de 160 DH » ou écrivez à l’équipe AD_LUXE.",
          [
            {
              label: "Continuer sur WhatsApp",
              href: whatsappUrl(`Bonjour AD_LUXE, j’ai une question : ${value}`),
              external: true,
            },
          ]
        ),
      180
    );
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && root.classList.contains("is-open")) closeChat();
  });

  addMessage(
    "assistant",
    "Salam 👋 Je suis l’assistante AD_LUXE. Demandez-moi le prix, les couleurs, les pointures ou la disponibilité d’un article. Vous pouvez aussi choisir une réponse rapide."
  );
})();
