import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { useDualBrain } from './useDualBrain';

const initialState = { target_budget: 50000, brand_weights: {}, viewed_refs: [], dwellEvents: [] };

function reducer(state, action) {
  if (action.type !== 'DWELL') return state;
  const event = action.payload;
  const nextEvents = [...state.dwellEvents, event];
  const nextBrands = { ...state.brand_weights, [event.brand]: (state.brand_weights[event.brand] || 0) + 1 };
  const nextRefs = [...new Set([...state.viewed_refs, event.reference])].slice(-80);
  const shouldRecalculate = nextEvents.length % 5 === 0;
  const recentPrices = shouldRecalculate ? nextEvents.slice(-5).map((item) => item.price).filter(Number.isFinite) : [];
  return {
    target_budget: recentPrices.length ? Math.round(recentPrices.reduce((sum, price) => sum + price, 0) / recentPrices.length) : state.target_budget,
    brand_weights: nextBrands,
    viewed_refs: nextRefs,
    dwellEvents: nextEvents.slice(-40),
  };
}

export function useAffinity(user) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const dualBrain = useDualBrain(user);
  const timers = useRef(new Map());
  const observer = useRef(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const telemetry = { target_budget: state.target_budget, brand_weights: state.brand_weights, viewed_refs: state.viewed_refs };
      dualBrain.dualWrite(telemetry);
    }, 450);
    return () => window.clearTimeout(timeout);
  }, [state, user]);

  useEffect(() => () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current.clear();
    observer.current?.disconnect();
  }, []);

  const observeCard = useCallback((node) => {
    if (!node) return;
    if (!observer.current) {
      observer.current = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const reference = entry.target.dataset.reference;
          if (!reference) return;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.75) {
            const timer = window.setTimeout(() => {
              const price = Number(entry.target.dataset.price);
              dispatch({ type: 'DWELL', payload: { reference, brand: entry.target.dataset.brand || 'Private desk', price } });
              timers.current.delete(reference);
            }, 1500);
            timers.current.set(reference, timer);
          } else if (timers.current.has(reference)) {
            window.clearTimeout(timers.current.get(reference));
            timers.current.delete(reference);
          }
        });
      }, { threshold: [0, 0.75, 1] });
    }
    observer.current.observe(node);
  }, []);

  const topBrand = useMemo(() => Object.entries(state.brand_weights).sort((a, b) => b[1] - a[1])[0]?.[0] || null, [state.brand_weights]);
  return { affinity: state, topBrand, observeCard };
}
