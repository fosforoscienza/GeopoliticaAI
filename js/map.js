// ════════════════════════════════════════════════════
// D3 Map utilities — shared by paesi.html & leader.html
// Depends on: d3, topojson, common.js
// ════════════════════════════════════════════════════

// Cover-fill projection: scales so the map fills 100% of W×H
function buildProjection(W, H) {
  const sphere = { type: 'Sphere' };
  const proj   = d3.geoNaturalEarth1().fitSize([W, H], sphere);
  const pathFn = d3.geoPath(proj);
  const [[x0, y0], [x1, y1]] = pathFn.bounds(sphere);
  const cover  = Math.max(W / (x1 - x0), H / (y1 - y0));
  return proj.scale(proj.scale() * cover).translate([W / 2, H / 2]);
}

// Draw the base world map (land, highlighted countries, borders, graticule)
function drawBaseMap(svg, projection, world, isoColorMap) {
  const path      = d3.geoPath(projection);
  const land      = topojson.feature(world, world.objects.land);
  const countries = topojson.feature(world, world.objects.countries);
  const borders   = topojson.mesh(world, world.objects.countries, (a, b) => a !== b);

  // Ocean
  svg.append('rect').attr('width', '100%').attr('height', '100%').attr('fill', '#040e1a');

  // Land base
  svg.append('path').datum(land).attr('d', path).attr('fill', '#0d2137');

  // Country highlights (actors)
  svg.selectAll('.hi')
    .data(countries.features.filter(d => isoColorMap[d.id]))
    .join('path').attr('class', 'hi').attr('d', path)
    .attr('fill',   d => isoColorMap[d.id] + '22')
    .attr('stroke', d => isoColorMap[d.id] + '60')
    .attr('stroke-width', 1.2);

  // Borders
  svg.append('path').datum(borders).attr('d', path)
    .attr('fill', 'none').attr('stroke', '#1a3550').attr('stroke-width', 0.4);

  // Graticule
  svg.append('path').datum(d3.geoGraticule()()).attr('d', path)
    .attr('fill', 'none').attr('stroke', 'rgba(255,255,255,0.04)').attr('stroke-width', 0.5);

  // Globe outline
  svg.append('path').datum({ type: 'Sphere' }).attr('d', path)
    .attr('fill', 'none').attr('stroke', '#1a3550').attr('stroke-width', 0.8);
}

// Place interactive markers on the map
// labelFn(actor) → string shown above the dot
function drawMarkers(svg, projection, actors, labelFn, clickFn) {
  actors.forEach(actor => {
    const p = projection(actor.coords);
    if (!p || isNaN(p[0])) return;
    const [x, y] = p;

    const g = svg.append('g')
      .attr('class', 'marker-group')
      .attr('transform', `translate(${x},${y})`)
      .on('click', () => clickFn(actor));

    // Pulse ring
    g.append('circle').attr('class', 'pulse-ring')
      .attr('r', 12).attr('fill', 'none')
      .attr('stroke', actor.color).attr('stroke-width', 1.8);

    // Dot
    g.append('circle').attr('class', 'marker-dot')
      .attr('r', 7).attr('fill', actor.color)
      .attr('stroke', '#f0f5fb').attr('stroke-width', 1.8)
      .style('filter', `drop-shadow(0 0 6px ${actor.color})`);

    // Label above dot
    g.append('text').attr('class', 'marker-label')
      .attr('y', -14).attr('text-anchor', 'middle')
      .attr('font-size', '15px').text(labelFn(actor));
  });
}

// Full map init: fetch world + draw base + place markers
async function initMap(svgId, actors, labelFn, clickFn) {
  const W   = window.innerWidth;
  const H   = window.innerHeight;
  const svg = d3.select(`#${svgId}`).attr('width', W).attr('height', H);
  const proj = buildProjection(W, H);

  const isoColorMap = {};
  actors.forEach(a => a.isoNums.forEach(n => { isoColorMap[n] = a.color; }));

  const world = await d3.json('https://unpkg.com/world-atlas@2/countries-110m.json');
  drawBaseMap(svg, proj, world, isoColorMap);
  drawMarkers(svg, proj, actors, labelFn, clickFn);
}
