-- Monyawn Core Schema: The Invisible Foundation 🥱

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ACCOUNTS
create table if not exists accounts (
  account_id uuid primary key default uuid_generate_v4(),
  account_name text not null,
  account_type text not null default 'individual',
  primary_region text,
  support_tier text,
  created_at timestamptz default now()
);

-- USERS (Profiles linked to Supabase Auth)
create table if not exists users (
  user_id uuid primary key default uuid_generate_v4(),
  account_id uuid references accounts(account_id) on delete cascade,
  full_name text,
  email text unique,
  phone text,
  timezone text,
  region text,
  current_role text,
  target_role_family text,
  target_compensation text,
  accessibility_needs text,
  sponsorship_type text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- OPPORTUNITIES (The central "Plays")
create table if not exists opportunities (
  opportunity_id uuid primary key default uuid_generate_v4(),
  account_id uuid references accounts(account_id) on delete cascade,
  user_id uuid references users(user_id) on delete cascade,
  use_case_id text default 'monyawn',
  pathway text check (pathway in ('w2', '1099')),
  company_name text not null,
  role_title text not null,
  opportunity_source text,
  job_posting_url text,
  employment_type text,
  location_type text,
  current_stage text not null default 'intake_started',
  status text not null default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ARTIFACTS
create table if not exists artifacts (
  artifact_id uuid primary key default uuid_generate_v4(),
  opportunity_id uuid references opportunities(opportunity_id) on delete cascade,
  artifact_type text not null,
  source_label text not null,
  origin text not null default 'user_uploaded',
  review_status text not null default 'unreviewed',
  parse_status text not null default 'pending',
  version_number int default 1,
  evidence_note text,
  content_summary text,
  source_text text,
  extracted_signals jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- CANDIDATE STORIES
create table if not exists candidate_stories (
  story_id uuid primary key default uuid_generate_v4(),
  opportunity_id uuid references opportunities(opportunity_id) on delete cascade,
  title text not null,
  summary text,
  markdown text,
  status text not null default 'draft',
  source_artifact_ids uuid[] default '{}',
  source_correspondence_ids uuid[] default '{}',
  updated_at timestamptz default now()
);

-- CORRESPONDENCE
create table if not exists correspondence (
  correspondence_id uuid primary key default uuid_generate_v4(),
  opportunity_id uuid references opportunities(opportunity_id) on delete cascade,
  channel text not null,
  subject text,
  body text,
  status text not null default 'draft',
  scheduled_for timestamptz,
  owner_role text,
  extracted_signals jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- EVENTS (Audit Log)
create table if not exists events (
  event_id uuid primary key default uuid_generate_v4(),
  opportunity_id uuid references opportunities(opportunity_id) on delete cascade,
  stage text not null,
  event_type text not null,
  actor_type text not null,
  actor_id text,
  event_timestamp timestamptz default now(),
  notes text
);

-- TASKS
create table if not exists tasks (
  task_id uuid primary key default uuid_generate_v4(),
  opportunity_id uuid references opportunities(opportunity_id) on delete cascade,
  task_type text,
  owner_role text,
  owner_id text,
  due_at timestamptz,
  status text not null default 'open',
  blocking boolean default false,
  created_at timestamptz default now()
);

-- ROW LEVEL SECURITY (RLS) - Example for Opportunities
alter table opportunities enable row level security;

create policy "Users can only see their own opportunities"
  on opportunities for all
  using (auth.uid() = user_id);

-- 🥱 Monyawn: Security enforced at the data layer.
