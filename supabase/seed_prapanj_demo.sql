-- Seed Script: seed_Tiwary_demo.sql
-- Run this in Supabase SQL Editor to seed the single fully completed demo account: Tiwary

-- 1. CLEANUP PREVIOUS MOCK DATA IF EXISTS
DELETE FROM clients WHERE name = 'Tiwary' OR name = 'Elena Rostova' OR name = 'Marcus Vance';

-- 2. INSERT Tiwary CLIENT RECORD
INSERT INTO clients (
  id,
  name,
  company_name,
  niche,
  target_audience,
  current_stage,
  avatar_url,
  status
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-111111111111',
  'Tiwary',
  'AlphaVentures',
  'Entrepreneurship & Tech',
  'Young ambitious entrepreneurs & founders',
  'brand_foundation',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  'active'
);

-- 3. INSERT Tiwary BRAND FOUNDATION (COMPLETE 9-PART BLUEPRINT)
INSERT INTO brand_foundations (
  client_id,
  -- Section 1: The Person
  person_one_liner,
  person_current_role,
  ten_year_expertise,
  unusual_superpower,
  advice_topics,
  top_10_percent_knowledge,
  still_learning,
  shaping_experiences,
  proud_moments,
  embarrassing_lessons,
  -- Section 2: The Authority
  built_projects,
  achievements,
  solved_problems,
  produced_results,
  failures,
  experiential_learnings,
  credentials_access,
  legitimate_skills_to_teach,
  -- Section 3: The Beliefs
  contrarian_beliefs,
  popular_bs_advice,
  industry_flaws,
  unlimited_power_changes,
  core_principles,
  non_negotiables,
  public_defensible_opinions,
  changed_minds,
  -- Section 4: The Audience
  ideal_followers,
  unwanted_followers,
  follower_struggles,
  follower_desires,
  nighttime_worries,
  scroll_stopping_hooks,
  six_month_transformation,
  -- Section 5: The Desired Reputation
  three_word_association,
  desired_fame_reason,
  unwanted_reputation,
  benchmark_comparisons,
  five_year_quote,
  one_sentence_brand,
  -- Section 6: The Story Bank
  origin_story,
  biggest_struggle,
  biggest_breakthrough,
  craziest_experience,
  pivotal_failure,
  life_changing_decision,
  key_influencers,
  controversial_situations,
  frequently_asked_stories,
  rare_experiences,
  -- Section 7: The Personality
  witty_subjects,
  vibe_style,
  trigger_topics,
  excitement_topics,
  weird_interests,
  hobbies,
  cultural_favorites,
  public_traits,
  off_limit_traits,
  -- Section 8: The Business Objective
  primary_goal,
  desired_outcomes,
  -- Section 9: The Content Preferences
  loved_creators,
  hated_creators,
  forbidden_content_types,
  comfortable_with_personal_life,
  comfortable_with_controversy,
  comfortable_with_failure,
  comfortable_with_money,
  comfortable_with_family,
  comfortable_looking_foolish,
  -- 6 Synthesized Content Pillars & Summary
  content_pillars,
  ai_summary
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-111111111111',
  -- Section 1
  'Entrepreneur building high-performance tech ventures with brutal honesty.',
  'Founder & CEO at AlphaVentures',
  'Scaling zero-to-one startups, sales funnels, and personal brand leverage.',
  'Cutting through motivational fluff to execute raw operational playbooks.',
  ARRAY['Zero-to-One Startup Execution', 'Brand Authority', 'Capital Allocation', 'Growth Mindset'],
  'How to convert personal brand attention into high-ticket enterprise deals.',
  'Managing multi-thousand employee remote leadership cultures.',
  'Failing his first e-commerce venture at 21, losing $40k, then rebuilding.',
  ARRAY['Built $1M ARR in 14 months', 'Hired first 10 core engineers', 'Spoke at TechSummit 2024'],
  ARRAY['Spent $15k on a useless PR agency', 'Pitched investor with incorrect financial slides'],
  -- Section 2
  ARRAY['AlphaVentures Incubator', 'ScaleOS Founder Community'],
  ARRAY['Featured in Forbes 30 under 30 shortlist', '$5M total client revenue generated'],
  ARRAY['Fixing broken startup distribution models', 'Transitioning technical founders into media CEOs'],
  '$5M+ client enterprise value generated via video sales letters.',
  ARRAY['First ecommerce brand bankruptcy', 'Failed software launch in 2022'],
  'Theoretical marketing books are useless compared to spending $50k on live ad testing.',
  'Direct network with top 50 YC founders and tier-1 venture partners.',
  ARRAY['Founder Media Engine', 'High-Ticket B2B Sales', 'Viral Short-Form Scripting'],
  -- Section 3
  'Business advice should be practical, not motivational bullshit.',
  'Follow your passion and money will automatically follow.',
  'Agencies selling bloated vanity metrics instead of qualified pipeline bookings.',
  'Eliminate vanity follower farming and mandate revenue-backed attribution.',
  ARRAY['Radical Transparency', 'Execution over Intellectualizing', 'Skin in the Game'],
  ARRAY['Never fake numbers', 'Never accept lazy video edits', 'Always deliver measurable ROI'],
  ARRAY['90% of business podcasts are fluff', 'Personal brand is the ultimate moat'],
  'Used to think working 100 hours a week was mandatory; now prioritizes high-leverage leverage.',
  -- Section 4
  'Young ambitious entrepreneurs who want real playbooks.',
  'Wantpreneurs seeking push-button riches without hard work.',
  'Struggling to stand out, generate consistent qualified leads, and build authority.',
  'To build a $100k+/mo business with authentic personal authority.',
  'Fearing irrelevance in an AI-dominated economy.',
  ARRAY['Stop taking advice from gurus who haven’t built a $1M business.', 'Here is the exact framework I used to close $500k in deals with 0 ad spend.', 'Why 95% of founders fail at personal branding in 2026.'],
  'From an invisible founder to a recognized industry authority with inbound deal flow.',
  -- Section 5
  ARRAY['Brutal Honesty', 'High Leverage', 'Operational Mastery'],
  'Building the most practical founder media agency on earth.',
  'A fake lifestyle influencer or clickbait guru.',
  ARRAY['Alex Hormozi', 'Naval Ravikant'],
  'Tiwary built the gold standard for founder personal brands.',
  'No fluff. No motivation. Just battle-tested business execution.',
  -- Section 6
  'Started in a small bedroom with $300 in savings, failed twice, and cracked the founder brand engine.',
  'Overcoming impostor syndrome while scaling to 7 figures.',
  'Realizing that authenticity and brutal honesty converts 10x better than polished corporate PR.',
  'Closing a $100k contract in a 15-minute Zoom call using just a raw voice memo proposal.',
  'Lost entire first agency team due to lack of clear standard operating procedures.',
  'Quitting his safe corporate job to go all-in on entrepreneurship.',
  ARRAY['Steve Jobs', 'Naval Ravikant', 'Charlie Munger'],
  'Publicly calling out a famous course creator for selling fake revenue screenshots.',
  ARRAY['The $40k failure story', 'The 15-minute $100k deal story'],
  'Pitched 50 VCs in 14 days across 3 continents.',
  -- Section 7
  'Guru jargon, corporate corporate-speak, overpriced coffee culture',
  'Direct, witty, brutally honest',
  ARRAY['Fake gurus', 'Lazy work ethic', 'Excuse-making'],
  ARRAY['Zero-to-One execution', 'Viral retention mechanics', 'Scale bottlenecks'],
  ARRAY['Vintage mechanical watches', 'Late-night chess strategy'],
  ARRAY['Calisthenics', 'Reading biography books', 'Podcasting'],
  '{"book": "Principles by Ray Dalio", "movie": "The Social Network", "music": "Synthwave / Lofi"}'::jsonb,
  ARRAY['Directness', 'Analytical mind', 'Dry humor'],
  ARRAY['Family private lives', 'Unverified income claims'],
  -- Section 8
  'Scale agency to $250k MRR & establish Tiwary as top founder-creator.',
  ARRAY['More Enterprise Clients', 'Keynote Speaking Engagements', 'Venture Investments'],
  -- Section 9
  ARRAY['Alex Hormozi', 'Dan Koe', 'Chris Do'],
  ARRAY['Generic motivation channels with stock footage'],
  ARRAY['Dancing reels', 'Lip-sync trends', 'Fake luxury car flexes'],
  TRUE,
  TRUE,
  TRUE,
  TRUE,
  FALSE,
  FALSE,
  -- 6 Pillars
  '[
    {
      "title": "Pillar 1: Zero-to-One Execution Playbooks",
      "description": "Step-by-step tactical teardowns of how to validate, build, and monetize tech & agency businesses.",
      "sample_topics": ["How to validate an idea in 48 hours", "Pricing strategies for 80% margins", "Cold outreach scripts that closed $500k"],
      "target_emotion": "Empowered & Ready to Execute"
    },
    {
      "title": "Pillar 2: Contrarian Business Beliefs & Industry Fluff Calls",
      "description": "Calling out popular business myths, fake gurus, and broken industry advice with empirical proof.",
      "sample_topics": ["Why passion is a terrible business model", "The lie of passive income", "Why 99% of podcasts waste founder time"],
      "target_emotion": "Shocked & Enlightened"
    },
    {
      "title": "Pillar 3: Raw Founder Stories & Lessons From Failure",
      "description": "Transparent breakdowns of lost deals, expensive mistakes, and pivotal mind shifts during the scaling journey.",
      "sample_topics": ["How I lost $40k at age 21", "The worst hiring mistake of my career", "What going broke taught me about cashflow"],
      "target_emotion": "Empathetic & Resilient"
    },
    {
      "title": "Pillar 4: Founder Media Engine & Authority Monetization",
      "description": "Teaching modern entrepreneurs how to turn personal authority into inbound client deal flow.",
      "sample_topics": ["The 13-stage founder video OS", "How to script short-form videos with 60% 3-sec retention", "Turning views into $10k retainer clients"],
      "target_emotion": "Hyped & Focused"
    },
    {
      "title": "Pillar 5: High-Leverage Systems & AI Automation",
      "description": "How modern founders use AI models (DeepSeek, Claude, Next.js) to run lean, high-margin teams.",
      "sample_topics": ["Replacing 3 managers with AI trace workflows", "How our agency handles 10 clients with 2 SMMs", "My daily focus OS"],
      "target_emotion": "Ahead of the Curve"
    },
    {
      "title": "Pillar 6: Mindset & Unforgiving Personal Principles",
      "description": "Direct talks on discipline, skin in the game, mental fortitude, and non-negotiables.",
      "sample_topics": ["Why consistency beats talent every single time", "The 3 principles I will never break", "How to handle extreme pressure as a founder"],
      "target_emotion": "Disciplined & Motivated"
    }
  ]'::jsonb,
  'Tiwary is positioned as the direct, anti-fluff authority for ambitious founders. Core strategy: combine brutal business honesty with high-retention video playbooks.'
);

-- 4. INSERT DEMO CONTENT ITEMS FOR Tiwary
INSERT INTO content_items (
  id,
  client_id,
  title,
  pillar,
  format,
  stage,
  status,
  angle_hook,
  script_body,
  ai_score,
  ai_feedback
) VALUES (
  'b2c3d4e5-f6a7-8901-bcde-222222222222',
  'a1b2c3d4-e5f6-7890-abcd-111111111111',
  'Why 95% of Founders Fail at Personal Branding in 2026',
  'Pillar 4: Founder Media Engine & Authority Monetization',
  'short_form_video',
  'script_scoring',
  'draft',
  'Stop hiring PR agencies that charge $10k/mo for vanity Forbes badges.',
  '[HOOK] Stop hiring PR agencies that charge $10k/mo for vanity Forbes badges. In 2026, buyers don''t care about a press release. They care about authentic founder proof.

[BODY] Here is the 3-step engine we use to generate $50k in inbound deals:
1. Document raw failures before you celebrate wins.
2. Publish 3 video breakdowns a week showing exact code or sales metrics.
3. Call out industry fluff directly.

[CTA] Comment "BUILD" and I''ll send you our 13-stage video script framework.',
  94,
  '{
    "hook_score": 96,
    "clarity_score": 92,
    "engagement_score": 95,
    "strengths": ["Strong immediate pattern interrupt in hook targeting high-paying founders.", "Clear action-oriented bullet points without fluff.", "High conversion CTA with specific keyword trigger."],
    "improvements": ["Add a visual overlay text requirement during step 2 for maximum retention."],
    "rewritten_hook": "If you are paying $10k/mo for PR press releases in 2026, you are burning cash."
  }'::jsonb
);
