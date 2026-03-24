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
// Navigation dots (3 pages: index, paesi, leader)
// ════════════════════════════════════════════════════
const PAGES = ['index.html', 'paesi.html', 'leader.html'];

function initNav(activePage) {
  // Dots
  document.querySelectorAll('.nav-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === activePage);
    dot.addEventListener('click', () => {
      if (i !== activePage) window.location.href = PAGES[i];
    });
  });
  // Arrows
  const prev = document.getElementById('nav-prev');
  const next = document.getElementById('nav-next');
  if (prev) {
    if (activePage === 0) prev.classList.add('hidden');
    else prev.href = PAGES[activePage - 1];
  }
  if (next) {
    if (activePage === 2) next.classList.add('hidden');
    else next.href = PAGES[activePage + 1];
  }
  // Keyboard — global (slide nav only, carousels override per-page)
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
      return;
    }
    if (document.querySelector('.modal-backdrop.open')) return; // modal absorbs arrows
    if (e.key === 'ArrowLeft'  && activePage > 0) window.location.href = PAGES[activePage - 1];
    if (e.key === 'ArrowRight' && activePage < 2) window.location.href = PAGES[activePage + 1];
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
