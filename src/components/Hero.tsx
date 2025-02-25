import React, { useCallback, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Hls from 'hls.js';

const TextGradient = React.memo(({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.span
      className={`relative inline-block ${className}`}
      whileHover={!prefersReducedMotion ? {
        scale: 1.05,
        transition: { duration: 0.2 }
      } : undefined}
    >
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-gold-400/20 via-gold-500/20 to-gold-400/20 blur-xl"
        animate={!prefersReducedMotion ? {
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.05, 1],
        } : undefined}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.span
        className="relative bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 bg-clip-text text-transparent"
        animate={!prefersReducedMotion ? {
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        } : undefined}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
});

TextGradient.displayName = 'TextGradient';

const BackgroundVideo = React.memo(() => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const videoSrc = "https://customer-quidvk8te4yje3fo.cloudflarestream.com/1997b116ac854e3d190daffa06257ce1/manifest/video.m3u8";

    // Function to initialize HLS
    const initializeHls = () => {
      if (Hls.isSupported()) {
        hlsRef.current = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hlsRef.current.loadSource(videoSrc);
        hlsRef.current.attachMedia(video);
        hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(error => {
            console.warn("Auto-play failed:", error);
          });
        });
      }
      // For browsers that natively support HLS
      else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoSrc;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(error => {
            console.warn("Auto-play failed:", error);
          });
        });
      }
    };

    // Initialize playback
    initializeHls();

    // Cleanup
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full">
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80"
      >
        <img
          src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80"
          alt="Laboratory Research"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
    </div>
  );
});

BackgroundVideo.displayName = 'BackgroundVideo';

const Hero = () => {
  const prefersReducedMotion = useReducedMotion();
  
  const handleLearnMoreClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleContactClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <BackgroundVideo />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={!prefersReducedMotion ? { opacity: 0, y: 20 } : undefined}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white mb-12"
            initial={!prefersReducedMotion ? { opacity: 0, y: 20 } : undefined}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.span
              initial={!prefersReducedMotion ? { opacity: 0, y: 20 } : undefined}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative inline-block"
            >
              Revolutionizing{" "}
              <motion.span
                className="relative inline-block"
                whileHover={!prefersReducedMotion ? {
                  scale: 1.05,
                  transition: { duration: 0.2 }
                } : undefined}
              >
                <motion.span
                  className="absolute -inset-1 bg-gradient-to-r from-lavender-400/20 via-lavender-500/20 to-lavender-400/20 blur-xl rounded-lg"
                  animate={!prefersReducedMotion ? {
                    opacity: [0.5, 0.8, 0.5],
                    scale: [1, 1.1, 1],
                  } : undefined}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <span className="relative">Women's Health</span>
              </motion.span>{" "}
              & Oncology
            </motion.span>
            <motion.div 
              className="block mt-4"
              initial={!prefersReducedMotion ? { opacity: 0, y: 20 } : undefined}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              with{" "}
              <TextGradient>Non-Hormonal</TextGradient>,{" "}
              <TextGradient>Curative</TextGradient>{" "}
              Therapies
            </motion.div>
          </motion.h1>
          <motion.p 
            className="mt-16 text-xl text-gray-200 mb-12"
            initial={!prefersReducedMotion ? { opacity: 0, y: 20 } : undefined}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.span
              className="relative inline-block"
              whileHover={!prefersReducedMotion ? {
                scale: 1.02,
                transition: { duration: 0.2 }
              } : undefined}
            >
              Pioneering{" "}
              <span className="text-gold-400">AI-driven diagnostics</span>
              {" "}and{" "}
              <span className="text-lavender-400">innovative treatments</span>
              {" "}to eliminate disease at its root cause.
            </motion.span>
          </motion.p>
          
          <motion.div 
            className="mt-16 flex flex-col sm:flex-row justify-center gap-3"
            initial={!prefersReducedMotion ? { opacity: 0, y: 20 } : undefined}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <motion.a
              whileHover={!prefersReducedMotion ? { scale: 1.05 } : undefined}
              whileTap={!prefersReducedMotion ? { scale: 0.95 } : undefined}
              href="#about"
              onClick={handleLearnMoreClick}
              className="btn-primary group"
            >
              Learn More 
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
            </motion.a>
            <motion.a
              whileHover={!prefersReducedMotion ? { scale: 1.05 } : undefined}
              whileTap={!prefersReducedMotion ? { scale: 0.95 } : undefined}
              href="#contact"
              onClick={handleContactClick}
              className="btn-secondary"
            >
              Contact Us
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={!prefersReducedMotion ? {
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          } : undefined}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -right-40 -top-40 w-96 h-96 bg-lavender-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={!prefersReducedMotion ? {
            rotate: [360, 0],
            scale: [1, 1.3, 1],
          } : undefined}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -left-40 -bottom-40 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl"
        />
      </div>
    </div>
  );
};

export default React.memo(Hero);