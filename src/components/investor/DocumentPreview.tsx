import React from 'react';
import { motion } from 'framer-motion';
import { X, Download } from 'lucide-react';

interface DocumentPreviewProps {
  document: {
    title: string;
    preview_url?: string;
    url: string;
  };
  onClose: () => void;
}

export const DocumentPreview = ({ document, onClose }: DocumentPreviewProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-4xl bg-white rounded-xl overflow-hidden"
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{document.title}</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        {document.preview_url && (
          <div className="relative aspect-video">
            <img
              src={document.preview_url}
              alt={document.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-4 bg-gray-50 flex justify-end">
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={document.url}
            download
            className="flex items-center gap-2 px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700"
          >
            <Download size={18} />
            Download Full Document
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
};