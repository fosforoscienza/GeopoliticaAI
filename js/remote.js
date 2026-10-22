// ════════════════════════════════════════════════════
// Telecomando da cellulare
// Il deck (finestra principale) ascolta i comandi del telefono (remote.html)
// su un canale ntfy.sh identificato da un codice "stanza" segreto, e
// pubblica lo stato corrente (titolo, posizione, note) su un secondo canale.
//
// Attivazione: aprire il deck una volta con ?room=<codice> (resta salvato in
// questo browser); ?room=off lo disattiva. Senza stanza non si collega nulla.
// I comandi arrivano come tasti PageDown/PageUp sintetici, così ogni slide
// li gestisce come farebbe con un telecomando fisico.
// ════════════════════════════════════════════════════
(function () {
  if (window.self !== window.top) return;           // solo la finestra principale
  if (window.SlideRemote) return;

  var NTFY = 'https://ntfy.sh/';
  var ROOM_KEY = 'slide-remote-room';
  var LAST_KEY = 'slide-remote-last';
  var MAX_AGE = 15;                                 // secondi: comandi più vecchi vengono ignorati

  function getRoom() {
    var q = new URLSearchParams(location.search).get('room');
    try {
      if (q === 'off') { localStorage.removeItem(ROOM_KEY); return null; }
      if (q && /^[A-Za-z0-9_-]{8,64}$/.test(q)) { localStorage.setItem(ROOM_KEY, q); return q; }
      return localStorage.getItem(ROOM_KEY);
    } catch (e) { return q; }
  }

  function press(key, code, keyCode) {
    var ev = new KeyboardEvent('keydown', { key: key, code: code, bubbles: true, cancelable: true });
    // reveal.js legge ancora keyCode/which.
    try { Object.defineProperty(ev, 'keyCode', { get: function () { return keyCode; } }); } catch (e) {}
    try { Object.defineProperty(ev, 'which', { get: function () { return keyCode; } }); } catch (e) {}
    (document.activeElement && document.activeElement !== document.body && document.activeElement.tagName !== 'IFRAME'
      ? document.activeElement : document).dispatchEvent(ev);
  }

  var defaults = {
    next: function () { press('PageDown', 'PageDown', 34); },
    prev: function () { press('PageUp', 'PageUp', 33); },
    state: function () { return { title: document.title, pos: '', notes: '' }; }
  };

  var room = null, handlers = defaults, es = null, badge = null, lastState = '';

  function showBadge(ok) {
    if (!badge) {
      badge = document.createElement('div');
      badge.style.cssText = 'position:fixed;top:12px;left:12px;z-index:9999;width:10px;height:10px;border-radius:50%;' +
        'pointer-events:none;transition:background .3s;opacity:.8';
      badge.title = 'Telecomando';
      (document.body || document.documentElement).appendChild(badge);
    }
    badge.style.background = ok ? '#34d399' : '#f87171';
  }

  function connect() {
    var url = NTFY + room + '-cmd/sse';
    var last = null;
    try { last = sessionStorage.getItem(LAST_KEY); } catch (e) {}
    if (last) url += '?since=' + encodeURIComponent(last);
    es = new EventSource(url);
    es.onopen = function () { showBadge(true); publishState(true); };
    es.onerror = function () { showBadge(false); };     // EventSource si riconnette da solo
    es.onmessage = function (e) {
      var m; try { m = JSON.parse(e.data); } catch (_) { return; }
      if (m.event !== 'message') return;
      try { sessionStorage.setItem(LAST_KEY, m.id); } catch (_) {}
      if (Date.now() / 1000 - m.time > MAX_AGE) return;
      var cmd = (m.message || '').trim();
      if (cmd === 'next') handlers.next();
      else if (cmd === 'prev') handlers.prev();
      else if (cmd === 'ping') publishState(true);
    };
  }

  function publishState(force) {
    if (!room) return;
    var s;
    try { s = handlers.state() || {}; } catch (e) { s = {}; }
    var body = JSON.stringify({
      title: String(s.title || '').slice(0, 200),
      pos: String(s.pos || ''),
      notes: String(s.notes || '').slice(0, 3000)
    });
    if (!force && body === lastState) return;
    lastState = body;
    fetch(NTFY + room + '-state', { method: 'POST', body: body }).catch(function () {});
  }

  window.SlideRemote = {
    // Un deck può sostituire next/prev/state; poi chiama changed() a ogni cambio slide.
    start: function (h) {
      if (es) return true;                          // già collegato
      room = getRoom();
      if (!room) return false;
      handlers = Object.assign({}, defaults, h || {});
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', connect);
      else connect();
      return true;
    },
    changed: function () { setTimeout(function () { publishState(false); }, 50); },
    room: function () { return room; }
  };
})();
