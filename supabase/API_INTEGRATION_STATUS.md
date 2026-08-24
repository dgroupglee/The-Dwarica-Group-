# Server-side API integration

The browser only receives public-safe data. Provider credentials belong in Supabase Edge Function secrets.

## Active in the application

- `FRED_API_KEY`: SOFR data in the Executive Intelligence Cockpit.
- `ALPHA_VANTAGE_KEY`: gold exchange data and SPY/GLD ticker quotes through `market-data`.
- `FMP_API_KEY`: market-hours data through `market-data`.
- Public endpoints without credentials: metals spot, FX, SEC submissions, and Federal Reserve calendar fallback data.

## Reserved server-side providers

`OPENAI_API_KEY`, `OPENROUTER_API_KEY`, `EXA_API_KEY`, `BITQUERY_API_KEY`, `ODDPOOL_API_KEY`, `APIFY_API_KEY`, `DUNE_API_KEY`, `COINGECKO_API_KEY`, `MARKETAUX_API_KEY`, and `DEEPSEEK_API_KEY` are listed in `EDGE_FUNCTION_SECRETS.example` for future feature-specific Edge Functions. They are not called blindly by the client because each provider needs a defined product surface, request limits, response schema, and access policy.

Deploy the active function and set only the credentials required by it:

```bash
supabase functions deploy market-data
supabase secrets set FRED_API_KEY=... ALPHA_VANTAGE_KEY=... FMP_API_KEY=...
```
