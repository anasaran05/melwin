'use client';

import React, { useState } from 'react';
import { PublishedVideoLog, SocialPlatform } from '@/types/smm-dashboard';
import { INITIAL_MOCK_PUBLISHED_VIDEOS } from '@/lib/supabase/smm-db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Video,
  PlusCircle,
  Eye,
  Calendar,
  ExternalLink,
  ThumbsUp,
  Share2,
  Film,
  TrendingUp,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
  Sparkles,
  Edit2
} from 'lucide-react';
import { toast } from 'sonner';

interface PublishedContentTrackerProps {
  clientName: string;
  clientId?: string;
}

const PLATFORM_LABELS: Record<SocialPlatform, { label: string; icon: any; color: string; badgeBg: string }> = {
  instagram_reel: { label: 'Instagram Reel', icon: Instagram, color: 'text-pink-600', badgeBg: 'bg-pink-50 text-pink-700 border-pink-200' },
  youtube_short: { label: 'YouTube Short', icon: Youtube, color: 'text-red-600', badgeBg: 'bg-red-50 text-red-700 border-red-200' },
  youtube_long: { label: 'YouTube Longform', icon: Youtube, color: 'text-red-600', badgeBg: 'bg-red-50 text-red-700 border-red-200' },
  linkedin_video: { label: 'LinkedIn Video', icon: Linkedin, color: 'text-blue-600', badgeBg: 'bg-blue-50 text-blue-700 border-blue-200' },
  twitter_x: { label: 'X / Twitter Video', icon: Twitter, color: 'text-slate-900', badgeBg: 'bg-slate-100 text-slate-800 border-slate-300' },
};

export function PublishedContentTracker({ clientName, clientId = 'a1b2c3d4-e5f6-7890-abcd-111111111111' }: PublishedContentTrackerProps) {
  const [videos, setVideos] = useState<PublishedVideoLog[]>(INITIAL_MOCK_PUBLISHED_VIDEOS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<PublishedVideoLog | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<SocialPlatform>('instagram_reel');
  const [postedDate, setPostedDate] = useState(new Date().toISOString().split('T')[0]);
  const [videoUrl, setVideoUrl] = useState('');
  const [views, setViews] = useState('');
  const [likes, setLikes] = useState('');
  const [pillar, setPillar] = useState('Pillar 1: Zero-to-One Execution Playbooks');
  const [notes, setNotes] = useState('');

  const totalViews = videos.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalLikes = videos.reduce((acc, curr) => acc + (curr.likes || 0), 0);
  const avgViews = videos.length > 0 ? Math.round(totalViews / videos.length) : 0;

  const handleOpenCreateModal = () => {
    setEditingVideo(null);
    setTitle('');
    setPlatform('instagram_reel');
    setPostedDate(new Date().toISOString().split('T')[0]);
    setVideoUrl('');
    setViews('');
    setLikes('');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (video: PublishedVideoLog) => {
    setEditingVideo(video);
    setTitle(video.title);
    setPlatform(video.platform);
    setPostedDate(video.posted_date);
    setVideoUrl(video.video_url);
    setViews(video.views.toString());
    setLikes(video.likes?.toString() || '');
    setPillar(video.pillar || 'Pillar 1: Zero-to-One Execution Playbooks');
    setNotes(video.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Video title is required');
      return;
    }

    const viewsNum = parseInt(views) || 0;
    const likesNum = parseInt(likes) || 0;

    if (editingVideo) {
      setVideos((prev) =>
        prev.map((v) =>
          v.id === editingVideo.id
            ? {
                ...v,
                title: title.trim(),
                platform,
                posted_date: postedDate,
                video_url: videoUrl.trim() || '#',
                views: viewsNum,
                likes: likesNum,
                pillar,
                notes: notes.trim(),
              }
            : v
        )
      );
      toast.success('Updated video metrics!');
    } else {
      const newVideo: PublishedVideoLog = {
        id: `vid-${Date.now()}`,
        client_id: clientId,
        title: title.trim(),
        platform,
        posted_date: postedDate,
        video_url: videoUrl.trim() || '#',
        views: viewsNum,
        likes: likesNum,
        pillar,
        notes: notes.trim(),
        created_at: new Date().toISOString(),
      };
      setVideos((prev) => [newVideo, ...prev]);
      toast.success('Logged new published video!');
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-indigo-50 via-purple-50/40 to-white border border-indigo-100 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Film className="w-5 h-5 text-indigo-600" /> Published Content & Reel Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Log and track views, posted dates, and video URLs for <span className="text-indigo-600 font-bold">{clientName}</span>.
          </p>
        </div>
        <Button
          onClick={handleOpenCreateModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-indigo-600/15"
        >
          <PlusCircle className="w-4 h-4" /> Log Posted Reel / Video
        </Button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Organic Views</span>
            <Eye className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{totalViews.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-600 font-bold">Sum of all tracked videos</div>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Posted Videos</span>
            <Video className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-purple-700">{videos.length} Videos</div>
          <div className="text-[10px] text-purple-700 font-bold">Cross-Platform Logged</div>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Avg Views / Video</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{avgViews.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-600 font-bold">Average view velocity</div>
        </div>

        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Recorded Likes</span>
            <ThumbsUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600">{totalLikes.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500 font-medium">Recorded user engagement</div>
        </div>
      </div>

      {/* Logged Videos List / Table */}
      <div className="p-6 bg-white border border-slate-200/80 rounded-2xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Film className="w-5 h-5 text-indigo-600" /> Tracked Videos & Reels Log ({videos.length})
          </h3>
          <span className="text-xs text-slate-500 font-medium">Sorted by Posted Date</span>
        </div>

        <div className="space-y-3">
          {videos.map((vid) => {
            const platformConfig = PLATFORM_LABELS[vid.platform] || PLATFORM_LABELS.instagram_reel;
            const PlatformIcon = platformConfig.icon;

            return (
              <div
                key={vid.id}
                className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl space-y-3 hover:border-indigo-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={`${platformConfig.badgeBg} text-[10px] font-bold flex items-center gap-1`}>
                      <PlatformIcon className="w-3 h-3" />
                      {platformConfig.label}
                    </Badge>
                    {vid.pillar && (
                      <Badge className="bg-slate-200/80 text-slate-700 border-slate-300 text-[10px] font-medium">
                        {vid.pillar}
                      </Badge>
                    )}
                    <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {vid.posted_date}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 truncate">{vid.title}</h4>

                  {vid.notes && <p className="text-xs text-slate-600 italic font-medium">"{vid.notes}"</p>}
                </div>

                <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                  {/* Views Badge */}
                  <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-center shadow-xs">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Manual Views</div>
                    <div className="text-xs font-black text-indigo-600">{vid.views.toLocaleString()}</div>
                  </div>

                  {/* Likes Badge */}
                  {vid.likes !== undefined && (
                    <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-center shadow-xs">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Likes</div>
                      <div className="text-xs font-black text-slate-800">{vid.likes.toLocaleString()}</div>
                    </div>
                  )}

                  {/* External Link */}
                  {vid.video_url && vid.video_url !== '#' ? (
                    <a
                      href={vid.video_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg border border-indigo-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Open Live Reel / Video"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : null}

                  {/* Edit Button */}
                  <Button
                    onClick={() => handleOpenEditModal(vid)}
                    variant="outline"
                    size="sm"
                    className="border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs h-8 px-2.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add / Edit Video Log Dialog Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-white border border-slate-200 text-slate-900 max-w-md p-6 rounded-2xl select-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
              <Film className="w-5 h-5 text-indigo-600" /> {editingVideo ? 'Edit Published Video Entry' : 'Log New Published Reel / Video'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Enter the video name, platform, publish date, reel link, and view count.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveVideo} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Video Name / Title *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Why 95% of Founders Fail at Personal Branding in 2026"
                className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:bg-white"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Platform</label>
                <Select value={platform} onValueChange={(val: SocialPlatform) => setPlatform(val)}>
                  <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-900 text-xs">
                    <SelectValue placeholder="Select Platform" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 text-slate-900 text-xs">
                    <SelectItem value="instagram_reel">Instagram Reel</SelectItem>
                    <SelectItem value="youtube_short">YouTube Short</SelectItem>
                    <SelectItem value="youtube_long">YouTube Longform</SelectItem>
                    <SelectItem value="linkedin_video">LinkedIn Video</SelectItem>
                    <SelectItem value="twitter_x">X / Twitter Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Posted Date *</label>
                <Input
                  type="date"
                  value={postedDate}
                  onChange={(e) => setPostedDate(e.target.value)}
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Reel / Video URL Link</label>
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://instagram.com/reels/..."
                className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 text-xs focus:bg-white font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Views Count *</label>
                <Input
                  type="number"
                  value={views}
                  onChange={(e) => setViews(e.target.value)}
                  placeholder="e.g. 142500"
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Likes Count</label>
                <Input
                  type="number"
                  value={likes}
                  onChange={(e) => setLikes(e.target.value)}
                  placeholder="e.g. 8420"
                  className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Content Pillar</label>
              <Input
                value={pillar}
                onChange={(e) => setPillar(e.target.value)}
                placeholder="e.g. Pillar 1: Zero-to-One Execution"
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Notes / Performance Highlights</label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Viral hook generated 42 DMs"
                className="bg-slate-50 border-slate-200 text-slate-900 text-xs focus:bg-white"
              />
            </div>

            <DialogFooter className="pt-4 flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="border-slate-200 text-slate-700 text-xs hover:bg-slate-100">
                Cancel
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/15">
                {editingVideo ? 'Update Video Entry' : 'Log Video Entry'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
