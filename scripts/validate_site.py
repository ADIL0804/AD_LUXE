#!/usr/bin/env python3
"""Validate AD_LUXE catalog links, SEO files and Merchant feed consistency."""

from __future__ import annotations

import json
from decimal import Decimal, InvalidOperation
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
SITE = "https://ad-luxe.ma"
G = "{http://base.google.com/ns/1.0}"
SITEMAP_NS = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.references: list[str] = []
        self.json_ld: list[str] = []
        self._json_buffer: list[str] | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        for key in ("href", "src"):
            value = values.get(key)
            if value:
                self.references.append(value)
        if tag == "script" and values.get("type") == "application/ld+json":
            self._json_buffer = []

    def handle_data(self, data: str) -> None:
        if self._json_buffer is not None:
            self._json_buffer.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag == "script" and self._json_buffer is not None:
            self.json_ld.append("".join(self._json_buffer))
            self._json_buffer = None


def fail(errors: list[str], message: str) -> None:
    errors.append(message)


def local_path(url: str) -> Path | None:
    parsed = urlparse(url)
    if parsed.scheme and parsed.netloc != "ad-luxe.ma":
        return None
    path = parsed.path
    if not path or path == "/":
        return ROOT / "index.html"
    candidate = ROOT / path.lstrip("/")
    if candidate.exists():
        return candidate
    if not candidate.suffix:
        html_candidate = candidate.with_suffix(".html")
        if html_candidate.exists():
            return html_candidate
    return candidate


def parse_page(path: Path, errors: list[str]) -> PageParser:
    parser = PageParser()
    try:
        parser.feed(path.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(errors, f"HTML illisible: {path.relative_to(ROOT)} ({exc})")
    for block in parser.json_ld:
        try:
            json.loads(block)
        except json.JSONDecodeError as exc:
            fail(errors, f"JSON-LD invalide: {path.relative_to(ROOT)} ({exc})")
    return parser


def main() -> int:
    errors: list[str] = []
    pages = sorted(ROOT.glob("*.html")) + sorted((ROOT / "products").glob("*.html"))
    parsed_pages = {page: parse_page(page, errors) for page in pages}
    product_prices: dict[str, str] = {}

    for page, parser in parsed_pages.items():
        for reference in parser.references:
            if reference.startswith(("#", "mailto:", "tel:", "data:", "javascript:")):
                continue
            target = local_path(reference)
            if target is not None and not target.exists():
                fail(errors, f"Référence locale absente: {page.relative_to(ROOT)} -> {reference}")
        for block in parser.json_ld:
            try:
                data = json.loads(block)
            except json.JSONDecodeError:
                continue
            if data.get("@type") != "Product":
                continue
            offer = data.get("offers", {})
            offer_url = offer.get("url")
            offer_price = offer.get("price")
            if offer_url and offer_price is not None:
                product_prices[offer_url] = str(offer_price)

    try:
        sitemap = ET.parse(ROOT / "sitemap.xml")
    except ET.ParseError as exc:
        fail(errors, f"sitemap.xml invalide: {exc}")
        sitemap = None
    sitemap_urls: set[str] = set()
    if sitemap is not None:
        sitemap_urls = {node.text or "" for node in sitemap.findall(".//s:loc", SITEMAP_NS)}
        for url in sitemap_urls:
            target = local_path(url)
            if target is not None and not target.exists():
                fail(errors, f"URL sitemap absente localement: {url}")

    try:
        feed = ET.parse(ROOT / "google-merchant-feed.xml")
    except ET.ParseError as exc:
        fail(errors, f"google-merchant-feed.xml invalide: {exc}")
        feed = None

    feed_ids: set[str] = set()
    if feed is not None:
        for item in feed.findall(".//item"):
            item_id = item.findtext(G + "id") or ""
            link = item.findtext(G + "link") or ""
            image = item.findtext(G + "image_link") or ""
            category = item.findtext(G + "google_product_category") or ""
            if not item_id or item_id in feed_ids:
                fail(errors, f"Identifiant Merchant absent ou dupliqué: {item_id!r}")
            feed_ids.add(item_id)
            for label, url in (("page", link), ("image", image)):
                target = local_path(url)
                if target is None or not target.exists():
                    fail(errors, f"{label} Merchant absente pour {item_id}: {url}")
            if link not in sitemap_urls:
                fail(errors, f"Produit Merchant absent du sitemap: {link}")
            feed_price = (item.findtext(G + "price") or "").split()[0]
            page_price = product_prices.get(link, "")
            try:
                prices_match = Decimal(feed_price) == Decimal(page_price)
            except InvalidOperation:
                prices_match = False
            if not prices_match:
                fail(errors, f"Prix Merchant/page différent pour {item_id}: {feed_price} != {page_price}")
            if category.endswith(("Clothing", "Shoes")):
                required = ["color", "size", "gender", "age_group"]
                if category.endswith("Shoes"):
                    required.append("size_system")
                for field in required:
                    if not item.findtext(G + field):
                        fail(errors, f"Attribut Merchant g:{field} absent pour {item_id}")

    product_pages = [page for page in (ROOT / "products").glob("*.html") if "-v2" not in page.stem]
    for page in product_pages:
        text = page.read_text(encoding="utf-8")
        if "product-detail.js?v=20260920-1" not in text:
            fail(errors, f"Version product-detail obsolète: {page.relative_to(ROOT)}")

    index_text = (ROOT / "index.html").read_text(encoding="utf-8")
    for script in ("analytics-core.js", "upgrade.js", "site-fixes.js", "seo-runtime.js"):
        if index_text.count(script) != 1:
            fail(errors, f"{script} doit être chargé exactement une fois dans index.html")

    product_js = (ROOT / "product-detail.js").read_text(encoding="utf-8")
    if "Votre couleur seront ajoutées" in product_js:
        fail(errors, "La faute 'Votre couleur seront ajoutées' est encore présente")

    if errors:
        print("ÉCHEC — problèmes détectés:")
        for error in errors:
            print(f"- {error}")
        return 1
    print(f"OK — {len(pages)} pages, {len(sitemap_urls)} URLs sitemap et {len(feed_ids)} produits Merchant validés.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
