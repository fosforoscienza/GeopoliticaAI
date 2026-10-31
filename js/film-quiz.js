// ════════════════════════════════════════════════════
// Quiz film — 10 slide emoji + 6 slide trama.
// Ogni pagina dichiara <body data-quiz="emoji-3"> (o "trama-2").
// La slide mostra solo l'indovinello: la SOLUZIONE va nella console.
// ════════════════════════════════════════════════════
const FILM_QUIZ = {
  emoji: [
    { e: '🚢🧊',     it: 'Titanic',                      en: 'Titanic',                        y: 1997 },
    { e: '🦁👑',     it: 'Il Re Leone',                  en: 'The Lion King',                  y: 1994 },
    { e: '🧙‍♂️⚡👓',     it: 'Harry Potter',                 en: 'Harry Potter',                   y: 2001 },
    { e: '🦖🏝️',     it: 'Jurassic Park',                en: 'Jurassic Park',                  y: 1993 },
    { e: '🦈🏖️',     it: 'Lo Squalo',                    en: 'Jaws',                           y: 1975 },
    { e: '💍🌋',     it: 'Il Signore degli Anelli',      en: 'The Lord of the Rings',          y: 2001 },
    { e: '🚗⚡🕰️',     it: 'Ritorno al futuro',            en: 'Back to the Future',             y: 1985 },
    { e: '🕶️💊',     it: 'Matrix',                       en: 'The Matrix',                     y: 1999 },
    { e: '🔍🐠',     it: 'Alla ricerca di Nemo',         en: 'Finding Nemo',                   y: 2003 },
    { e: '👽🚲🌕',     it: 'E.T. l\'extra-terrestre',      en: 'E.T. the Extra-Terrestrial',     y: 1982 }
  ],
  trama: [
    { it: 'Terminator', s: ['🤖⏳', '🔫👩', '🤰👶', '✊🤖'], en: 'The Terminator', y: 1984,
      pit: 'Dal futuro arriva un cyborg con un solo obiettivo: uccidere una giovane cameriera di Los Angeles prima che metta al mondo l\'uomo che guiderà la resistenza contro le macchine.',
      pen: 'A cyborg is sent back from the future with a single goal: kill a young Los Angeles waitress before she gives birth to the man who will lead the resistance against the machines.' },
    { it: 'Lei (Her)', s: ['👨✍️💌', '💻🗣️👩', '😍❤️'], en: 'Her', y: 2013,
      pit: 'Un uomo solo, che di mestiere scrive lettere d\'amore per conto di altri, si innamora del nuovo sistema operativo del suo computer: una voce femminile che impara, ride e cresce più in fretta di lui.',
      pen: 'A lonely man who writes love letters for other people falls in love with his computer\'s new operating system: a female voice that learns, laughs and grows faster than he does.' },
    { it: '2001: Odissea nello spazio', s: ['🚀🪐', '🔴👁️💻', '😱👨‍🚀'], en: '2001: A Space Odyssey', y: 1968,
      pit: 'Durante una missione verso Giove, il computer di bordo — infallibile, dalla voce calma e con un unico occhio rosso — decide che l\'equipaggio è diventato un rischio per la missione.',
      pen: 'On a mission to Jupiter, the ship\'s computer — infallible, calm-voiced, with a single red eye — decides that the crew has become a threat to the mission.' },
    { it: 'Ex Machina', s: ['👨‍💻🏆', '🏡🌲', '🤖👩', '🧠❓'], en: 'Ex Machina', y: 2014,
      pit: 'Un giovane programmatore vince una settimana nella villa isolata del CEO del suo colosso tech. Il compito: capire se il robot dal volto di donna custodito lì dentro sia davvero cosciente.',
      pen: 'A young programmer wins a week at the secluded estate of his tech giant\'s CEO. His task: figure out whether the robot with a woman\'s face kept there is truly conscious.' },
    { it: 'WALL·E', s: ['🌍🗑️', '🤖📦', '🛸🤍', '❤️'], en: 'WALL·E', y: 2008,
      pit: 'Secoli dopo che l\'umanità ha abbandonato una Terra sommersa dai rifiuti, un piccolo robot spazzino continua a compattare spazzatura tutto solo… finché non atterra una sonda bianca e lucente.',
      pen: 'Centuries after humanity abandoned an Earth buried in trash, a small cleaning robot keeps compacting garbage all alone… until a sleek white probe lands.' },
    { it: 'Blade Runner', s: ['🌧️🌃', '🕵️‍♂️🔫', '🤖🤖🤖🤖', '⏳🙏'], en: 'Blade Runner', y: 1982,
      pit: 'Los Angeles, 2019: pioggia, neon e un ex poliziotto richiamato in servizio per «ritirare» quattro androidi fuggiti dalle colonie extra-mondo, tornati sulla Terra per chiedere al loro creatore più vita.',
      pen: 'Los Angeles, 2019: rain, neon and an ex-cop called back to "retire" four androids who escaped the off-world colonies and returned to Earth to demand more life from their maker.' }
  ]
};

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
      // Trama raccontata a scene: [emoji emoji] → [emoji emoji] → …
      const scenes = q.s.map(graphemes);
      const total = scenes.reduce((a, sc) => a + sc.length, 0) + (scenes.length - 1) * 0.6;
      main.style.setProperty('--n', total);
      scenes.forEach((sc, k) => {
        if (k > 0) {
          const ar = document.createElement('span');
          ar.className = 'quiz-arrow';
          ar.style.animationDelay = delay.toFixed(2) + 's';
          ar.textContent = '→';
          main.appendChild(ar);
        }
        const box = document.createElement('span');
        box.className = 'quiz-scene';
        sc.forEach(ch => box.appendChild(emojiSpan(ch)));
        main.appendChild(box);
        delay += 0.15;
      });
      fitStrip();
    }
  }

  // Keep the emoji story on ONE line: shrink the font until the strip fits
  // inside the stage's content box (measured on the children, since a
  // centred flex row overflows on both sides).
  function fitStrip() {
    if (kind !== 'trama') return;
    const main = document.getElementById('quiz-main');
    const stage = main.parentElement;
    const cs = getComputedStyle(stage);
    const maxW = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const stripW = () => {
      const kids = [...main.children];
      const gap = parseFloat(getComputedStyle(main).columnGap) || 0;
      return kids.reduce((a, k) => a + k.getBoundingClientRect().width, 0) + gap * (kids.length - 1);
    };
    let fs = Math.min(150, window.innerHeight * 0.17);
    main.style.setProperty('--fs', fs + 'px');
    while (stripW() > maxW && fs > 20) {
      fs -= 2;
      main.style.setProperty('--fs', fs + 'px');
    }
  }
  window.addEventListener('resize', fitStrip);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitStrip);

  // ── Soluzione in console ──
  let lastLog = 0;
  function logSolution() {
    const now = Date.now();
    if (now - lastLog < 1500) return; // avoid duplicates (load + focus)
    lastLog = now;
    const label = kind === 'emoji' ? 'EMOJI ' + n + '/10' : 'TRAMA ' + n + '/6';
    console.log(
      '%c🎬 SOLUZIONE ' + label + '%c  ' + q.it + (q.en !== q.it ? '  ·  ' + q.en : '') + '  (' + q.y + ')',
      'background:#41b7ff;color:#02060f;font-weight:800;padding:4px 8px;border-radius:4px;font-size:13px',
      'color:#41b7ff;font-weight:700;font-size:14px'
    );
    if (kind === 'trama') console.log('%c📖 Trama: ' + q.pit, 'color:#fcd38a;font-size:12px');
  }

  window.onLangChange = render;
  initLangToggle();
  render();
  initNav();

  // Standalone: log right away. Inside the onepage shell the neighbouring
  // slides are preloaded, so log only when this slide actually gets focus
  // (the shell focuses the active iframe).
  if (window.self === window.top) logSolution();
  else {
    window.addEventListener('focus', logSolution);
    if (document.hasFocus()) logSolution();
  }
})();
