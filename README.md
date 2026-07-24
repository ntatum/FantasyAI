# FantasyAI

FantasyAI is the application layer for SOA.GM: a secure fantasy-league workspace built around provider imports, private data access, and transparent AI recommendations.

## Local development

1. Copy `.env.example` to `.env.local`.
2. Set the Supabase project URL and a publishable key. Never place the service-role key in a `NEXT_PUBLIC_*` variable.
3. Install dependencies with `npm install` and start the app with `npm run dev`.

## Current status

The first application foundation provides a responsive landing page and email magic-link sign-in form. Provider imports, dashboard data, and AI workflows remain behind the security and schema-baseline work tracked in GitHub issues #3–#10.
