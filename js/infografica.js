// ════════════════════════════════════════════════════
// Infografiche SNS: curva animata in SVG, contatori e barre.
// Il grafico ha un'unica serie (un solo colore), griglia tenue, etichette
// dirette solo sui punti che contano.
// ════════════════════════════════════════════════════
const Info = (function () {
  const NS = 'http://www.w3.org/2000/svg';
  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    Object.entries(attrs || {}).forEach(([k, v]) => e.setAttribute(k, v));
    if (parent) parent.appendChild(e);
    return e;
  }

  // o: { x:[min,max], y:[min,max], points:[[x,y]...], xticks:[[x,label]], yticks:[[y,label]],
  //      events:[{x, label, dy}], notes:[{x, y, big, small, dx, dy, anchor, delay}], dots:[x...] }
  function lineChart(svg, o) {
    // altezza del disegno = proporzioni del riquadro, così il grafico lo riempie
    const r = svg.getBoundingClientRect();
    const W = 1000, H = r.width > 0 && r.height > 0 ? Math.max(360, Math.round(W * r.height / r.width)) : 520;
    const m = { l: 64, r: 24, t: 24, b: 44 };
    svg.textContent = '';
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    const X = v => m.l + (v - o.x[0]) / (o.x[1] - o.x[0]) * (W - m.l - m.r);
    const Y = v => H - m.b - (v - o.y[0]) / (o.y[1] - o.y[0]) * (H - m.t - m.b);

    const defs = el('defs', {}, svg);
    const g = el('linearGradient', { id: 'info-area', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    el('stop', { offset: 0, 'stop-color': '#41b7ff', 'stop-opacity': 0.35 }, g);
    el('stop', { offset: 1, 'stop-color': '#41b7ff', 'stop-opacity': 0 }, g);

    const axis = el('g', { class: 'axis' }, svg);
    (o.yticks || []).forEach(([v, lab]) => {
      el('line', { class: 'gridline', x1: m.l, x2: W - m.r, y1: Y(v), y2: Y(v) }, axis);
      el('text', { x: m.l - 12, y: Y(v) + 5, 'text-anchor': 'end' }, axis).textContent = lab;
    });
    (o.xticks || []).forEach(([v, lab]) => {
      el('text', { x: X(v), y: H - m.b + 28, 'text-anchor': 'middle' }, axis).textContent = lab;
    });

    (o.events || []).forEach(ev => {
      const e = el('g', { class: 'event' }, svg);
      el('line', { x1: X(ev.x), x2: X(ev.x), y1: Y(o.y[0]), y2: Y(o.y[0]) - (ev.h || 120) }, e);
      const left = ev.side === 'left';
      el('text', { x: X(ev.x) + (left ? -8 : 8), y: Y(o.y[0]) - (ev.h || 120) + 4, 'text-anchor': left ? 'end' : 'start' }, e).textContent = ev.label;
    });

    const pts = o.points.map(([x, y]) => [X(x), Y(y)]);
    const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    el('path', { class: 'area', d: d + ` L${pts[pts.length - 1][0]} ${Y(o.y[0])} L${pts[0][0]} ${Y(o.y[0])} Z`, fill: 'url(#info-area)' }, svg);
    el('path', { class: 'curve', d, pathLength: 1 }, svg);

    (o.notes || []).forEach(n => {
      const gx = X(n.x), gy = Y(n.y);
      const note = el('g', { class: 'note', style: `animation-delay:${n.delay || 2}s` }, svg);
      const tx = gx + (n.dx || 0), ty = gy + (n.dy || -60);
      el('line', { x1: gx, y1: gy, x2: tx, y2: ty + 8 }, note);
      const a = n.anchor || 'middle';
      el('text', { class: 'big', x: tx, y: ty - 18, 'text-anchor': a }, note).textContent = n.big;
      if (n.small) el('text', { class: 'small', x: tx, y: ty + 2, 'text-anchor': a }, note).textContent = n.small;
      el('circle', { class: 'dot', cx: gx, cy: gy, r: 7, style: `animation-delay:${(n.delay || 2) - 0.2}s` }, svg);
    });
  }

  // numeri che contano fino al valore: <span data-to="40" data-dec="0">
  function countUp(root) {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.querySelectorAll('[data-to]').forEach((s, i) => {
      const to = parseFloat(s.dataset.to), dec = parseInt(s.dataset.dec || '0', 10);
      const fmt = v => v.toLocaleString('it-IT', { minimumFractionDigits: dec, maximumFractionDigits: dec });
      if (still) { s.textContent = fmt(to); return; }
      const t0 = performance.now() + 700 + i * 250, dur = 1600;
      s.textContent = fmt(0);
      (function tick(t) {
        const k = Math.min(1, Math.max(0, (t - t0) / dur));
        s.textContent = fmt(to * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(tick);
      })(performance.now());
    });
  }

  // barre: <div class="fill" data-w="0.27">
  function bars(root) {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const set = () => root.querySelectorAll('.fill[data-w]').forEach(f => { f.style.width = (parseFloat(f.dataset.w) * 100) + '%'; });
    still ? set() : setTimeout(set, 900);
  }

  // disegna e ridisegna se cambia la finestra (proiettore, schermo intero)
  function chart(svg, o) {
    lineChart(svg, o);
    let t = null;
    window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => lineChart(svg, o), 200); });
  }

  return { chart, countUp, bars };
})();
