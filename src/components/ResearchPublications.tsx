import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Users, Link as LinkIcon, Download, ChevronDown } from 'lucide-react';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';

interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  publication_date: string;
  abstract: string;
  doi: string;
  category: string;
}

const ResearchPublications = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: publications, loading, error } = useSupabaseQuery<Publication[]>({
    query: 'SELECT * FROM research_publications ORDER BY publication_date DESC',
    transform: (data) => data as Publication[],
  });

  const categories = Array.from(new Set(publications?.map(pub => pub.category) || []));
  
  const filteredPublications = selectedCategory && publications
    ? publications.filter(pub => pub.category === selectedCategory)
    : publications;

  if (loading) {
    return (
      <section className="py-24 bg-white bg-pattern relative">
        <div className="pattern-grid" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-4" />
              <div className="h-4 w-96 bg-gray-200 rounded mx-auto mb-12" />
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-xl p-6">
                    <div className="h-6 w-3/4 bg-gray-200 rounded mb-4" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-full bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-white bg-pattern relative">
        <div className="pattern-grid" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center text-red-600">
            Error loading publications. Please try again later.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white bg-pattern relative">
      <div className="pattern-grid" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-display font-bold text-gray-900 sm:text-4xl">
            Research Publications
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Our latest scientific contributions advancing women's health research
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
              selectedCategory === null
                ? 'bg-gold-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gold-50'
            } shadow-sm`}
          >
            All
          </motion.button>
          {categories.map(category => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                selectedCategory === category
                  ? 'bg-gold-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gold-50'
              } shadow-sm`}
            >
              {category}
            </motion.button>
          ))}
        </div>

        <div className="space-y-6">
          <AnimatePresence>
            {filteredPublications?.map((publication, index) => (
              <motion.div
                key={publication.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <FileText className="text-gold-600" size={20} />
                        <span className="text-sm font-medium text-gold-600">
                          {publication.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {publication.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <Users size={16} />
                        <span>{publication.authors.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{publication.journal}</span>
                        <span>•</span>
                        <span>{new Date(publication.publication_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long'
                        })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        href={`https://doi.org/${publication.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gold-600 hover:text-gold-700 transition-colors duration-200"
                      >
                        <LinkIcon size={20} />
                      </motion.a>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-gold-600 hover:text-gold-700 transition-colors duration-200"
                      >
                        <Download size={20} />
                      </motion.button>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => setExpandedId(expandedId === publication.id ? null : publication.id)}
                    className="mt-4 flex items-center gap-2 text-sm font-medium text-gold-600 hover:text-gold-700"
                  >
                    <span>Abstract</span>
                    <motion.div
                      animate={{ rotate: expandedId === publication.id ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={16} />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {expandedId === publication.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 text-gray-600 text-sm">
                          {publication.abstract}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ResearchPublications;