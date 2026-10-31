#!/usr/bin/env python3
"""Assembla ../onepage.html da _head.html + le sezioni (in ordine) + _tail.html.
Le slide native usano <slug>.section.html; le slide interattive (mappa "iframe")
vengono incorporate via <iframe>. Esegui:  python3 onepage-parts/build.py"""
import os

ORDER = ["saturday-night-science","index","video","scrittura","fotografia","pechino-1","pechino-2","pechino-3",
    "dartmouth-1956","dartmouth-1956-2","timeline","napa-valley","musk-page","musk-page-2","musk-altman","paesi","leader",
    "trump-amodei","anthropic-usa-1","anthropic-usa-2","anthropic-usa-3","anthropic-usa-4",
    "llm-occidentali","llm-asiatici","llm-russi","thiel","palantir-intro","palantir-intro-2",
    "palantir","paypal-mafia","paypal-mafia-2","paypal-mafia-3","epistemia","pappagallo",
    "alba-transformer",
    "quiz-emoji-1","quiz-emoji-2","quiz-emoji-3","quiz-emoji-4","quiz-emoji-5","quiz-emoji-6","quiz-emoji-7","quiz-emoji-8","quiz-emoji-9","quiz-emoji-10",
    "quiz-trama-1","quiz-trama-2","quiz-trama-3","quiz-trama-4","quiz-trama-5","quiz-trama-6","fosforo-web","fosforo-dashboard","tom-brad","tre-fattori","confronto-ai"]

# slide interattive/pesanti tenute in iframe (slug -> accento per i dot)
IFRAME = {"saturday-night-science":"#41b7ff","video":"#41b7ff","fotografia":"#41b7ff","timeline":"#41b7ff","paesi":"#41b7ff",
    "leader":"#4f8ef7","alba-transformer":"#41b7ff","tom-brad":"#41b7ff",
    # step-reveal slides run their own JS, so they stay as iframes
    "tre-fattori":"#41b7ff",
    # quiz film: render + console solutions via js/film-quiz.js
    "quiz-emoji-1":"#41b7ff","quiz-emoji-2":"#41b7ff","quiz-emoji-3":"#41b7ff","quiz-emoji-4":"#41b7ff","quiz-emoji-5":"#41b7ff","quiz-emoji-6":"#41b7ff","quiz-emoji-7":"#41b7ff","quiz-emoji-8":"#41b7ff","quiz-emoji-9":"#41b7ff","quiz-emoji-10":"#41b7ff",
    "quiz-trama-1":"#f59e0b","quiz-trama-2":"#f59e0b","quiz-trama-3":"#f59e0b","quiz-trama-4":"#f59e0b","quiz-trama-5":"#f59e0b","quiz-trama-6":"#f59e0b"}

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
