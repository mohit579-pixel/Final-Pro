import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, FaUserMd, FaCalendarAlt, FaPlus, 
  FaClock, FaTooth, FaSpinner, FaCheck 
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
}

interface TreatmentPlan {
  patientId: string;
  treatmentType: string;
  description: string;
  estimatedDuration: number;
  totalCost: number;
  steps: TreatmentStep[];
  status: 'pending' | 'in-progress' | 'completed';
}

interface RootState {
  auth: {
    data: {
      _id: string;
    };
  };
}

const treatmentTypes = [
  { id: 'root-canal', name: 'Root Canal Treatment', defaultSteps: 4 },
  { id: 'implant', name: 'Dental Implant', defaultSteps: 3 },
  { id: 'orthodontic', name: 'Orthodontic Treatment', defaultSteps: 6 },
  { id: 'crown', name: 'Crown Placement', defaultSteps: 2 },
  { id: 'periodontal', name: 'Periodontal Treatment', defaultSteps: 4 },
];

const CreatePlan: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState(treatmentTypes[0]);
  const doctorId = useSelector((state: RootState) => state.auth.data?._id);

  const [treatmentPlan, setTreatmentPlan] = useState<TreatmentPlan>({
    patientId: '',
    treatmentType: '',
    description: '',
    estimatedDuration: 0,
    totalCost: 0,
    steps: [],
    status: 'pending'
  });

  // Search patients
  const searchPatients = async (query: string) => {
    if (query.length < 2) {
      setPatients([]);
      return;
    }

    try {
      setSearching(true);
      const response = await axiosInstance.get(`/patients/search?query=${query}`);
      if (response.data.success) {
        setPatients(response.data.data);
      }
    } catch (error) {
      console.error('Error searching patients:', error);
      toast.error('Failed to search patients');
    } finally {
      setSearching(false);
    }
  };

  // Handle patient selection
  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowPlanForm(true);
    setPatients([]);
    setSearchTerm('');
    setTreatmentPlan(prev => ({
      ...prev,
      patientId: patient._id
    }));
  };

  // Generate treatment steps
  const generateTreatmentSteps = (treatmentType: typeof treatmentTypes[0]) => {
    const steps: TreatmentStep[] = [];
    for (let i = 1; i <= treatmentType.defaultSteps; i++) {
      steps.push({
        stepNumber: i,
        description: '',
        duration: 30,
      });
    }
    return steps;
  };

  // Handle treatment type selection
  const handleTreatmentSelect = (treatment: typeof treatmentTypes[0]) => {
    setSelectedTreatment(treatment);
    setTreatmentPlan(prev => ({
      ...prev,
      treatmentType: treatment.id,
      steps: generateTreatmentSteps(treatment)
    }));
  };

  // Create treatment plan
  const createTreatmentPlan = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/treatment-plans', treatmentPlan);
      if (response.data.success) {
        toast.success('Treatment plan created successfully');
        setShowPlanForm(false);
        setSelectedPatient(null);
        setTreatmentPlan({
          patientId: '',
          treatmentType: '',
          description: '',
          estimatedDuration: 0,
          totalCost: 0,
          steps: [],
          status: 'pending'
        });
      }
    } catch (error) {
      console.error('Error creating treatment plan:', error);
      toast.error('Failed to create treatment plan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let debounceTimer: NodeJS.Timeout;
    if (searchTerm) {
      debounceTimer = setTimeout(() => {
        searchPatients(searchTerm);
      }, 300);
    }
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

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
              Create Treatment Plan
            </h1>
            <p className="text-gray-600 mt-2">
              Create a systematic treatment plan for your patients
            </p>
          </motion.div>

          {/* Search Section */}
          {!showPlanForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-8"
            >
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search patient by name or email..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Search Results */}
                <AnimatePresence>
                  {searching ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex justify-center items-center py-8"
                    >
                      <FaSpinner className="animate-spin text-blue-500 text-2xl" />
                    </motion.div>
                  ) : patients.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mt-4 space-y-2"
                    >
                      {patients.map((patient) => (
                        <motion.div
                          key={patient._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          whileHover={{ scale: 1.02 }}
                          className="p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-blue-50 transition-all"
                          onClick={() => handlePatientSelect(patient)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 font-semibold">
                                  {patient.fullName.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-800">{patient.fullName}</h3>
                                <p className="text-sm text-gray-500">{patient.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {patient.age && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                  {patient.age} years
                                </span>
                              )}
                              {patient.gender && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs capitalize">
                                  {patient.gender}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Treatment Plan Form */}
          <AnimatePresence>
            {showPlanForm && selectedPatient && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                {/* Patient Info Header */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                        <FaUserMd className="text-2xl" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">{selectedPatient.fullName}</h2>
                        <p className="text-blue-100">{selectedPatient.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPlanForm(false)}
                      className="text-white/80 hover:text-white"
                    >
                      ← Back to Search
                    </button>
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-6">
                  {/* Treatment Type Selection */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Treatment Type</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {treatmentTypes.map((treatment) => (
                        <motion.div
                          key={treatment.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-xl cursor-pointer border-2 transition-all ${
                            selectedTreatment.id === treatment.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-200'
                          }`}
                          onClick={() => handleTreatmentSelect(treatment)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-800">{treatment.name}</span>
                            {selectedTreatment.id === treatment.id && (
                              <FaCheck className="text-blue-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {treatment.defaultSteps} steps
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Treatment Details */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Treatment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          value={treatmentPlan.description}
                          onChange={(e) => setTreatmentPlan(prev => ({
                            ...prev,
                            description: e.target.value
                          }))}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={4}
                          placeholder="Describe the treatment plan..."
                        />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estimated Total Duration (days)
                          </label>
                          <input
                            type="number"
                            value={treatmentPlan.estimatedDuration}
                            onChange={(e) => setTreatmentPlan(prev => ({
                              ...prev,
                              estimatedDuration: parseInt(e.target.value)
                            }))}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Total Cost ($)
                          </label>
                          <input
                            type="number"
                            value={treatmentPlan.totalCost}
                            onChange={(e) => setTreatmentPlan(prev => ({
                              ...prev,
                              totalCost: parseInt(e.target.value)
                            }))}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Treatment Steps */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Treatment Steps</h3>
                    <div className="space-y-4">
                      {treatmentPlan.steps.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Step {step.stepNumber} Description
                              </label>
                              <input
                                type="text"
                                value={step.description}
                                onChange={(e) => {
                                  const newSteps = [...treatmentPlan.steps];
                                  newSteps[index].description = e.target.value;
                                  setTreatmentPlan(prev => ({
                                    ...prev,
                                    steps: newSteps
                                  }));
                                }}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder={`Step ${step.stepNumber} description`}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Date
                              </label>
                              <input
                                type="date"
                                value={step.date || ''}
                                onChange={(e) => {
                                  const newSteps = [...treatmentPlan.steps];
                                  newSteps[index].date = e.target.value;
                                  setTreatmentPlan(prev => ({
                                    ...prev,
                                    steps: newSteps
                                  }));
                                }}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Duration (minutes)
                              </label>
                              <input
                                type="number"
                                value={step.duration}
                                onChange={(e) => {
                                  const newSteps = [...treatmentPlan.steps];
                                  newSteps[index].duration = parseInt(e.target.value);
                                  setTreatmentPlan(prev => ({
                                    ...prev,
                                    steps: newSteps
                                  }));
                                }}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowPlanForm(false)}
                      className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={createTreatmentPlan}
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 font-medium disabled:opacity-50 flex items-center"
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Creating Plan...
                        </>
                      ) : (
                        <>
                          <FaCalendarAlt className="mr-2" />
                          Create Treatment Plan
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePlan; 