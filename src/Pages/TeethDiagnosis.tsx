import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { teethData, commonDentalConditions } from '../data/teethData';
import { FaSave, FaTimesCircle, FaArrowRight, FaArrowLeft, FaUpload } from 'react-icons/fa';
import axiosInstance from '../Helper/axiosInstance';
import { toast } from 'react-hot-toast';
import Layout from '@/Layout/Layout';

interface Diagnosis {
  toothId: string;
  condition: string;
  notes: string;
  severity: 'low' | 'medium' | 'high';
  treatment?: string;
  prescription?: string;
  followUpDate?: string;
  medications?: {
    name: string;
    dosage: string;
    duration: string;
  }[];
  images?: string[];
}

interface TeethDiagnosisProps {
  appointmentId: string;
  onSaveComplete?: () => void;
}

const TeethDiagnosis: React.FC<TeethDiagnosisProps> = ({ appointmentId, onSaveComplete }) => {
  const [currentPage, setCurrentPage] = useState<'diagnosis' | 'images'>('diagnosis');
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTeeth, setSelectedTeeth] = useState<string[]>([]);
  const [currentDiagnosis, setCurrentDiagnosis] = useState<Diagnosis>({
    toothId: '',
    condition: '',
    notes: '',
    severity: 'low',
    treatment: '',
    prescription: '',
    followUpDate: '',
    medications: [],
    images: []
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleToothClick = (toothId: string) => {
    if (selectedTeeth.includes(toothId)) {
      setSelectedTeeth(selectedTeeth.filter(id => id !== toothId));
    } else {
      setSelectedTeeth([...selectedTeeth, toothId]);
    }
  };

  const handleDiagnosisChange = (field: keyof Diagnosis, value: string) => {
    setCurrentDiagnosis(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addDiagnosis = () => {
    const newDiagnoses = selectedTeeth.map(toothId => ({
      ...currentDiagnosis,
      toothId
    }));

    setDiagnoses(prev => [...prev, ...newDiagnoses]);
    setSelectedTeeth([]);
    setCurrentDiagnosis({
      toothId: '',
      condition: '',
      notes: '',
      severity: 'low',
      treatment: '',
      prescription: '',
      followUpDate: '',
      medications: [],
      images: []
    });
  };

  const removeDiagnosis = (toothId: string) => {
    setDiagnoses(prev => prev.filter(d => d.toothId !== toothId));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(prev => [...prev, ...files]);
    
    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const saveDiagnoses = async () => {
    try {
      setLoading(true);
      
      // First upload images to Cloudinary
      const imageUrls = await Promise.all(
        selectedImages.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', 'dental_images');
          
          const response = await axiosInstance.post('/upload', formData);
          return response.data.secure_url;
        })
      );

      // Update diagnoses with image URLs
      const diagnosesWithImages = diagnoses.map(diagnosis => ({
        ...diagnosis,
        images: imageUrls
      }));

      const response = await axiosInstance.post(`/appointments/${appointmentId}/diagnoses`, {
        diagnoses: diagnosesWithImages
      });

      if (response.data.success) {
        toast.success('Diagnoses saved successfully');
        if (onSaveComplete) {
          onSaveComplete();
        }
      }
    } catch (error) {
      console.error('Error saving diagnoses:', error);
      toast.error('Failed to save diagnoses');
    } finally {
      setLoading(false);
    }
  };

  const getToothColor = (toothId: string) => {
    if (selectedTeeth.includes(toothId)) return '#3B82F6'; // blue-500
    const diagnosis = diagnoses.find(d => d.toothId === toothId);
    if (!diagnosis) return '#D1D5DB'; // gray-300
    switch (diagnosis.severity) {
      case 'high': return '#EF4444'; // red-500
      case 'medium': return '#F59E0B'; // yellow-500
      case 'low': return '#10B981'; // green-500
      default: return '#D1D5DB'; // gray-300
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                {currentPage === 'diagnosis' ? 'Teeth Diagnosis' : 'Upload Images'}
              </h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {currentPage === 'diagnosis' ? (
                <motion.div
                  key="diagnosis"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                  {/* Dental Chart */}
                  <div className="lg:col-span-1">
                    <div className="relative w-full h-[400px] bg-gray-50 rounded-xl p-4">
                      <svg width="100%" height="100%" viewBox="0 0 400 200">
                        {teethData.map((tooth) => (
                          <g key={tooth.id} onClick={() => handleToothClick(tooth.id)}>
                            <path
                              d={tooth.path}
                              fill={getToothColor(tooth.id)}
                              stroke="#4B5563"
                              strokeWidth="1"
                              className="cursor-pointer transition-colors duration-200 hover:opacity-80"
                            />
                            <text
                              x={tooth.x}
                              y={tooth.y}
                              textAnchor="middle"
                              fontSize="8"
                              fill="#4B5563"
                              className="select-none pointer-events-none"
                            >
                              {tooth.id}
                            </text>
                          </g>
                        ))}
                      </svg>
                    </div>
                  </div>

                  {/* Diagnosis Form */}
                  <div className="lg:col-span-1">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                          Selected Teeth: {selectedTeeth.join(', ')}
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                            <select
                              value={currentDiagnosis.condition}
                              onChange={(e) => handleDiagnosisChange('condition', e.target.value)}
                              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select condition</option>
                              {commonDentalConditions.map((condition) => (
                                <option key={condition} value={condition}>
                                  {condition}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                            <div className="flex space-x-4">
                              {['low', 'medium', 'high'].map((severity) => (
                                <label key={severity} className="flex items-center">
                                  <input
                                    type="radio"
                                    value={severity}
                                    checked={currentDiagnosis.severity === severity}
                                    onChange={(e) => handleDiagnosisChange('severity', e.target.value)}
                                    className="mr-2"
                                  />
                                  <span className="capitalize">{severity}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Treatment</label>
                            <input
                              type="text"
                              value={currentDiagnosis.treatment}
                              onChange={(e) => handleDiagnosisChange('treatment', e.target.value)}
                              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Recommended treatment"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prescription</label>
                            <textarea
                              value={currentDiagnosis.prescription}
                              onChange={(e) => handleDiagnosisChange('prescription', e.target.value)}
                              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                              rows={3}
                              placeholder="Enter prescription details"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                            <input
                              type="date"
                              value={currentDiagnosis.followUpDate}
                              onChange={(e) => handleDiagnosisChange('followUpDate', e.target.value)}
                              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <button
                            onClick={addDiagnosis}
                            disabled={selectedTeeth.length === 0 || !currentDiagnosis.condition}
                            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Add Diagnosis
                          </button>
                        </div>
                      </div>

                      {/* Current Diagnoses */}
                      <div className="space-y-4 max-h-[300px] overflow-y-auto">
                        {diagnoses.map((diagnosis, index) => (
                          <motion.div
                            key={`${diagnosis.toothId}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-gray-50 rounded-lg relative"
                          >
                            <button
                              onClick={() => removeDiagnosis(diagnosis.toothId)}
                              className="absolute top-2 right-2 text-red-500 hover:text-red-600"
                            >
                              <FaTimesCircle />
                            </button>
                            <h4 className="font-medium">Tooth #{diagnosis.toothId}</h4>
                            <p className="text-sm text-gray-600">Condition: {diagnosis.condition}</p>
                            <p className="text-sm text-gray-600">Severity: {diagnosis.severity}</p>
                            {diagnosis.treatment && (
                              <p className="text-sm text-gray-600">Treatment: {diagnosis.treatment}</p>
                            )}
                          </motion.div>
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentPage('images')}
                        disabled={diagnoses.length === 0}
                        className="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        Next: Upload Images <FaArrowRight className="ml-2" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="images"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-700">Upload Dental Images</h3>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                          accept="image/*"
                          multiple
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <FaUpload className="text-3xl text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">
                            Click to upload or drag and drop
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            Supported formats: JPEG, PNG
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-700">Preview</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {previewUrls.map((url, index) => (
                          <div key={index} className="relative">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              <FaTimesCircle />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setCurrentPage('diagnosis')}
                      className="py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center"
                    >
                      <FaArrowLeft className="mr-2" /> Back
                    </button>
                    <button
                      onClick={saveDiagnoses}
                      disabled={loading || diagnoses.length === 0}
                      className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <FaSave />
                        </motion.div>
                      ) : (
                        <>
                          <FaSave className="mr-2" />
                          Save All Diagnoses
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default TeethDiagnosis; 