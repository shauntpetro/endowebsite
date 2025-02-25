import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Pill, Activity, Target, ChevronRight, Microscope, ArrowRight } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';

interface Product {
  id: string;
  name: string;
  phase: string;
  description: string;
  progress: number;
  category: string;
  details: {
    features: string[];
  };
}

const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 });
  
  // Special handling for ENDO-210
  if (product.name === 'ENDO-210') {
    return (
      <motion.div
        ref={ref as any}
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: index * 0.2 }}
        className="col-span-full science-card group"
      >
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Microscope className="text-gold-600" size={24} />
                <span className="text-sm font-medium text-gold-600">{product.phase}</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 glow-on-hover">{product.name}</h3>
            </div>
            <span className="px-4 py-1 bg-lavender-100 text-lavender-800 rounded-full text-sm font-medium">
              {product.category}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Revolutionizing Imaging Detection with Unprecedented Clarity: A breakthrough MRI imaging agent enabling definitive detection of sub-millimeter endometriosis lesions that are otherwise undetectable by existing technologies.
              </p>

              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Development Progress</span>
                  <span>{product.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isVisible ? { width: `${product.progress}%` } : { width: 0 }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className="h-full bg-lavender-500"
                  />
                </div>
              </div>

              <ul className="space-y-3">
                {product.details.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: (index * 0.2) + (i * 0.1) }}
                    className="flex items-center text-gray-700"
                  >
                    <Target size={16} className="text-lavender-500 mr-2 flex-shrink-0" />
                    {feature}
                  </motion.li>
                ))}
              </ul>

              <motion.button
                whileHover={{ x: 5 }}
                className="flex items-center font-medium text-lavender-600 hover:text-lavender-700"
              >
                Learn More <ArrowRight size={16} className="ml-1" />
              </motion.button>
            </div>

            <div className="relative">
              <div className="bg-gray-900 rounded-xl p-6 shadow-xl">
                <h4 className="text-lg font-semibold text-white mb-4">Enhanced Lesion Detection</h4>
                <div className="relative aspect-[3/2] rounded-lg overflow-hidden">
                  <img
                    src="/Endo210Scan.jpg"
                    alt="ENDO-210 MRI Comparison"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex justify-between text-sm text-white/90">
                      <span>Standard MRI</span>
                      <span>ENDO-210 Enhanced</span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-300">
                  ENDO-210's revolutionary imaging technology enables clear visualization of sub-millimeter lesions, dramatically improving diagnostic accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref as any}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="science-card group"
    >
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900 glow-on-hover">{product.name}</h3>
          <span className={`px-4 py-1 ${
            product.phase === 'Therapeutics' 
              ? 'bg-gold-100 text-gold-800' 
              : 'bg-lavender-100 text-lavender-800'
          } rounded-full text-sm font-medium`}>
            {product.phase}
          </span>
        </div>
        
        <p className="text-gray-600">{product.description}</p>
        
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Development Progress</span>
            <span>{product.progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={isVisible ? { width: `${product.progress}%` } : { width: 0 }}
              transition={{ duration: 1, delay: index * 0.2 }}
              className={`h-full ${
                product.phase === 'Therapeutics'
                  ? 'bg-gold-500'
                  : 'bg-lavender-500'
              }`}
            />
          </div>
        </div>

        <ul className="space-y-3">
          {product.details.features.map((feature, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: (index * 0.2) + (i * 0.1) }}
              className="flex items-center text-gray-700"
            >
              <Target size={16} className={`${
                product.phase === 'Therapeutics'
                  ? 'text-gold-500'
                  : 'text-lavender-500'
              } mr-2 flex-shrink-0`} />
              {feature}
            </motion.li>
          ))}
        </ul>

        <motion.button
          whileHover={{ x: 5 }}
          className={`flex items-center font-medium ${
            product.phase === 'Therapeutics'
              ? 'text-gold-600 hover:text-gold-700'
              : 'text-lavender-600 hover:text-lavender-700'
          }`}
        >
          Learn More <ChevronRight size={16} className="ml-1" />
        </motion.button>
      </div>
    </motion.div>
  );
};

const ProductGroup = ({ title, products, index }: { title: string; products: Product[]; index: number }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <motion.div
      ref={ref as any}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="space-y-8"
    >
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-start">
          <span className="pr-3 bg-white text-2xl font-display font-semibold text-gray-900">
            {title}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {products.map((product, idx) => (
          <ProductCard key={product.id} product={product} index={idx} />
        ))}
      </div>
    </motion.div>
  );
};

const Products = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 0.5, 0]);

  const { data: products, loading, error } = useSupabaseQuery<Product[]>({
    query: 'SELECT * FROM products',
    transform: (data) => data as Product[],
  });
  
  if (loading) {
    return (
      <div className="py-24 bg-white bg-pattern relative">
        <div className="pattern-grid" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-4" />
              <div className="h-4 w-96 bg-gray-200 rounded mx-auto" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-24 bg-white bg-pattern relative">
        <div className="pattern-grid" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center text-red-600">
            Error loading products. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  // Group products by therapeutic area
  const endoProducts = products?.filter(p => p.name.includes('ENDO-2')) || [];
  const cancerProducts = products?.filter(p => p.name.includes('ENDO-9') || p.name.includes('ENDO-3')) || [];
  
  return (
    <div className="py-24 bg-white bg-pattern relative">
      <div className="pattern-grid" />
      <motion.div 
        style={{ opacity }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-display font-bold text-gray-900 sm:text-4xl glow-on-hover">
            Product Pipeline
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Our innovative pipeline includes both therapeutic and diagnostic solutions
            designed to address critical unmet needs in women's health and oncology.
          </p>
        </motion.div>

        <div className="space-y-16">
          <ProductGroup 
            title="Endometriosis Solutions" 
            products={endoProducts}
            index={0}
          />
          <ProductGroup 
            title="Cancer Therapeutics" 
            products={cancerProducts}
            index={1}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Products;