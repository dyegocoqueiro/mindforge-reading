create table if not exists public.training_block_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  training_plan_day_id uuid not null references public.training_plan_days(id) on delete cascade,
  block_key text not null check (block_key in ('preparation','fluency','comprehension','retention','focus','vocabulary','metacognition','feedback')),
  score numeric(4,3) not null check (score between 0 and 1),
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  result_summary jsonb not null default '{}',
  completed_at timestamptz not null default now(),
  unique(training_plan_day_id, block_key)
);

create table if not exists public.training_session_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  training_plan_day_id uuid not null unique references public.training_plan_days(id) on delete cascade,
  average_score numeric(4,3) not null check (average_score between 0 and 1),
  skill_scores jsonb not null,
  review_items_created smallint not null default 0,
  completed_at timestamptz not null default now()
);

alter table public.training_block_attempts enable row level security;
alter table public.training_session_summaries enable row level security;
create policy training_block_attempts_owner on public.training_block_attempts for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy training_session_summaries_owner on public.training_session_summaries for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create index if not exists training_block_attempts_user_idx on public.training_block_attempts(user_id, completed_at desc);
create index if not exists training_summaries_user_idx on public.training_session_summaries(user_id, completed_at desc);
