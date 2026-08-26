import React from 'react';
import { 
  Sparkles, 
  Gamepad2, 
  Smartphone, 
  Flame, 
  Layers, 
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES_LIST } from '../data/initialApks';

export const CategoryFilter: React.FC = () => {
  const { 
    selectedCategory, 
    setSelectedCategory, 
    filterType, 
    setFilterType, 
    sortOption, 
    setSortOption,
    apks 
  } = useApp();

  const filteredCategories = CATEGORIES_LIST.filter(cat => {
    if (filterType === 'games') return cat.type === 'games' || cat.id === 'all';
    if (filterType === 'apps') return cat.type === 'apps' || cat.id === 'all';
    return true;
  });

  return (
    <div id="category-filter-section" className="space-y-4 mb-8">
      
      {/* Top Filter & Sort Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800">
        
        {/* Main Tab Switches */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 self-start">
          <button
            onClick={() => { setFilterType('all'); setSelectedCategory('all'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer ${
              filterType === 'all'
                ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            All Mods ({apks.length})
          </button>
          
          <button
            onClick={() => { setFilterType('games'); setSelectedCategory('all'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer ${
              filterType === 'games'
                ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            Mod Games
          </button>

          <button
            onClick={() => { setFilterType('apps'); setSelectedCategory('all'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer ${
              filterType === 'apps'
                ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Mod Apps
          </button>

          <button
            onClick={() => { setFilterType('trending'); setSelectedCategory('all'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer ${
              filterType === 'trending'
                ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-500" />
            Trending
          </button>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
          </span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="text-xs sm:text-sm bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer font-medium"
          >
            <option value="popular">Most Popular</option>
            <option value="latest">Latest Updates</option>
            <option value="rating">Highest Rated ★</option>
            <option value="name">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Category Pills (Horizontal Scrollable) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filteredCategories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 border ${
                isSelected
                  ? 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-zinc-950 border-emerald-500 shadow-sm shadow-emerald-500/20 font-bold'
                  : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/60 hover:text-emerald-600 dark:hover:text-emerald-400'
              }`}
            >
              {cat.id === 'all' ? <Sparkles className="w-3.5 h-3.5" /> : null}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
