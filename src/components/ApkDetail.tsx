import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Star, 
  Heart, 
  Share2, 
  ShieldCheck, 
  CheckCircle2, 
  Info, 
  Smartphone, 
  Calendar, 
  HardDrive, 
  Layers, 
  Sparkles, 
  MessageSquare, 
  Send,
  ExternalLink,
  ChevronRight,
  User,
  Zap,
  Clock,
  FileCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ApkItem } from '../types';
import { ApkCard } from './ApkCard';

export const ApkDetail: React.FC = () => {
  const { 
    selectedApk, 
    setActivePage, 
    navigateToApk, 
    toggleFavorite, 
    isFavorite,
    submitReview,
    showNotification,
    apks
  } = useApp();

  const [activeTab, setActiveTab] = useState<'info' | 'mod' | 'reviews'>('info');
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  // Review Form state
  const [userRating, setUserRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [userName, setUserName] = useState<string>('');
  const [userComment, setUserComment] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  if (!selectedApk) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">APK not found</h2>
        <button 
          onClick={() => setActivePage('home')}
          className="mt-4 px-4 py-2 bg-emerald-500 text-zinc-950 rounded-xl font-bold"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const favorited = isFavorite(selectedApk.id);

  // Related APKs
  const relatedApks = apks
    .filter(a => a.id !== selectedApk.id && (a.category === selectedApk.category || a.categoryType === selectedApk.categoryType))
    .slice(0, 4);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${selectedApk.title} (MOD APK)`,
          text: `Download ${selectedApk.title} MOD APK on MODAPKs powered by linksshare:`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showNotification('Link copied to clipboard!', 'success');
      }
    } catch {
      showNotification('Link copied to clipboard!', 'success');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) {
      showNotification('Please enter a comment or feedback.', 'error');
      return;
    }
    setSubmittingReview(true);
    await submitReview(selectedApk.id, userRating, userComment, userName);
    setUserComment('');
    setSubmittingReview(false);
  };

  return (
    <div id="apk-detail-view" className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
        <button 
          onClick={() => setActivePage('home')}
          className="hover:text-emerald-500 flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Home
        </button>
        <ChevronRight className="w-3 h-3" />
        <span>{selectedApk.category}</span>
        <ChevronRight className="w-3 h-3" />
        <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">{selectedApk.title}</span>
      </div>

      {/* Main Header Card */}
      <div className="relative bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/90 dark:border-zinc-800/90 shadow-xl overflow-hidden">
        
        {/* Subtle Ambient Background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full filter blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          
          {/* Left: Icon & Meta */}
          <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            <img
              src={selectedApk.iconUrl}
              alt={selectedApk.title}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-emerald-500/40 shadow-xl shrink-0"
            />
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-400/40">
                  {selectedApk.category}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {selectedApk.version}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Virus Free
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-zinc-900 dark:text-zinc-100 tracking-tight">
                {selectedApk.title}
              </h1>

              <div className="flex items-center gap-4 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 flex-wrap">
                <span>By <strong className="text-emerald-600 dark:text-emerald-400">{selectedApk.developer}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-500" />
                  {selectedApk.rating} ({selectedApk.ratingCount.toLocaleString()} votes)
                </span>
                <span>•</span>
                <span>{selectedApk.downloadsCount.toLocaleString()} Downloads</span>
              </div>
            </div>
          </div>

          {/* Right: Download CTA & Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
            <button
              id="detail-main-download-btn"
              onClick={() => navigateToApk(selectedApk, 'download')}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-extrabold text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/25 transform hover:-translate-y-0.5 active:scale-95 transition cursor-pointer"
            >
              <Download className="w-5 h-5 stroke-[2.8]" />
              <span>Download APK ({selectedApk.size})</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(selectedApk.id)}
                className={`flex-1 py-2.5 px-4 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
                  favorited
                    ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-500'
                    : 'bg-zinc-50 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500' : ''}`} />
                <span>{favorited ? 'Favorited' : 'Favorite'}</span>
              </button>

              <button
                onClick={handleShare}
                className="py-2.5 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>

        </div>

        {/* Quick Specs Strip */}
        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <div className="text-zinc-400 text-[11px] uppercase font-bold">File Size</div>
              <div className="font-bold text-zinc-800 dark:text-zinc-200">{selectedApk.size}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-zinc-400 text-[11px] uppercase font-bold">Requirement</div>
              <div className="font-bold text-zinc-800 dark:text-zinc-200">{selectedApk.minAndroid}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-zinc-400 text-[11px] uppercase font-bold">Updated On</div>
              <div className="font-bold text-zinc-800 dark:text-zinc-200">{selectedApk.updatedAt}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-zinc-400 text-[11px] uppercase font-bold">Package</div>
              <div className="font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-[120px] sm:max-w-full" title={selectedApk.packageName}>
                {selectedApk.packageName}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOD Info Banner */}
      <div className="bg-gradient-to-r from-emerald-950/90 to-teal-950/90 rounded-3xl p-6 border border-emerald-500/40 text-white shadow-lg">
        <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-xs mb-3">
          <Sparkles className="w-4 h-4" />
          <span>Exclusive MOD Info & Unlocked Features:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {selectedApk.modFeatures.map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-zinc-100 bg-white/5 rounded-xl px-3 py-2 border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-medium">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Screenshots Gallery */}
      {selectedApk.screenshots && selectedApk.screenshots.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold font-display text-zinc-900 dark:text-zinc-100">
            Official Screenshots Preview
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
            {selectedApk.screenshots.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${selectedApk.title} screenshot ${idx + 1}`}
                onClick={() => setSelectedScreenshot(img)}
                className="h-44 sm:h-56 rounded-2xl object-cover cursor-pointer hover:opacity-90 border border-zinc-200 dark:border-zinc-800 shrink-0 transition shadow-sm hover:scale-[1.02]"
              />
            ))}
          </div>
        </div>
      )}

      {/* Lightbox for screenshots */}
      {selectedScreenshot && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedScreenshot(null)}
        >
          <img
            src={selectedScreenshot}
            alt="Preview"
            className="max-w-full max-h-[85vh] rounded-2xl object-contain border border-white/20 shadow-2xl"
          />
        </div>
      )}

      {/* Description & Specs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Description & What's New */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-4">
            <h3 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Info className="w-5 h-5 text-emerald-500" />
              About {selectedApk.title}
            </h3>
            
            <div className="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {selectedApk.description}
            </div>

            {selectedApk.whatsNew && (
              <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
                  What's New in {selectedApk.version}:
                </h4>
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 whitespace-pre-line font-mono">
                  {selectedApk.whatsNew}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Rating & Community Reviews Section */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-500" />
                Ratings & User Feedback ({selectedApk.reviews?.length || 0})
              </h3>
              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 text-amber-500 px-3 py-1 rounded-full text-sm font-bold border border-amber-300/40">
                <Star className="w-4 h-4 fill-amber-500" />
                <span>{selectedApk.rating} / 5.0</span>
              </div>
            </div>

            {/* Submit Review Form */}
            <form onSubmit={handleReviewSubmit} className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">
                Leave a rating & review for {selectedApk.title}:
              </div>
              
              {/* Star Rating Picker */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">Your Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 cursor-pointer transition transform hover:scale-125"
                    >
                      <Star 
                        className={`w-6 h-6 ${
                          (hoverRating || userRating) >= star 
                            ? 'text-amber-400 fill-amber-400' 
                            : 'text-zinc-300 dark:text-zinc-700'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-amber-500">
                  {userRating} Star{userRating > 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Your Name (e.g. Alex)"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                />
                <div className="text-xs text-zinc-400 flex items-center">
                  Saved automatically to Firebase database
                </div>
              </div>

              <textarea
                placeholder="Share your experience with this MOD APK (e.g. Works great on Android 14, smooth performance)..."
                rows={3}
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submittingReview ? 'Submitting...' : 'Post Review'}</span>
                </button>
              </div>
            </form>

            {/* List of Reviews */}
            <div className="space-y-3">
              {selectedApk.reviews && selectedApk.reviews.length > 0 ? (
                selectedApk.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-800/60 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                          {rev.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            {rev.userName}
                          </div>
                          <div className="text-[10px] text-zinc-400">
                            {rev.createdAt} {rev.device ? `• ${rev.device}` : ''}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              rev.rating >= s ? 'text-amber-400 fill-amber-400' : 'text-zinc-300 dark:text-zinc-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 pl-10">
                      {rev.comment}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-zinc-400 text-xs">
                  No reviews yet. Be the first to rate this Mod APK!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Specifications & Fast Links */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Detailed Specs Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs space-y-4">
            <h4 className="text-base font-bold font-display text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-500" />
              Technical Specifications
            </h4>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-zinc-400">App Name</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-right">{selectedApk.title}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-zinc-400">Package Name</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 text-right text-[11px] truncate max-w-[170px]">{selectedApk.packageName}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-zinc-400">Version</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{selectedApk.version}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-zinc-400">File Size</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{selectedApk.size}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-zinc-400">Android OS</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{selectedApk.minAndroid}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-zinc-400">Root Required</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">No (Safe to Install)</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-zinc-400">License</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">Free / Modded</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-zinc-400">Security Check</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> Passed Clean
                </span>
              </div>
            </div>

            <button
              onClick={() => navigateToApk(selectedApk, 'download')}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Go to Download Page</span>
            </button>
          </div>

          {/* Telegram Channel Promotion */}
          <div className="bg-gradient-to-br from-cyan-900/60 to-blue-900/60 rounded-3xl p-6 border border-cyan-500/30 text-white space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Zap className="w-4 h-4" /> Join Telegram for Instant Updates
            </div>
            <p className="text-xs text-zinc-300">
              Get notified immediately when new game mods and APK updates are released!
            </p>
            <a
              href="https://t.me/linksshare_modapks"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 transition block text-center"
            >
              Join Official Channel
            </a>
          </div>

        </div>
      </div>

      {/* Related MOD APKs */}
      {relatedApks.length > 0 && (
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-display text-zinc-900 dark:text-zinc-100">
              Similar {selectedApk.category} Mod APKs
            </h3>
            <button 
              onClick={() => setActivePage('home')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Browse All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedApks.map((item) => (
              <ApkCard key={item.id} apk={item} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
