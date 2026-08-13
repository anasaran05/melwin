import { Client, BrandFoundation, ContentItem, PublishedVideoLog, PipelineStage } from '@/types/smm-dashboard';
import { createClient as createBrowserSupabaseClient } from '@/lib/supabase/client';

export const PIPELINE_STAGES: { id: PipelineStage; name: string; stepNumber: number; description: string }[] = [
  { id: 'research', name: '1. Research & Audit', stepNumber: 1, description: 'Market research, competitor analysis & initial audit' },
  { id: 'brand_foundation', name: '2. Brand Foundation', stepNumber: 2, description: '9-Part Brand Blueprint & Identity Extraction' },
  { id: 'content_pillars', name: '3. 6 Content Pillars', stepNumber: 3, description: 'Synthesizing core messaging themes & pillars' },
  { id: 'idea_generation', name: '4. Idea Generation', stepNumber: 4, description: 'Idea vault, viral format benchmarking' },
  { id: 'angle_hooking', name: '5. Angle & Hooking', stepNumber: 5, description: 'Curating scroll-stopping hooks & angles' },
  { id: 'format_selection', name: '6. Format Selection', stepNumber: 6, description: 'Short-form, long-form, carousel, or text' },
  { id: 'script_scoring', name: '7. Script Scoring', stepNumber: 7, description: 'AI scoring (0-100) & retention predictions' },
  { id: 'scripting', name: '8. Scripting & Teleprompter', stepNumber: 8, description: 'Final teleprompter script & visual cues' },
  { id: 'production', name: '9. Production & Filming', stepNumber: 9, description: 'Raw footage upload to Cloudflare R2' },
  { id: 'editing', name: '10. Video Editing', stepNumber: 10, description: 'Editing, captions, sound design & feedback' },
  { id: 'distribution', name: '11. Distribution', stepNumber: 11, description: 'Scheduling & cross-platform publishing' },
  { id: 'analytics', name: '12. Performance Analytics', stepNumber: 12, description: 'Views, watch time & 3s retention tracking' },
  { id: 'ai_iteration', name: '13. AI Feedback & Iteration', stepNumber: 13, description: 'DeepSeek AI strategic report & next sprint' },
];

export const INITIAL_MOCK_CLIENTS: Client[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-111111111111',
    name: 'Tiwary',
    company_name: 'AlphaVentures',
    niche: 'Entrepreneurship & Tech',
    target_audience: 'Young ambitious entrepreneurs & founders',
    current_stage: 'brand_foundation',
    status: 'active',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const INITIAL_MOCK_BRAND_FOUNDATION: Record<string, BrandFoundation> = {
  'a1b2c3d4-e5f6-7890-abcd-111111111111': {
    id: 'bf-101',
    client_id: 'a1b2c3d4-e5f6-7890-abcd-111111111111',
    person_one_liner: 'Entrepreneur building high-performance tech ventures with brutal honesty.',
    person_current_role: 'Founder & CEO at AlphaVentures',
    current_role: 'Founder & CEO at AlphaVentures',
    ten_year_expertise: 'Scaling zero-to-one startups, sales funnels, and personal brand leverage.',
    unusual_superpower: 'Cutting through motivational fluff to execute raw operational playbooks.',
    advice_topics: ['Zero-to-One Startup Execution', 'Brand Authority', 'Capital Allocation', 'Growth Mindset'],
    top_10_percent_knowledge: 'How to convert personal brand attention into high-ticket enterprise deals.',
    still_learning: 'Managing multi-thousand employee remote leadership cultures.',
    shaping_experiences: 'Failing his first e-commerce venture at 21, losing $40k, then rebuilding.',
    proud_moments: ['Built $1M ARR in 14 months', 'Hired first 10 core engineers', 'Spoke at TechSummit 2024'],
    embarrassing_lessons: ['Spent $15k on a useless PR agency', 'Pitched investor with incorrect financial slides'],
    built_projects: ['AlphaVentures Incubator', 'ScaleOS Founder Community'],
    achievements: ['Featured in Forbes 30 under 30 shortlist', '$5M total client revenue generated'],
    solved_problems: ['Fixing broken startup distribution models', 'Transitioning technical founders into media CEOs'],
    produced_results: '$5M+ client enterprise value generated via video sales letters.',
    failures: ['First ecommerce brand bankruptcy', 'Failed software launch in 2022'],
    experiential_learnings: 'Theoretical marketing books are useless compared to spending $50k on live ad testing.',
    credentials_access: 'Direct network with top 50 YC founders and tier-1 venture partners.',
    legitimate_skills_to_teach: ['Founder Media Engine', 'High-Ticket B2B Sales', 'Viral Short-Form Scripting'],
    contrarian_beliefs: 'Business advice should be practical, not motivational bullshit.',
    popular_bs_advice: 'Follow your passion and money will automatically follow.',
    industry_flaws: 'Agencies selling bloated vanity metrics instead of qualified pipeline bookings.',
    unlimited_power_changes: 'Eliminate vanity follower farming and mandate revenue-backed attribution.',
    core_principles: ['Radical Transparency', 'Execution over Intellectualizing', 'Skin in the Game'],
    non_negotiables: ['Never fake numbers', 'Never accept lazy video edits', 'Always deliver measurable ROI'],
    public_defensible_opinions: ['90% of business podcasts are fluff', 'Personal brand is the ultimate moat'],
    changed_minds: 'Used to think working 100 hours a week was mandatory; now prioritizes high-leverage leverage.',
    ideal_followers: 'Young ambitious entrepreneurs who want real playbooks.',
    unwanted_followers: 'Wantpreneurs seeking push-button riches without hard work.',
    follower_struggles: 'Struggling to stand out, generate consistent qualified leads, and build authority.',
    follower_desires: 'To build a $100k+/mo business with authentic personal authority.',
    nighttime_worries: 'Fearing irrelevance in an AI-dominated economy.',
    scroll_stopping_hooks: [
      'Stop taking advice from gurus who haven’t built a $1M business.',
      'Here is the exact framework I used to close $500k in deals with 0 ad spend.',
      'Why 95% of founders fail at personal branding in 2026.'
    ],
    six_month_transformation: 'From an invisible founder to a recognized industry authority with inbound deal flow.',
    three_word_association: ['Brutal Honesty', 'High Leverage', 'Operational Mastery'],
    desired_fame_reason: 'Building the most practical founder media agency on earth.',
    unwanted_reputation: 'A fake lifestyle influencer or clickbait guru.',
    benchmark_comparisons: ['Alex Hormozi', 'Naval Ravikant'],
    five_year_quote: 'Tiwary built the gold standard for founder personal brands.',
    one_sentence_brand: 'No fluff. No motivation. Just battle-tested business execution.',
    origin_story: 'Started in a small bedroom with $300 in savings, failed twice, and cracked the founder brand engine.',
    biggest_struggle: 'Overcoming impostor syndrome while scaling to 7 figures.',
    biggest_breakthrough: 'Realizing that authenticity and brutal honesty converts 10x better than polished corporate PR.',
    craziest_experience: 'Closing a $100k contract in a 15-minute Zoom call using just a raw voice memo proposal.',
    pivotal_failure: 'Lost entire first agency team due to lack of clear standard operating procedures.',
    life_changing_decision: 'Quitting his safe corporate job to go all-in on entrepreneurship.',
    key_influencers: ['Steve Jobs', 'Naval Ravikant', 'Charlie Munger'],
    controversial_situations: 'Publicly calling out a famous course creator for selling fake revenue screenshots.',
    frequently_asked_stories: ['The $40k failure story', 'The 15-minute $100k deal story'],
    rare_experiences: 'Pitched 50 VCs in 14 days across 3 continents.',
    witty_subjects: 'Guru jargon, corporate corporate-speak, overpriced coffee culture',
    vibe_style: 'Direct, witty, brutally honest',
    trigger_topics: ['Fake gurus', 'Lazy work ethic', 'Excuse-making'],
    excitement_topics: ['Zero-to-One execution', 'Viral retention mechanics', 'Scale bottlenecks'],
    weird_interests: ['Vintage mechanical watches', 'Late-night chess strategy'],
    hobbies: ['Calisthenics', 'Reading biography books', 'Podcasting'],
    cultural_favorites: { book: 'Principles by Ray Dalio', movie: 'The Social Network', music: 'Synthwave / Lofi' },
    public_traits: ['Directness', 'Analytical mind', 'Dry humor'],
    off_limit_traits: ['Family private lives', 'Unverified income claims'],
    primary_goal: 'Scale agency to $250k MRR & establish Tiwary as top founder-creator.',
    desired_outcomes: ['More Enterprise Clients', 'Keynote Speaking Engagements', 'Venture Investments'],
    loved_creators: ['Alex Hormozi', 'Dan Koe', 'Chris Do'],
    hated_creators: ['Generic motivation channels with stock footage'],
    forbidden_content_types: ['Dancing reels', 'Lip-sync trends', 'Fake luxury car flexes'],
    comfortable_with_personal_life: true,
    comfortable_with_controversy: true,
    comfortable_with_failure: true,
    comfortable_with_money: true,
    comfortable_with_family: false,
    comfortable_looking_foolish: false,
    content_pillars: [
      {
        title: 'Pillar 1: Zero-to-One Execution Playbooks',
        description: 'Step-by-step tactical teardowns of how to validate, build, and monetize tech & agency businesses.',
        sample_topics: ['How to validate an idea in 48 hours', 'Pricing strategies for 80% margins', 'Cold outreach scripts that closed $500k'],
        target_emotion: 'Empowered & Ready to Execute'
      },
      {
        title: 'Pillar 2: Contrarian Business Beliefs & Industry Fluff Calls',
        description: 'Calling out popular business myths, fake gurus, and broken industry advice with empirical proof.',
        sample_topics: ['Why passion is a terrible business model', 'The lie of passive income', 'Why 99% of podcasts waste founder time'],
        target_emotion: 'Shocked & Enlightened'
      },
      {
        title: 'Pillar 3: Raw Founder Stories & Lessons From Failure',
        description: 'Transparent breakdowns of lost deals, expensive mistakes, and pivotal mind shifts during the scaling journey.',
        sample_topics: ['How I lost $40k at age 21', 'The worst hiring mistake of my career', 'What going broke taught me about cashflow'],
        target_emotion: 'Empathetic & Resilient'
      },
      {
        title: 'Pillar 4: Founder Media Engine & Authority Monetization',
        description: 'Teaching modern entrepreneurs how to turn personal authority into inbound client deal flow.',
        sample_topics: ['The 13-stage founder video OS', 'How to script short-form videos with 60% 3-sec retention', 'Turning views into $10k retainer clients'],
        target_emotion: 'Hyped & Focused'
      },
      {
        title: 'Pillar 5: High-Leverage Systems & AI Automation',
        description: 'How modern founders use AI models (DeepSeek, Claude, Next.js) to run lean, high-margin teams.',
        sample_topics: ['Replacing 3 managers with AI trace workflows', 'How our agency handles 10 clients with 2 SMMs', 'My daily focus OS'],
        target_emotion: 'Ahead of the Curve'
      },
      {
        title: 'Pillar 6: Mindset & Unforgiving Personal Principles',
        description: 'Direct talks on discipline, skin in the game, mental fortitude, and non-negotiables.',
        sample_topics: ['Why consistency beats talent every single time', 'The 3 principles I will never break', 'How to handle extreme pressure as a founder'],
        target_emotion: 'Disciplined & Motivated'
      }
    ],
    ai_summary: 'Tiwary is positioned as the direct, anti-fluff authority for ambitious founders. Core strategy: combine brutal business honesty with high-retention video playbooks.',
    updated_at: new Date().toISOString()
  }
};

export const INITIAL_MOCK_PUBLISHED_VIDEOS: PublishedVideoLog[] = [
  {
    id: 'vid-101',
    client_id: 'a1b2c3d4-e5f6-7890-abcd-111111111111',
    title: 'Why 95% of Founders Fail at Personal Branding in 2026',
    platform: 'instagram_reel',
    posted_date: '2026-08-10',
    video_url: 'https://instagram.com/reels/Tiwary_1',
    views: 142500,
    likes: 8420,
    pillar: 'Pillar 4: Founder Media Engine & Authority Monetization',
    notes: 'Viral hook on PR agency waste generated 42 inbound DMs.',
    created_at: new Date().toISOString()
  },
  {
    id: 'vid-102',
    client_id: 'a1b2c3d4-e5f6-7890-abcd-111111111111',
    title: 'How I Lost $40k at 21 & Rebuilt to $1M ARR',
    platform: 'youtube_short',
    posted_date: '2026-08-08',
    video_url: 'https://youtube.com/shorts/Tiwary_2',
    views: 98200,
    likes: 6150,
    pillar: 'Pillar 3: Raw Founder Stories & Lessons From Failure',
    notes: 'Raw bank account breakdown performed best in comments.',
    created_at: new Date().toISOString()
  },
  {
    id: 'vid-103',
    client_id: 'a1b2c3d4-e5f6-7890-abcd-111111111111',
    title: '3 Cold Outreach Scripts That Closed $500k',
    platform: 'linkedin_video',
    posted_date: '2026-08-05',
    video_url: 'https://linkedin.com/posts/Tiwary_3',
    views: 45600,
    likes: 2340,
    pillar: 'Pillar 1: Zero-to-One Execution Playbooks',
    notes: 'Generated 15 discovery calls booked via LinkedIn comments.',
    created_at: new Date().toISOString()
  }
];

export const INITIAL_MOCK_CONTENT_ITEMS: ContentItem[] = [
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-222222222222',
    client_id: 'a1b2c3d4-e5f6-7890-abcd-111111111111',
    title: 'Why 95% of Founders Fail at Personal Branding in 2026',
    pillar: 'Pillar 4: Founder Media Engine & Authority Monetization',
    format: 'short_form_video',
    stage: 'script_scoring',
    status: 'draft',
    angle_hook: 'Stop hiring PR agencies that charge $10k/mo for vanity Forbes badges.',
    script_body: `[HOOK] Stop hiring PR agencies that charge $10k/mo for vanity Forbes badges. In 2026, buyers don't care about a press release. They care about authentic founder proof.

[BODY] Here is the 3-step engine we use to generate $50k in inbound deals:
1. Document raw failures before you celebrate wins.
2. Publish 3 video breakdowns a week showing exact code or sales metrics.
3. Call out industry fluff directly.

[CTA] Comment "BUILD" and I'll send you our 13-stage video script framework.`,
    ai_score: 94,
    ai_feedback: {
      hook_score: 96,
      clarity_score: 92,
      engagement_score: 95,
      strengths: [
        'Strong immediate pattern interrupt in hook targeting high-paying founders.',
        'Clear action-oriented bullet points without fluff.',
        'High conversion CTA with specific keyword trigger.'
      ],
      improvements: [
        'Add a visual overlay text requirement during step 2 for maximum retention.'
      ],
      rewritten_hook: 'If you are paying $10k/mo for PR press releases in 2026, you are burning cash.'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

// LIVE SUPABASE FETCH & MUTATION HELPERS

export async function fetchClientsFromSupabase(): Promise<Client[]> {
  try {
    const supabase = createBrowserSupabaseClient();
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return INITIAL_MOCK_CLIENTS;
    }
    return data as Client[];
  } catch (err) {
    return INITIAL_MOCK_CLIENTS;
  }
}

export async function updateClientStageInSupabase(clientId: string, newStage: PipelineStage): Promise<boolean> {
  try {
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase
      .from('clients')
      .update({ current_stage: newStage, updated_at: new Date().toISOString() })
      .eq('id', clientId);

    return !error;
  } catch (err) {
    return false;
  }
}

export async function saveClientToSupabase(client: Client): Promise<boolean> {
  try {
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase
      .from('clients')
      .insert([client]);

    return !error;
  } catch (err) {
    return false;
  }
}
