import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
  FaUpload,
  FaFileAlt,
  FaTrash,
  FaDownload,
  FaSpinner,
  FaSearch
} from 'react-icons/fa';
import Layout from '@/Layout/Layout';
import axiosInstance from '../Helper/axiosInstance';

interface DentalRecord {
  _id: string;
  patientId: string;
  title: string;
  description: string;
  fileType: 'xray' | 'image' | 'document';
  fileUrl: string;
  uploadDate: string;
  tags: string[];
}

interface RootState {
  auth: {
    data: {
      _id: string;
      role: string;
    };
  };
}

const DentalRecords: React.FC = () => {
  const [records, setRecords] = useState<DentalRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'xray' | 'image' | 'document'>('all');
  const [recordTitle, setRecordTitle] = useState('');
  const [recordDescription, setRecordDescription] = useState('');
  const [recordTags, setRecordTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const user = useSelector((state: RootState) => state.auth.data);

  // Fetch records
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/dental-records/${user._id}`);
      if (response.data.success) {
        setRecords(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      toast.error('Failed to load dental records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchRecords();
    }
  }, [user?._id]);

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload an image or PDF.');
        return;
      }
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File size too large. Maximum size is 50MB.');
        return;
      }
      setSelectedFile(file);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile || !recordTitle) {
      toast.error('Please select a file and provide a title');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', recordTitle);
      formData.append('description', recordDescription);
      formData.append('tags', JSON.stringify(recordTags));
      formData.append('patientId', user._id);
      formData.append('fileType', selectedFile.type.includes('image') ? 'image' : 'document');

      const response = await axiosInstance.post('/dental-records/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('File uploaded successfully');
        setShowUploadModal(false);
        setSelectedFile(null);
        setRecordTitle('');
        setRecordDescription('');
        setRecordTags([]);
        fetchRecords();
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  // Handle record deletion
  const handleDelete = async (recordId: string) => {
    if (!window.confirm('Are you sure you want to delete this record?')) {
      return;
    }

    try {
      const response = await axiosInstance.delete(`/dental-records/${recordId}`);
      if (response.data.success) {
        toast.success('Record deleted successfully');
        fetchRecords();
      }
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Failed to delete record');
    }
  };

  // Filter records based on search term and type
  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || record.fileType === filterType;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-800">Dental Records</h1>
            <p className="text-gray-600 mt-2">Manage your dental X-rays, images, and documents</p>
          </motion.div>

          {/* Actions Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as 'all' | 'xray' | 'image' | 'document')}
                  className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="xray">X-rays</option>
                  <option value="image">Images</option>
                  <option value="document">Documents</option>
                </select>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <FaUpload />
                  Upload New
                </button>
              </div>
            </div>
          </motion.div>

          {/* Records Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="animate-spin text-blue-600 text-4xl" />
            </div>
          ) : filteredRecords.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FaFileAlt className="mx-auto text-gray-400 text-5xl mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No records found</h3>
              <p className="text-gray-500">Upload your first dental record to get started</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecords.map((record) => (
                <motion.div
                  key={record._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="relative aspect-video bg-gray-100">
                    {record.fileType === 'document' ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FaFileAlt className="text-4xl text-gray-400" />
                      </div>
                    ) : (
                      <img
                        src={record.fileUrl}
                        alt={record.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">{record.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {record.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{new Date(record.uploadDate).toLocaleDateString()}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.open(record.fileUrl, '_blank')}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <FaDownload />
                        </button>
                        <button
                          onClick={() => handleDelete(record._id)}
                          className="p-2 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Upload Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-xl p-6 max-w-lg w-full"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Dental Record</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={recordTitle}
                      onChange={(e) => setRecordTitle(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter record title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={recordDescription}
                      onChange={(e) => setRecordDescription(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter record description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {recordTags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
                        >
                          {tag}
                          <button
                            onClick={() => setRecordTags(recordTags.filter((_, i) => i !== index))}
                            className="hover:text-blue-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newTag.trim()) {
                            setRecordTags([...recordTags, newTag.trim()]);
                            setNewTag('');
                          }
                        }}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add tags"
                      />
                      <button
                        onClick={() => {
                          if (newTag.trim()) {
                            setRecordTags([...recordTags, newTag.trim()]);
                            setNewTag('');
                          }
                        }}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                        accept="image/*,.pdf"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <FaUpload className="text-3xl text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          Supported formats: JPEG, PNG, WEBP, PDF
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={uploading || !selectedFile}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaUpload />
                        Upload
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default DentalRecords; 