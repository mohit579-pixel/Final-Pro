import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, FaUpload, FaFile, FaFilePdf, FaFileImage, 
  FaFileAlt, FaSpinner, FaSearch, FaTrash 
} from 'react-icons/fa';
import axiosInstance from '../Helper/axiosInstance';
import Layout from '@/Layout/Layout';
import { toast } from 'react-hot-toast';

interface Patient {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  age?: number;
  gender?: string;
  documents: Document[];
}

interface Document {
  _id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

const ViewPatientFiles: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axiosInstance.get('/patients');
        if (response.data.success) {
          setPatients(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast.error('Failed to load patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Handle file upload
  const handleFileUpload = async (files: FileList) => {
    if (!selectedPatient) return;

    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });
    formData.append('patientId', selectedPatient._id);

    try {
      const response = await axiosInstance.post('/patients/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success('Documents uploaded successfully');
        // Refresh patient documents
        const updatedPatient = await axiosInstance.get(`/patients/${selectedPatient._id}`);
        setSelectedPatient(updatedPatient.data.data);
      }
    } catch (error) {
      console.error('Error uploading documents:', error);
      toast.error('Failed to upload documents');
    } finally {
      setUploading(false);
      setShowUploadModal(false);
    }
  };

  // Handle document deletion
  const handleDeleteDocument = async (documentId: string) => {
    if (!selectedPatient) return;

    try {
      await axiosInstance.delete(`/patients/documents/${documentId}`);
      toast.success('Document deleted successfully');
      // Refresh patient documents
      const updatedPatient = await axiosInstance.get(`/patients/${selectedPatient._id}`);
      setSelectedPatient(updatedPatient.data.data);
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient =>
    patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get file icon based on type
  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FaFilePdf className="text-red-500" />;
    if (type.includes('image')) return <FaFileImage className="text-blue-500" />;
    return <FaFileAlt className="text-gray-500" />;
  };

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
            <h1 className="text-3xl font-bold text-gray-800">Patient Files</h1>
            <p className="text-gray-600 mt-2">View and manage patient documents</p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Patient List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Patients ({filteredPatients.length})
                  </h2>
                </div>
                <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center p-8">
                      <FaSpinner className="animate-spin text-blue-500 text-2xl" />
                    </div>
                  ) : filteredPatients.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No patients found
                    </div>
                  ) : (
                    filteredPatients.map((patient) => (
                      <motion.div
                        key={patient._id}
                        whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                        className={`p-4 cursor-pointer transition-colors ${
                          selectedPatient?._id === patient._id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FaUser className="text-blue-500" />
                          </div>
                          <div className="ml-4">
                            <h3 className="font-medium text-gray-800">{patient.fullName}</h3>
                            <p className="text-sm text-gray-500">{patient.email}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>

            {/* Documents Display */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {selectedPatient ? `${selectedPatient.fullName}'s Documents` : 'Select a Patient'}
                  </h2>
                  {selectedPatient && (
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                    >
                      <FaUpload className="mr-2" />
                      Upload Documents
                    </button>
                  )}
                </div>
                <div className="p-6">
                  {!selectedPatient ? (
                    <div className="text-center py-12">
                      <FaFile className="text-gray-300 text-5xl mx-auto mb-4" />
                      <p className="text-gray-500">Select a patient to view their documents</p>
                    </div>
                  ) : selectedPatient.documents?.length === 0 ? (
                    <div className="text-center py-12">
                      <FaFile className="text-gray-300 text-5xl mx-auto mb-4" />
                      <p className="text-gray-500">No documents uploaded yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedPatient.documents?.map((doc) => (
                        <motion.div
                          key={doc._id}
                          whileHover={{ y: -2, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                          className="p-4 border rounded-lg"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center">
                              {getFileIcon(doc.type)}
                              <div className="ml-3">
                                <p className="font-medium text-gray-800">{doc.name}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(doc.uploadedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => window.open(doc.url, '_blank')}
                                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleDeleteDocument(doc._id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
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
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white rounded-xl p-6 max-w-md w-full"
              >
                <h3 className="text-xl font-semibold mb-4">Upload Documents</h3>
                <input
                  type="file"
                  multiple
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  className="w-full mb-4"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {}}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FaUpload className="mr-2" />
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

export default ViewPatientFiles; 