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
    { it: 'Cenerentola', en: 'Cinderella', y: 1950, g: 'Animazione / fiaba',
      s: ['👧🧹', '🧚‍♀️🎃', '💃🕛', '👠🤴'],
      pit: 'Una ragazza maltrattata dalla matrigna va al ballo del principe grazie alla fata madrina, ma deve fuggire allo scoccare della mezzanotte lasciando una scarpetta di cristallo.',
      pen: 'A girl mistreated by her stepmother attends the prince\'s ball thanks to her fairy godmother, but must flee at midnight, leaving behind a glass slipper.' },
    { it: 'Forrest Gump', en: 'Forrest Gump', y: 1994, g: 'Drammatico',
      s: ['🪑🍫', '🏃‍♂️🇺🇸', '🦐⛵', '❤️👩'],
      pit: 'Seduto su una panchina con una scatola di cioccolatini, un uomo semplice racconta la sua vita: corre attraverso l\'America, fa fortuna pescando gamberi e non smette mai di amare Jenny.',
      pen: 'Sitting on a bench with a box of chocolates, a simple man tells his life story: he runs across America, gets rich catching shrimp and never stops loving Jenny.' },
    { it: 'Terminator', en: 'The Terminator', y: 1984, g: 'Fantascienza',
      s: ['🤖⏳', '🔫👩', '🤰👶', '✊🤖'],
      pit: 'Dal futuro arriva un cyborg con un solo obiettivo: uccidere una giovane cameriera di Los Angeles prima che metta al mondo l\'uomo che guiderà la resistenza contro le macchine.',
      pen: 'A cyborg is sent back from the future with a single goal: kill a young Los Angeles waitress before she gives birth to the man who will lead the resistance against the machines.' },
    { it: 'La vita è bella', en: 'Life Is Beautiful', y: 1997, g: 'Commedia drammatica',
      s: ['👨‍🦱💐👩', '👨‍🦱👦❤️', '🚂⛓️', '🎲🏆'],
      pit: 'Un libraio ebreo conquista la sua «principessa»; deportato in un campo di concentramento con il figlio, gli fa credere che sia tutto un gioco a punti con un carro armato in palio.',
      pen: 'A Jewish bookseller wins his "princess"; deported to a concentration camp with his son, he convinces the boy it is all a game with a real tank as the prize.' },
    { it: 'Mamma, ho perso l\'aereo', en: 'Home Alone', y: 1990, g: 'Commedia',
      s: ['🧳✈️', '👦🏠🎄', '🦹‍♂️🦹‍♂️💰', '🪤😱'],
      pit: 'La famiglia parte per le vacanze di Natale dimenticando a casa il figlio di otto anni, che difende la villa da due ladri maldestri a colpi di trappole.',
      pen: 'The family leaves for Christmas vacation and forgets their eight-year-old son at home, who defends the house from two clumsy burglars with booby traps.' },
    { it: 'Shrek', en: 'Shrek', y: 2001, g: 'Animazione / commedia',
      s: ['👹🏞️', '🐴🗣️', '🏰🐉👸', '💚'],
      pit: 'Un orco burbero, accompagnato da un asino chiacchierone, deve liberare una principessa prigioniera in un castello sorvegliato da un drago… e scopre un segreto che la riguarda.',
      pen: 'A grumpy ogre, joined by a chatty donkey, must rescue a princess locked in a dragon-guarded castle… and discovers her secret.' }
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
    const label = kind === 'emoji' ? 'EMOJI ' + n + '/10' : 'TRAMA ' + n + '/6';
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
  if (window.self === window.top) logSolution();
  else {
    window.addEventListener('focus', logSolution);
    if (document.hasFocus()) logSolution();
  }
})();
