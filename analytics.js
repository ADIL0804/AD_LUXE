(() => {
  "use strict";

  const head = document.head;

  function addStylesheet(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    head.append(link);
  }

  function addScript(src) {
    return new Promise((resolve, reject) => {
      const existing = [...document.scripts].find((script) => script.getAttribute("src") === src);
      if (existing) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", reject, { once: true });
      head.append(script);
    });
  }

  addStylesheet("/catalog-compact.css?v=20260824-1");
  addScript("/analytics-core.js?v=20260824-3")
    .then(() => addScript("/upgrade.js?v=20260824-3"))
    .then(() => addScript("/seo-runtime.js?v=20260824-3"))
    .catch(() => {});
})();
