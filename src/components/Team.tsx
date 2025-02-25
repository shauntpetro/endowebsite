import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Mail } from 'lucide-react';
import { useSupabaseQuery } from '../hooks/useSupabaseQuery';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  linkedin_url?: string;
  email?: string;
  order_index: number;
}

const TeamMemberCard = ({ member, index }: { member: TeamMember; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="aspect-w-1 aspect-h-1 relative overflow-hidden">
        <img
          src={member.image_url}
          alt={member.name}
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 w-full flex justify-end gap-2">
            {member.linkedin_url && (
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href={member.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-200"
              >
                <Linkedin size={18} />
              </motion.a>
            )}
            {member.email && (
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href={`mailto:${member.email}`}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-200"
              >
                <Mail size={18} />
              </motion.a>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
        <p className="text-gold-600 text-sm font-medium mb-2">{member.role}</p>
        <p className="text-gray-600 text-sm">{member.bio}</p>
      </div>
    </motion.div>
  );
};

const Team = () => {
  const { data: teamMembers, loading, error } = useSupabaseQuery<TeamMember[]>({
    query: 'SELECT * FROM team_members ORDER BY order_index ASC',
    transform: (data) => data as TeamMember[],
  });

  if (loading) {
    return (
      <section className="py-24 bg-white bg-pattern relative">
        <div className="pattern-grid" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-4" />
              <div className="h-4 w-96 bg-gray-200 rounded mx-auto" />
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-xl h-64" />
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
            Error loading team members. Please try again later.
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
            Our Leadership Team
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Experienced leaders dedicated to transforming women's health through innovation
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers?.map((member, index) => (
            <TeamMemberCard key={member.id} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;