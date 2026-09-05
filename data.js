/* ============================================================
   SUN VALLEY WEATHER — baked live data (NWS / NOAA, station KSUN)
   Fetched 2026-09-05 ~08:54 MDT. Used as fallback if a live
   client-side refresh from api.weather.gov fails (e.g. offline).
   ============================================================ */

window.SVW_FALLBACK = {
  observedAt: '2026-09-05T14:54:00Z', // 8:54 AM MDT
  station: 'KSUN',
  stationName: 'Friedman Memorial Airport, Hailey',
  location: 'Sun Valley, Idaho',
  elevation: 5315, // ft
  current: {
    tempF: 54,
    dewpointF: 43,
    humidity: 67,
    windMph: 7,
    windDir: 310, // degrees
    windCardinal: 'NW',
    pressureInHg: 30.12,
    condition: 'Clear',
    feelsLikeF: 52,
    icon: 'sun',
  },
  hourly: [
    { t: '9 AM',  temp: 47, wind: 5,  cond: 'Sunny',          icon: 'sun',       day: true },
    { t: '10 AM', temp: 57, wind: 3,  cond: 'Sunny',          icon: 'sun',       day: true },
    { t: '11 AM', temp: 63, wind: 5,  cond: 'Sunny',          icon: 'sun',       day: true },
    { t: '12 PM', temp: 67, wind: 8,  cond: 'Sunny',          icon: 'sun',       day: true },
    { t: '1 PM',  temp: 70, wind: 9,  cond: 'Sunny',          icon: 'sun',       day: true },
    { t: '2 PM',  temp: 70, wind: 10, cond: 'Sunny',          icon: 'sun',       day: true },
    { t: '3 PM',  temp: 71, wind: 10, cond: 'Sunny',          icon: 'sun',       day: true },
    { t: '4 PM',  temp: 71, wind: 9,  cond: 'Sunny',          icon: 'sun',       day: true },
    { t: '5 PM',  temp: 70, wind: 8,  cond: 'Sunny',          icon: 'sun',       day: true },
    { t: '6 PM',  temp: 72, wind: 6,  cond: 'Mostly Clear',   icon: 'cloud-moon', day: false },
    { t: '7 PM',  temp: 69, wind: 5,  cond: 'Mostly Clear',   icon: 'cloud-moon', day: false },
    { t: '8 PM',  temp: 65, wind: 2,  cond: 'Partly Cloudy',  icon: 'cloud-moon', day: false },
    { t: '9 PM',  temp: 60, wind: 3,  cond: 'Mostly Clear',   icon: 'moon',      day: false },
    { t: '10 PM', temp: 56, wind: 5,  cond: 'Mostly Clear',   icon: 'moon',      day: false },
    { t: '11 PM', temp: 54, wind: 5,  cond: 'Mostly Clear',   icon: 'moon',      day: false },
    { t: '12 AM', temp: 52, wind: 6,  cond: 'Partly Cloudy',  icon: 'cloud-moon', day: false },
    { t: '1 AM',  temp: 50, wind: 6,  cond: 'Partly Cloudy',  icon: 'cloud-moon', day: false },
    { t: '2 AM',  temp: 49, wind: 6,  cond: 'Partly Cloudy',  icon: 'cloud-moon', day: false },
    { t: '3 AM',  temp: 47, wind: 6,  cond: 'Partly Cloudy',  icon: 'cloud-moon', day: false },
    { t: '4 AM',  temp: 45, wind: 6,  cond: 'Partly Cloudy',  icon: 'cloud-moon', day: false },
    { t: '5 AM',  temp: 43, wind: 6,  cond: 'Partly Cloudy',  icon: 'cloud-moon', day: false },
    { t: '6 AM',  temp: 42, wind: 5,  cond: 'Mostly Sunny',   icon: 'cloud-sun', day: true },
    { t: '7 AM',  temp: 40, wind: 5,  cond: 'Mostly Sunny',   icon: 'cloud-sun', day: true },
    { t: '8 AM',  temp: 42, wind: 5,  cond: 'Mostly Sunny',   icon: 'cloud-sun', day: true },
  ],
  daily: [
    { name: 'Today',          hi: 73, lo: 40, cond: 'Sunny',                          icon: 'sun',         day: true },
    { name: 'Sun',            hi: 75, lo: 39, cond: 'Mostly sunny, PM t-storms',     icon: 'cloud-sun',   day: true },
    { name: 'Labor Day',     hi: 62, lo: 31, cond: 'Rain & t-storms likely',        icon: 'thunder',     day: true },
    { name: 'Tue',            hi: 70, lo: 38, cond: 'Sunny',                          icon: 'sun',         day: true },
    { name: 'Wed',            hi: 77, lo: 42, cond: 'Mostly sunny',                  icon: 'cloud-sun',   day: true },
    { name: 'Thu',            hi: 77, lo: 43, cond: 'Mostly sunny',                  icon: 'cloud-sun',   day: true },
    { name: 'Fri',            hi: 75, lo: 42, cond: 'Slight chance PM rain',         icon: 'cloud-sun',   day: true },
  ],
  webcams: [
    { name: 'River Run',      img: 'https://b16.hdrelay.com/camera/4c82abd4-5ef5-4b16-870f-548c2885d3f0/snapshot', live: true,  badge: 'Live'  },
    { name: 'Warm Springs',  img: 'https://b16.hdrelay.com/camera/5f27e4b8-7c51-4451-bcf5-3ab843f56bc6/snapshot', live: true,  badge: 'Live'  },
    { name: 'The Bowls',     img: 'https://b16.hdrelay.com/camera/390488dd-a758-4dd3-ae95-91c408abbff0/snapshot', live: true,  badge: 'Live'  },
    { name: 'Snow Stake',    img: 'https://b16.hdrelay.com/camera/9d9a56b7-bf9e-4162-be9c-06c42ca208ff/snapshot', live: true,  badge: 'Live'  },
    { name: 'Quarter Dollar', img: 'https://b16.hdrelay.com/camera/b4e43d2a-4ba6-4f25-8753-1055f95230cb/snapshot', live: true, badge: 'Live'  },
    { name: 'SV Club',        img: 'https://b16.hdrelay.com/camera/22429e23-e586-4934-b19b-beb1e20a54a7/snapshot', live: true, badge: 'Live'  },
  ],
};

/* ---------- Live NWS refresh (best-effort) ---------- */
window.SVW_fetchLive = async function () {
  const UA = { 'User-Agent': '(sunvalleyweather.com, timur@mac.com)', 'Accept': 'application/geo+json' };
  try {
    const pt = await fetch('https://api.weather.gov/points/43.6966,-114.3528', { headers: UA });
    if (!pt.ok) throw new Error('point');
    const pd = await pt.json();
    const props = pd.properties || {};
    const fUrl = props.forecast, hUrl = props.forecastHourly;
    const obs = await fetch('https://api.weather.gov/stations/KSUN/observations/latest', { headers: UA });
    if (!obs.ok) throw new Error('obs');
    const od = (await obs.json()).properties || {};
    const toF = c => (c == null ? null : Math.round(c * 9 / 5 + 32));
    const c2f = v => v && v.value != null && v.unitCode.includes('degC') ? toF(v.value) : null;
    const windMph = v => v && v.value != null && v.unitCode.includes('km_h') ? Math.round(v.value / 1.609) : null;
    const degToCard = d => d == null ? '' : ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'][Math.round(d/22.5) % 16];
    const condIcon = (txt, day) => {
      const s = (txt || '').toLowerCase();
      if (/thunder|t-storm/.test(s)) return 'thunder';
      if (/rain|shower/.test(s)) return 'rain';
      if (/cloud|overcast/.test(s)) return day ? 'cloud-sun' : 'cloud-moon';
      if (/few|clear|sunny/.test(s)) return day ? 'sun' : 'moon';
      return day ? 'cloud-sun' : 'cloud-moon';
    };
    const cur = {
      tempF: c2f(od.temperature),
      dewpointF: c2f(od.dewpoint),
      humidity: od.relativeHumidity && od.relativeHumidity.value != null ? Math.round(od.relativeHumidity.value) : null,
      windMph: windMph(od.windSpeed),
      windCardinal: degToCard(od.windDirection && od.windDirection.value),
      pressureInHg: od.barometricPressure && od.barometricPressure.value ? Math.round((od.barometricPressure.value / 3386.39) * 100) / 100 : null,
      condition: od.textDescription || '—',
      feelsLikeF: c2f(od.temperature), // simplified
      icon: condIcon(od.textDescription, true),
    };
    let hourly = [], daily = [];
    if (hUrl) {
      const hd = await (await fetch(hUrl, { headers: UA })).json();
      hourly = (hd.properties && hd.properties.periods || []).slice(0, 24).map(p => {
        const day = (p.isDaytime !== false);
        const t = new Date(p.startTime);
        const tLabel = t.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }).replace(':00','');
        return { t: tLabel, temp: p.temperature, wind: parseInt(p.windSpeed) || 0, cond: p.shortForecast || '', icon: condIcon(p.shortForecast, day), day };
      });
    }
    if (fUrl) {
      const fd = await (await fetch(fUrl, { headers: UA })).json();
      daily = (fd.properties && fd.properties.periods || []).slice(0, 14).reduce((acc, p, i, arr) => {
        if (i % 2 === 0) {
          const night = arr[i + 1];
          acc.push({
            name: p.name,
            hi: p.temperature,
            lo: night ? night.temperature : null,
            cond: night ? (p.shortForecast + ' / ' + night.shortForecast) : p.shortForecast,
            icon: condIcon(p.shortForecast, true),
            day: true,
          });
        }
        return acc;
      }, []).slice(0, 7);
    }
    return { observedAt: od.timestamp, current: cur, hourly, daily };
  } catch (e) {
    return null;
  }
};
