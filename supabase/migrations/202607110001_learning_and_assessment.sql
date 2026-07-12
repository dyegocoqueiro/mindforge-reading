create table if not exists public.learning_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_slug text not null,
  status text not null default 'started' check (status in ('started','completed')),
  score numeric(4,3) check (score between 0 and 1),
  last_position integer not null default 0 check (last_position >= 0),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_slug)
);

create table if not exists public.practice_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_slug text,
  exercise_kind text not null check (exercise_kind in ('reading_ruler','meaning_groups','active_recall','lesson_review')),
  score numeric(4,3) not null check (score between 0 and 1),
  duration_seconds integer not null default 0 check (duration_seconds >= 0),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists practice_attempts_user_created_idx on public.practice_attempts(user_id, created_at desc);

alter table public.learning_progress enable row level security;
alter table public.practice_attempts enable row level security;

create policy learning_progress_owner on public.learning_progress
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy practice_attempts_owner on public.practice_attempts
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy assessment_metrics_insert_own on public.assessment_metrics
  for insert with check (user_id = auth.uid());
create policy diagnostic_insert_own on public.diagnostic_results
  for insert with check (user_id = auth.uid());
create policy training_plans_insert_own on public.training_plans
  for insert with check (user_id = auth.uid());
create policy training_plan_days_insert_own on public.training_plan_days
  for insert with check (
    exists(select 1 from public.training_plans p where p.id = training_plan_id and p.user_id = auth.uid())
  );
create policy training_plan_days_update_own on public.training_plan_days
  for update using (
    exists(select 1 from public.training_plans p where p.id = training_plan_id and p.user_id = auth.uid())
  ) with check (
    exists(select 1 from public.training_plans p where p.id = training_plan_id and p.user_id = auth.uid())
  );
