import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaTooth, FaCalendarAlt, FaUser, FaSpinner,
  FaEdit, FaTrash, FaPlus, FaCheck
} from 'react-icons/fa';
import axiosInstance from '../Helper/axiosInstance';
import Layout from '@/Layout/Layout';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface TreatmentPlan {
  _id: string;
  patientId: {
    _id: string;
    fullName: string;
    email: string;
  };
  procedure: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  cost: number;
  notes: string;
  teeth: string[];
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

interface NewTreatmentPlan {
  patientId: string;
  procedure: string;
  description: string;
  startDate: string;
  endDate: string;
  cost: number;
  notes: string;
  teeth: string[];
}

const TreatmentPlans: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'create' | 'review'>('review');
  const [plans, setPlans] = useState<TreatmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<TreatmentPlan | null>(null);
  const [newPlan, setNewPlan] = useState<NewTreatmentPlan>({
    patientId: '',
    procedure: '',
    description: '',
    startDate: '',
    endDate: '',
    cost: 0,
    notes: '',
    teeth: []
  });
  const doctorId = useSelector((state: any) => state.auth.data?._id);

  useEffect(() => {
    if (view === 'review') {
      fetchTreatmentPlans();
    }
  }, [view, doctorId]);

  const fetchTreatmentPlans = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/treatment-plans/doctor/${doctorId}`);
      setPlans(response.data.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch treatment plans');
      toast.error('Error loading treatment plans');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async () => {
    try {
      setLoading(true);
      await axiosInstance.post('/treatment-plans', newPlan);
      toast.success('Treatment plan created successfully');
      setView('review');
      fetchTreatmentPlans();
    } catch (error) {
      toast.error('Failed to create treatment plan');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlan = async (planId: string, status: string) => {
    try {
      await axiosInstance.patch(`/treatment-plans/${planId}`, { status });
      toast.success('Treatment plan updated');
      fetchTreatmentPlans();
    } catch (error) {
      toast.error('Failed to update treatment plan');
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!window.confirm('Are you sure you want to delete this treatment plan?')) return;
    
    try {
      await axiosInstance.delete(`/treatment-plans/${planId}`);
      toast.success('Treatment plan deleted');
      fetchTreatmentPlans();
    } catch (error) {
      toast.error('Failed to delete treatment plan');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
          <div className="text-center max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl">
            <div className="text-red-500 text-xl mb-4 font-semibold">{error}</div>
            <button 
              onClick={fetchTreatmentPlans}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-800">Treatment Plans</h1>
            <p className="text-gray-600 mt-2">Create and manage treatment plans</p>
          </motion.div>

          {/* View Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="flex space-x-4">
              <button
                onClick={() => setView('review')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  view === 'review'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Review Plans
              </button>
              <button
                onClick={() => setView('create')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  view === 'create'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Create New Plan
              </button>
            </div>
          </motion.div>

          {/* Main Content */}
          {view === 'create' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Create New Treatment Plan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient ID
                    </label>
                    <input
                      type="text"
                      value={newPlan.patientId}
                      onChange={(e) => setNewPlan({ ...newPlan, patientId: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter patient ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Procedure
                    </label>
                    <input
                      type="text"
                      value={newPlan.procedure}
                      onChange={(e) => setNewPlan({ ...newPlan, procedure: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter procedure name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newPlan.description}
                      onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      rows={3}
                      placeholder="Enter procedure description"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={newPlan.startDate}
                      onChange={(e) => setNewPlan({ ...newPlan, startDate: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={newPlan.endDate}
                      onChange={(e) => setNewPlan({ ...newPlan, endDate: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cost
                    </label>
                    <input
                      type="number"
                      value={newPlan.cost}
                      onChange={(e) => setNewPlan({ ...newPlan, cost: parseFloat(e.target.value) })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter cost"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={newPlan.notes}
                      onChange={(e) => setNewPlan({ ...newPlan, notes: e.target.value })}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      rows={3}
                      placeholder="Enter additional notes"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleCreatePlan}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    'Create Treatment Plan'
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <FaSpinner className="animate-spin text-blue-500 text-2xl" />
                </div>
              ) : plans.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                  <FaTooth className="text-gray-400 text-5xl mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-800 mb-2">No Treatment Plans</h3>
                  <p className="text-gray-500 mb-4">Start by creating a new treatment plan</p>
                  <button
                    onClick={() => setView('create')}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Create Plan
                  </button>
                </div>
              ) : (
                plans.map((plan) => (
                  <motion.div
                    key={plan._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">{plan.procedure}</h3>
                          <p className="text-gray-500">{plan.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdatePlan(plan._id, 'completed')}
                            className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => navigate(`/doctor/treatment-plans/${plan._id}/edit`)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeletePlan(plan._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <FaUser className="mr-2" />
                            {plan.patientId.fullName}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <FaCalendarAlt className="mr-2" />
                            {formatDate(plan.startDate)} - {formatDate(plan.endDate)}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-2">
                            <span className="font-medium">Cost:</span> {formatCurrency(plan.cost)}
                          </p>
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Status:</span>{' '}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              plan.status === 'completed' ? 'bg-green-100 text-green-800' :
                              plan.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {plan.status}
                            </span>
                          </p>
                        </div>
                      </div>
                      {plan.notes && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">{plan.notes}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TreatmentPlans; 