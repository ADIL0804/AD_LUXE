(() => {
"use strict";
const grid = document.querySelector(".adluxe-seo-catalog");
if (!grid) return;
const cards = [...grid.children];
const search = document.getElementById("catalog-search"), category = document.getElementById("catalog-category"), sort = document.getElementById("catalog-sort");
const normalize = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const apply = () => {
const query = normalize(search.value.trim());
const ordered = [...cards];
if(sort.value !== "default") ordered.sort((a,b) => (a.dataset.price === undefined ? (b.dataset.price === undefined ? 0 : 1) : b.dataset.price === undefined ? -1 : (Number(a.dataset.price)-Number(b.dataset.price))*(sort.value==="asc"?1:-1)));
let count=0;
ordered.forEach(card => {
card.hidden = !(normalize(card.textContent).includes(query) && (category.value==="all" || category.value===card.dataset.category));
if(!card.hidden) count++;
grid.append(card);
});
document.getElementById("catalog-results").textContent = count + " article" + (count===1?"":"s") + " trouvé" + (count===1?"":"s");
document.getElementById("catalog-empty").hidden = count>0;
};
const initial = new URLSearchParams(location.search).get("category");
if ([...category.options].some(o=>o.value===initial)) category.value=initial;
[search,category,sort].forEach(el=>el.addEventListener(el===search?"input":"change",apply));
document.getElementById("catalog-reset").addEventListener("click",()=>{search.value="";category.value="all";sort.value="default";apply();search.focus();});
apply();
})();