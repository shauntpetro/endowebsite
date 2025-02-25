import React from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

export const ProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Transform scrollYProgress to control opacity and y position
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const translateY = useTransform(scrollYProgress, [0, 0.1], [-20, 0]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-12 pointer-events-none z-50"
      style={{ opacity, y: translateY }}
    >
      <div className="absolute left-1/2 -translate-x-1/2 top-4 w-[96%] max-w-[1200px] h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
        <motion.div
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full"
          style={{ scaleX, transformOrigin: '0%' }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-gold-500 rounded-full shadow-lg shadow-gold-500/30">
            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};