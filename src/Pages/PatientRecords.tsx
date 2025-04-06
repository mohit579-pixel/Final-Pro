import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaUserMd, FaCalendarAlt, FaSpinner, FaFileMedical } from 'react-icons/fa';
import axiosInstance from '@/Helper/axiosInstance';
import { toast } from 'react-toastify';
import Layout from '@/Layout/Layout';

interface TreatmentPlan {
  procedure: string;
  status: string;
  startDate: string;
  endDate: string;
  notes: string;
}

interface Appointment {
  date: string;
  type: string;
  status: string;
  notes: string;
}

interface Patient {
  _id: string;
  fullName: string;
  email: string;
  age: number;
  gender: string;
  bloodGroup: string;
  phone: string;
  address: string;
  medicalHistory: string[];
  treatmentPlans: TreatmentPlan[];
  appointments: Appointment[];
}

const PatientRecords: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [ageFilter, setAgeFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/patients');
      setPatients(response.data.data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch patients';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = searchQuery === '' || 
      (patient.fullName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (patient.email?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesAge = ageFilter === 'all' || 
      (ageFilter === 'child' && patient.age < 18) ||
      (ageFilter === 'adult' && patient.age >= 18 && patient.age < 60) ||
      (ageFilter === 'senior' && patient.age >= 60);
    
    const matchesGender = genderFilter === 'all' || 
      (patient.gender?.toLowerCase() || '') === genderFilter.toLowerCase();
    
    return matchesSearch && matchesAge && matchesGender;
  });

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Patient Records</h1>
            <div className="flex space-x-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Ages</option>
                <option value="child">0-18 years</option>
                <option value="adult">19-40 years</option>
                <option value="senior">40+ years</option>
              </select>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {filteredPatients.map((patient) => (
                <motion.div
                  key={patient._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-4 rounded-lg border cursor-pointer ${
                    selectedPatient?._id === patient._id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handlePatientClick(patient)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaUserMd className="text-blue-500 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{patient.fullName}</h3>
                      <p className="text-sm text-gray-500">{patient.email}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {selectedPatient && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-50 rounded-lg p-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaUserMd className="text-blue-500 text-2xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{selectedPatient.fullName}</h2>
                      <p className="text-gray-500">{selectedPatient.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Age</p>
                      <p className="font-medium">{selectedPatient.age} years</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="font-medium">{selectedPatient.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Blood Group</p>
                      <p className="font-medium">{selectedPatient.bloodGroup}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{selectedPatient.phone}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{selectedPatient.address}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Medical History</h3>
                    <div className="space-y-2">
                      {selectedPatient.medicalHistory.map((history, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <FaFileMedical className="text-gray-400" />
                          <span>{history}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Treatment Plans</h3>
                    <div className="space-y-2">
                      {selectedPatient.treatmentPlans.map((plan, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <FaCalendarAlt className="text-gray-400" />
                          <span>{plan.procedure}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PatientRecords; 