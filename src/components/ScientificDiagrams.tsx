import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Zap, ArrowRight, Microscope, Shield } from 'lucide-react';

const generateRandomPositions = (count: number, radius: number = 35) => {
  const positions = [];
  for (let i = 0; i < count; i++) {
    // Random angle and distance from center
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * radius;
    
    // Convert to cartesian coordinates
    const x = 50 + distance * Math.cos(angle);
    const y = 50 + distance * Math.sin(angle);
    
    // Add random wiggle offset
    const wiggleX = Math.random() * 10 - 5;
    const wiggleY = Math.random() * 10 - 5;
    
    positions.push({ 
      x, 
      y,
      wiggleX,
      wiggleY,
      delay: Math.random() * 2 // Random delay for staggered animation
    });
  }
  return positions;
};

const ScientificDiagrams = () => {
  const [activeState, setActiveState] = useState<'normal' | 'lesion'>('normal');
  const [showDetails, setShowDetails] = useState(false);
  const [particlePositions, setParticlePositions] = useState<Array<{x: number, y: number, wiggleX: number, wiggleY: number, delay: number}>>([]);

  useEffect(() => {
    setParticlePositions(generateRandomPositions(12));
  }, []);

  const particleVariants = {
    normal: (custom: number) => ({
      scale: 1,
      opacity: 0.3,
      x: [0, custom % 2 === 0 ? 3 : -3, 0],
      y: [0, custom % 3 === 0 ? 3 : -3, 0],
      transition: {
        opacity: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        },
        x: {
          duration: 3 + Math.random(),
          repeat: Infinity,
          repeatType: "reverse"
        },
        y: {
          duration: 3 + Math.random(),
          repeat: Infinity,
          repeatType: "reverse"
        }
      }
    }),
    lesion: (custom: number) => ({
      scale: [1, 1.2, 1],
      opacity: [0.3, 1, 0.3],
      x: [0, custom % 2 === 0 ? 5 : -5, 0],
      y: [0, custom % 3 === 0 ? 5 : -5, 0],
      transition: {
        opacity: {
          duration: 2,
          repeat: Infinity
        },
        scale: {
          duration: 2,
          repeat: Infinity
        },
        x: {
          duration: 2 + Math.random(),
          repeat: Infinity,
          repeatType: "reverse"
        },
        y: {
          duration: 2 + Math.random(),
          repeat: Infinity,
          repeatType: "reverse"
        }
      }
    })
  };

  const containerVariants = {
    normal: {
      backgroundColor: '#f0fdf4',
      transition: { duration: 0.5 }
    },
    lesion: {
      backgroundColor: '#fef2f2',
      transition: { duration: 0.5 }
    }
  };

  const peptideVariants = {
    normal: {
      scale: [1, 1.05, 1],
      rotate: [-1, 1, -1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    lesion: {
      scale: [1, 1.15, 1],
      rotate: [-2, 2, -2],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

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
          <h2 className="text-3xl font-display font-bold text-gray-900 sm:text-4xl mb-6">
            pH-Sensitive Peptide Technology
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our innovative peptides selectively activate in diseased tissue while remaining
            inactive in healthy cells.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="relative">
            <div className="flex justify-center gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveState('normal');
                  setParticlePositions(generateRandomPositions(12));
                }}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeState === 'normal'
                    ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-200 shadow-lg shadow-emerald-100'
                    : 'bg-white/90 text-gray-600 border-2 border-gray-200 hover:bg-emerald-50/80 hover:border-emerald-200/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Normal Tissue</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">pH 7.4</div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveState('lesion');
                  setParticlePositions(generateRandomPositions(12));
                }}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeState === 'lesion'
                    ? 'bg-red-50 text-red-700 border-2 border-red-200 shadow-lg shadow-red-100'
                    : 'bg-white/90 text-gray-600 border-2 border-gray-200 hover:bg-red-50/80 hover:border-red-200/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>Lesion Tissue</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">pH {'<'} 6.0</div>
              </motion.button>
            </div>

            <div className="aspect-square relative">
              <motion.div
                className={`absolute inset-0 rounded-full ${
                  activeState === 'normal' 
                    ? 'border-4 border-emerald-400/50' 
                    : 'border-4 border-red-400/50'
                }`}
                variants={containerVariants}
                animate={activeState}
              >
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  variants={peptideVariants}
                  animate={activeState}
                >
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center backdrop-blur-sm ${
                    activeState === 'normal'
                      ? 'bg-yellow-100/90 border-2 border-emerald-400'
                      : 'bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/50'
                  }`}>
                    <span className={`text-3xl font-bold ${
                      activeState === 'normal' ? 'text-emerald-700' : 'text-white'
                    }`}>
                      {activeState === 'normal' ? 'R' : 'RH+'}
                    </span>
                  </div>
                </motion.div>

                {particlePositions.map((pos, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-8 h-8 rounded-full ${
                      activeState === 'normal'
                        ? 'bg-emerald-200/80'
                        : 'bg-red-300/80'
                    }`}
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                    }}
                    variants={particleVariants}
                    animate={activeState}
                    custom={i}
                  >
                    {activeState === 'lesion' && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute -top-2 -right-2 text-sm font-bold text-red-500"
                      >
                        H+
                      </motion.span>
                    )}
                  </motion.div>
                ))}

                <motion.div 
                  className="absolute top-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md"
                  initial={false}
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <span className={`text-sm font-medium ${
                    activeState === 'normal' ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                    pH {activeState === 'normal' ? '7.4' : '< 6.0'}
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </div>

          <div className="space-y-8">
            <motion.div
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  activeState === 'normal' 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'bg-red-50 text-red-600'
                }`}>
                  {activeState === 'normal' ? <Shield size={24} /> : <Target size={24} />}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {activeState === 'normal' ? 'Inactive State' : 'Active State'}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {activeState === 'normal'
                      ? 'In normal tissue, our peptides remain inactive due to neutral pH, preventing any therapeutic activity and ensuring safety.'
                      : 'In acidic lesion tissue, peptides become activated, enabling targeted therapeutic effects while sparing healthy cells.'}
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowDetails(!showDetails)}
                className="mt-6 w-full flex items-center justify-between px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors duration-300"
              >
                <span className="font-medium">Technical Details</span>
                <ArrowRight 
                  className={`transform transition-transform duration-300 ${
                    showDetails ? 'rotate-90' : ''
                  }`} 
                  size={18} 
                />
              </motion.button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 space-y-6">
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                          <Microscope size={20} className="text-gold-500" />
                          Key Features
                        </h4>
                        <ul className="space-y-3">
                          <li className="flex items-center gap-3 text-gray-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                            Selective activation in diseased tissue
                          </li>
                          <li className="flex items-center gap-3 text-gray-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                            Non-hormonal mechanism of action
                          </li>
                          <li className="flex items-center gap-3 text-gray-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                            Rapid response to pH changes
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                          <Target size={20} className="text-gold-500" />
                          Mechanism
                        </h4>
                        <ul className="space-y-3">
                          <li className="flex items-center gap-3 text-gray-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                            Cell-penetrating peptide design
                          </li>
                          <li className="flex items-center gap-3 text-gray-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                            pH-sensitive activation mechanism
                          </li>
                          <li className="flex items-center gap-3 text-gray-700">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                            Targeted intracellular binding
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScientificDiagrams;