import { useEffect, useState } from 'react';

const fallback = [
  { stream: 'Macro rates', value: 'SOFR / 5.33%', detail: 'Public benchmark fallback' },
  { stream: 'Hard assets', value: 'Gold / $2,340', detail: 'Spot reference fallback' },
  { stream: 'SEC disclosures', value: 'EDGAR / monitoring', detail: 'Public filings channel' },
  { stream: 'FX volatility', value: 'DXY / steady', detail: 'Broad-market reference' },
  { stream: 'Economic calendar', value: 'Fed releases / tracked', detail: 'Scheduled public data' },
];

const request = async (url, options = {}) => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 3200);
  try { const response = await fetch(url, { ...options, signal: controller.signal }); return response.ok ? response.json() : null; } catch { return null; } finally { window.clearTimeout(timeout); }
};

const requestText = async (url) => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 3200);
  try { const response = await fetch(url, { signal: controller.signal }); return response.ok ? response.text() : ''; } catch { return ''; } finally { window.clearTimeout(timeout); }
};

export default function ExecutiveIntelligenceCockpit() {
  const [streams, setStreams] = useState(fallback);
  const [live, setLive] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const fredKey = import.meta.env.VITE_FRED_API_KEY;
      const alphaKey = import.meta.env.VITE_ALPHA_VANTAGE_KEY;
      const fmpKey = import.meta.env.VITE_FMP_API_KEY;
      const [fred, metals, fx, gold, marketHours, sec, fedCalendar] = await Promise.all([
        fredKey ? request(`https://api.stlouisfed.org/fred/series/observations?series_id=SOFR&api_key=${fredKey}&file_type=json&sort_order=desc&limit=1`) : null,
        request('https://api.metals.live/v1/spot'),
        request('https://open.er-api.com/v6/latest/USD'),
        alphaKey ? request(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=XAU&to_currency=USD&apikey=${alphaKey}`) : null,
        fmpKey ? request(`https://financialmodelingprep.com/api/v3/market-hours?apikey=${fmpKey}`) : null,
        request('https://data.sec.gov/submissions/CIK0000320193.json', { headers: { Accept: 'application/json' } }),
        requestText('https://www.federalreserve.gov/feeds/press_all.xml'),
      ]);
      if (cancelled) return;
      const sofr = fred?.observations?.[0]?.value;
      const spotGold = gold?.['Realtime Currency Exchange Rate']?.['5. Exchange Rate'] || (Array.isArray(metals) ? metals.find((item) => item.gold)?.gold : null);
      const eur = fx?.rates?.EUR;
      const latestFiling = sec?.filings?.recent?.form?.[0];
      const marketState = marketHours?.isOpen === true ? 'Markets / open' : marketHours ? 'Markets / closed' : fallback[3].value;
      const fedRelease = fedCalendar.match(/<title>([^<]+)<\/title>/i)?.[1];
      setStreams([
        { stream: 'Macro rates', value: sofr && sofr !== '.' ? `SOFR / ${sofr}%` : fallback[0].value, detail: sofr ? 'FRED public API' : fallback[0].detail },
        { stream: 'Hard assets', value: spotGold ? `Gold / $${Number(spotGold).toLocaleString()}` : fallback[1].value, detail: spotGold ? (gold ? 'Alpha Vantage public API' : 'Metals public endpoint') : fallback[1].detail },
        { stream: 'SEC disclosures', value: latestFiling ? `EDGAR / ${latestFiling}` : fallback[2].value, detail: latestFiling ? 'SEC public submissions' : fallback[2].detail },
        { stream: 'Market health', value: marketHours ? marketState : (eur ? `USD/EUR / ${Number(eur).toFixed(3)}` : fallback[3].value), detail: marketHours ? 'FMP market-hours API' : (eur ? 'Open exchange reference' : fallback[3].detail) },
        { stream: 'Economic calendar', value: fedRelease ? 'Fed / latest release' : fallback[4].value, detail: fedRelease || fallback[4].detail },
      ]);
      setLive(Boolean(sofr || spotGold || eur || marketHours || latestFiling || fedRelease));
    };
    load();
    const refreshInterval = window.setInterval(load, 300000);
    return () => { cancelled = true; window.clearInterval(refreshInterval); };
  }, []);
  return <section className="executive-cockpit" aria-label="Executive intelligence cockpit"><div className="executive-cockpit-heading"><div><span className="portal-zone-label">Executive intelligence / five streams</span><h2>Signals the desk is watching.</h2></div><span className={live ? 'cockpit-status cockpit-status--live' : 'cockpit-status'}><i />{live ? 'Public feeds synchronized' : 'Reference mode'}</span></div><div className="executive-cockpit-grid">{streams.map((item) => <article key={item.stream}><span>{item.stream}</span><strong>{item.value}</strong><small>{item.detail}</small></article>)}</div><p className="executive-cockpit-disclaimer">Public reference data only. Not investment advice, an offer, or a substitute for diligence.</p></section>;
}
