import React from 'react';
import { Star, Download, Heart, ShieldCheck, Zap } from 'lucide-react';
import { ApkItem } from '../types';
import { useApp } from '../context/AppContext';

interface ApkCardProps {
  apk: ApkItem;
}

export const ApkCard: React.FC<ApkCardProps> = ({ apk }) => {
  const { navigateToApk, toggleFavorite, isFavorite } = useApp();
  const favorited = isFavorite(apk.id);

  return (
    <div
      id={`apk-card-${apk.id}`}
      className="group relative bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-500/80 dark:hover:border-emerald-500/80 shadow-xs hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Top Section: Icon, Title, Badges */}
      <div>
        <div className="flex items-start gap-3.5">
          {/* App Icon */}
          <div 
            onClick={() => navigateToApk(apk, 'detail')}
            className="relative cursor-pointer shrink-0"
          >
            <img
              src={apk.iconUrl}
              alt={apk.title}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border border-zinc-200 dark:border-zinc-800 group-hover:scale-105 transition-transform duration-300 shadow-sm"
              loading="lazy"
            />
            {apk.isFeatured && (
              <span className="absolute -top-1.5 -left-1.5 p-1 bg-amber-500 text-zinc-950 rounded-full shadow-xs" title="Featured Pick">
                <Zap className="w-3 h-3 fill-current" />
              </span>
            )}
          </div>

          {/* Title & Metadata */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-1">
              <h3 
                onClick={() => navigateToApk(apk, 'detail')}
                className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 font-display line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition cursor-pointer"
                title={apk.title}
              >
                {apk.title}
              </h3>

              {/* Favorite Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(apk.id);
                }}
                className={`p-1.5 rounded-full transition cursor-pointer ${
                  favorited 
                    ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/60' 
                    : 'text-zinc-400 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
                title={favorited ? 'Remove from favorites' : 'Add to favorites'}
                aria-label="Favorite toggle"
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
              {apk.developer}
            </p>

            {/* Version & Size tags */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[11px]">
              <span className="px-2 py-0.5 font-bold rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-700/40">
                {apk.version}
              </span>
              <span className="text-zinc-400 dark:text-zinc-500">•</span>
              <span className="text-zinc-600 dark:text-zinc-400 font-medium">
                {apk.size}
              </span>
              <span className="text-zinc-400 dark:text-zinc-500">•</span>
              <span className="text-zinc-500 dark:text-zinc-400">
                {apk.category}
              </span>
            </div>
          </div>
        </div>

        {/* MOD Features Highlight Chip */}
        {apk.modFeatures.length > 0 && (
          <div 
            onClick={() => navigateToApk(apk, 'detail')}
            className="mt-3 px-2.5 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/70 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1.5 cursor-pointer line-clamp-1"
          >
            <span className="font-extrabold uppercase text-[10px] px-1 bg-emerald-500 text-zinc-950 rounded">MOD</span>
            <span className="truncate">{apk.modFeatures[0]}</span>
          </div>
        )}
      </div>

      {/* Bottom Section: Rating, Safe Badge, Download Button */}
      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            <span>{apk.rating}</span>
          </div>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
            ({(apk.downloadsCount > 1000 ? `${(apk.downloadsCount / 1000).toFixed(0)}k+` : apk.downloadsCount)})
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigateToApk(apk, 'download')}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 hover:scale-105 active:scale-95 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};
