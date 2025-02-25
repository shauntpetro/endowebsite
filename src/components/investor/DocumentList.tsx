import React from 'react';
import { motion } from 'framer-motion';
import { FileText, FileImage, FileSpreadsheet, Presentation, Calendar, Download, Eye, Loader2 } from 'lucide-react';
import { useInvestorDocuments } from '../../hooks/useInvestorDocuments';

interface DocumentListProps {
  searchQuery: string;
  selectedCategory: string | null;
  selectedTags: string[];
  onPreview: (doc: any) => void;
}

const FileIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'pdf':
      return <FileText />;
    case 'image':
      return <FileImage />;
    case 'spreadsheet':
      return <FileSpreadsheet />;
    case 'presentation':
      return <Presentation />;
    default:
      return <FileText />;
  }
};

export const DocumentList = ({
  searchQuery,
  selectedCategory,
  selectedTags,
  onPreview
}: DocumentListProps) => {
  const { documents, loading, error } = useInvestorDocuments();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading documents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg inline-block">
          <p>Error loading documents. Please try again later.</p>
          <p className="text-sm mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || doc.category === selectedCategory;
    
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every(tag => doc.tags.includes(tag));
    
    return matchesSearch && matchesCategory && matchesTags;
  });

  if (filteredDocuments.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
        <p className="text-gray-600">
          {searchQuery || selectedCategory || selectedTags.length > 0 
            ? 'Try adjusting your search or filters'
            : 'No documents are available at this time'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredDocuments.map((doc) => (
        <motion.div
          key={doc.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="group p-4 rounded-lg border border-gray-200 hover:border-gold-500 hover:bg-gold-50 transition-colors duration-200"
        >
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-lg ${
              doc.file_type === 'pdf' ? 'bg-red-100 text-red-700' :
              doc.file_type === 'spreadsheet' ? 'bg-green-100 text-green-700' :
              doc.file_type === 'presentation' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              <FileIcon type={doc.file_type} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{doc.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{doc.description}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {doc.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(doc.publish_date).toLocaleDateString()}
                </span>
                <span>•</span>
                <span>{(doc.file_size / 1024).toFixed(1)} MB</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {doc.preview_url && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onPreview(doc)}
                  className="p-2 text-gray-500 hover:text-gold-600 transition-colors duration-200"
                >
                  <Eye size={20} />
                </motion.button>
              )}
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href={doc.url}
                download
                className="p-2 text-gray-500 hover:text-gold-600 transition-colors duration-200"
              >
                <Download size={20} />
              </motion.a>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};