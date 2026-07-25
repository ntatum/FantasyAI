import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type BuildRequest = {
  issue_number: number;
  title: string;
  body?: string;
  repository: string;
};

const corsHeaders = { 'content-type': 'application/json' };

Deno.serve(async (request) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'POST required' }), { status: 405, headers: corsHeaders });
  }

  // TODO: Validate an HMAC or bearer token issued only to the SOA.GM GitHub workflow.
  // Never accept unauthenticated requests from the public internet.
  const suppliedToken = request.headers.get('authorization');
  if (suppliedToken !== `Bearer ${Deno.env.get('AGENT_ORCHESTRATOR_TOKEN')}`) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: corsHeaders });
  }

  const payload = (await request.json()) as BuildRequest;
  if (!payload.issue_number || !payload.title || !payload.repository) {
    return new Response(JSON.stringify({ error: 'issue_number, title, and repository are required' }), { status: 400, headers: corsHeaders });
  }

  // This prevents a caller from redirecting agent work to another repository.
  if (payload.repository !== 'ntatum/FantasyAI') {
    return new Response(JSON.stringify({ error: 'repository is not allowed' }), { status: 403, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
  const sourceReference = `${payload.repository}#${payload.issue_number}`;
  const { data: job, error } = await supabase
    .from('agent_jobs')
    .upsert({
      source: 'github_issue',
      source_reference: sourceReference,
      title: payload.title,
      request: { issue_number: payload.issue_number, body: payload.body ?? '', repository: payload.repository },
      status: 'planning',
    }, { onConflict: 'source,source_reference' })
    .select('id, status')
    .single();

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });

  const { error: runError } = await supabase.from('agent_runs').insert({
    job_id: job.id,
    provider: 'openai',
    role: 'planner',
    status: 'queued',
    input: { objective: payload.title, issue_body: payload.body ?? '', repository: payload.repository },
  });
  if (runError) return new Response(JSON.stringify({ error: runError.message }), { status: 500, headers: corsHeaders });

  // Intentionally stop here for phase one. A background worker should claim queued runs,
  // call each provider through a small adapter, persist its output, then request approvals.
  return new Response(JSON.stringify({ job_id: job.id, status: 'planning' }), { status: 202, headers: corsHeaders });
});
