import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUser, FaCalendarAlt, FaClock, FaSpinner,
  FaSearch, FaFilter, FaCheckCircle, FaHourglassHalf
} from 'react-icons/fa';
import axiosInstance from '../Helper/axiosInstance';
import Layout from '@/Layout/Layout';
import { toast } from 'react-hot-toast';

interface TreatmentPlan {
  _id: string;
  patientId: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  doctorId: {
    _id: string;
    name: string;
  };
  treatmentType: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  estimatedDuration: number;
  totalCost: number;
  status: 'pending' | 'in-progress' | 'completed';
  steps: TreatmentStep[];
  createdAt: string;
}

interface TreatmentStep {
  stepNumber: number;
  description: string;
  duration: number;
  date?: string;
  time?: string;
  notes?: string;
  status: 'pending' | 'completed' | 'cancelled';
}

const TreatmentHistory: React.FC = () => {
  const [treatments, setTreatments] = useState<TreatmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentPlan | null>(null);

  // Fetch treatments
  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const response = await axiosInstance.get('/treatments');
        if (response.data.success) {
          setTreatments(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching treatments:', error);
        toast.error('Failed to load treatment history');
      } finally {
        setLoading(false);
      }
    };

    fetchTreatments();
  }, []);

  // Filter treatments based on search term and status
  const filteredTreatments = treatments.filter(treatment => {
    const matchesSearch = 
      treatment.patientId.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.treatmentType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      treatment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
            <h1 className="text-3xl font-bold text-gray-800">Treatment History</h1>
            <p className="text-gray-600 mt-2">View and manage patient treatment plans</p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient name or treatment type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </motion.div>

          {/* Treatment List and Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Treatment List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Treatment Plans ({filteredTreatments.length})
                  </h2>
                </div>
                <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center p-8">
                      <FaSpinner className="animate-spin text-blue-500 text-2xl" />
                    </div>
                  ) : filteredTreatments.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No treatment plans found
                    </div>
                  ) : (
                    filteredTreatments.map((treatment) => (
                      <motion.div
                        key={treatment._id}
                        whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                        className={`p-4 cursor-pointer transition-colors ${
                          selectedTreatment?._id === treatment._id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedTreatment(treatment)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <FaUser className="text-blue-500" />
                            </div>
                            <div className="ml-3">
                              <h3 className="font-medium text-gray-800">
                                {treatment.patientId.fullName}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {treatment.treatmentType}
                              </p>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(treatment.status)}`}>
                            {treatment.status}
                          </span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>

            {/* Treatment Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {!selectedTreatment ? (
                  <div className="p-8 text-center">
                    <FaCalendarAlt className="text-gray-300 text-5xl mx-auto mb-4" />
                    <p className="text-gray-500">Select a treatment plan to view details</p>
                  </div>
                ) : (
                  <>
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-800">
                            {selectedTreatment.treatmentType}
                          </h2>
                          <p className="text-gray-600 mt-1">
                            Patient: {selectedTreatment.patientId.fullName}
                          </p>
                        </div>
                        <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(selectedTreatment.status)}`}>
                          {selectedTreatment.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center">
                          <FaCalendarAlt className="text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm text-gray-500">Start Date</p>
                            <p className="font-medium">{formatDate(selectedTreatment.startDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <FaCalendarAlt className="text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm text-gray-500">End Date</p>
                            <p className="font-medium">{formatDate(selectedTreatment.endDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm text-gray-500">Duration</p>
                            <p className="font-medium">{selectedTreatment.estimatedDuration} days</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <FaUser className="text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm text-gray-500">Doctor</p>
                            <p className="font-medium">{selectedTreatment.doctorId.name}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                        <p className="text-gray-600">{selectedTreatment.description}</p>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-semibold text-gray-800 mb-4">Treatment Steps</h3>
                      <div className="space-y-4">
                        {selectedTreatment.steps.map((step) => (
                          <motion.div
                            key={step.stepNumber}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 border rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                {step.status === 'completed' ? (
                                  <FaCheckCircle className="text-green-500 mr-2" />
                                ) : (
                                  <FaHourglassHalf className="text-yellow-500 mr-2" />
                                )}
                                <h4 className="font-medium">Step {step.stepNumber}</h4>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(step.status)}`}>
                                {step.status}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2">{step.description}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <FaClock className="mr-1" />
                              {step.duration} minutes
                              {step.date && (
                                <span className="ml-4">
                                  <FaCalendarAlt className="inline mr-1" />
                                  {formatDate(step.date)}
                                  {step.time && ` at ${step.time}`}
                                </span>
                              )}
                            </div>
                            {step.notes && (
                              <p className="mt-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                                {step.notes}
                              </p>
                            )}
                          </motion.div>
                        ))}
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

export default TreatmentHistory; 