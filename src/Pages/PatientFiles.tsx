import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FaUser, FaFileAlt, FaUpload, FaSpinner,
  FaSearch, FaDownload, FaTrash, FaEye
} from 'react-icons/fa';
import axiosInstance from '../Helper/axiosInstance';
import Layout from '@/Layout/Layout';
import { toast } from 'react-hot-toast';

interface Patient {
  _id: string;
  fullName: string;
  userId: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
}

interface PatientFile {
  _id: string;
  patientId: string;
  title: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  fileUrl: string;
  description?: string;
}

const PatientFiles: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [files, setFiles] = useState<PatientFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileDescription, setFileDescription] = useState('');

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
  // /dental-records
  // Fetch patient files when a patient is selected
  useEffect(() => {
    const fetchPatientFiles = async () => {
      if (!selectedPatient) return;
      // console.log("selectedPatient", selectedPatient);
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/dental-records/${selectedPatient.userId}`);
        console.log("response", response);
        if (response.data.success) {
          setFiles(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching patient files:', error);
        toast.error('Failed to load patient files');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientFiles();
  }, [selectedPatient]);

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient =>
    patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format file size
  // const formatFileSize = (bytes: number) => {
  //   if (bytes === 0) return '0 Bytes';
  //   const k = 1024;
  //   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  //   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  // };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedPatient || !event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', fileDescription);

    try {
      setUploading(true);
      const response = await axiosInstance.post(
        `/patients/${selectedPatient._id}/files/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        toast.success('File uploaded successfully');
        // Refresh the file list
        const filesResponse = await axiosInstance.get(`/patients/${selectedPatient._id}/files`);
        if (filesResponse.data.success) {
          setFiles(filesResponse.data.data);
        }
        setFileDescription('');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  // Handle file deletion
  const handleDeleteFile = async (fileId: string) => {
    if (!selectedPatient) return;

    try {
      const response = await axiosInstance.delete(
        `/patients/${selectedPatient._id}/files/${fileId}`
      );

      if (response.data.success) {
        toast.success('File deleted successfully');
        setFiles(files.filter(file => file._id !== fileId));
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
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
            <p className="text-gray-600 mt-2">Manage and organize patient documents</p>
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
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
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
                          <div className="ml-3">
                            <h3 className="font-medium text-gray-800">
                              {patient.fullName}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {patient.email}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>

            {/* Files Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {!selectedPatient ? (
                  <div className="p-8 text-center">
                    <FaFileAlt className="text-gray-300 text-5xl mx-auto mb-4" />
                    <p className="text-gray-500">Select a patient to view their files</p>
                  </div>
                ) : (
                  <>
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-800">
                            {selectedPatient.fullName}'s Files
                          </h2>
                          <p className="text-gray-600 mt-1">
                            {files.length} document{files.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileUpload}
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                          >
                            {uploading ? (
                              <FaSpinner className="animate-spin mr-2" />
                            ) : (
                              <FaUpload className="mr-2" />
                            )}
                            Upload File
                          </button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <input
                          type="text"
                          placeholder="File description (optional)"
                          value={fileDescription}
                          onChange={(e) => setFileDescription(e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="space-y-4">
                        {loading ? (
                          <div className="flex items-center justify-center p-8">
                            <FaSpinner className="animate-spin text-blue-500 text-2xl" />
                          </div>
                        ) : files.length === 0 ? (
                          <div className="text-center text-gray-500">
                            No files uploaded yet
                          </div>
                        ) : (
                          files.map((file) => (
                            <motion.div
                              key={file._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-4 border rounded-lg hover:border-blue-200 transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-center">
                                  <div className="p-2 bg-blue-100 rounded-lg">
                                    <FaFileAlt className="text-blue-500" />
                                  </div>
                                  <div className="ml-3">
                                    <h4 className="font-medium text-gray-800">
                                      {file.title}
                                    </h4>
                                    <div className="flex items-center text-sm text-gray-500 mt-1">
                                      {/* <span>{formatFileSize(file.fileSize)}</span> */}
                                      {/* <span className="mx-2">•</span> */}
                                      <span>{formatDate(file.uploadDate)}</span>
                                    </div>
                                    {file.description && (
                                      <p className="text-sm text-gray-600 mt-2">
                                        {file.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => window.open(file.fileUrl, '_blank')}
                                    className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                                    title="View"
                                  >
                                    <FaEye />
                                  </button>
                                  <button
                                    onClick={() => {
                                      const link = document.createElement('a');
                                      link.href = file.fileUrl;
                                      link.download = file.title;
                                      link.click();
                                    }}
                                    className="p-2 text-gray-500 hover:text-green-500 transition-colors"
                                    title="Download"
                                  >
                                    <FaDownload />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteFile(file._id)}
                                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                    title="Delete"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientFiles; 