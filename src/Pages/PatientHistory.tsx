import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCalendarAlt, FaClock, FaUser, FaSpinner,
  FaSearch, FaStethoscope, FaNotesMedical
} from 'react-icons/fa';
import axiosInstance from '../Helper/axiosInstance';
import Layout from '@/Layout/Layout';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';

interface Appointment {
  _id: string;
  patientId: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;
  };
  doctorId: {
    _id: string;
    name: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  status: string;
  diagnosis?: {
    description: string;
    images: string[];
    prescription?: string;
    notes?: string;
  };
  notes?: string;
}

interface RootState {
  auth: {
    data: {
      _id: string;
    };
  };
}

const PatientHistory: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const userId = useSelector((state: RootState) => state.auth.data?._id);

  useEffect(() => {
    const fetchCompletedAppointments = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/appointments/doctor/${userId}/completed`);
        console.log("userId", userId);
        // console.log("response", response);
        if (response.data.success) {
          setAppointments(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching completed appointments:', error);
        toast.error('Failed to load appointment history');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCompletedAppointments();
    }
  }, [userId]);

  const filteredAppointments = appointments.filter(appointment =>
    appointment.patientId.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
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
            <h1 className="text-3xl font-bold text-gray-800">Patient History</h1>
            <p className="text-gray-600 mt-2">View completed appointments and treatment records</p>
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
                placeholder="Search by patient name or appointment type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Appointments List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Completed Appointments ({filteredAppointments.length})
                  </h2>
                </div>
                <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center p-8">
                      <FaSpinner className="animate-spin text-blue-500 text-2xl" />
                    </div>
                  ) : filteredAppointments.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No completed appointments found
                    </div>
                  ) : (
                    filteredAppointments.map((appointment) => (
                      <motion.div
                        key={appointment._id}
                        whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                        className={`p-4 cursor-pointer transition-colors ${
                          selectedAppointment?._id === appointment._id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FaUser className="text-blue-500" />
                          </div>
                          <div className="ml-3">
                            <h3 className="font-medium text-gray-800">
                              {appointment.patientId.fullName}
                            </h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <FaCalendarAlt className="mr-1" />
                              {formatDate(appointment.date)}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>

            {/* Appointment Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {!selectedAppointment ? (
                  <div className="p-8 text-center">
                    <FaStethoscope className="text-gray-300 text-5xl mx-auto mb-4" />
                    <p className="text-gray-500">Select an appointment to view details</p>
                  </div>
                ) : (
                  <>
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-800">
                            Appointment Details
                          </h2>
                          <p className="text-gray-600 mt-1">
                            {selectedAppointment.type}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          Completed
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center">
                          <FaUser className="text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm text-gray-500">Patient</p>
                            <p className="font-medium">{selectedAppointment.patientId.fullName}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <FaCalendarAlt className="text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium">{formatDate(selectedAppointment.date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <FaClock className="text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm text-gray-500">Time</p>
                            <p className="font-medium">
                              {formatTime(selectedAppointment.startTime)} - {formatTime(selectedAppointment.endTime)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {selectedAppointment.diagnosis && (
                        <div className="mt-6">
                          <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                            <FaNotesMedical className="mr-2" />
                            Diagnosis & Treatment
                          </h3>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700">{selectedAppointment.diagnosis.description}</p>
                            
                            {selectedAppointment.diagnosis.prescription && (
                              <div className="mt-4">
                                <h4 className="font-medium text-gray-800 mb-2">Prescription</h4>
                                <p className="text-gray-700">{selectedAppointment.diagnosis.prescription}</p>
                              </div>
                            )}

                            {selectedAppointment.diagnosis.notes && (
                              <div className="mt-4">
                                <h4 className="font-medium text-gray-800 mb-2">Additional Notes</h4>
                                <p className="text-gray-700">{selectedAppointment.diagnosis.notes}</p>
                              </div>
                            )}

                            {selectedAppointment.diagnosis.images && selectedAppointment.diagnosis.images.length > 0 && (
                              <div className="mt-4">
                                <h4 className="font-medium text-gray-800 mb-2">Images</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                  {selectedAppointment.diagnosis.images.map((image, index) => (
                                    <a
                                      key={index}
                                      href={image}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block"
                                    >
                                      <img
                                        src={image}
                                        alt={`Diagnosis image ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg hover:opacity-75 transition-opacity"
                                      />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
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

export default PatientHistory; 