-- Internal-only orchestration state. Do not grant client roles access by default.
create type public.agent_job_status as enum (
  'queued', 'planning', 'awaiting_approval', 'running', 'completed', 'failed', 'cancelled'
);

create type public.agent_run_status as enum (
  'queued', 'running', 'succeeded', 'failed', 'cancelled'
);

create table public.agent_jobs (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('github_issue', 'manual', 'webhook')),
  source_reference text not null,
  title text not null,
  request jsonb not null default '{}'::jsonb,
  status public.agent_job_status not null default 'queued',
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source, source_reference)
);

create table public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.agent_jobs(id) on delete cascade,
  provider text not null check (provider in ('openai', 'anthropic', 'manus', 'internal')),
  role text not null check (role in ('planner', 'architect', 'reviewer', 'researcher', 'qa', 'builder')),
  status public.agent_run_status not null default 'queued',
  provider_reference text,
  input jsonb not null default '{}'::jsonb,
  output jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.agent_approvals (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.agent_jobs(id) on delete cascade,
  approval_type text not null check (approval_type in ('plan', 'database', 'merge', 'deploy')),
  approved_by uuid not null references auth.users(id),
  note text,
  created_at timestamptz not null default now(),
  unique (job_id, approval_type)
);

alter table public.agent_jobs enable row level security;
alter table public.agent_runs enable row level security;
alter table public.agent_approvals enable row level security;

-- No policies are created intentionally. The browser has no access; server-side functions
-- use the service-role key after authenticating and authorizing the caller.

create index agent_jobs_status_created_at_idx on public.agent_jobs (status, created_at desc);
create index agent_runs_job_id_created_at_idx on public.agent_runs (job_id, created_at desc);

