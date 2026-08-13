export type PipelineStage =
  | 'research'
  | 'brand_foundation'
  | 'content_pillars'
  | 'idea_generation'
  | 'angle_hooking'
  | 'format_selection'
  | 'script_scoring'
  | 'scripting'
  | 'production'
  | 'editing'
  | 'distribution'
  | 'analytics'
  | 'ai_iteration';

export type ContentFormat =
  | 'short_form_video'
  | 'long_form_video'
  | 'text_post'
  | 'carousel'
  | 'story';

export type ContentStatus =
  | 'draft'
  | 'review_pending'
  | 'approved'
  | 'filmed'
  | 'editing'
  | 'ready_to_publish'
  | 'published';

export type SocialPlatform = 'instagram_reel' | 'youtube_short' | 'youtube_long' | 'linkedin_video' | 'twitter_x';

export interface Client {
  id: string;
  assigned_manager_id?: string | null;
  name: string;
  company_name?: string | null;
  niche: string;
  target_audience?: string | null;
  current_stage: PipelineStage;
  avatar_url?: string | null;
  status: 'active' | 'paused' | 'offboarded';
  created_at: string;
  updated_at: string;
}

export interface ContentPillar {
  title: string;
  description: string;
  sample_topics: string[];
  target_emotion: string;
}

export interface BrandFoundation {
  id: string;
  client_id: string;
  // Section 1: The Person
  person_one_liner?: string | null;
  person_current_role?: string | null;
  current_role?: string | null;
  ten_year_expertise?: string | null;
  unusual_superpower?: string | null;
  advice_topics?: string[];
  top_10_percent_knowledge?: string | null;
  still_learning?: string | null;
  shaping_experiences?: string | null;
  proud_moments?: string[];
  embarrassing_lessons?: string[];

  // Section 2: The Authority
  built_projects?: string[];
  achievements?: string[];
  solved_problems?: string[];
  produced_results?: string | null;
  failures?: string[];
  experiential_learnings?: string | null;
  credentials_access?: string | null;
  legitimate_skills_to_teach?: string[];

  // Section 3: The Beliefs
  contrarian_beliefs?: string | null;
  popular_bs_advice?: string | null;
  industry_flaws?: string | null;
  unlimited_power_changes?: string | null;
  core_principles?: string[];
  non_negotiables?: string[];
  public_defensible_opinions?: string[];
  changed_minds?: string | null;

  // Section 4: The Audience
  ideal_followers?: string | null;
  unwanted_followers?: string | null;
  follower_struggles?: string | null;
  follower_desires?: string | null;
  nighttime_worries?: string | null;
  scroll_stopping_hooks?: string[];
  six_month_transformation?: string | null;

  // Section 5: The Desired Reputation
  three_word_association?: string[];
  desired_fame_reason?: string | null;
  unwanted_reputation?: string | null;
  benchmark_comparisons?: string[];
  five_year_quote?: string | null;
  one_sentence_brand?: string | null;

  // Section 6: The Story Bank
  origin_story?: string | null;
  biggest_struggle?: string | null;
  biggest_breakthrough?: string | null;
  craziest_experience?: string | null;
  pivotal_failure?: string | null;
  life_changing_decision?: string | null;
  key_influencers?: string[];
  controversial_situations?: string | null;
  frequently_asked_stories?: string[];
  rare_experiences?: string | null;

  // Section 7: The Personality
  witty_subjects?: string | null;
  vibe_style?: string | null;
  trigger_topics?: string[];
  excitement_topics?: string[];
  weird_interests?: string[];
  hobbies?: string[];
  cultural_favorites?: Record<string, string> | null;
  public_traits?: string[];
  off_limit_traits?: string[];

  // Section 8: The Business Objective
  primary_goal?: string | null;
  desired_outcomes?: string[];

  // Section 9: The Content Preferences
  loved_creators?: string[];
  hated_creators?: string[];
  forbidden_content_types?: string[];
  comfortable_with_personal_life?: boolean;
  comfortable_with_controversy?: boolean;
  comfortable_with_failure?: boolean;
  comfortable_with_money?: boolean;
  comfortable_with_family?: boolean;
  comfortable_looking_foolish?: boolean;

  // Synthesized output
  content_pillars?: ContentPillar[];
  ai_summary?: string | null;
  updated_at?: string;
}

export interface ContentItem {
  id: string;
  client_id: string;
  title: string;
  pillar?: string | null;
  format: ContentFormat;
  stage: PipelineStage;
  status: ContentStatus;
  angle_hook?: string | null;
  script_body?: string | null;
  ai_score?: number | null;
  ai_feedback?: {
    hook_score: number;
    clarity_score: number;
    engagement_score: number;
    strengths: string[];
    improvements: string[];
    rewritten_hook?: string;
  } | null;
  raw_media_url?: string | null;
  edited_media_url?: string | null;
  scheduled_for?: string | null;
  published_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PublishedVideoLog {
  id: string;
  client_id: string;
  title: string;
  platform: SocialPlatform;
  posted_date: string;
  video_url: string;
  views: number;
  likes?: number;
  pillar?: string | null;
  notes?: string | null;
  created_at: string;
}
