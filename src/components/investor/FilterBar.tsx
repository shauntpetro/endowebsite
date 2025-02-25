import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ChevronRight } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  selectedCategory: string | null;
  selectedTags: string[];
  onClearFilters: () => void;
  categories: string[];
  tags: string[];
  onCategorySelect: (category: string | null) => void;
  onTagSelect: (tag: string) => void;
}

export const FilterBar = ({
  searchQuery,
  onSearchChange,
  showFilters,
  onToggleFilters,
  selectedCategory,
  selectedTags,
  onClearFilters,
  categories,
  tags,
  onCategorySelect,
  onTagSelect
}: FilterBarProps) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-gold-500 focus:ring-gold-500"
        />
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onToggleFilters}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gold-600"
        >
          <Filter size={18} />
          Filters
          <motion.span
            animate={{ rotate: showFilters ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight size={16} />
          </motion.span>
        </button>

        {(selectedCategory || selectedTags.length > 0) && (
          <button
            onClick={onClearFilters}
            className="text-sm text-gold-600 hover:text-gold-700"
          >
            Clear filters
          </button>
        )}
      </div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="space-y-4 py-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => onCategorySelect(selectedCategory === category ? null : category)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategory === category
                      ? 'bg-gold-100 text-gold-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => onTagSelect(tag)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTags.includes(tag)
                      ? 'bg-gold-100 text-gold-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};