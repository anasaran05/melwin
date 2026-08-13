'use client';

import React, { useState } from 'react';
import { scoreScriptWithAI, AiScriptScoreResponse } from '@/lib/ai/deepseek-copilot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CheckCircle, AlertTriangle, Zap, Send } from 'lucide-react';
import { toast } from 'sonner';

interface ScriptScorerWidgetProps {
  initialTitle?: string;
  initialHook?: string;
  initialScript?: string;
  targetAudience?: string;
  onSaveScript?: (data: { title: string; hook: string; scriptBody: string; aiScore: number; feedback: AiScriptScoreResponse }) => void;
}

export function ScriptScorerWidget({
  initialTitle = '',
  initialHook = '',
  initialScript = '',
  targetAudience = 'Entrepreneurs & Founders',
  onSaveScript
}: ScriptScorerWidgetProps) {
  const [title, setTitle] = useState(initialTitle);
  const [hook, setHook] = useState(initialHook);
  const [scriptBody, setScriptBody] = useState(initialScript);
  const [isScoring, setIsScoring] = useState(false);
  const [analysis, setAnalysis] = useState<AiScriptScoreResponse | null>(null);

  const handleScoreScript = async () => {
    if (!scriptBody.trim()) {
      toast.error('Please enter a script body to score');
      return;
    }
    setIsScoring(true);
    toast.info('DeepSeek AI scoring script retention & hook strength...');
    try {
      const res = await scoreScriptWithAI(title, hook, scriptBody, targetAudience);
      setAnalysis(res);
      toast.success(`Script Scored: ${res.score}/100!`);
    } catch (e) {
      toast.error('AI Scoring failed');
    } finally {
      setIsScoring(false);
    }
  };

  const handleApplyRewrittenHook = () => {
    if (analysis?.rewritten_hook) {
      setHook(analysis.rewritten_hook);
      toast.success('Applied AI Optimized Hook!');
    }
  };

  const handleSave = () => {
    if (onSaveScript && analysis) {
      onSaveScript({ title, hook, scriptBody, aiScore: analysis.score, feedback: analysis });
      toast.success('Script saved to client content pipeline!');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-none">
      {/* Script Editor Column */}
      <div className="lg:col-span-7 p-6 bg-white border border-slate-200/80 rounded-2xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" /> AI Script Workshop & Teleprompter Studio
          </h3>
          <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 text-[10px] font-semibold">
            Target: {targetAudience}
          </Badge>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Video Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Why 95% of Founders Fail at Personal Branding in 2026"
            className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Scroll-Stopping Hook (First 0-3s)</label>
          <Textarea
            value={hook}
            onChange={(e) => setHook(e.target.value)}
            placeholder="e.g. Stop hiring PR agencies that charge $10k/mo for vanity badges..."
            className="bg-slate-50 border-slate-200 text-slate-900 text-xs min-h-[60px] focus:bg-white"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Script Body & Teleprompter Cues</label>
          <Textarea
            value={scriptBody}
            onChange={(e) => setScriptBody(e.target.value)}
            placeholder="[HOOK] Stop hiring PR agencies...\n[BODY] Here is the 3-step engine...\n[CTA] Comment BUILD..."
            className="bg-slate-50 border-slate-200 text-slate-900 text-xs min-h-[220px] font-mono leading-relaxed focus:bg-white"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button
            onClick={handleScoreScript}
            disabled={isScoring}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 py-2 shadow-md shadow-indigo-600/15"
          >
            <Sparkles className="w-4 h-4 text-amber-300" /> {isScoring ? 'Scoring...' : 'Score Script with DeepSeek AI'}
          </Button>
          {analysis && onSaveScript && (
            <Button
              onClick={handleSave}
              variant="outline"
              className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs flex items-center gap-1.5 font-semibold"
            >
              <Send className="w-3.5 h-3.5" /> Save to Pipeline
            </Button>
          )}
        </div>
      </div>

      {/* AI Score Feedback Panel */}
      <div className="lg:col-span-5 p-6 bg-gradient-to-b from-slate-50 to-white border border-slate-200/80 rounded-2xl space-y-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200/80 pb-3">
          <Sparkles className="w-5 h-5 text-indigo-600" /> AI Score Breakdown & Recommendations
        </h3>

        {analysis ? (
          <div className="space-y-5">
            {/* Score Ring / Badge */}
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-emerald-400 p-1 flex items-center justify-center shadow-md shadow-indigo-500/15">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-black text-xl text-slate-900">
                  {analysis.score}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">Overall AI Script Score</div>
                <div className="text-sm font-bold text-emerald-600">
                  {analysis.score >= 90 ? '🔥 Viral Potential (High Retention)' : '⚡ Solid Script (Ready to Film)'}
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">Estimated 3s Retention: {analysis.hook_score}%</div>
              </div>
            </div>

            {/* Metrics Breakdown Bar */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Hook Strength</div>
                <div className="text-sm font-bold text-indigo-600">{analysis.hook_score}/100</div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Clarity Rating</div>
                <div className="text-sm font-bold text-purple-600">{analysis.clarity_score}/100</div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Engagement</div>
                <div className="text-sm font-bold text-emerald-600">{analysis.engagement_score}/100</div>
              </div>
            </div>

            {/* AI Rewritten Hook Recommendation */}
            <div className="p-3.5 bg-indigo-50/80 border border-indigo-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> DeepSeek Suggested Hook Rewrite:
                </span>
                <button
                  onClick={handleApplyRewrittenHook}
                  className="text-[10px] text-indigo-700 hover:text-indigo-900 underline font-bold"
                >
                  Apply Hook
                </button>
              </div>
              <p className="text-xs text-slate-800 italic font-mono bg-white p-2.5 rounded-lg border border-indigo-100 shadow-xs">
                "{analysis.rewritten_hook}"
              </p>
            </div>

            {/* Strengths List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Key Strengths
              </span>
              <ul className="space-y-1 text-xs text-slate-600 font-medium">
                {analysis.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-600">•</span> {str}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Improvements */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Recommended Tweaks
              </span>
              <ul className="space-y-1 text-xs text-slate-600 font-medium">
                {analysis.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-600">•</span> {imp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 text-slate-400">
            <Sparkles className="w-10 h-10 text-indigo-300 animate-pulse" />
            <p className="text-xs">Click "Score Script with DeepSeek AI" to view retention analysis and recommendations.</p>
          </div>
        )}
      </div>
    </div>
  );
}
