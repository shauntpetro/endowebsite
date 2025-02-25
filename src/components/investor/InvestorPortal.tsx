import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { InvestorAuth } from '../auth/InvestorAuth';
import { FilterBar } from './FilterBar';
import { DocumentList } from './DocumentList';
import { DocumentPreview } from './DocumentPreview';
import { useInvestorDocuments } from '../../hooks/useInvestorDocuments';

export const InvestorPortal = () => {
  const { isAuthenticated, investorStatus } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<any>(null);

  const { documents, loading, error } = useInvestorDocuments();

  const categories = Array.from(new Set(documents?.map(doc => doc.category) || []));
  const tags = Array.from(new Set(documents?.flatMap(doc => doc.tags) || []));

  const handlePortalAccess = () => {
    if (!isAuthenticated) {
      setShowAuth(true);
    } else if (investorStatus === 'pending') {
      alert('Your registration is pending approval. You will be notified once approved.');
    } else if (investorStatus === 'approved') {
      setIsOpen(true);
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedTags([]);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePortalAccess}
        className="fixed bottom-8 right-8 z-40 bg-white text-gold-600 px-6 py-3 rounded-full shadow-lg hover:bg-gold-50 transition-colors duration-300 flex items-center space-x-2 border border-gold-200"
      >
        <div className="relative">
          <Lock size={18} />
        </div>
        <span className="text-gray-900 font-medium">Investor Portal</span>
      </motion.button>

      <AnimatePresence>
        {showAuth && (
          <InvestorAuth onClose={() => setShowAuth(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && investorStatus === 'approved' && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!previewDocument) {
                  setIsOpen(false);
                }
              }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-full md:w-[640px] bg-white shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              <div className="flex-none p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-display font-bold text-gray-900">Investor Portal</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <FilterBar
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  showFilters={showFilters}
                  onToggleFilters={() => setShowFilters(!showFilters)}
                  selectedCategory={selectedCategory}
                  selectedTags={selectedTags}
                  onClearFilters={handleClearFilters}
                  categories={categories}
                  tags={tags}
                  onCategorySelect={setSelectedCategory}
                  onTagSelect={handleTagSelect}
                />

                <div className="mt-6">
                  <DocumentList
                    searchQuery={searchQuery}
                    selectedCategory={selectedCategory}
                    selectedTags={selectedTags}
                    onPreview={setPreviewDocument}
                  />
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {previewDocument && (
                <DocumentPreview
                  document={previewDocument}
                  onClose={() => setPreviewDocument(null)}
                />
              )}
            </AnimatePresence>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default InvestorPortal;