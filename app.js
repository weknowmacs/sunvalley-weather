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
    sun: '<circle cx="12" cy="12" r="4.5"/><g stroke-linecap="round"><path d="M12 1.5v2M12 20.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1.5 12h2M20.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></g>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>',
    'cloud-sun': '<path d="M8 18a4 4 0 1 1 .5-7.97A5 5 0 0 1 18 11a3.5 3.5 0 0 1 0 7H8z"/><g stroke-linecap="round"><path d="M7 4v2M3.5 7.5l1.4 1.4M1.5 11h2"/></g>',
    'cloud-moon': '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" opacity=".5"/><path d="M9 20a4 4 0 1 1 .5-7.97A3.5 3.5 0 0 1 17 13a3 3 0 0 1 0 7H9z"/>',
    cloud: '<path d="M8 18a4 4 0 1 1 .5-7.97A5 5 0 0 1 18 11a3.5 3.5 0 0 1 0 7H8z"/>',
    rain: '<path d="M8 15a4 4 0 1 1 .5-7.97A5 5 0 0 1 18 8a3.5 3.5 0 0 1 0 7H8z"/><g stroke-linecap="round"><path d="M9 19l-1 3M13 19l-1 3M17 19l-1 3"/></g>',
    thunder: '<path d="M8 14a4 4 0 1 1 .5-7.97A5 5 0 0 1 18 7a3.5 3.5 0 0 1 0 7H8z"/><path d="M13 14l-3 5h2.5L11 23l4-6h-2.5L13 14z" fill="currentColor" stroke="none"/>',
  };
  const iconSVG = (key) => `<svg class="h-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round">${ICONS[key] || ICONS.cloud}</svg>`;
  const dayIconSVG = (key) => `<svg class="day-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round">${ICONS[key] || ICONS.cloud}</svg>`;

  // ---- Helpers ----
  const $ = (sel) => document.querySelector(sel);
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

  function render(data) {
    const fb = window.SVW_FALLBACK || {};
    const current = mergeCurrent(fb.current, data.current);
    let hourly = (data.hourly && data.hourly.length && data.hourly[0].temp != null) ? data.hourly : fb.hourly;
    let daily = (data.daily && data.daily.length && data.daily[0].hi != null) ? data.daily : fb.daily;
    const observedAt = data.observedAt || fb.observedAt;

    // Current
    const setText = (sel, val) => { const el = $(sel); if (el && val != null) el.textContent = val; };
    setText('[data-current-temp]', current.tempF + '°');
    setText('[data-current-temp-big]', current.tempF + '°');
    setText('[data-current-temp-card]', current.tempF + '°');
    setText('[data-current-cond]', current.condition);
    setText('[data-current-cond-card]', current.condition);
    setText('[data-feelslike]', current.feelsLikeF + '°');
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
      list.innerHTML = daily.map(d => `
        <div class="day-row">
          <span class="day-name">${d.name}</span>
          ${dayIconSVG(d.icon)}
          <span class="day-cond">${d.cond}</span>
          <span class="day-temps"><b class="day-hi">${d.hi}°</b> <span class="day-lo">${d.lo}°</span></span>
        </div>`).join('');
    }

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
  }

  // ---- Initial render with fallback, then attempt live refresh ----
  render({});
  if (window.SVW_fetchLive) {
    window.SVW_fetchLive().then(live => { if (live && live.current) render(live); }).catch(() => {});
  }
})();
