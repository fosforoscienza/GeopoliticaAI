// ════════════════════════════════════════════════════
// Saturday Night Science — regia condivisa tra show e console
// Lo show (sns-show.html) va sul proiettore, la console (sns-console.html)
// sullo schermo del relatore o sul telefono, anche su un altro dispositivo.
// I video caricati dalla console restano in IndexedDB di quel browser: per
// lo show su un altro dispositivo valgono solo i VIDEOS pubblicati col sito.
// ════════════════════════════════════════════════════
const SNS = (function () {
  // thumb: anteprima statica per la console (le slide vive in miniatura
  // esauriscono la memoria dei telefoni). Si rigenera dopo ogni modifica.
  const SLIDES = [
    { id: 'slide:saturday-night-science', src: 'saturday-night-science.html', thumb: 'img/sns/saturday-night-science.jpg', title: 'Saturday Night Science', sub: 'Macchine che pensano da sole' },
    { id: 'slide:dartmouth-1956',         src: 'dartmouth-1956.html', thumb: 'img/sns/dartmouth-1956.jpg',         title: 'Dartmouth 1956',         sub: 'Copertina' },
    { id: 'slide:dartmouth-1956-2',       src: 'dartmouth-1956-2.html', thumb: 'img/sns/dartmouth-1956-2.jpg',       title: "La nascita dell'AI",     sub: 'Proposta · Pionieri · Promessa' }
  ];

  // Video pubblicati insieme al sito (sempre presenti in galleria)
  const VIDEOS = [
    { id: 'video:che-cose-il-machine-learning', src: 'video/che-cose-il-machine-learning.mp4',
      poster: 'img/che-cose-il-machine-learning-poster.jpg',
      title: "Che cos'è il machine learning", sub: 'Cicerone AI', dur: 138 }
  ];

  // ── Trasporto ──
  // Stesso browser: BroadcastChannel (immediato). Dispositivi diversi (console
  // sul telefono, show sul computer del proiettore): canale broadcast di
  // Supabase Realtime self-hosted sul Mac mini (api.fosforo.info), identificato
  // dalla stanza. Prima di questo file vanno caricati supabase-js e
  // js/sns-config.js (URL e chiave pubblica; non versionato).
  const CONFIG = window.SNS_CONFIG || {};
  const ROOM_KEY = 'sns-regia-room';
  const room = (function () {
    const q = new URLSearchParams(location.search).get('room');
    try {
      if (q && /^[A-Za-z0-9_-]{8,64}$/.test(q)) { localStorage.setItem(ROOM_KEY, q); return q; }
      return localStorage.getItem(ROOM_KEY) || 'sns-regia-m4c7q2xk';
    } catch (e) { return q || 'sns-regia-m4c7q2xk'; }
  })();
  const me = Math.random().toString(36).slice(2, 10);
  const seen = new Set();
  const handlers = [];
  let netOk = false;

  const channel = ('BroadcastChannel' in window) ? new BroadcastChannel('sns-regia') : null;
  function deliver(msg) {
    if (!msg || msg.from === me || seen.has(msg.mid)) return;
    seen.add(msg.mid);
    if (seen.size > 500) seen.delete(seen.values().next().value);
    handlers.forEach(fn => fn(msg));
  }
  if (channel) channel.addEventListener('message', e => deliver(e.data));

  // Prima del collegamento i messaggi aspettano: l'invio via REST di supabase-js
  // non è autorizzato sull'istanza del Mac mini (401).
  let rt = null;
  const pending = [];
  function netSend(msg) { rt.send({ type: 'broadcast', event: 'msg', payload: msg }).catch(() => {}); }
  function connect() {
    if (!window.supabase || !CONFIG.url || !CONFIG.key) return;
    const client = window.supabase.createClient(CONFIG.url, CONFIG.key, { auth: { persistSession: false } });
    rt = client.channel('sns-regia:' + room, { config: { broadcast: { self: false } } });
    rt.on('broadcast', { event: 'msg' }, p => deliver(p.payload));
    rt.subscribe(status => {                                       // la libreria si riconnette da sola
      netOk = status === 'SUBSCRIBED';
      if (netOk) pending.splice(0).forEach(netSend);
    });
  }
  connect();

  // Jarvis (assistente vocale sullo stesso Mac): ponte locale sul suo server. Riceve tutti i messaggi, anche quelli locali,
  // così sa cosa è in onda; i suoi comandi arrivano come quelli della console.
  // Se Jarvis non è acceso riprova in silenzio con attesa crescente.
  const JARVIS = 'http://127.0.0.1:8787/api/sns/';
  let jarvisOk = false, jarvisWait = 3000;
  function connectJarvis() {
    const es = new EventSource(JARVIS + 'events');
    es.onopen = () => { jarvisOk = true; jarvisWait = 3000; postCatalog(); };
    es.onerror = () => {
      jarvisOk = false;
      es.close();
      setTimeout(connectJarvis, jarvisWait);
      jarvisWait = Math.min(jarvisWait * 2, 30000);
    };
    es.onmessage = e => { let msg; try { msg = JSON.parse(e.data); } catch (_) { return; } deliver(msg); };
  }
  function toJarvis(msg) {
    if (jarvisOk) fetch(JARVIS + 'send', { method: 'POST', headers: { 'Content-Type': 'application/json' },
                                           body: JSON.stringify(msg) }).catch(() => {});
  }
  // Elenco di slide e video, per poterli chiamare per nome a voce
  function postCatalog() {
    videos.list().catch(() => []).then(up => toJarvis({ t: 'catalog',
      slides: SLIDES.map(s => ({ id: s.id, title: s.title, sub: s.sub })),
      videos: VIDEOS.map(v => ({ id: v.id, title: v.title, sub: v.sub }))
        .concat(up.map(v => ({ id: v.id, title: v.name, sub: 'Caricato' }))) }));
  }

  // local: true → solo stesso browser (aggiornamenti frequenti)
  function send(msg, local) {
    msg = Object.assign({ mid: me + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), from: me }, msg);
    seen.add(msg.mid);
    if (channel) channel.postMessage(msg);
    toJarvis(msg);
    if (!local && rt) { if (netOk) netSend(msg); else if (pending.push(msg) > 20) pending.shift(); }
  }
  function listen(fn) { handlers.push(fn); }

  // ── Video in IndexedDB ──
  const DB_NAME = 'sns-regia', STORE = 'videos';
  let dbp = null;
  function db() {
    if (!dbp) dbp = new Promise((res, rej) => {
      const r = indexedDB.open(DB_NAME, 1);
      r.onupgradeneeded = () => r.result.createObjectStore(STORE, { keyPath: 'id' });
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
    return dbp;
  }
  function tx(mode, fn) {
    return db().then(d => new Promise((res, rej) => {
      const t = d.transaction(STORE, mode), s = t.objectStore(STORE);
      const r = fn(s);
      t.oncomplete = () => res(r && r.result);
      t.onerror = () => rej(t.error);
    }));
  }
  const videos = {
    list: () => tx('readonly', s => s.getAll()).then(a => (a || []).sort((x, y) => x.added - y.added)),
    get: (id) => tx('readonly', s => s.get(id)),
    add: (file) => {
      const v = { id: 'video:' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                  name: file.name.replace(/\.[^.]+$/, ''), type: file.type, blob: file, added: Date.now() };
      return tx('readwrite', s => s.put(v)).then(() => { postCatalog(); return v; });
    },
    remove: (id) => tx('readwrite', s => s.delete(id)).then(r => { postCatalog(); return r; })
  };

  function isNext(e) {
    const k = e.key, c = e.code;
    return k === 'ArrowRight' || c === 'ArrowRight' || k === 'ArrowDown' || c === 'ArrowDown' ||
           k === 'PageDown' || c === 'PageDown' || k === ' ' || k === 'Spacebar' || c === 'Space' ||
           k === 'Enter' || c === 'Enter';
  }
  function isPrev(e) {
    const k = e.key, c = e.code;
    return k === 'ArrowLeft' || c === 'ArrowLeft' || k === 'ArrowUp' || c === 'ArrowUp' ||
           k === 'PageUp' || c === 'PageUp' || k === 'Backspace' || c === 'Backspace';
  }

  connectJarvis();

  return { SLIDES, VIDEOS, send, listen, videos, isNext, isPrev, room, online: () => netOk };
})();
