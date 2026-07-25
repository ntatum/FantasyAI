# SOA.GM

Editable source for the SOA.GM FantasyAI Manager dashboard.

## Run locally

This first implementation is framework-free so it can run from any static host. Open `index.html` in a browser, or serve this folder with a static web server.

## Supabase

The visual dashboard is intentionally disconnected from Supabase until row-level security policies are designed and enabled. Never add a service-role key to browser code.

## ESPN fantasy import

The dashboard imports public ESPN fantasy leagues directly from ESPN's documented public endpoint. An optional ESPN username is shown as a profile label; it is not sent to ESPN and cannot discover leagues. Enter a League ID, game type, and season. ESPN does not provide a public username-to-leagues lookup; private leagues require ESPN session cookies, which this app deliberately does not collect or store. The endpoint reference is based on [Public-ESPN-API](https://github.com/pseudo-r/Public-ESPN-API).
