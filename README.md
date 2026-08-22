# The Dwarica Group

## Supabase Magic Link Email Template

This dashboard-only step must be completed manually: go to `supabase.com` → your project → **Authentication → Email Templates → Magic Link**.

Replace the subject line with: **Your Private DGroup Access.**

Replace the body with this exact HTML:

```html
<div style="background:#0A1628;padding:40px;font-family:'Georgia',serif;max-width:480px;margin:0 auto">
  <p style="font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#D4A840;margin-bottom:24px;font-family:monospace">
    THE DWARICA GROUP · PRIVATE ACCESS
  </p>
  <p style="font-size:22px;color:#ffffff;font-weight:400;margin-bottom:16px;line-height:1.4">
    Your private DGroup portal is ready.
  </p>
  <p style="font-size:13px;color:rgba(255,255,255,0.5);line-height:1.8;margin-bottom:32px">
    Click below to access your account. This link expires in 24 hours. If you did not request access, disregard this message.
  </p>
  <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#D4A840;color:#0A1628;padding:14px 32px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;font-weight:700;text-decoration:none;font-family:monospace">
    ENTER PORTAL →
  </a>
  <p style="font-size:10px;color:rgba(255,255,255,0.2);margin-top:40px;letter-spacing:0.1em">
    The Dwarica Group · New York · Private Investment
  </p>
</div>
```
