'use client';

import React, { useState } from 'react';
import { BrandFoundation, ContentPillar } from '@/types/smm-dashboard';
import { synthesizeBrandFoundation } from '@/lib/ai/deepseek-copilot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Award,
  Flame,
  Users,
  Star,
  BookOpen,
  Smile,
  Target,
  Video,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

interface QuestionnaireStepperProps {
  initialData?: BrandFoundation;
  clientName: string;
  onSave?: (foundation: BrandFoundation) => void;
}

const QUESTIONNAIRE_SECTIONS = [
  { id: 1, title: '1. The Person', icon: User, desc: 'Uncovering who the founder actually is' },
  { id: 2, title: '2. The Authority', icon: Award, desc: 'Determining real credibility & wins' },
  { id: 3, title: '3. The Beliefs', icon: Flame, desc: 'Contrarian views & non-negotiables' },
  { id: 4, title: '4. The Audience', icon: Users, desc: 'Ideal followers & scroll-stoppers' },
  { id: 5, title: '5. Desired Reputation', icon: Star, desc: '3-word association & brand statement' },
  { id: 6, title: '6. The Story Bank', icon: BookOpen, desc: 'Origin story, struggle & breakthroughs' },
  { id: 7, title: '7. The Personality', icon: Smile, desc: 'Tone, humor, trigger topics & boundaries' },
  { id: 8, title: '8. Business Objective', icon: Target, desc: 'Why brand exists & monetizing outcomes' },
  { id: 9, title: '9. Content Preferences', icon: Video, desc: 'Comfort levels, loved creators & boundaries' },
];

export function QuestionnaireStepper({ initialData, clientName, onSave }: QuestionnaireStepperProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<BrandFoundation>>(initialData || {});
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [pillars, setPillars] = useState<ContentPillar[]>(initialData?.content_pillars || []);
  const [aiSummary, setAiSummary] = useState<string>(initialData?.ai_summary || '');

  const updateField = (key: keyof BrandFoundation, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSynthesizeAI = async () => {
    setIsSynthesizing(true);
    toast.info('DeepSeek AI is synthesizing 9-part responses into 6 Content Pillars...');
    try {
      const res = await synthesizeBrandFoundation(formData);
      setPillars(res.content_pillars);
      setAiSummary(res.ai_summary);
      const updated: BrandFoundation = {
        ...formData,
        id: initialData?.id || `bf-${Date.now()}`,
        client_id: initialData?.client_id || 'client-id',
        content_pillars: res.content_pillars,
        ai_summary: res.ai_summary,
        updated_at: new Date().toISOString(),
      } as BrandFoundation;
      if (onSave) onSave(updated);
      toast.success('Brand Foundation & 6 Content Pillars Synthesized!');
    } catch (e) {
      toast.error('Synthesis failed');
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleManualSave = () => {
    const updated: BrandFoundation = {
      ...formData,
      id: initialData?.id || `bf-${Date.now()}`,
      client_id: initialData?.client_id || 'client-id',
      content_pillars: pillars,
      ai_summary: aiSummary,
      updated_at: new Date().toISOString(),
    } as BrandFoundation;
    if (onSave) onSave(updated);
    toast.success('Questionnaire saved successfully!');
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-indigo-50 via-purple-50/50 to-white border border-indigo-100 rounded-2xl shadow-sm">
        <div>
          <Badge className="bg-indigo-100/80 text-indigo-700 border-indigo-200 mb-2 font-semibold">
            9-Part Brand Blueprint Engine
          </Badge>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Personal Brand Questionnaire for <span className="text-indigo-600">{clientName}</span>
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Answer the 9 core pillars below to extract the raw identity, authority, story bank, and 6 Content Pillars.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleManualSave}
            variant="outline"
            className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs flex items-center gap-1.5 font-semibold"
          >
            <Save className="w-3.5 h-3.5" /> Save Draft
          </Button>
          <Button
            onClick={handleSynthesizeAI}
            disabled={isSynthesizing}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20"
          >
            <Sparkles className="w-4 h-4" /> {isSynthesizing ? 'Synthesizing...' : 'Synthesize 6 Pillars with AI'}
          </Button>
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
        {QUESTIONNAIRE_SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const isActive = currentStep === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setCurrentStep(sec.id)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                isActive
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white border-slate-200/80 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 mb-1 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="text-[10px] font-bold truncate w-full">{sec.title.split('.')[1]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Section Form Content */}
      <div className="p-6 bg-white border border-slate-200/80 rounded-2xl space-y-6 shadow-sm">
        {/* SECTION 1: THE PERSON */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-5 h-5 text-indigo-600" /> Section 1: The Person
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">1. Who are you in one sentence?</label>
                <Input
                  value={formData.person_one_liner || ''}
                  onChange={(e) => updateField('person_one_liner', e.target.value)}
                  placeholder="e.g. Entrepreneur building high-performance tech ventures..."
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">2. What do you currently do?</label>
                <Input
                  value={formData.person_current_role || formData.current_role || ''}
                  onChange={(e) => {
                    updateField('person_current_role', e.target.value);
                    updateField('current_role', e.target.value);
                  }}
                  placeholder="e.g. Founder & CEO at AlphaVentures"
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">3. What have you spent the last 5 to 10 years becoming really good at?</label>
              <Textarea
                value={formData.ten_year_expertise || ''}
                onChange={(e) => updateField('ten_year_expertise', e.target.value)}
                placeholder="Scaling zero-to-one startups, sales funnels, and personal brand leverage..."
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs min-h-[70px] focus:bg-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">4. What are you unusually good at?</label>
                <Input
                  value={formData.unusual_superpower || ''}
                  onChange={(e) => updateField('unusual_superpower', e.target.value)}
                  placeholder="Cutting through motivational fluff to execute raw operational playbooks..."
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">5. What do people come to you for advice about?</label>
                <Input
                  value={formData.advice_topics?.join(', ') || ''}
                  onChange={(e) => updateField('advice_topics', e.target.value.split(',').map((s) => s.trim()))}
                  placeholder="Zero-to-One Execution, High-Ticket Sales, Personal Brand (comma separated)"
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">6. What do you know better than 90% of people around you?</label>
              <Textarea
                value={formData.top_10_percent_knowledge || ''}
                onChange={(e) => updateField('top_10_percent_knowledge', e.target.value)}
                placeholder="How to convert personal brand attention into high-ticket enterprise deals..."
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs min-h-[60px] focus:bg-white"
              />
            </div>
          </div>
        )}

        {/* SECTION 2: THE AUTHORITY */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Award className="w-5 h-5 text-indigo-600" /> Section 2: The Authority
            </h3>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">1. What have you built?</label>
              <Input
                value={formData.built_projects?.join(', ') || ''}
                onChange={(e) => updateField('built_projects', e.target.value.split(',').map((s) => s.trim()))}
                placeholder="AlphaVentures Incubator, ScaleOS Founder Community (comma separated)"
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">2. What results have you produced?</label>
                <Input
                  value={formData.produced_results || ''}
                  onChange={(e) => updateField('produced_results', e.target.value)}
                  placeholder="e.g. $5M+ total client revenue generated via video sales letters."
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">3. What have you failed at?</label>
                <Input
                  value={formData.failures?.join(', ') || ''}
                  onChange={(e) => updateField('failures', e.target.value.split(',').map((s) => s.trim()))}
                  placeholder="First e-commerce brand bankruptcy, Failed software launch"
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">4. What have you learned through experience that others only learn theoretically?</label>
              <Textarea
                value={formData.experiential_learnings || ''}
                onChange={(e) => updateField('experiential_learnings', e.target.value)}
                placeholder="Theoretical marketing books are useless compared to spending $50k on live ad testing..."
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs min-h-[70px] focus:bg-white"
              />
            </div>
          </div>
        )}

        {/* SECTION 3: THE BELIEFS */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Flame className="w-5 h-5 text-indigo-600" /> Section 3: The Beliefs
            </h3>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">1. What do you strongly believe that most people disagree with?</label>
              <Textarea
                value={formData.contrarian_beliefs || ''}
                onChange={(e) => updateField('contrarian_beliefs', e.target.value)}
                placeholder="Business advice should be practical, not motivational bullshit..."
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs min-h-[60px] focus:bg-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">2. What popular advice do you think is bullshit?</label>
                <Input
                  value={formData.popular_bs_advice || ''}
                  onChange={(e) => updateField('popular_bs_advice', e.target.value)}
                  placeholder="Follow your passion and money will automatically follow..."
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">3. What does your industry get completely wrong?</label>
                <Input
                  value={formData.industry_flaws || ''}
                  onChange={(e) => updateField('industry_flaws', e.target.value)}
                  placeholder="Selling bloated vanity metrics instead of qualified pipeline bookings..."
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">4. What principles do you live by & non-negotiables?</label>
              <Input
                value={formData.core_principles?.join(', ') || ''}
                onChange={(e) => updateField('core_principles', e.target.value.split(',').map((s) => s.trim()))}
                placeholder="Radical Transparency, Execution over Intellectualizing, Skin in the Game"
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white"
              />
            </div>
          </div>
        )}

        {/* SECTION 4: THE AUDIENCE */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Users className="w-5 h-5 text-indigo-600" /> Section 4: The Audience
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">1. Who do you ultimately want following you?</label>
                <Input
                  value={formData.ideal_followers || ''}
                  onChange={(e) => updateField('ideal_followers', e.target.value)}
                  placeholder="Young ambitious entrepreneurs who want real playbooks..."
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">2. Who do you NOT want following you?</label>
                <Input
                  value={formData.unwanted_followers || ''}
                  onChange={(e) => updateField('unwanted_followers', e.target.value)}
                  placeholder="Wantpreneurs seeking push-button riches without hard work..."
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">3. What does your ideal follower struggle with?</label>
                <Input
                  value={formData.follower_struggles || ''}
                  onChange={(e) => updateField('follower_struggles', e.target.value)}
                  placeholder="Struggling to stand out, generate consistent qualified leads..."
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">4. What keeps them awake at night?</label>
                <Input
                  value={formData.nighttime_worries || ''}
                  onChange={(e) => updateField('nighttime_worries', e.target.value)}
                  placeholder="Fearing irrelevance in an AI-dominated economy..."
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: THE DESIRED REPUTATION */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Star className="w-5 h-5 text-indigo-600" /> Section 5: The Desired Reputation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">1. If someone hears your name, what 3 things should come to mind?</label>
                <Input
                  value={formData.three_word_association?.join(', ') || ''}
                  onChange={(e) => updateField('three_word_association', e.target.value.split(',').map((s) => s.trim()))}
                  placeholder="Brutal Honesty, High Leverage, Operational Mastery"
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">2. Who would you like people to compare you with?</label>
                <Input
                  value={formData.benchmark_comparisons?.join(', ') || ''}
                  onChange={(e) => updateField('benchmark_comparisons', e.target.value.split(',').map((s) => s.trim()))}
                  placeholder="Alex Hormozi, Naval Ravikant"
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">3. If your personal brand had only one sentence, what should it be?</label>
              <Input
                value={formData.one_sentence_brand || ''}
                onChange={(e) => updateField('one_sentence_brand', e.target.value)}
                placeholder="No fluff. No motivation. Just battle-tested business execution."
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white"
              />
            </div>
          </div>
        )}

        {/* SECTION 6: THE STORY BANK */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <BookOpen className="w-5 h-5 text-indigo-600" /> Section 6: The Story Bank
            </h3>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">1. Tell us your origin story.</label>
              <Textarea
                value={formData.origin_story || ''}
                onChange={(e) => updateField('origin_story', e.target.value)}
                placeholder="Started in a small bedroom with $300 in savings, failed twice..."
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs min-h-[60px] focus:bg-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">2. What was your biggest struggle?</label>
                <Input
                  value={formData.biggest_struggle || ''}
                  onChange={(e) => updateField('biggest_struggle', e.target.value)}
                  placeholder="Overcoming impostor syndrome while scaling..."
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">3. What was your biggest breakthrough?</label>
                <Input
                  value={formData.biggest_breakthrough || ''}
                  onChange={(e) => updateField('biggest_breakthrough', e.target.value)}
                  placeholder="Realizing authenticity converts 10x better than PR..."
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 7: THE PERSONALITY */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Smile className="w-5 h-5 text-indigo-600" /> Section 7: The Personality
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">1. Are you serious, sarcastic, aggressive, calm, etc.?</label>
                <Input
                  value={formData.vibe_style || ''}
                  onChange={(e) => updateField('vibe_style', e.target.value)}
                  placeholder="Direct, witty, brutally honest"
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">2. What subjects make you angry or triggered?</label>
                <Input
                  value={formData.trigger_topics?.join(', ') || ''}
                  onChange={(e) => updateField('trigger_topics', e.target.value.split(',').map((s) => s.trim()))}
                  placeholder="Fake gurus, Lazy work ethic, Excuse-making"
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 8: THE BUSINESS OBJECTIVE */}
        {currentStep === 8 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Target className="w-5 h-5 text-indigo-600" /> Section 8: The Business Objective
            </h3>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">1. Why do you want a personal brand?</label>
              <Input
                value={formData.primary_goal || ''}
                onChange={(e) => updateField('primary_goal', e.target.value)}
                placeholder="Scale agency to $250k MRR & establish founder authority..."
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">2. What should the brand eventually make possible?</label>
              <Input
                value={formData.desired_outcomes?.join(', ') || ''}
                onChange={(e) => updateField('desired_outcomes', e.target.value.split(',').map((s) => s.trim()))}
                placeholder="More Customers, Keynote Speaking, Investments, Recruiting"
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white"
              />
            </div>
          </div>
        )}

        {/* SECTION 9: CONTENT PREFERENCES */}
        {currentStep === 9 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Video className="w-5 h-5 text-indigo-600" /> Section 9: Content Preferences & Boundaries
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-800">Comfortable talking about personal life?</span>
                <Switch
                  checked={formData.comfortable_with_personal_life ?? true}
                  onCheckedChange={(v) => updateField('comfortable_with_personal_life', v)}
                />
              </div>
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-800">Comfortable being controversial?</span>
                <Switch
                  checked={formData.comfortable_with_controversy ?? false}
                  onCheckedChange={(v) => updateField('comfortable_with_controversy', v)}
                />
              </div>
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-800">Comfortable showing failures?</span>
                <Switch
                  checked={formData.comfortable_with_failure ?? true}
                  onCheckedChange={(v) => updateField('comfortable_with_failure', v)}
                />
              </div>
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-800">Comfortable discussing money?</span>
                <Switch
                  checked={formData.comfortable_with_money ?? true}
                  onCheckedChange={(v) => updateField('comfortable_with_money', v)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <Button
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
            variant="outline"
            className="border-slate-200 bg-white text-slate-700 text-xs flex items-center gap-1.5 hover:bg-slate-50 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous Section
          </Button>
          <span className="text-xs text-slate-500 font-medium">Step {currentStep} of 9</span>
          <Button
            disabled={currentStep === 9}
            onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 9))}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs flex items-center gap-1.5 font-semibold"
          >
            Next Section <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Synthesized 6 Content Pillars Section */}
      {pillars.length > 0 && (
        <div className="p-6 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 border border-indigo-100 rounded-2xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Synthesized 6 Content Pillars
            </h3>
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 font-semibold">AI Verified</Badge>
          </div>
          {aiSummary && <p className="text-xs text-slate-700 italic bg-white p-3 rounded-xl border border-indigo-100 shadow-xs">{aiSummary}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pillars.map((pillar, idx) => (
              <div key={idx} className="p-4 bg-white border border-slate-200/80 rounded-xl space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700">{pillar.title}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{pillar.description}</p>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Target Emotion:</span>
                  <span className="text-[10px] text-amber-700 ml-1.5 font-bold">{pillar.target_emotion}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
