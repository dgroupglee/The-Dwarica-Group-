import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const fallback = [
  { symbol: 'SPY', price: '485.20', change: '+0.34%' },
  { symbol: 'GLD', price: '192.80', change: '+0.12%' },
  { symbol: 'BTC', price: '67,420', change: '+1.80%' },
];

export default function MarketTicker() {
  const [quotes, setQuotes] = useState(fallback);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data } = await supabase.functions.invoke('market-data');
      if (cancelled) return;
      const live = ['SPY', 'GLD'].map((symbol, index) => {
        const quote = data?.quotes?.[symbol];
        return quote?.price ? { symbol, price: Number(quote.price).toFixed(2), change: quote.change || '0.00%' } : fallback[index];
      });
      setQuotes([...live, fallback[2]]);
    };
    load();
    const timer = window.setInterval(load, 60000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, []);

  return <div className="market-ticker" aria-label="Market data ticker"><div className="market-ticker-track">{[...quotes, ...quotes].map((quote, index) => <span key={`${quote.symbol}-${index}`}><b>{quote.symbol}</b> {quote.price} <i>{quote.change.startsWith('-') ? '▼' : '▲'}{quote.change.replace('+', '')}</i></span>)}</div></div>;
}
