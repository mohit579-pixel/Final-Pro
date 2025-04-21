import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, FaUserMd, FaCalendarAlt, 
  FaTooth, FaSpinner, FaCheck, FaEdit,
  FaTrash, FaClock
} from 'react-icons/fa';
import Layout from '@/Layout/Layout';
import axiosInstance from '../Helper/axiosInstance';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';

interface Patient {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  age?: number;
  gender?: string;
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

interface TreatmentPlan {
  _id: string;
  patientId: Patient;
  treatmentType: string;
  description: string;
  estimatedDuration: number;
  totalCost: number;
  steps: TreatmentStep[];
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

interface RootState {
  auth: {
    data: {
      _id: string;
    };
  };
}

const ReviewAndUpdate: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<TreatmentPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<TreatmentPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const doctorId = useSelector((state: RootState) => state.auth.data?._id);

  // Fetch treatment plans
  const fetchTreatmentPlans = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/treatment-plans/doctor/${doctorId}`);
      if (response.data.success) {
        setTreatmentPlans(response.data.data);
        setFilteredPlans(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching treatment plans:', error);
      toast.error('Failed to load treatment plans');
    } finally {
      setLoading(false);
    }
  };

  // Filter plans based on search term and status
  useEffect(() => {
    const filtered = treatmentPlans.filter(plan => {
      const matchesSearch = 
        plan.patientId.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.treatmentType.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    setFilteredPlans(filtered);
  }, [searchTerm, statusFilter, treatmentPlans]);

  // Initial fetch
  useEffect(() => {
    fetchTreatmentPlans();
  }, [doctorId]);

  // Update treatment plan
  const updateTreatmentPlan = async (planId: string, updatedData: Partial<TreatmentPlan>) => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(`/treatment-plans/${planId}`, updatedData);
      if (response.data.success) {
        toast.success('Treatment plan updated successfully');
        fetchTreatmentPlans();
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error updating treatment plan:', error);
      toast.error('Failed to update treatment plan');
    } finally {
      setLoading(false);
    }
  };

  // Delete treatment plan
  const deleteTreatmentPlan = async (planId: string) => {
    if (!window.confirm('Are you sure you want to delete this treatment plan?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.delete(`/treatment-plans/${planId}`);
      if (response.data.success) {
        toast.success('Treatment plan deleted successfully');
        fetchTreatmentPlans();
        setSelectedPlan(null);
      }
    } catch (error) {
      console.error('Error deleting treatment plan:', error);
      toast.error('Failed to delete treatment plan');
    } finally {
      setLoading(false);
    }
  };

  // Update step status
  const updateStepStatus = async (planId: string, stepIndex: number, status: TreatmentStep['status']) => {
    if (!selectedPlan) return;

    const updatedSteps = [...selectedPlan.steps];
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      status
    };

    await updateTreatmentPlan(planId, { steps: updatedSteps });
  };

  const getStatusColor = (status: TreatmentPlan['status'] | TreatmentStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaTooth className="mr-3 text-blue-500" />
              Review & Update Treatment Plans
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and update your patients' treatment plans
            </p>
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by patient name or treatment type..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </motion.div>

          {/* Treatment Plans List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Plans List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800">Treatment Plans</h2>
                </div>
                <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                  {loading ? (
                    <div className="flex justify-center items-center py-8">
                      <FaSpinner className="animate-spin text-blue-500 text-2xl" />
                    </div>
                  ) : filteredPlans.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No treatment plans found
                    </div>
                  ) : (
                    filteredPlans.map((plan) => (
                      <motion.div
                        key={plan._id}
                        whileHover={{ scale: 1.02 }}
                        className={`p-4 cursor-pointer transition-all ${
                          selectedPlan?._id === plan._id ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedPlan(plan)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-gray-800">{plan.patientId.fullName}</h3>
                            <p className="text-sm text-gray-500">{plan.treatmentType}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                            {plan.status}
                          </span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>

            {/* Plan Details */}
            <AnimatePresence mode="wait">
              {selectedPlan && (
                <motion.div
                  key={selectedPlan._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="lg:col-span-2"
                >
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Plan Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                            <FaUserMd className="text-2xl" />
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold">{selectedPlan.patientId.fullName}</h2>
                            <p className="text-blue-100">{selectedPlan.treatmentType}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setEditMode(!editMode)}
                            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                          >
                            <FaEdit />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => deleteTreatmentPlan(selectedPlan._id)}
                            className="p-2 bg-red-400/20 rounded-lg hover:bg-red-400/30 transition-colors"
                          >
                            <FaTrash />
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* Plan Content */}
                    <div className="p-6">
                      {/* Plan Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">Plan Details</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Description</label>
                              {editMode ? (
                                <textarea
                                  value={selectedPlan.description}
                                  onChange={(e) => setSelectedPlan({
                                    ...selectedPlan,
                                    description: e.target.value
                                  })}
                                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  rows={3}
                                />
                              ) : (
                                <p className="mt-1 text-gray-600">{selectedPlan.description}</p>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Duration</label>
                                {editMode ? (
                                  <input
                                    type="number"
                                    value={selectedPlan.estimatedDuration}
                                    onChange={(e) => setSelectedPlan({
                                      ...selectedPlan,
                                      estimatedDuration: parseInt(e.target.value)
                                    })}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  />
                                ) : (
                                  <p className="mt-1 text-gray-600">{selectedPlan.estimatedDuration} days</p>
                                )}
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">Cost</label>
                                {editMode ? (
                                  <input
                                    type="number"
                                    value={selectedPlan.totalCost}
                                    onChange={(e) => setSelectedPlan({
                                      ...selectedPlan,
                                      totalCost: parseInt(e.target.value)
                                    })}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  />
                                ) : (
                                  <p className="mt-1 text-gray-600">${selectedPlan.totalCost}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress Overview</h3>
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="space-y-4">
                              {/* Progress Bar */}
                              <div>
                                <div className="flex justify-between text-sm text-gray-600 mb-1">
                                  <span>Progress</span>
                                  <span>
                                    {Math.round(
                                      (selectedPlan.steps.filter(step => step.status === 'completed').length /
                                        selectedPlan.steps.length) *
                                        100
                                    )}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                    style={{
                                      width: `${
                                        (selectedPlan.steps.filter(step => step.status === 'completed').length /
                                          selectedPlan.steps.length) *
                                        100
                                      }%`
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Status Summary */}
                              <div className="grid grid-cols-3 gap-2">
                                <div className="text-center p-2 bg-white rounded-lg">
                                  <div className="text-2xl font-bold text-blue-600">
                                    {selectedPlan.steps.filter(step => step.status === 'pending').length}
                                  </div>
                                  <div className="text-xs text-gray-500">Pending</div>
                                </div>
                                <div className="text-center p-2 bg-white rounded-lg">
                                  <div className="text-2xl font-bold text-green-600">
                                    {selectedPlan.steps.filter(step => step.status === 'completed').length}
                                  </div>
                                  <div className="text-xs text-gray-500">Completed</div>
                                </div>
                                <div className="text-center p-2 bg-white rounded-lg">
                                  <div className="text-2xl font-bold text-red-600">
                                    {selectedPlan.steps.filter(step => step.status === 'cancelled').length}
                                  </div>
                                  <div className="text-xs text-gray-500">Cancelled</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Treatment Steps */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Treatment Steps</h3>
                        <div className="space-y-4">
                          {selectedPlan.steps.map((step, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className={`p-4 rounded-xl border ${
                                step.status === 'completed'
                                  ? 'border-green-200 bg-green-50'
                                  : step.status === 'cancelled'
                                  ? 'border-red-200 bg-red-50'
                                  : 'border-gray-200 bg-gray-50'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-sm font-medium mr-2">
                                      {step.stepNumber}
                                    </span>
                                    {editMode ? (
                                      <input
                                        type="text"
                                        value={step.description}
                                        onChange={(e) => {
                                          const newSteps = [...selectedPlan.steps];
                                          newSteps[index].description = e.target.value;
                                          setSelectedPlan({
                                            ...selectedPlan,
                                            steps: newSteps
                                          });
                                        }}
                                        className="flex-1 p-2 border border-gray-300 rounded-lg"
                                      />
                                    ) : (
                                      <span className="font-medium text-gray-800">{step.description}</span>
                                    )}
                                  </div>
                                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center">
                                      <FaCalendarAlt className="mr-1" />
                                      {editMode ? (
                                        <input
                                          type="date"
                                          value={step.date || ''}
                                          onChange={(e) => {
                                            const newSteps = [...selectedPlan.steps];
                                            newSteps[index].date = e.target.value;
                                            setSelectedPlan({
                                              ...selectedPlan,
                                              steps: newSteps
                                            });
                                          }}
                                          className="p-1 border border-gray-300 rounded"
                                        />
                                      ) : (
                                        step.date || 'Not scheduled'
                                      )}
                                    </div>
                                    <div className="flex items-center">
                                      <FaClock className="mr-1" />
                                      {step.duration} min
                                    </div>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  {editMode ? (
                                    <select
                                      value={step.status}
                                      onChange={(e) => updateStepStatus(
                                        selectedPlan._id,
                                        index,
                                        e.target.value as TreatmentStep['status']
                                      )}
                                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(step.status)}`}
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="completed">Completed</option>
                                      <option value="cancelled">Cancelled</option>
                                    </select>
                                  ) : (
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(step.status)}`}>
                                      {step.status}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {editMode && (
                        <div className="mt-6 flex justify-end space-x-4">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setEditMode(false);
                              fetchTreatmentPlans(); // Reset changes
                            }}
                            className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
                          >
                            Cancel
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => updateTreatmentPlan(selectedPlan._id, selectedPlan)}
                            disabled={loading}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 font-medium disabled:opacity-50 flex items-center"
                          >
                            {loading ? (
                              <>
                                <FaSpinner className="animate-spin mr-2" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <FaCheck className="mr-2" />
                                Save Changes
                              </>
                            )}
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReviewAndUpdate; 