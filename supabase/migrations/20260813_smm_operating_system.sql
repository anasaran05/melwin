-- Migration: 20260813_smm_operating_system.sql
-- Description: Social Media Management & Personal Branding Agency OS Database Schema (Single Agency, Multi-Client)

-- 1. ENUMS FOR PIPELINE STAGES & ROLES
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('agency_ceo', 'social_media_manager', 'editor', 'client');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE pipeline_stage AS ENUM (
    'research',
    'brand_foundation',
    'content_pillars',
    'idea_generation',
    'angle_hooking',
    'format_selection',
    'script_scoring',
    'scripting',
    'production',
    'editing',
    'distribution',
    'analytics',
    'ai_iteration'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE content_format AS ENUM ('short_form_video', 'long_form_video', 'text_post', 'carousel', 'story');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE content_status AS ENUM ('draft', 'review_pending', 'approved', 'filmed', 'editing', 'ready_to_publish', 'published');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. CLIENTS TABLE
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assigned_manager_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  company_name TEXT,
  niche TEXT NOT NULL,
  target_audience TEXT,
  current_stage pipeline_stage DEFAULT 'research',
  avatar_url TEXT,
  status TEXT DEFAULT 'active', -- active, paused, offboarded
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BRAND FOUNDATIONS (9-PART QUESTIONNAIRE & SYNTHESIZED PILLARS)
CREATE TABLE IF NOT EXISTS brand_foundations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID UNIQUE NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  -- Section 1: The Person
  person_one_liner TEXT,
  person_current_role TEXT,
  ten_year_expertise TEXT,
  unusual_superpower TEXT,
  advice_topics TEXT[],
  top_10_percent_knowledge TEXT,
  still_learning TEXT,
  shaping_experiences TEXT,
  proud_moments TEXT[],
  embarrassing_lessons TEXT[],
  -- Section 2: The Authority
  built_projects TEXT[],
  achievements TEXT[],
  solved_problems TEXT[],
  produced_results TEXT,
  failures TEXT[],
  experiential_learnings TEXT,
  credentials_access TEXT,
  legitimate_skills_to_teach TEXT[],
  -- Section 3: The Beliefs
  contrarian_beliefs TEXT,
  popular_bs_advice TEXT,
  industry_flaws TEXT,
  unlimited_power_changes TEXT,
  core_principles TEXT[],
  non_negotiables TEXT[],
  public_defensible_opinions TEXT[],
  changed_minds TEXT,
  -- Section 4: The Audience
  ideal_followers TEXT,
  unwanted_followers TEXT,
  follower_struggles TEXT,
  follower_desires TEXT,
  nighttime_worries TEXT,
  scroll_stopping_hooks TEXT[],
  six_month_transformation TEXT,
  -- Section 5: The Desired Reputation
  three_word_association TEXT[],
  desired_fame_reason TEXT,
  unwanted_reputation TEXT,
  benchmark_comparisons TEXT[],
  five_year_quote TEXT,
  one_sentence_brand TEXT,
  -- Section 6: The Story Bank
  origin_story TEXT,
  biggest_struggle TEXT,
  biggest_breakthrough TEXT,
  craziest_experience TEXT,
  pivotal_failure TEXT,
  life_changing_decision TEXT,
  key_influencers TEXT[],
  controversial_situations TEXT,
  frequently_asked_stories TEXT[],
  rare_experiences TEXT,
  -- Section 7: The Personality
  witty_subjects TEXT,
  vibe_style TEXT,
  trigger_topics TEXT[],
  excitement_topics TEXT[],
  weird_interests TEXT[],
  hobbies TEXT[],
  cultural_favorites JSONB,
  public_traits TEXT[],
  off_limit_traits TEXT[],
  -- Section 8: The Business Objective
  primary_goal TEXT,
  desired_outcomes TEXT[],
  -- Section 9: The Content Preferences
  loved_creators TEXT[],
  hated_creators TEXT[],
  forbidden_content_types TEXT[],
  comfortable_with_personal_life BOOLEAN DEFAULT TRUE,
  comfortable_with_controversy BOOLEAN DEFAULT FALSE,
  comfortable_with_failure BOOLEAN DEFAULT TRUE,
  comfortable_with_money BOOLEAN DEFAULT TRUE,
  comfortable_with_family BOOLEAN DEFAULT FALSE,
  comfortable_looking_foolish BOOLEAN DEFAULT FALSE,
  -- 6 Synthesized Content Pillars & AI Summary
  content_pillars JSONB DEFAULT '[]'::jsonb,
  ai_summary TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CONTENT ITEMS / SCRIPTS PIPELINE
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  pillar TEXT,
  format content_format DEFAULT 'short_form_video',
  stage pipeline_stage DEFAULT 'idea_generation',
  status content_status DEFAULT 'draft',
  angle_hook TEXT,
  script_body TEXT,
  ai_score INT CHECK (ai_score IS NULL OR (ai_score >= 0 AND ai_score <= 100)),
  ai_feedback JSONB,
  raw_media_url TEXT,
  edited_media_url TEXT,
  scheduled_for TIMESTAMPTZ,
  published_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ANALYTICS & METRICS TABLE
CREATE TABLE IF NOT EXISTS content_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- instagram, youtube, linkedin, twitter
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  shares INT DEFAULT 0,
  watch_time_seconds NUMERIC(10,2) DEFAULT 0,
  retention_at_3s NUMERIC(5,2) DEFAULT 0,
  ai_performance_verdict TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. AI TRACE & REASONING LOGS
CREATE TABLE IF NOT EXISTS ai_traces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  model_name TEXT NOT NULL,
  prompt_type TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  response_text TEXT NOT NULL,
  tokens_used INT DEFAULT 0,
  latency_ms INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES FOR AUTHENTICATED USERS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_foundations ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_traces ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated users full access to clients" ON clients;
CREATE POLICY "Allow authenticated users full access to clients" ON clients FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users full access to brand_foundations" ON brand_foundations;
CREATE POLICY "Allow authenticated users full access to brand_foundations" ON brand_foundations FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users full access to content_items" ON content_items;
CREATE POLICY "Allow authenticated users full access to content_items" ON content_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users full access to content_analytics" ON content_analytics;
CREATE POLICY "Allow authenticated users full access to content_analytics" ON content_analytics FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users full access to ai_traces" ON ai_traces;
CREATE POLICY "Allow authenticated users full access to ai_traces" ON ai_traces FOR ALL TO authenticated USING (true) WITH CHECK (true);
