import React from 'react';
import { motion } from 'framer-motion';
import { Award, FileText, FlaskRound as Flask, Microscope, Star } from 'lucide-react';

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: string;
}

const events: TimelineEvent[] = [
  {
    date: 'March 2024',
    title: 'FDA Fast Track Designation',
    description: 'EC-101 receives Fast Track designation for endometriosis treatment',
    icon: Award,
    category: 'Regulatory'
  },
  {
    date: 'January 2024',
    title: 'Phase II Trial Initiation',
    description: 'Commenced Phase II clinical trials for EC-101',
    icon: Flask,
    category: 'Clinical'
  },
  {
    date: 'November 2023',
    title: 'Research Publication',
    description: 'Groundbreaking research published in Nature Biotechnology',
    icon: FileText,
    category: 'Research'
  },
  {
    date: 'September 2023',
    title: 'Strategic Partnership',
    description: 'Partnership with leading research institutions announced',
    icon: Microscope,
    category: 'Business'
  },
  {
    date: 'June 2023',
    title: 'Company Foundation',
    description: 'EndoCyclic Therapeutics founded with Series A funding',
    icon: Star,
    category: 'Company'
  }
];

const CompanyTimeline = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-lavender-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-display font-bold text-gray-900 sm:text-4xl">
            Our Journey
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Milestones in our mission to revolutionize women's health
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-gold-500 to-lavender-500" />

          <div className="space-y-16">
            {events.map((event, index) => (
              <motion.div
                key={event.date}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'justify-start' : 'justify-end'
                }`}
              >
                {/* Content */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`w-5/12 ${
                    index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'
                  }`}
                >
                  <span className="text-sm font-medium text-gold-600">
                    {event.date}
                  </span>
                  <h3 className="mt-2 text-xl font-semibold text-gray-900">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-gray-600">{event.description}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600 shadow-sm">
                    {event.category}
                  </span>
                </motion.div>

                {/* Icon */}
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-gold-500"
                  >
                    <event.icon className="w-6 h-6 text-gold-600" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyTimeline;