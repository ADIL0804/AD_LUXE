(() => {
  "use strict";
  const main = document.querySelector('[data-collection-product]');
  if (!main) return;
  const buttons = [...main.querySelectorAll('[data-variant]')];
  const sizes = [...main.querySelectorAll('[data-size-option]')];
  const image = main.querySelector('[data-variant-image]');
  const inquiry = main.querySelector('[data-product-inquiry]');
  let color = buttons[0]?.dataset.variant || '', size = '';
  const sync = () => {
    const lines = [`Bonjour AD_LUXE, je souhaite des informations sur ${main.dataset.collectionProduct}.`, `Couleur : ${color}`];
    if (sizes.length) lines.push(`Taille : ${size || 'À préciser'}`);
    inquiry.href = 'https://wa.me/212644162453?text=' + encodeURIComponent(lines.join('\n'));
  };
  const choose = (button) => {
    color = button.dataset.variant;
    image.src = button.dataset.image;
    image.alt = `${main.dataset.collectionProduct} — ${color}`;
    main.querySelector('[data-color-label]').textContent = color;
    buttons.forEach(other => {
      other.classList.toggle('is-active', other === button);
      other.setAttribute('aria-pressed', String(other === button));
    });
    const url = new URL(location.href);
    url.searchParams.set('color', color);
    history.replaceState(null, '', url);
    sync();
  };
  buttons.forEach(button => button.addEventListener('click', () => choose(button)));
  sizes.forEach(button => button.addEventListener('click', () => {
    size = button.dataset.sizeOption;
    main.querySelector('[data-size-label]').textContent = size;
    sizes.forEach(other => {
      other.classList.toggle('is-active', other === button);
      other.setAttribute('aria-pressed', String(other === button));
    });
    sync();
  }));
  const initial = new URLSearchParams(location.search).get('color');
  choose(buttons.find(button => button.dataset.variant === initial) || buttons[0]);
})();
