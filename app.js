/* ============================================================
   SUN VALLEY WEATHER — render + interactions
   ============================================================ */
(function () {
  // ---- Theme toggle ----
  const toggle = document.querySelector('[data-theme-toggle]');
  const htmlRoot = document.documentElement;
  const sunSVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="4.5"/><g stroke-linecap="round"><path d="M12 1.5v2M12 20.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1.5 12h2M20.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></g></svg>';
  const moonSVG = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  let theme = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  htmlRoot.setAttribute('data-theme', theme);
  const syncToggle = () => { if (!toggle) return; toggle.innerHTML = theme === 'dark' ? sunSVG : moonSVG; toggle.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode'); };
  syncToggle();
  toggle && toggle.addEventListener('click', () => { theme = theme === 'dark' ? 'light' : 'dark'; htmlRoot.setAttribute('data-theme', theme); syncToggle(); });

  // ---- Mobile menu ----
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const backdrop = document.getElementById('menuBackdrop');
  const setMenu = (open) => {
    if (!mobileMenu) return;
    mobileMenu.hidden = false;
    mobileMenu.classList.toggle('open', open);
    backdrop && backdrop.classList.toggle('open', open);
    menuBtn && menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuBtn && menuBtn.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
  backdrop && backdrop.addEventListener('click', () => setMenu(false));
  mobileMenu && mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  // ---- Header shadow on scroll ----
  const header = document.getElementById('header');
  const onScroll = () => { if (!header) return; if (window.scrollY > 40) header.classList.add('scrolled'); else header.classList.remove('scrolled'); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // ---- Weather icons (inline SVG, monochrome via currentColor) ----
  const ICONS = {
    sun: '<g class="wx-sun-rays"><path d="M12 1.5v2M12 20.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1.5 12h2M20.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke-linecap="round"/></g><circle class="wx-sun-body" cx="12" cy="12" r="4.5"/>',
    moon: '<path class="wx-moon" d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/><circle class="wx-star" cx="5.5" cy="6.5" r="0.7"/><circle class="wx-star" cx="7.5" cy="11" r="0.5"/>',
    'cloud-sun': '<g class="wx-sun-rays"><path d="M7 4v2M3.5 7.5l1.4 1.4M1.5 11h2" stroke-linecap="round"/></g><circle class="wx-sun-body" cx="6" cy="7.5" r="2.5"/><g class="wx-cloud"><path d="M8 18a4 4 0 1 1 .5-7.97A5 5 0 0 1 18 11a3.5 3.5 0 0 1 0 7H8z"/></g>',
    'cloud-moon': '<path class="wx-moon" d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" opacity=".5"/><g class="wx-cloud"><path d="M9 20a4 4 0 1 1 .5-7.97A3.5 3.5 0 0 1 17 13a3 3 0 0 1 0 7H9z"/></g><circle class="wx-star" cx="5" cy="6.5" r="0.5"/>',
    cloud: '<g class="wx-cloud"><path d="M8 18a4 4 0 1 1 .5-7.97A5 5 0 0 1 18 11a3.5 3.5 0 0 1 0 7H8z"/></g>',
    rain: '<g class="wx-cloud"><path d="M8 15a4 4 0 1 1 .5-7.97A5 5 0 0 1 18 8a3.5 3.5 0 0 1 0 7H8z"/></g><g class="wx-rain" stroke-linecap="round"><path class="drop" d="M9 19l-1 3"/><path class="drop" d="M13 19l-1 3"/><path class="drop" d="M17 19l-1 3"/></g>',
    snow: '<g class="wx-cloud"><path d="M8 15a4 4 0 1 1 .5-7.97A5 5 0 0 1 18 8a3.5 3.5 0 0 1 0 7H8z"/></g><g class="wx-snow"><circle class="flake" cx="9" cy="18" r="0.8"/><circle class="flake" cx="12" cy="19" r="0.8"/><circle class="flake" cx="15" cy="18" r="0.8"/></g>',
    thunder: '<g class="wx-cloud"><path d="M8 14a4 4 0 1 1 .5-7.97A5 5 0 0 1 18 7a3.5 3.5 0 0 1 0 7H8z"/></g><path class="wx-bolt" d="M13 14l-3 5h2.5L11 23l4-6h-2.5L13 14z" fill="currentColor" stroke="none"/><g class="wx-rain" stroke-linecap="round"><path class="drop" d="M9 19l-1 3"/><path class="drop" d="M17 19l-1 3"/></g>',
  };
  const iconSVG = (key) => `<svg class="h-icon wx-icon" data-wx="${key}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round">${ICONS[key] || ICONS.cloud}</svg>`;
  const dayIconSVG = (key) => `<svg class="day-icon wx-icon" data-wx="${key}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round">${ICONS[key] || ICONS.cloud}</svg>`;
  const currentIconSVG = (key) => `<svg class="hero-icon wx-icon" data-wx="${key}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round">${ICONS[key] || ICONS.cloud}</svg>`;

  // ---- Helpers ----
  const $ = (sel) => document.querySelector(sel);
  // ---- Count-up animation for temperature values ----
  function animateTemp(el, target, suffix = '°') {
    if (!el) return;
    const goal = Math.round(parseFloat(target));
    if (isNaN(goal)) { el.textContent = target + suffix; return; }
    const prev = parseInt(el.dataset.tempVal, 10);
    const from = isNaN(prev) ? 0 : prev;
    if (el._anim) cancelAnimationFrame(el._anim);
    const dur = 950, t0 = performance.now();
    const step = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);          // easeOutCubic
      el.textContent = Math.round(from + (goal - from) * e) + suffix;
      if (p < 1) el._anim = requestAnimationFrame(step);
      else { el.textContent = goal + suffix; el.dataset.tempVal = goal; }
    };
    el._anim = requestAnimationFrame(step);
  }
  const fmtObserved = (iso) => {
    if (!iso) return 'Updated recently';
    const d = new Date(iso);
    if (isNaN(d)) return 'Updated recently';
    return 'Observed ' + d.toLocaleTimeString('en-US', { timeZone: 'America/Boise', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' });
  };

  // ---- Render ----
  // Merge live values over fallback; only override fields that are non-null.
  function mergeCurrent(fbCur, liveCur) {
    const out = {};
    for (const k of Object.keys(fbCur || {})) out[k] = fbCur[k];
    if (liveCur) for (const k of Object.keys(liveCur)) if (liveCur[k] != null) out[k] = liveCur[k];
    return out;
  }

  let firstRender = true;
  function render(data) {
    const fb = window.SVW_FALLBACK || {};
    const current = mergeCurrent(fb.current, data.current);
    let hourly = (data.hourly && data.hourly.length && data.hourly[0].temp != null) ? data.hourly : fb.hourly;
    let daily = (data.daily && data.daily.length && data.daily[0].hi != null) ? data.daily : fb.daily;
    const observedAt = data.observedAt || fb.observedAt;

    // Current
    const setText = (sel, val) => { const el = $(sel); if (el && val != null) el.textContent = val; };
    setText('[data-current-cond]', current.condition);
    setText('[data-current-cond-card]', current.condition);
    const heroIcon = $('[data-current-icon]');
    if (heroIcon) heroIcon.innerHTML = currentIconSVG(current.icon);
    animateTemp($('[data-current-temp]'), current.tempF);
    animateTemp($('[data-current-temp-big]'), current.tempF);
    animateTemp($('[data-current-temp-card]'), current.tempF);
    animateTemp($('[data-feelslike]'), current.feelsLikeF);
    setText('[data-humidity]', current.humidity + '%');
    setText('[data-humidity-card]', current.humidity + '%');
    setText('[data-dewpoint]', current.dewpointF + '°');
    setText('[data-dewpoint-card]', current.dewpointF + '°');
    setText('[data-pressure]', (current.pressureInHg || 0).toFixed(2) + '"');
    setText('[data-pressure-card]', (current.pressureInHg || 0).toFixed(2) + '"');
    setText('[data-wind]', current.windMph + ' mph ' + (current.windCardinal || ''));
    setText('[data-wind-card]', current.windMph + ' mph ' + (current.windCardinal || ''));
    setText('[data-observed]', fmtObserved(observedAt));
    setText('[data-observed-card]', fmtObserved(observedAt));

    // Hourly
    const track = $('[data-hourly-track]');
    if (track) {
      if (!firstRender) track.classList.add('no-anim');
      track.innerHTML = hourly.slice(0, 24).map((h, i) => `
        <div class="hour-card${i === 0 ? ' now' : ''}">
          <span class="h-time">${i === 0 ? 'Now' : h.t}</span>
          ${iconSVG(h.icon)}
          <span class="h-temp">${h.temp}°</span>
          <span class="h-wind">${h.wind} mph</span>
        </div>`).join('');
    }

    // Daily
    const list = $('[data-daily-list]');
    if (list) {
      if (!firstRender) list.classList.add('no-anim');
      list.innerHTML = daily.map(d => `
        <div class="day-row">
          <span class="day-name">${d.name}</span>
          ${dayIconSVG(d.icon)}
          <span class="day-cond">${d.cond}</span>
          <span class="day-temps"><b class="day-hi">${d.hi}°</b> <span class="day-lo">${d.lo}°</span></span>
        </div>`).join('');
    }

    // 48-hour summary
    renderSummary(hourly);

    // Webcams
    const camGrid = $('[data-cam-grid]');
    if (camGrid && fb.webcams) {
      const grads = ['linear-gradient(135deg,#1f4e6b,#0b223f)', 'linear-gradient(135deg,#5c7f93,#0b223f)', 'linear-gradient(135deg,#3a6b54,#16271d)'];
      camGrid.innerHTML = fb.webcams.map((c, i) => `
        <div class="cam" style="background:${grads[i % grads.length]}">
          ${c.img ? `<img src="${c.img}" alt="${c.name} webcam" loading="lazy" onerror="this.style.display='none'" />` : ''}
          <span class="cam-label">${c.name}</span>
          <span class="cam-live">${c.badge || 'Live'}</span>
        </div>`).join('');
    }
    firstRender = false;
  }

  // ---- 48-hour summary (8 six-hour windows, 2 rows of 4) ----
  const sumGrid = $('[data-sum-grid]');
  const condShort = (s) => (s || '')
    .replace(/Slight Chance Showers And Thunderstorms/gi, 'Slight T-Storms')
    .replace(/Chance Showers And Thunderstorms/gi, 'Chance T-Storms')
    .replace(/Showers And Thunderstorms/gi, 'T-Storms')
    .replace(/Thunderstorms/gi, 'T-Storms')
    .replace(/Showers And Snow/gi, 'Rain/Snow')
    .replace(/Rain And Snow/gi, 'Rain/Snow')
    .replace(/Slight Chance/gi, 'Slight')
    .replace(/Chance of/gi, 'Chance');
  function renderSummary(hours) {
    if (!sumGrid || !hours || !hours.length) return;
    const h = hours.slice(0, 48);
    const blocks = [];
    for (let b = 0; b < 8; b++) {
      const start = b * 6;
      if (start >= h.length) break;
      const end = Math.min(start + 5, h.length - 1);
      const slice = h.slice(start, end + 1);
      const maxTemp = Math.max(...slice.map(p => p.temp));
      const maxPop = Math.max(...slice.map(p => p.pop || 0));
      const mid = slice[Math.floor(slice.length / 2)];
      const wet = slice.find(p => ['rain', 'thunder', 'snow'].includes(p.icon));
      const icon = wet ? wet.icon : mid.icon;
      const cond = wet ? wet.cond : mid.cond;
      const range = h[start].t + ' \u2013 ' + h[end].t;
      blocks.push({ range, maxTemp, maxPop, icon, cond });
    }
    let html = '';
    blocks.forEach((b, i) => {
      if (i === 0) html += `<div class="sum-day-tag">Day 1</div>`;
      if (i === 4) html += `<div class="sum-day-tag">Day 2</div>`;
      html += `<div class="sum-cell">
        <span class="sum-range">${b.range}</span>
        <div class="sum-icon">${iconSVG(b.icon)}</div>
        <span class="sum-temp">${b.maxTemp}°</span>
        <span class="sum-cond">${condShort(b.cond)}</span>
        ${b.maxPop > 0 ? `<span class="sum-pop">${b.maxPop}% precip</span>` : ''}
      </div>`;
    });
    sumGrid.innerHTML = html;
  }

  // ---- Ski & snow report (point-in-time snapshot from data.js) ----
  function renderSki() {
    const s = window.SVW_SKI; if (!s) return;
    const el = $('[data-ski-report]'); if (!el) return;
    const dash = v => (v == null || v === '') ? '—' : v;
    const snow = s.snow || {};
    const t = s.terrain || {};
    const cells = [['last24','Last 24h'],['last48','Past 48h'],['last7','7-Day'],['baseDepth','Base depth'],['seasonTotal','Season total']];
    el.innerHTML = `
      <div class="ski-banner">
        <span class="ski-status ${s.open ? '' : 'closed'}">${s.status}</span>
        <span class="ski-reopens">Season reopens <b>${s.reopens}</b> · closes ${s.seasonEnd}</span>
      </div>
      <div class="ski-grid">
        ${cells.map(([k, lbl]) => `<div class="ski-cell"><div class="ski-val">${dash(snow[k])}</div><div class="ski-lbl">${lbl}</div></div>`).join('')}
      </div>
      <div class="ski-terrain">
        <div class="ski-terr"><div class="ski-val">${t.liftsOpen}<span class="u">/${t.liftsTotal}</span></div><div class="ski-lbl">Lifts open</div></div>
        <div class="ski-terr"><div class="ski-val">${t.trailsOpen}<span class="u">/${t.trailsTotal}km</span></div><div class="ski-lbl">Trails open</div></div>
        <div class="ski-terr"><div class="ski-val" style="font-size:var(--text-base)">${dash(t.surface)}</div><div class="ski-lbl">Surface</div></div>
      </div>
      <div class="ski-cta">
        <a class="btn btn-solid" href="${s.reportUrl}" target="_blank" rel="noopener">Official mountain report</a>
        <span class="ski-attrib">Snow report data: Sun Valley Resort · snapshot ${s.updated} · <a href="${s.reportUrl}" target="_blank" rel="noopener">view live report</a></span>
      </div>`;
  }

  // ---- Initial render with fallback, then attempt live refresh ----
  render({});
  renderSki();
  renderFish();
  fetchAlerts();
  fetchRiver();
  if (window.SVW_fetchLive) {
    window.SVW_fetchLive().then(live => { if (live && live.current) render(live); }).catch(() => {});
  }

  // ---- Fishing report (live USGS river flow + seasonal notes) ----
  function renderFish() {
    const f = window.SVW_FISH; if (!f) return;
    const el = $('[data-fish-report]'); if (!el) return;
    el.innerHTML = `
      <div class="fish-flow">
        ${f.waters.map(w => `<div class="flow-card"><div class="flow-name">${w.name}</div><div class="flow-val" data-flow-site="${w.site}">${w.flow}<span class="u">${w.unit}</span></div><div class="flow-loc">${w.loc} <span class="live-dot"></span> live</div></div>`).join('')}
      </div>
      <div class="fish-grid">
        <div class="fish-cell"><div class="fish-val">${f.biting}</div><div class="fish-lbl">What's biting</div></div>
        <div class="fish-cell"><div class="fish-val">${f.clarity}</div><div class="fish-lbl">Water clarity</div></div>
        <div class="fish-cell"><div class="fish-val">${f.bestTimes}</div><div class="fish-lbl">Best times</div></div>
      </div>
      <div class="fish-hatches">
        <p class="fish-h-title">September hatches &amp; patterns</p>
        <ul class="hatch-list">${f.hatches.map(h => `<li><span class="hatch-name">${h.name}</span><span class="hatch-size">${h.size}</span></li>`).join('')}</ul>
        <p class="fish-attrib" style="margin-top:1rem">${f.season}</p>
      </div>
      <div class="fish-cta">
        <a class="btn btn-solid" href="${f.shopUrl}" target="_blank" rel="noopener">Local fly-shop report</a>
        <a class="btn btn-outline" href="${f.idfgUrl}" target="_blank" rel="noopener">IDFG seasons &amp; rules</a>
        <span class="fish-attrib">River flow: <a href="https://waterdata.usgs.gov/nwis" target="_blank" rel="noopener">USGS Water Data</a> · fishing notes: seasonal snapshot ${f.updated}</span>
      </div>`;
  }
  async function fetchRiver() {
    const f = window.SVW_FISH; if (!f) return;
    const sites = f.waters.map(w => w.site).join(',');
    try {
      const r = await fetch(`https://waterservices.usgs.gov/nwis/iv/?sites=${sites}&parameterCd=00060&format=json`);
      if (!r.ok) return;
      const d = await r.json();
      for (const ts of (d.value.timeSeries || [])) {
        const site = ts.sourceInfo.siteCode[0].value;
        const w = f.waters.find(x => x.site === site); if (!w) continue;
        const v = ts.values[0].value[0]; if (!v || v.value === '-' || v.value == null) continue;
        const node = document.querySelector(`[data-flow-site="${site}"]`);
        if (node) node.innerHTML = `${(Math.round(parseFloat(v.value) * 10) / 10)}<span class="u">${w.unit}</span>`;
      }
    } catch (e) {}
  }

  // ---- Weather alerts (NWS active alerts for Sun Valley point) ----
  const alertClose = $('#alertClose');
  if (alertClose) alertClose.addEventListener('click', () => { const b = $('#alertBar'); if (b) b.hidden = true; });
  async function fetchAlerts() {
    try {
      const UA = { 'User-Agent': '(sunvalleyweather.com, timur@mac.com)', 'Accept': 'application/geo+json' };
      const r = await fetch('https://api.weather.gov/alerts/active?point=43.6966,-114.3528', { headers: UA });
      if (!r.ok) return;
      const d = await r.json();
      const feats = d.features || [];
      if (!feats.length) return;
      const order = { Extreme: 5, Severe: 4, Moderate: 3, Minor: 2, Unknown: 1 };
      feats.sort((a, b) => (order[b.properties.severity] || 0) - (order[a.properties.severity] || 0));
      const f = feats[0];
      const p = f.properties;
      const bar = $('#alertBar'); if (!bar) return;
      bar.hidden = false;
      bar.setAttribute('data-severity', (p.severity || 'unknown').toLowerCase());
      const head = $('[data-alert-headline]');
      if (head) head.textContent = p.headline || (p.event + (p.areaDesc ? ' \u2014 ' + p.areaDesc : ''));
      const link = $('[data-alert-link]');
      if (link) {
        const urn = String(f.id).split('/alerts/').pop();
        link.href = 'https://alerts.weather.gov/cap/wwacapget.php?x=' + urn;
      }
    } catch (e) {}
  }
})();
