import React from 'react';
import { motion } from 'framer-motion';
import { Award, FlaskRound as Flask, Microscope, ArrowRight } from 'lucide-react';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';

interface NewsUpdate {
  id: string;
  title: string;
  content: string;
  category: string;
  publish_date: string;
  icon: string;
}

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Award':
      return Award;
    case 'Flask':
      return Flask;
    case 'Microscope':
      return Microscope;
    default:
      return Award;
  }
};

const NewsCard = ({ news, index }: { news: NewsUpdate; index: number }) => {
  const IconComponent = getIconComponent(news.icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gold-100 text-gold-600 mb-6">
        <IconComponent size={24} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{news.title}</h3>
      <p className="text-gray-600 mb-4">{news.content}</p>
      <p className="text-sm text-gold-600 font-medium">
        {new Date(news.publish_date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long'
        })}
      </p>
    </motion.div>
  );
};

const LatestNews = () => {
  const { data: news, loading, error } = useSupabaseQuery<NewsUpdate[]>({
    query: 'SELECT * FROM news_updates ORDER BY publish_date DESC LIMIT 3',
    transform: (data) => data as NewsUpdate[],
  });

  if (loading) {
    return (
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-4" />
              <div className="h-4 w-96 bg-gray-200 rounded mx-auto mb-12" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-xl p-8">
                    <div className="w-12 h-12 rounded-full bg-gray-200 mx-auto mb-6" />
                    <div className="h-6 w-3/4 bg-gray-200 rounded mb-4 mx-auto" />
                    <div className="h-4 w-full bg-gray-200 rounded mb-2" />
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
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">
            Error loading news updates. Please try again later.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-display font-bold text-gray-900 sm:text-4xl">
            Latest News & Achievements
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Stay updated with our latest breakthroughs and milestones
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news?.map((item, index) => (
            <NewsCard key={item.id} news={item} index={index} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/news"
            className="inline-flex items-center text-gold-600 font-semibold hover:text-gold-700"
          >
            View All News
            <ArrowRight className="ml-2" size={20} />
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;