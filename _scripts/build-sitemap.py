#!/usr/bin/env python3
"""Sinh sitemap.xml từ blog/posts.json.

Chạy ở thư mục gốc repo sau khi thêm/sửa bài:
    python3 _scripts/build-sitemap.py

- Bài có "draft": true bị bỏ qua.
- lastmod của bài = "date" trong posts.json.
- lastmod của /blog/ = ngày bài mới nhất.
- Trang chủ lấy lastmod = ngày bài mới nhất (trang chủ có mục "Bài viết mới").
- Không đưa vào: /about-me, /chatbot-demo, blog/_mau-bai-viet (đều noindex).
"""
import json
import pathlib
from xml.sax.saxutils import escape

ROOT = pathlib.Path(__file__).resolve().parent.parent
BASE = "https://truongmanhtung.com"

posts = json.loads((ROOT / "blog" / "posts.json").read_text(encoding="utf-8"))
posts = [p for p in posts if not p.get("draft")]
posts.sort(key=lambda p: p["date"], reverse=True)

latest = posts[0]["date"] if posts else None

entries = [(f"{BASE}/", latest), (f"{BASE}/blog/", latest)]
entries += [(f"{BASE}/blog/{p['slug']}/", p["date"]) for p in posts]

lines = ['<?xml version="1.0" encoding="UTF-8"?>',
         '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for loc, lastmod in entries:
    lines.append("  <url>")
    lines.append(f"    <loc>{escape(loc)}</loc>")
    if lastmod:
        lines.append(f"    <lastmod>{lastmod}</lastmod>")
    lines.append("  </url>")
lines.append("</urlset>")

(ROOT / "sitemap.xml").write_text("\n".join(lines) + "\n", encoding="utf-8")
print(f"sitemap.xml: {len(entries)} URL ({len(posts)} bài blog)")
