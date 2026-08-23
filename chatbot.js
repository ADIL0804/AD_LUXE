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
      .trim();

  const detectTopic = (value) => {
    const text = normalise(value);
    if (/(salam|bonjour|bonsoir|hello|slt|sbah|سلام|مرحبا)/.test(text)) return "hello";
    if (/(suivi|suivre|colis|reference|fin.*(commande|komond)|فين.*كوموند|commande.*fin)/.test(text)) return "tracking";
    if (/(echange|echanger|retour|rembour|nbdel|nbedel|nrj3|بدل|تبديل|رجع)/.test(text)) return "exchange";
    if (/(delai|duree|temps|combien.*jour|chhal.*(wa9t|waqt|nhar)|imta|24h|48h|72h|شحال.*وقت|فوقاش)/.test(text)) return "delay";
    if (/(livraison|livrer|frais|transport|casablanca|tawsil|المدينة|التوصيل)/.test(text)) return "delivery";
    if (/(paiement|payer|cash|especes|reception|nkhls|nkheles|nkhlles|khalas|flous|n?خلص|الدفع|الخلاص)/.test(text)) return "payment";
    if (/(categorie|produit|article|vetement|bijou|sac|chaussure|parfum|chno.*kayn|achno.*kayn|شنو.*كاين|المنتوج)/.test(text)) return "categories";
    if (/(commander|commande|acheter|panier|ncommandi|nkomondi|nchri|bghit.*(commande|komond)|طلب|كوموند|نشري)/.test(text)) return "order";
    if (/(conseiller|vendeur|equipe|personne|whatsapp|nhedr|nhdr|انسان|نهضر)/.test(text)) return "human";
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
          "Je n’ai pas bien compris votre question. Choisissez une option ci-dessous ou écrivez à l’équipe AD_LUXE sur WhatsApp.",
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
    "Salam 👋 Je suis l’assistante AD_LUXE. Posez votre question ou choisissez une réponse rapide."
  );
})();
