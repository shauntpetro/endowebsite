import React from 'react';
import { motion } from 'framer-motion';
import { Microscope, Heart, Brain } from 'lucide-react';

const features = [
  {
    icon: Microscope,
    title: 'Innovative Research',
    description: 'Pioneering non-hormonal therapeutic solutions through cutting-edge molecular research and AI-driven discovery.'
  },
  {
    icon: Heart,
    title: 'Patient-Centric',
    description: 'Dedicated to developing treatments that address the root cause while prioritizing patient well-being and quality of life.'
  },
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'Leveraging advanced artificial intelligence to accelerate drug discovery and optimize treatment outcomes.'
  }
];

const About = () => {
  return (
    <div className="py-12 bg-white bg-pattern relative">
      <div className="pattern-grid" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-display font-bold text-gray-900 sm:text-4xl glow-on-hover">
            Transforming Women's Health Through Innovation
          </h2>
          <p className="mt-3 text-xl text-gray-600 max-w-3xl mx-auto">
            EndoCyclic Therapeutics is at the forefront of developing revolutionary treatments
            for endometriosis and other women's health conditions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative p-6 blur-card rounded-xl hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute -top-3 left-6">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gold-100 text-gold-600">
                  <feature.icon size={20} />
                </div>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900 glow-on-hover">{feature.title}</h3>
              <p className="mt-3 text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;