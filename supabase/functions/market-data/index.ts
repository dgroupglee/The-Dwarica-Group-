const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*', 'access-control-allow-headers': 'authorization, x-client-info, apikey, content-type' } });

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return json({ ok: true });
  const fredKey = Deno.env.get('FRED_API_KEY');
  const alphaKey = Deno.env.get('ALPHA_VANTAGE_KEY');
  const fmpKey = Deno.env.get('FMP_API_KEY');
  try {
    const [fred, metals, fx, gold, spy, gld, marketHours, sec, fedCalendar] = await Promise.all([
      fredKey ? fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=SOFR&api_key=${fredKey}&file_type=json&sort_order=desc&limit=1`).then((response) => response.ok ? response.json() : null) : null,
      fetch('https://api.metals.live/v1/spot').then((response) => response.ok ? response.json() : null),
      fetch('https://open.er-api.com/v6/latest/USD').then((response) => response.ok ? response.json() : null),
      alphaKey ? fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=XAU&to_currency=USD&apikey=${alphaKey}`).then((response) => response.ok ? response.json() : null) : null,
      alphaKey ? fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SPY&apikey=${alphaKey}`).then((response) => response.ok ? response.json() : null) : null,
      alphaKey ? fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=GLD&apikey=${alphaKey}`).then((response) => response.ok ? response.json() : null) : null,
      fmpKey ? fetch(`https://financialmodelingprep.com/api/v3/market-hours?apikey=${fmpKey}`).then((response) => response.ok ? response.json() : null) : null,
      fetch('https://data.sec.gov/submissions/CIK0000320193.json', { headers: { Accept: 'application/json' } }).then((response) => response.ok ? response.json() : null),
      fetch('https://www.federalreserve.gov/feeds/press_all.xml').then((response) => response.ok ? response.text() : ''),
    ]);
    const toQuote = (payload: any) => {
      const quote = payload?.['Global Quote'];
      return quote?.['05. price'] ? { price: quote['05. price'], change: quote['10. change percent'] || '0.00%' } : null;
    };
    return json({ fred, metals, fx, gold, quotes: { SPY: toQuote(spy), GLD: toQuote(gld) }, marketHours, sec, fedCalendar });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Market data unavailable' }, 502);
  }
});
