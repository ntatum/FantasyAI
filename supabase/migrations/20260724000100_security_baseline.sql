-- REVIEW BEFORE APPLYING: this intentionally blocks direct browser access until
-- explicit RLS policies are added for the chosen canonical application model.
-- It is a security containment baseline, not a complete authorization design.

revoke all privileges on all tables in schema public from anon, authenticated;
revoke all privileges on all sequences in schema public from anon, authenticated;

do $$
declare
  tbl record;
begin
  for tbl in
    select quote_ident(schemaname) || '.' || quote_ident(tablename) as qualified_name
    from pg_tables
    where schemaname = 'public'
  loop
    execute 'alter table ' || tbl.qualified_name || ' enable row level security';
  end loop;
end $$;

alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;
