import { useEffect, useState } from 'react';

const fallback = [
  { symbol: 'SPY', price: '485.20', change: '+0.34%' },
  { symbol: 'GLD', price: '192.80', change: '+0.12%' },
  { symbol: 'BTC', price: '67,420', change: '+1.80%' },
];

export default function MarketTicker() {
  const [quotes, setQuotes] = useState(fallback);

  useEffect(() => {
    const endpoint = import.meta.env.VITE_ALPHA_VANTAGE_KEY;
    if (!endpoint) return undefined;
    let cancelled = false;
    const load = async () => {
      const symbols = ['SPY', 'GLD'];
      const responses = await Promise.allSettled(symbols.map((symbol) => fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${endpoint}`).then((response) => response.json())));
      if (cancelled) return;
      const live = responses.map((result, index) => {
        const quote = result.status === 'fulfilled' ? result.value?.['Global Quote'] : null;
        return quote?.['05. price'] ? { symbol: symbols[index], price: Number(quote['05. price']).toFixed(2), change: quote['10. change percent'] || '0.00%' } : fallback[index];
      });
      setQuotes([...live, fallback[2]]);
    };
    load();
    const timer = window.setInterval(load, 60000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, []);

  return <div className="market-ticker" aria-label="Market data ticker"><div className="market-ticker-track">{[...quotes, ...quotes].map((quote, index) => <span key={`${quote.symbol}-${index}`}><b>{quote.symbol}</b> {quote.price} <i>{quote.change.startsWith('-') ? '▼' : '▲'}{quote.change.replace('+', '')}</i></span>)}</div></div>;
}
