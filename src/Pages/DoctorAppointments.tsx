import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCalendarAlt, FaClock, FaUser, FaSpinner,
  FaCheckCircle, FaTimesCircle
} from 'react-icons/fa';
import axiosInstance from '../Helper/axiosInstance';
import Layout from '@/Layout/Layout';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PrescriptionButton from '@/components/PrescriptionButton';

interface Appointment {
  _id: string;
  patientId?: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  type: string;
  status: string;
  notes: string;
}

interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

interface Doctor {
  _id: string;
  name: string;
  // Add other doctor fields as needed
}

interface RootState {
  auth: {
    data: {
      _id: string;
    };
  };
}

const DoctorAppointments: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'today' | 'upcoming' | 'all'>('today');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [doctorInfo, setDoctorInfo] = useState<Doctor | null>(null);
  const userId = useSelector((state: RootState) => state.auth.data?._id);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // First, fetch doctor info using userId
  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        if (!userId) return;
        const response = await axiosInstance.get(`/doctors/user/${userId}`);
        if (response.data.success) {
          setDoctorInfo(response.data.data);
        }
      } catch {
        console.error('Error fetching doctor info');
        toast.error('Error loading doctor information');
      }
    };

    fetchDoctorInfo();
  }, [userId]);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      // Always fetch all appointments and filter on the frontend
      const response = await axiosInstance.get(`/doctors/${doctorInfo?._id}/appointments`);
      console.log(response.data);
      if (response.data.success) {
        const allAppointments = response.data.data;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter appointments based on view
        const filteredAppointments = allAppointments.filter((app: Appointment) => {
          const appointmentDate = new Date(app.date);
          appointmentDate.setHours(0, 0, 0, 0);

          switch (view) {
            case 'today':
              return appointmentDate.getTime() === today.getTime();
            case 'upcoming':
              return appointmentDate.getTime() >= today.getTime() && app.status !== 'canceled';
            case 'all':
              return true;
            default:
              return true;
          }
        });

        setAppointments(filteredAppointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Error loading appointments');
    } finally {
      setLoading(false);
    }
  }, [view, doctorInfo?._id]);

  useEffect(() => {
    if (doctorInfo?._id) {
      fetchAppointments();
    }
  }, [view, doctorInfo?._id, fetchAppointments]);

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      // Map frontend status to backend status values
      const statusMapping: { [key: string]: string } = {
        'confirmed': 'confirmed',
        'cancelled': 'canceled'
      };

      const backendStatus = statusMapping[newStatus] || newStatus;
      
      await axiosInstance.patch(`/appointments/status/${appointmentId}`, { status: backendStatus });
      toast.success(`Appointment ${newStatus} successfully`);
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Failed to update appointment status');
    }
  };

  const generateTimeSlots = useCallback(() => {
    const slots: TimeSlot[] = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    const slotDuration = 30; // 30 minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const start = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endMinute = (minute + slotDuration) % 60;
        const endHour = hour + Math.floor((minute + slotDuration) / 60);
        const end = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
        
        const isTimeSlotTaken = appointments.some(appointment => appointment.startTime === start);
        
        slots.push({
          start,
          end,
          available: !isTimeSlotTaken
        });
      }
    }
    setTimeSlots(slots);
  }, [appointments]);

  useEffect(() => {
    generateTimeSlots();
  }, [selectedDate, generateTimeSlots]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'pending':
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      // Convert search term to lowercase for case-insensitive search
      const searchLower = searchTerm.toLowerCase().trim();
      
      // Safely access nested properties with optional chaining
      const patientName = appointment.patientId?.fullName?.toLowerCase() || '';
      const patientEmail = appointment.patientId?.email?.toLowerCase() || '';
      const appointmentType = appointment.type?.toLowerCase() || '';
      const appointmentStatus = appointment.status?.toLowerCase() || '';
      const appointmentDate = formatDate(appointment.date)?.toLowerCase() || '';
      const appointmentTime = `${formatTime(appointment.startTime)} - ${formatTime(appointment.endTime)}`.toLowerCase();
      const notes = appointment.notes?.toLowerCase() || '';

      // Check if any field contains the search term
      const matchesSearch = searchLower === '' || 
        patientName.includes(searchLower) ||
        patientEmail.includes(searchLower) ||
        appointmentType.includes(searchLower) ||
        appointmentStatus.includes(searchLower) ||
        appointmentDate.includes(searchLower) ||
        appointmentTime.includes(searchLower) ||
        notes.includes(searchLower);

      // Check if status matches the filter
      const matchesStatus = 
        statusFilter === 'all' || 
        appointmentStatus === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchTerm, statusFilter, formatDate, formatTime]);

  console.log(appointments);

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
            <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
            <p className="text-gray-600 mt-2">Manage your appointments and schedule</p>
          </motion.div>

          {/* View Toggle and Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setView('today')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      view === 'today'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Today's Schedule
                  </button>
                  <button
                    onClick={() => setView('upcoming')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      view === 'upcoming'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Upcoming
                  </button>
                  <button
                    onClick={() => setView('all')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      view === 'all'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All Appointments
                  </button>
                </div>
                <button
                  onClick={() => navigate('/doctor/appointments/new')}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  New Appointment
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by patient name, email, or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Appointments List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar and Time Slots */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Available Time Slots
                  </h2>
                </div>
                <div className="p-4">
                  <input
                    type="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="w-full p-2 border rounded-lg mb-4"
                  />
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {timeSlots.map((slot, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-3 rounded-lg border ${
                          slot.available
                            ? 'border-green-200 bg-green-50 cursor-pointer hover:bg-green-100'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {formatTime(slot.start)} - {formatTime(slot.end)}
                          </span>
                          {slot.available ? (
                            <FaCheckCircle className="text-green-500" />
                          ) : (
                            <FaTimesCircle className="text-gray-400" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Appointments List */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {view === 'today' ? "Today's" : view === 'upcoming' ? 'Upcoming' : 'All'} Appointments
                    <span className="ml-2 text-sm text-gray-500">
                      ({filteredAppointments.length} appointments)
                    </span>
                  </h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {loading ? (
                    <div className="flex items-center justify-center p-8">
                      <FaSpinner className="animate-spin text-blue-500 text-2xl" />
                    </div>
                  ) : filteredAppointments.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No appointments found
                    </div>
                  ) : (
                    filteredAppointments.map((appointment) => (
                      <motion.div
                        key={appointment._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <FaUser className="text-blue-500" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-800">
                                {appointment.patientId?.fullName}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {appointment.patientId?.email}
                              </p>
                              <div className="flex items-center mt-2 space-x-4">
                                <div className="flex items-center text-sm text-gray-500">
                                  <FaCalendarAlt className="mr-2" />
                                  {formatDate(appointment.date)}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <FaClock className="mr-2" />
                                  {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              getStatusColor(appointment.status)
                            }`}>
                              {appointment.status}
                            </span>
                            <div className="flex space-x-2">
                              {appointment.status !== 'confirmed' && appointment.status !== 'completed' && appointment.status !== 'canceled' && (
                                <>
                                  <button
                                    onClick={() => handleStatusChange(appointment._id, 'confirmed')}
                                    className="px-3 py-1 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(appointment._id, 'cancelled')}
                                    className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                              {appointment.status === 'completed' && (
                                <PrescriptionButton 
                                  appointmentId={appointment._id}
                                  status={appointment.status}
                                  className="px-3 py-1 text-xs"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        {appointment.notes && (
                          <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            {appointment.notes}
                          </p>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorAppointments; 