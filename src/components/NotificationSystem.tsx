import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, ExternalLink } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  link?: string;
  date: string;
}

const notifications: Notification[] = [
  {
    id: '1',
    title: 'Phase II Trial Update',
    message: 'EC-101 shows promising results in latest clinical trials',
    type: 'success',
    link: '#news',
    date: '2 hours ago'
  },
  {
    id: '2',
    title: 'Investor Conference',
    message: 'Join our Q1 2024 Earnings Call on April 15th',
    type: 'info',
    link: '#contact',
    date: '1 day ago'
  }
];

const NotificationSystem = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(notifications.length);
  const [activeNotifications, setActiveNotifications] = useState(notifications);

  const dismissNotification = (id: string) => {
    setActiveNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const notificationVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      transition: { duration: 0.2 }
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-8 z-40 bg-white text-gold-600 px-4 py-3 rounded-full shadow-lg hover:bg-gold-50 transition-colors duration-300 flex items-center space-x-2 border border-gold-200"
      >
        <div className="relative">
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-500 text-white text-xs flex items-center justify-center rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <span className="text-gray-900 font-medium">Updates</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-24 left-8 w-96 bg-white rounded-xl shadow-xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Updates</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {activeNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      variants={notificationVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="p-4 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-900">
                            {notification.title}
                          </h4>
                          <p className="mt-1 text-sm text-gray-600">
                            {notification.message}
                          </p>
                          <div className="mt-2 flex items-center gap-4">
                            <span className="text-xs text-gray-500">
                              {notification.date}
                            </span>
                            {notification.link && (
                              <a
                                href={notification.link}
                                className="text-xs text-gold-600 hover:text-gold-700 flex items-center gap-1"
                                onClick={() => {
                                  setIsOpen(false);
                                  dismissNotification(notification.id);
                                }}
                              >
                                View Details
                                <ExternalLink size={12} />
                              </a>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => dismissNotification(notification.id)}
                          className="text-gray-400 hover:text-gray-600 p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  {activeNotifications.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-8 text-center text-gray-500"
                    >
                      <Bell size={24} className="mx-auto mb-2 text-gray-400" />
                      <p>No new notifications</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationSystem;