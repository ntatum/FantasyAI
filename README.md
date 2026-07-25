# SOA.GM

Editable source for the SOA.GM FantasyAI Manager dashboard.

## Sleeper import

Enter a Sleeper username to import its current NFL leagues live. The app resolves the public user profile, reads Sleeper's current NFL season, and fetches the leagues for that user. No Sleeper password or API token is required.

## Major-sports scope

The current live sources cover Sleeper NFL and public ESPN NFL, NBA, and MLB league IDs. Imported ESPN leagues are labeled as redraft, dynasty, keeper, or other. WNBA requires a fantasy provider that exposes user-league access; it is shown in the product coverage view but is not presented as a connected source.

## Run locally

This first implementation is framework-free so it can run from any static host. Open `index.html` in a browser, or serve this folder with a static web server.

## Supabase

The visual dashboard is intentionally disconnected from Supabase until row-level security policies are designed and enabled. Never add a service-role key to browser code.

## ESPN fantasy import

The dashboard imports public ESPN fantasy leagues directly from ESPN's documented public endpoint. An optional ESPN username is shown as a profile label; it is not sent to ESPN and cannot discover leagues. Enter a League ID, game type, and season. ESPN does not provide a public username-to-leagues lookup; private leagues require ESPN session cookies, which this app deliberately does not collect or store. The endpoint reference is based on [Public-ESPN-API](https://github.com/pseudo-r/Public-ESPN-API).
