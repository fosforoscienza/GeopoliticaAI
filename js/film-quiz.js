// ════════════════════════════════════════════════════
// Quiz film — 10 slide emoji + 12 slide trama.
// Ogni pagina dichiara <body data-quiz="emoji-3"> (o "trama-2").
// La slide mostra solo l'indovinello: la SOLUZIONE va nella console.
// ════════════════════════════════════════════════════
// FILM_QUIZ è in js/film-quiz-data.js (caricato prima di questo file).

const QUIZ_TXT = {
  it: { emoji: 'Indovina il film', trama: 'Indovina il film dalla trama', hintE: 'Quale film raccontano queste emoji?', hintT: 'Quale film raccontano queste scene?', year: 'Anno' },
  en: { emoji: 'Guess the movie', trama: 'Guess the movie from the plot', hintE: 'Which movie do these emojis tell?', hintT: 'Which movie do these scenes tell?', year: 'Year' }
};

(function () {
  const key = (document.body.dataset.quiz || 'emoji-1').split('-');
  const kind = key[0] === 'trama' ? 'trama' : 'emoji';
  const n = Math.max(1, parseInt(key[1], 10) || 1);
  const list = FILM_QUIZ[kind];
  const q = list[Math.min(n, list.length) - 1];
  document.body.classList.add('kind-' + kind);

  function render() {
    const t = QUIZ_TXT[lang];
    document.title = (kind === 'emoji' ? t.emoji : t.trama) + ' ' + n + ' — Geopolitica della AI';
    document.getElementById('quiz-eyebrow').textContent = kind === 'emoji' ? t.emoji : t.trama;
    document.getElementById('quiz-count').textContent = String(n).padStart(2, '0') + ' / ' + String(list.length).padStart(2, '0');
    document.getElementById('quiz-hint').textContent = kind === 'emoji' ? t.hintE : t.hintT;
    const main = document.getElementById('quiz-main');
    main.innerHTML = '';
    // Split into grapheme clusters so composite emoji (🧙‍♂️, 🏝️) stay intact.
    const graphemes = (str) => ((typeof Intl !== 'undefined' && Intl.Segmenter)
      ? [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(str)].map(x => x.segment)
      : Array.from(str)).filter(x => x.trim());
    let delay = 0.15;
    const emojiSpan = (ch) => {
      const sp = document.createElement('span');
      sp.className = 'quiz-emoji';
      sp.style.animationDelay = delay.toFixed(2) + 's';
      delay += 0.12;
      sp.textContent = ch;
      return sp;
    };
    if (kind === 'emoji') {
      const items = graphemes(q.e);
      main.style.setProperty('--n', items.length);
      items.forEach(ch => main.appendChild(emojiSpan(ch)));
    } else {
      // Trama raccontata a scene: riquadri numerati, due per riga.
      const scenes = q.s.map(graphemes);
      main.classList.toggle('odd', scenes.length % 2 === 1);
      scenes.forEach((sc, k) => {
        const box = document.createElement('span');
        box.className = 'quiz-scene';
        box.dataset.n = k + 1;
        box.style.animationDelay = delay.toFixed(2) + 's';
        sc.forEach(ch => box.appendChild(emojiSpan(ch)));
        main.appendChild(box);
        delay += 0.15;
      });
    }
  }

  // ── Soluzione in console ──
  let lastLog = 0;
  function logSolution() {
    const now = Date.now();
    if (now - lastLog < 1500) return; // avoid duplicates (load + focus)
    lastLog = now;
    const label = (kind === 'emoji' ? 'EMOJI ' : 'TRAMA ') + n + '/' + list.length;
    console.log(
      '%c🎬 SOLUZIONE ' + label + '%c  ' + q.it + (q.en !== q.it ? '  ·  ' + q.en : '') + '  (' + q.y + ')',
      'background:#41b7ff;color:#02060f;font-weight:800;padding:4px 8px;border-radius:4px;font-size:13px',
      'color:#41b7ff;font-weight:700;font-size:14px'
    );
    if (kind === 'trama') console.log('%c📖 ' + q.g + ' — ' + q.pit, 'color:#fcd38a;font-size:12px');
  }

  window.onLangChange = render;
  initLangToggle();
  render();
  initNav();

  // Standalone: log right away. Inside the onepage shell the neighbouring
  // slides are preloaded, so log only when this slide actually gets focus
  // (the shell focuses the active iframe).
  // Nella onepage le slide vicine sono precaricate: lì si scrive solo quando
  // la slide riceve il focus. Altrove (show SNS, slide aperta da sola) subito.
  let inOnepage = false;
  try { inOnepage = window.self !== window.top && !!window.parent.document.getElementById('op-track'); } catch (_) {}
  if (!inOnepage) logSolution();
  else {
    window.addEventListener('focus', logSolution);
    if (document.hasFocus()) logSolution();
  }
})();
