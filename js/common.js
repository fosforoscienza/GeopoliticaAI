// ════════════════════════════════════════════════════
// i18n
// ════════════════════════════════════════════════════
const UI = {
  it: {
    loadErr: "Errore nel caricamento. Apri la pagina via HTTP (es: npx serve .).",
  },
  en: {
    loadErr: "Load error. Open via HTTP server (e.g. npx serve .).",
  },
};

// ════════════════════════════════════════════════════
// Language (persisted in localStorage)
// ════════════════════════════════════════════════════
let lang = localStorage.getItem('geopolitica-lang') || 'it';

function setLang(l) {
  lang = l;
  localStorage.setItem('geopolitica-lang', l);
  document.documentElement.lang = l;
  document.querySelectorAll('.lang-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.lang === l)
  );
  if (typeof onLangChange === 'function') onLangChange(l);
}

function initLangToggle() {
  document.documentElement.lang = lang;
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang);
    b.addEventListener('click', () => setLang(b.dataset.lang));
  });
}

// ════════════════════════════════════════════════════
// Navigation dots (13 pages by default)
// ════════════════════════════════════════════════════
const DEFAULT_PAGES = [
  'index.html', 'video.html', 'scrittura.html', 'fotografia.html',
  'pechino-1.html', 'pechino-2.html', 'pechino-3.html',
  'timeline.html', 'paesi.html', 'leader.html',
  'llm.html',
  'thiel.html', 'palantir.html', 'paypal-mafia.html',
  'epistemia.html', 'pappagallo.html',
  'fosforo-web.html', 'fosforo-dashboard.html'
];

// Mutable runtime list — dashboard can reorder and hide entries.
// Hidden slides are removed entirely from PAGES (skipped in navigation).
const PAGES = DEFAULT_PAGES.slice();
const SLIDES_CONFIG_KEY = 'geopolitica-slides-config';

function loadSlidesConfig() {
  try {
    const raw = localStorage.getItem(SLIDES_CONFIG_KEY);
    if (!raw) return;
    const cfg = JSON.parse(raw);
    if (!cfg || !Array.isArray(cfg.order)) return;
    // Only accept entries we still know about.
    const known = new Set(DEFAULT_PAGES);
    const order = cfg.order.filter(p => known.has(p));
    // Append any new defaults the saved config didn't know.
    DEFAULT_PAGES.forEach(p => { if (!order.includes(p)) order.push(p); });
    const hidden = new Set(Array.isArray(cfg.hidden) ? cfg.hidden : []);
    const visible = order.filter(p => !hidden.has(p));
    if (visible.length === 0) return; // never leave the user stuck
    PAGES.splice(0, PAGES.length, ...visible);
  } catch (e) { /* fall back to defaults */ }
}
loadSlidesConfig();

function currentPageIndex() {
  const fn = (window.location.pathname.split('/').pop() || 'index.html') || 'index.html';
  const idx = PAGES.indexOf(fn);
  return idx < 0 ? 0 : idx;
}

// Hidden shortcut: press "O" anywhere to open the slide-order dashboard.
document.addEventListener('keydown', (e) => {
  if (e.key !== 'o' && e.key !== 'O') return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const tag = (e.target && e.target.tagName) || '';
  if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target && e.target.isContentEditable)) return;
  window.location.href = 'dashboard.html';
});

// Fills #nav-dots to match PAGES.length, sets the active dot, and
// wires click navigation. Safe to call multiple times — extra dots
// are appended, listeners aren't re-attached.
function buildNavDots(activePage) {
  const c = document.getElementById('nav-dots');
  if (!c) return;
  while (c.children.length < PAGES.length) {
    const dot = document.createElement('button');
    dot.className = 'nav-dot';
    c.appendChild(dot);
  }
  c.querySelectorAll('.nav-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === activePage);
    if (!dot._navWired) {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        if (i !== activePage) window.location.href = PAGES[i];
      });
      dot._navWired = true;
    }
  });
}

function initNav(activePage) {
  if (typeof activePage !== 'number') activePage = currentPageIndex();
  buildNavDots(activePage);

  const prev = document.getElementById('nav-prev');
  const next = document.getElementById('nav-next');
  if (prev) {
    if (activePage === 0) prev.classList.add('hidden');
    else { prev.classList.remove('hidden'); prev.href = PAGES[activePage - 1]; }
  }
  if (next) {
    if (activePage === PAGES.length - 1) next.classList.add('hidden');
    else { next.classList.remove('hidden'); next.href = PAGES[activePage + 1]; }
  }

  // Keyboard — global (slide nav only, carousels override per-page)
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
      return;
    }
    if (document.querySelector('.modal-backdrop.open')) return; // modal absorbs arrows
    if (e.key === 'ArrowLeft'  && activePage > 0) window.location.href = PAGES[activePage - 1];
    if (e.key === 'ArrowRight' && activePage < PAGES.length - 1) window.location.href = PAGES[activePage + 1];
  });
}

// ════════════════════════════════════════════════════
// Modal helpers
// ════════════════════════════════════════════════════
function openModal(id) {
  document.getElementById(id).classList.add('open');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}
function backdropClose(e, id) {
  if (e.target === document.getElementById(id)) closeModal(id);
}

// ════════════════════════════════════════════════════
// Loader
// ════════════════════════════════════════════════════
function hideLoader() {
  const el = document.getElementById('loader');
  if (!el) return;
  el.style.opacity = '0';
  setTimeout(() => el.remove(), 500);
}
function showLoadError() {
  const el = document.getElementById('loader');
  if (el) el.innerHTML =
    `<p style="color:#64748b;font-size:14px;padding:24px;text-align:center">${UI[lang].loadErr}</p>`;
}

// ════════════════════════════════════════════════════
// Schede loader
// ════════════════════════════════════════════════════
const SCHEDE_IDS = ['usa','china','eu','uk','russia','india','uae','canada','japan','israel'];

async function loadSchede(folder) {
  const results = await Promise.all(
    SCHEDE_IDS.map(id =>
      fetch(`${folder}/${id}.json`)
        .then(r => { if (!r.ok) throw new Error(id); return r.json(); })
        .catch(err => { console.warn('Scheda not loaded:', err); return null; })
    )
  );
  return results.filter(Boolean);
}
