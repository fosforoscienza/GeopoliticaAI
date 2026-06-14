#!/usr/bin/env python3
"""Assembla ../onepage.html da _head.html + le sezioni (in ordine) + _tail.html.
Le slide native usano <slug>.section.html; le slide interattive (mappa "iframe")
vengono incorporate via <iframe>. Esegui:  python3 onepage-parts/build.py"""
import os

ORDER = ["index","video","scrittura","fotografia","pechino-1","pechino-2","pechino-3",
    "timeline","napa-valley","musk-page","musk-page-2","musk-altman","paesi","leader",
    "trump-amodei","anthropic-usa-1","anthropic-usa-2","anthropic-usa-3","anthropic-usa-4",
    "llm-occidentali","llm-asiatici","llm-russi","thiel","palantir-intro","palantir-intro-2",
    "palantir","paypal-mafia","paypal-mafia-2","paypal-mafia-3","epistemia","pappagallo",
    "alba-transformer","fosforo-web","fosforo-dashboard","tom-brad","tre-fattori","confronto-ai"]

# slide interattive/pesanti tenute in iframe (slug -> accento per i dot)
IFRAME = {"video":"#41b7ff","fotografia":"#41b7ff","timeline":"#41b7ff","paesi":"#41b7ff",
    "leader":"#4f8ef7","alba-transformer":"#41b7ff","tom-brad":"#41b7ff",
    # step-reveal slides run their own JS, so they stay as iframes
    "tre-fattori":"#41b7ff"}

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

def read(p): return open(os.path.join(HERE, p), encoding="utf-8").read()

out = [read("_head.html")]
missing = []
for slug in ORDER:
    if slug in IFRAME:
        acc = IFRAME[slug]
        out.append(f'      <section class="op-sec" id="op-{slug}" data-slug="{slug}" '
                   f'data-accent="{acc}"><iframe data-src="{slug}.html" loading="lazy" '
                   f'title="{slug}"></iframe></section>\n')
    else:
        f = f"{slug}.section.html"
        if os.path.exists(os.path.join(HERE, f)):
            out.append(f"      <!-- {slug} -->\n" + read(f) + "\n")
        else:
            missing.append(slug)
out.append(read("_tail.html"))

dest = os.path.join(ROOT, "onepage.html")
open(dest, "w", encoding="utf-8").write("".join(out))
n = "".join(out).count('class="op-sec"')
print(f"Scritto {dest} — {n} sezioni" + (f" — MANCANTI: {missing}" if missing else ""))
