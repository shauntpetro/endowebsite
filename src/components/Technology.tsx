import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Cpu, Database, Network, ArrowRight, Zap, Target, Shield } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import ScientificDiagrams from './ScientificDiagrams';

const technologies = [
  {
    icon: Cpu,
    title: 'AI-Driven Discovery',
    description: 'Our proprietary AI platform analyzes vast molecular datasets to identify novel therapeutic targets and optimize drug candidates.',
    stats: {
      label: 'Data Points Analyzed',
      value: '500M+',
      plus: true
    },
    features: [
      'Deep learning algorithms',
      'Molecular pathway analysis',
      'Target validation'
    ]
  },
  {
    icon: Database,
    title: 'Biomarker Platform',
    description: 'Comprehensive collection of disease-specific biomarkers enabling precise patient stratification and treatment monitoring.',
    stats: {
      label: 'Prediction Accuracy',
      value: '95',
      suffix: '%'
    },
    features: [
      'Real-time monitoring',
      'Patient stratification',
      'Treatment response'
    ]
  },
  {
    icon: Network,
    title: 'Network Biology',
    description: 'Advanced network biology approaches to understand disease mechanisms and identify optimal intervention points.',
    stats: {
      label: 'Novel Targets',
      value: '50',
      plus: true
    },
    features: [
      'Pathway mapping',
      'Drug-target interactions',
      'Systems biology'
    ]
  }
];

const TechnologyCard = ({ tech, index }: { tech: typeof technologies[0], index: number }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 });

  return (
    <motion.div
      ref={ref as any}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="science-card group"
    >
      <div className="p-8 space-y-6">
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg"
          >
            <tech.icon size={24} className="text-white" />
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-900 glow-on-hover">{tech.title}</h3>
        </div>

        <p className="text-gray-600">{tech.description}</p>

        <div className="bg-gradient-to-br from-lavender-50 to-white rounded-lg p-6 transform transition-transform duration-300 group-hover:scale-[1.02]">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={isVisible ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-3xl font-bold bg-gradient-to-r from-gold-500 to-gold-600 bg-clip-text text-transparent"
            >
              {tech.stats.value}
              {tech.stats.plus && '+'}
              {tech.stats.suffix}
            </motion.div>
            <div className="text-sm text-gray-600 mt-2">{tech.stats.label}</div>
          </div>
        </div>

        <ul className="space-y-3">
          {tech.features.map((feature, i) => (
            <motion.li
              key={feature}
              initial={{ opacity: 0, x: -20 }}
              animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-3 text-gray-700"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
              {feature}
            </motion.li>
          ))}
        </ul>

        <motion.button
          whileHover={{ x: 5 }}
          className="flex items-center text-gold-600 font-medium hover:text-gold-700 group"
        >
          Learn More 
          <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
        </motion.button>
      </div>
    </motion.div>
  );
};

const MechanismCard = ({ 
  icon: Icon, 
  title, 
  description, 
  features 
}: { 
  icon: typeof Zap;
  title: string;
  description: string;
  features: string[];
}) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 });

  return (
    <motion.div
      ref={ref as any}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      className="science-card p-8"
    >
      <div className="flex items-center gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg"
        >
          <Icon size={24} className="text-white" />
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-900 glow-on-hover">{title}</h3>
      </div>

      <p className="text-gray-600 mb-8">{description}</p>

      <ul className="space-y-4">
        {features.map((feature, index) => (
          <motion.li
            key={feature}
            initial={{ opacity: 0, x: -20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            className="flex items-start gap-4"
          >
            <div className="mt-1.5 w-2 h-2 rounded-full bg-gold-500 flex-shrink-0" />
            <span className="text-gray-700 flex-1">{feature}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

const Technology = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 0.5, 0]);

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
          <h2 className="text-3xl font-display font-bold text-gray-900 sm:text-4xl glow-on-hover mb-6">
            Our Technology Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Combining advanced AI algorithms with molecular biology to revolutionize
            drug discovery and development in women's health.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          {technologies.map((tech, index) => (
            <TechnologyCard key={tech.title} tech={tech} index={index} />
          ))}
        </div>

        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h3 className="text-2xl font-display font-bold text-gray-900 glow-on-hover mb-4">
              Dual-Mode Therapeutic Mechanism
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our innovative approach combines pH-sensitive activation with targeted binding,
              ensuring therapeutic efficacy while minimizing side effects.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <MechanismCard
              icon={Zap}
              title="pH-Sensitive Activation"
              description="Smart peptides that activate specifically in the acidic environment of diseased tissue while remaining inactive in healthy areas."
              features={[
                "Selective activation in acidic disease microenvironment (pH < 6.0)",
                "Remains inactive at physiological pH (7.4) in healthy tissue",
                "Enhanced therapeutic window and reduced systemic effects",
                "Real-time response to local conditions"
              ]}
            />

            <MechanismCard
              icon={Target}
              title="Targeted Binding"
              description="Precision-engineered peptides that specifically bind to disease-relevant targets, maximizing therapeutic impact."
              features={[
                "High-affinity binding to disease-specific molecular targets",
                "Non-hormonal mechanism of action",
                "Validated through AI-driven target discovery",
                "Optimized for minimal off-target effects"
              ]}
            />
          </div>
        </div>

        <ScientificDiagrams />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              title: 'Enhanced Safety',
              description: 'Dual-mode selectivity minimizes impact on healthy tissue'
            },
            {
              icon: Target,
              title: 'Precise Targeting',
              description: 'Specific activation in disease microenvironment'
            },
            {
              icon: Zap,
              title: 'Rapid Response',
              description: 'Dynamic adaptation to local tissue conditions'
            }
          ].map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="glass-card rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <benefit.icon className="w-5 h-5 text-gold-600" />
                <h4 className="text-lg font-semibold text-gray-900">{benefit.title}</h4>
              </div>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Technology;