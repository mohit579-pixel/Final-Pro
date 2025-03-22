import { useState, useEffect } from 'react';
import Layouts from "@/Layout/Layout";
import { useSelector } from 'react-redux';
import axiosInstance from '../Helper/axiosInstance.js';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { FaTeeth, FaCalendarAlt, FaCalendarCheck, FaListAlt, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { MdOutlineWavingHand, MdDateRange, MdOutlineHealthAndSafety } from 'react-icons/md';

// Define Redux state type
interface RootState {
  auth: {
    isLoggedIn: boolean;
    data: any;
  }
}

// Define appointment types
type AppointmentStatus = 'upcoming' | 'completed' | 'canceled' | 'rescheduled';
type AppointmentType = 'general-checkup' | 'scaling' | 'extraction' | 'bleaching' | 'consultation' | 'other';

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  avatar?: string;
  availableSlots?: string[]; // Times available for booking
}

type Appointment = {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  type: AppointmentType;
  notes?: string;
  location?: string;
  color?: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

const Calendars = () => {
  // Get user from Redux store
  const { data: user } = useSelector((state: any) => state.auth);     // Add this to check actual Redux state
     const authState = useSelector((state: any) => state.auth);
     console.log("Auth state:", authState);
    //  console.log("Auth stateaaaa:", user?.data._id);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);
  const [availableDoctors, setAvailableDoctors] = useState<Doctor[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedType, setSelectedType] = useState<AppointmentType>('general-checkup');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [appointmentNotes, setAppointmentNotes] = useState<string>('');
// Add these near your other state variables
const [showToast, setShowToast] = useState<boolean>(false);
const [toastMessage, setToastMessage] = useState<string>('');
const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
const [pageTransition, setPageTransition] = useState(false);
  // Modern vibrant color scheme for appointment types
  const getAppointmentColor = (type: AppointmentType) => {
    const colors: Record<AppointmentType, { bg: string, border: string, text: string, gradient: string }> = {
      'general-checkup': {
        bg: 'bg-indigo-50',
        border: 'border-indigo-300',
        text: 'text-indigo-700',
        gradient: 'from-indigo-400 to-indigo-500'
      },
      'scaling': {
        bg: 'bg-teal-50',
        border: 'border-teal-300',
        text: 'text-teal-700',
        gradient: 'from-teal-400 to-teal-500'
      },
      'extraction': {
        bg: 'bg-rose-50',
        border: 'border-rose-300',
        text: 'text-rose-700',
        gradient: 'from-rose-400 to-rose-500'
      },
      'bleaching': {
        bg: 'bg-violet-50',
        border: 'border-violet-300',
        text: 'text-violet-700',
        gradient: 'from-violet-400 to-violet-500'
      },
      'consultation': {
        bg: 'bg-amber-50',
        border: 'border-amber-300',
        text: 'text-amber-700',
        gradient: 'from-amber-400 to-amber-500'
      },
      'other': {
        bg: 'bg-slate-50',
        border: 'border-slate-300',
        text: 'text-slate-700',
        gradient: 'from-slate-400 to-slate-500'
      }
    };
    return colors[type];
  };

  // ... existing code ...
// Add this function near your other utility functions
const showToastMessage = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  setToastMessage(message);
  setToastType(type);
  setShowToast(true);
  
  // Auto-hide the toast after 5 seconds
  setTimeout(() => {
    setShowToast(false);
  }, 5000);
};
// Utility function to get doctor details by ID
const getDoctorDetails = (doctorId: string) => {
  const doctor = availableDoctors.find(doc => doc.id === doctorId);
  console.log("doctor",doctorId);
  // Return the doctor details if found, otherwise return default values
  return {
    name: doctor?.name || 'Unknown Doctor',
    specialty: doctor?.specialty || 'Unknown Specialty'
  };
};



// ... existing code ...

  // Status badge colors
  const getStatusColor = (status: AppointmentStatus) => {
    const colors: Record<AppointmentStatus, { bg: string, text: string }> = {
      'upcoming': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'completed': { bg: 'bg-emerald-100', text: 'text-emerald-800' },
      'canceled': { bg: 'bg-red-100', text: 'text-red-800' },
      'rescheduled': { bg: 'bg-amber-100', text: 'text-amber-800' }
    };
    return colors[status];
  };

  // API calls to fetch appointments
 // API calls to fetch appointments
const fetchAppointments = async () => {
  if (!user?._id) return;
  
  setIsLoading(true);
  setError(null);
  try {
    const response = await axiosInstance.get(`/appointments/patient/${user._id}`);
    console.log("Raw response data:", response.data);

    if (response.data.success) {
      // Store the appointments temporarily
      const tempAppointments = response.data.data.map(app => {
        // Extract the doctorId - could be a string or an object
        let doctorId = typeof app.doctorId === 'object' ? app.doctorId?._id : app.doctorId;
        
        return {
          id: app._id,
          doctorId: doctorId || 'unknown',
          doctorName: 'Loading...', // We'll fill this in after getting doctor details
          specialty: 'Loading...', // We'll fill this in after getting doctor details
          date: new Date(app.date),
          startTime: app.startTime,
          endTime: app.endTime,
          status: app.status,
          type: app.type,
          notes: app.notes,
          location: app.location || 'Unknown Location',
          color: app.type
        };
      });
      
      // Now fetch doctor details for each appointment
      const appointmentsWithDoctors = await Promise.all(
        tempAppointments.map(async (app) => {
          // For each appointment, get the doctor details
          try {
            if (app.doctorId !== 'unknown') {
              // First try to find doctor in availableDoctors
              const cachedDoctor = availableDoctors.find(d => 
                // Try different formats of comparison
                d.id === app.doctorId || 
                d.id.toString() === app.doctorId.toString()
              );
              
              if (cachedDoctor) {
                return {
                  ...app,
                  doctorName: cachedDoctor.name,
                  specialty: cachedDoctor.specialty
                };
              } else {
                // If not in cache, make API call to get doctor details
                const doctorResponse = await axiosInstance.get(`/doctors/${app.doctorId}`);
                if (doctorResponse.data.success) {
                  return {
                    ...app,
                    doctorName: doctorResponse.data.data.name,
                    specialty: doctorResponse.data.data.speciality
                  };
                }
              }
            }
          } catch (err) {
            console.error(`Failed to fetch doctor details for ID: ${app.doctorId}`, err);
          }
          
          // Default fallback if doctor details couldn't be retrieved
          return {
            ...app,
            doctorName: 'Unknown Doctor',
            specialty: 'Unknown Specialty'
          };
        })
      );
      
      console.log("Appointments with doctor details:", appointmentsWithDoctors);
      setMyAppointments(appointmentsWithDoctors);
    }
  } catch (error) {
    console.error("Error fetching appointments:", error);
    setError("Failed to load appointments. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  // API call to book appointment
  // API call to book appointment
const bookAppointment = async () => {
  console.log("Book appointment called with:", {
    doctor: selectedDoctor,
    slot: selectedSlot,
    type: selectedType,
    userId: user?._id
  });
  
  if (!selectedDoctor || !selectedSlot || !selectedType || !user?._id) {
    console.log("Missing required fields, returning early");
    return;
  }
  
  setIsLoading(true);
  setError(null);
  try {
    // Calculate end time (30min appointment by default)
    const [hours, minutes] = selectedSlot.split(':').map(Number);
    const endHour = hours + Math.floor((minutes + 30) / 60);
    const endMinutes = (minutes + 30) % 60;
    const endTime = `${String(endHour).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    
    const appointmentData = {
      patientId: user._id,
      doctorId: selectedDoctor.id,
      date: selectedDate.toISOString(),
      startTime: selectedSlot,
      endTime,
      type: selectedType,
      notes: appointmentNotes,
      location: 'Main Clinic'
    };
    
    console.log("Sending appointment data:", appointmentData);
    
    // Make sure your API path matches what's defined in your backend routes
    const response = await axiosInstance.post('/appointments/create', appointmentData);
    
    console.log("Appointment response:", response.data);
    
    if (response.data.success) {
      // Add the new appointment to state
      const newAppointment = response.data.data;
      
      // Create a formatted appointment object matching your Appointment type
      const formattedAppointment: Appointment = {
        id: newAppointment._id,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        specialty: selectedDoctor.specialty,
        date: new Date(selectedDate),
        startTime: selectedSlot,
        endTime,
        status: 'upcoming', // Default status for new appointments
        type: selectedType,
        notes: appointmentNotes,
        location: 'Main Clinic',
        color: selectedType
      };
      
      // Update state with the new appointment
      setMyAppointments(prev => [...prev, formattedAppointment]);
      
      // Show success toast instead of alert
      showToastMessage('Appointment booked successfully!', 'success');
      
      // Close the modal
      setShowBookingModal(false);
      
      // Reset form fields
      setSelectedDoctor(null);
      setSelectedSlot('');
      setSelectedType('general-checkup');
      setAppointmentNotes('');
    }
  } catch (error) {
    console.error("Error booking appointment:", error);
    setError("Failed to book appointment. Please try again.");
    // Show error toast
    showToastMessage('Failed to book appointment. Please try again.', 'error');
  } finally {
    setIsLoading(false);
  }
};

  // Update handleBookAppointment to use the API
  // Make handleBookAppointment async and await the result
const handleBookAppointment = async () => {
  try {
    await bookAppointment();
  } catch (err) {
    console.error("Error in handleBookAppointment:", err);
    setError("Failed to book appointment. Please check the console for details.");
  }
};

  // Fetch available slots for a doctor
  // In Calendars.tsx

  const fetchDoctorAvailableSlots = async (doctorId: string, date: Date) => {
    setIsLoading(true);
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const response = await axiosInstance.get(`/doctors/${doctorId}/available-slots?date=${formattedDate}`);
      
      if (response.data.success) {
        // Store slots in the separate state instead of modifying selectedDoctor
        const slots = response.data.data.map(slot => slot.startTime);
        setAvailableSlots(slots);
      }
    } catch (error) {
      console.error("Error fetching available slots:", error);
      setError("Failed to load available time slots.");
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel an appointment
  const cancelAppointment = async (appointmentId: string) => {
    try {
      const response = await axiosInstance.patch(`/appointments/cancel/${appointmentId}`);
      
      if (response.data.success) {
        // Update the appointment in state
        setMyAppointments(prevAppointments => 
          prevAppointments.map(app => 
            app.id === appointmentId 
              ? { ...app, status: 'canceled' } 
              : app
          )
        );
        
        // Show success toast
        showToastMessage('Appointment canceled successfully', 'success');
      }
    } catch (error) {
      console.error("Error canceling appointment:", error);
      setError("Failed to cancel appointment.");
      
      // Show error toast
      showToastMessage('Failed to cancel appointment', 'error');
    }
  };

  // Reschedule an appointment (opens the booking modal with prefilled values)
  const openRescheduleModal = (appointment: Appointment) => {
    // Find the doctor in availableDoctors
    const doctor = availableDoctors.find(doc => doc.id === appointment.doctorId);
    
    if (doctor) {
      setSelectedDoctor(doctor);
      setSelectedDate(appointment.date);
      setSelectedType(appointment.type);
      setAppointmentNotes(appointment.notes || '');
      // We don't set the time slot yet because we need to fetch available slots first
      
      // The fetchDoctorAvailableSlots will be triggered by the useEffect that watches selectedDoctor and selectedDate
      setShowBookingModal(true);
    }
  };

  // Helper function to convert time string to display format
  const formatTime = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  // Get appointments for the selected date
  const selectedDateAppointments = myAppointments.filter(
    app => app.date.toDateString() === selectedDate.toDateString()
  );

  // Format date to display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  // Fetch doctor details when selected
  useEffect(() => {
    if (selectedDoctor) {
      fetchDoctorAvailableSlots(selectedDoctor.id, selectedDate);
    }
  }, [selectedDoctor, selectedDate]);

  // Fetch initial data
  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
    
    // Fetch doctors
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get('/doctors');
        if (response.data.success) {
          const doctors = response.data.data.map(doc => ({
            id: doc._id,
            name: doc.name,
            specialty: doc.speciality,
            availableSlots: []
          }));

          setAvailableDoctors(doctors);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError("Failed to load doctors list.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDoctors();
  }, [user]); // Add user as dependency

  // Modern calendar rendering with indicators
  const renderCalendar = () => {
    const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    const endDate = new Date(monthEnd);
    
    // Adjust start date to the beginning of the week
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    // Adjust end date to the end of the week
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';
    
    // Render day headers (Sun, Mon, etc.)
    const dayHeaders = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 0; i < 7; i++) {
      dayHeaders.push(
        <motion.div 
          key={`header-${i}`} 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          className="text-center font-medium text-sm py-3 text-slate-600"
        >
          {daysOfWeek[i]}
        </motion.div>
      );
    }
    
    // Render calendar days
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = day.getDate().toString();
        const cloneDay = new Date(day);
        const isToday = day.toDateString() === new Date().toDateString();
        const isSelected = day.toDateString() === selectedDate.toDateString();
        const isCurrentMonth = day.getMonth() === selectedDate.getMonth();
        
        // Find appointments for this day
        const dayAppointments = myAppointments.filter(
          app => app.date.toDateString() === day.toDateString()
        );
        
        // Count appointments by status
        const upcomingCount = dayAppointments.filter(app => app.status === 'upcoming').length;
        const completedCount = dayAppointments.filter(app => app.status === 'completed').length;
        
        days.push(
          <motion.div
            key={day.toString()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.3, 
              delay: i * 0.03, 
              type: "spring", 
              stiffness: 250, 
              damping: 20 
            }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: isCurrentMonth ? "0 4px 12px rgba(0,0,0,0.05)" : "none"
            }}
            className={`relative p-1 border h-24 overflow-hidden transition-all duration-200 ${
              !isCurrentMonth ? 'bg-slate-50/50 text-slate-400' : 'bg-white'
            } ${isToday ? 'bg-blue-50 border-blue-200' : ''} ${isSelected ? 'ring-2 ring-blue-400 shadow-sm' : ''}`}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <div className="flex justify-between items-start p-1">
              <span className={`text-sm font-medium p-1 rounded-full w-6 h-6 flex items-center justify-center
                ${isToday ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' : ''}
                ${isSelected && !isToday ? 'bg-blue-100 text-blue-800' : ''}
              `}>
                {formattedDate}
              </span>
              
              {dayAppointments.length > 0 && (
                <div className="flex space-x-1">
                  {upcomingCount > 0 && (
                    <span className="text-xs rounded-full w-5 h-5 flex items-center justify-center bg-gradient-to-r from-blue-400 to-cyan-400 text-white">
                      {upcomingCount}
                    </span>
                  )}
                  {completedCount > 0 && (
                    <span className="text-xs rounded-full w-5 h-5 flex items-center justify-center bg-gradient-to-r from-green-400 to-emerald-400 text-white">
                      {completedCount}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <AnimatePresence>
              <div className="mt-1 space-y-1">
                {dayAppointments.filter(app => app.status !== 'canceled').slice(0, 2).map((app, index) => {
                  const colorInfo = getAppointmentColor(app.type as AppointmentType);
                  return (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`text-xs p-1 rounded-md truncate shadow-sm ${colorInfo.bg} ${colorInfo.text} border-l-2 ${colorInfo.border}`}
                    >
                      {formatTime(app.startTime)} - {app.doctorName.split(' ')[0]}
                    </motion.div>
                  );
                })}
                {dayAppointments.filter(app => app.status !== 'canceled').length > 2 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-blue-600 font-medium mt-1 bg-blue-50 p-1 rounded text-center"
                  >
                    + {dayAppointments.filter(app => app.status !== 'canceled').length - 2} more
                  </motion.div>
                )}
              </div>
            </AnimatePresence>
          </motion.div>
        );
        day = new Date(day);
        day.setDate(day.getDate() + 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>
      );
      days = [];
    }
    
    return (
      <motion.div 
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-7 gap-1 bg-white rounded-t-lg">
          {dayHeaders}
        </div>
        <div className="border rounded-b-lg overflow-hidden shadow-md bg-slate-100/50 p-1">
          <motion.div layout className="space-y-1">
            {rows}
          </motion.div>
        </div>
      </motion.div>
    );
  };
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

  const renderListView = () => {
    // Group appointments by month
    const groupedAppointments: Record<string, Appointment[]> = {};
    
    myAppointments.forEach(appointment => {
      const monthYear = appointment.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!groupedAppointments[monthYear]) {
        groupedAppointments[monthYear] = [];
      }
      groupedAppointments[monthYear].push(appointment);
    });
    
    // Sort appointments by date
    Object.keys(groupedAppointments).forEach(month => {
      groupedAppointments[month].sort((a, b) => a.date.getTime() - b.date.getTime());
    });
    
    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {Object.keys(groupedAppointments).map((month, monthIndex) => (
          <motion.div 
            key={month}
            variants={itemVariants}
            transition={{ delay: monthIndex * 0.1 }}
          >
            <h3 className="text-lg font-bold mb-4 text-slate-800 border-b pb-2 flex items-center">
              <MdDateRange className="mr-2 text-blue-500" />
              {month}
            </h3>
            <div className="space-y-4">
              {groupedAppointments[month].map((appointment, appIndex) => {
                const colorInfo = getAppointmentColor(appointment.type as AppointmentType);
                const statusInfo = getStatusColor(appointment.status);
                
                return (
                  <motion.div 
                    key={appointment.id}
                    variants={itemVariants}
                    whileHover={{ 
                      y: -5, 
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" 
                    }}
                    className="border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className={`h-1.5 bg-gradient-to-r ${colorInfo.gradient}`}></div>
                    <div className="p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-bold text-slate-800 flex items-center">
                            <MdDateRange className="mr-2 text-blue-500" />
                            {appointment.date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
                          </div>
                          <div className="text-sm text-slate-600 font-medium mt-1 flex items-center">
                            <FaCalendarAlt className="mr-2 text-blue-400" size={12} />
                            {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                          </div>
                        </div>
                        <div className={`text-xs px-3 py-1 rounded-full ${statusInfo.bg} ${statusInfo.text} font-semibold flex items-center`}>
                          {appointment.status === 'upcoming' && <FaCalendarCheck className="mr-1" />}
                          {appointment.status === 'completed' && <FaCheckCircle className="mr-1" />}
                          {appointment.status === 'canceled' && <FaTimesCircle className="mr-1" />}
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold mr-3">
                          {appointment.doctorName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-800">{appointment.doctorName}</div>
                          <div className="text-xs text-slate-500">{appointment.specialty}</div>
                        </div>
                      </div>
                      
                      {appointment.location && (
                        <div className="mt-3 flex items-center text-sm text-slate-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {appointment.location}
                        </div>
                      )}
                      
                      <div className="mt-3 flex items-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs ${colorInfo.bg} ${colorInfo.text} font-medium`}>
                          {appointment.type.replace('-', ' ')}
                        </span>
                      </div>
                      
                      {appointment.status === 'upcoming' && (
                        <div className="mt-4 flex space-x-2">
                          <motion.button 
                            className="flex-1 px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-medium shadow-sm"
                            onClick={() => openRescheduleModal(appointment)}
                            whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                            whileTap={{ y: 0 }}
                          >
                            Reschedule
                          </motion.button>
                          <motion.button 
                            className="flex-1 px-3 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium"
                            onClick={() => cancelAppointment(appointment.id)}
                            whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(255, 0, 0, 0.1)" }}
                            whileTap={{ y: 0 }}
                          >
                            Cancel
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}

        {Object.keys(groupedAppointments).length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10"
          >
            <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <FaCalendarAlt className="text-blue-500 w-8 h-8" />
            </div>
            <h3 className="text-xl font-medium text-slate-800 mb-2">No appointments yet</h3>
            <p className="text-slate-500 mb-6">Schedule your first appointment to get started</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowBookingModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg shadow-md"
            >
              Book an Appointment
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    );
  };

  // Show loading state if user is not yet loaded
  if (!isLoggedIn) {
    return (
      <Layouts>
        <div className="flex flex-col items-center justify-center py-20">
          <motion.div
            animate={{ 
              rotate: 360,
              transition: { duration: 1.5, repeat: Infinity, ease: "linear" }
            }}
            className="w-16 h-16 mb-4"
          >
            <FaSpinner className="w-full h-full text-blue-500" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-blue-600 font-medium"
          >
            Loading your profile...
          </motion.p>
        </div>
      </Layouts>
    );
  }

  return (
    <Layouts>
      <MotionConfig reducedMotion="user">
        <div className="w-full max-w-6xl mx-auto min-h-screen p-4 flex flex-col bg-slate-50">
          <motion.div 
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-6 sm:p-8 rounded-2xl shadow-lg mb-6"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="mb-4 sm:mb-0">
                <motion.div 
                  className="flex items-center"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <MdOutlineWavingHand className="mr-2 text-yellow-300 text-2xl" />
                  <h1 className="text-2xl sm:text-3xl font-bold">My Appointments</h1>
                </motion.div>
                <motion.p 
                  className="opacity-90 mt-1"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Manage your upcoming and past dental appointments
                </motion.p>
              </div>
              <motion.button 
                className="px-4 sm:px-6 py-3 bg-white text-blue-600 rounded-xl font-medium hover:bg-blue-50 shadow-lg transition-all duration-300 hover:shadow-xl flex items-center"
                onClick={() => setShowBookingModal(true)}
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <FaCalendarAlt className="mr-2" />
                Book New Appointment
              </motion.button>
            </div>
          </motion.div>
          
          {error && (
            <motion.div 
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4 flex items-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <FaTimesCircle className="mt-1 mr-2 flex-shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
          
          <motion.div 
            className="flex items-center mb-6 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex p-1 bg-white rounded-xl shadow-sm">
              <motion.button 
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center ${view === 'calendar' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100'}`}
                onClick={() => setView('calendar')}
                whileHover={view !== 'calendar' ? { scale: 1.05 } : {}}
                whileTap={view !== 'calendar' ? { scale: 0.95 } : {}}
              >
                <FaCalendarAlt className="mr-2" />
                Calendar View
              </motion.button>
              <motion.button 
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center ${view === 'list' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100'}`}
                onClick={() => setView('list')}
                whileHover={view !== 'list' ? { scale: 1.05 } : {}}
                whileTap={view !== 'list' ? { scale: 0.95 } : {}}
              >
                <FaListAlt className="mr-2" />
                List View
              </motion.button>
            </div>
          </motion.div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div
                animate={{ 
                  rotate: 360,
                  transition: { duration: 1.5, repeat: Infinity, ease: "linear" }
                }}
                className="w-16 h-16"
              >
                <FaSpinner className="w-full h-full text-blue-500" />
              </motion.div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {view === 'calendar' && (
                <motion.div 
                  key="calendar-view"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center">
                      <motion.button 
                        className="p-2 rounded-full hover:bg-blue-50 text-blue-600 transition-colors"
                        onClick={() => {
                          const newDate = new Date(selectedDate);
                          newDate.setMonth(newDate.getMonth() - 1);
                          setSelectedDate(newDate);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </motion.button>
                      <motion.h2 
                        className="text-xl sm:text-2xl font-bold text-slate-800 mx-4"
                        key={selectedDate.toISOString()}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </motion.h2>
                      <motion.button 
                        className="p-2 rounded-full hover:bg-blue-50 text-blue-600 transition-colors"
                        onClick={() => {
                          const newDate = new Date(selectedDate);
                          newDate.setMonth(newDate.getMonth() + 1);
                          setSelectedDate(newDate);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.button>
                    </div>
                    <motion.button 
                      className="px-4 py-2 border border-blue-300 rounded-lg bg-white text-blue-600 font-medium hover:bg-blue-50 transition-colors shadow-sm flex items-center justify-center sm:justify-start"
                      onClick={() => setSelectedDate(new Date())}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MdDateRange className="mr-1" />
                      Today
                    </motion.button>
                  </div>
                  
                  {renderCalendar()}
                  
                  <AnimatePresence>
                    {selectedDateAppointments.length > 0 && (
                      <motion.div 
                        className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        key={selectedDate.toISOString()}
                      >
                        <h3 className="font-medium text-blue-800 mb-4 flex items-center">
                          <FaCalendarCheck className="mr-2" />
                          Appointments for {formatDate(selectedDate)}
                        </h3>
                        <motion.div 
                          className="space-y-3"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {selectedDateAppointments.filter(app => app.status !== 'canceled').map((appointment, index) => {
                            const colorInfo = getAppointmentColor(appointment.type as AppointmentType);
                            const statusInfo = getStatusColor(appointment.status);
                            
                            return (
                              <motion.div 
                                key={appointment.id}
                                variants={itemVariants}
                                whileHover={{ y: -2, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                                className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-all"
                              >
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <div className={`w-1.5 h-10 rounded-full ${colorInfo.border} mr-3`}></div>
                                    <div>
                                      <div className="font-medium text-slate-800 flex items-center">
                                        <FaCalendarAlt className="mr-2 text-blue-500 text-xs" />
                                        {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                                      </div>
                                      <div className="text-sm text-slate-600 mt-0.5">
                                        {appointment.doctorName} • {appointment.type.replace('-', ' ')}
                                      </div>
                                    </div>
                                  </div>
                                  <div className={`text-xs px-3 py-1 rounded-full ${statusInfo.bg} ${statusInfo.text} font-medium flex items-center`}>
                                    {appointment.status === 'upcoming' && <FaCalendarCheck className="mr-1" />}
                                    {appointment.status === 'completed' && <FaCheckCircle className="mr-1" />}
                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                  </div>
                                </div>
                                
                                {appointment.location && (
                                  <div className="mt-2 text-xs text-slate-500 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {appointment.location}
                                  </div>
                                )}
                                
                                {appointment.status === 'upcoming' && (
                                  <div className="mt-3 flex space-x-2">
                                    <motion.button 
                                      className="text-xs px-3 py-1.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 font-medium flex items-center"
                                      onClick={() => openRescheduleModal(appointment)}
                                      whileHover={{ y: -2, boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
                                      whileTap={{ y: 0 }}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      Reschedule
                                    </motion.button>
                                    <motion.button 
                                      className="text-xs px-3 py-1.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium flex items-center"
                                      onClick={() => cancelAppointment(appointment.id)}
                                      whileHover={{ y: -2, boxShadow: "0 2px 4px rgba(220, 38, 38, 0.1)" }}
                                      whileTap={{ y: 0 }}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                      Cancel
                                    </motion.button>
                                  </div>
                                )}
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
              
              {view === 'list' && (
                <motion.div 
                  key="list-view"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-lg p-4 sm:p-6"
                >
                  {renderListView()}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
        
        <AnimatePresence>
          {showBookingModal && (
            <motion.div 
              className="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-50 backdrop-blur-sm overflow-y-auto p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                    <FaCalendarCheck className="mr-2 text-blue-500" />
                    Book Appointment
                  </h2>
                  <motion.button 
                    onClick={() => setShowBookingModal(false)}
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700"
                    disabled={isLoading}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-slate-700">Select Date</label>
                    <input 
                      type="date" 
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      value={selectedDate.toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(new Date(e.target.value))}
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-slate-700">Select Doctor</label>
                    <select
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                      value={selectedDoctor?.id || ''}
                      onChange={(e) => {
                        const doctor = availableDoctors.find(d => d.id === e.target.value);
                        setSelectedDoctor(doctor || null);
                        setSelectedSlot('');
                      }}
                      disabled={isLoading}
                    >
                      <option value="">Choose a doctor</option>
                      {availableDoctors.map(doctor => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name} - {doctor.specialty}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedDoctor && (
                    <div>
                      <label className="block text-sm font-medium mb-1.5 text-slate-700">Available Time Slots</label>
                      {isLoading ? (
                        <div className="flex justify-center py-4">
                          <motion.div
                            animate={{ 
                              rotate: 360,
                              transition: { duration: 1.5, repeat: Infinity, ease: "linear" }
                            }}
                            className="w-6 h-6"
                          >
                            <FaSpinner className="w-full h-full text-blue-500" />
                          </motion.div>
                        </div>
                      ) : availableSlots.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-100 rounded-lg bg-slate-50/50">
                          {availableSlots.map((slot, index) => (
                            <motion.button
                              key={slot}
                              className={`p-3 border rounded-lg text-center transition-all ${
                                selectedSlot === slot 
                                  ? 'bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-300 text-blue-700 font-medium' 
                                  : 'hover:bg-slate-50 text-slate-700 border-slate-200'
                              }`}
                              onClick={() => setSelectedSlot(slot)}
                              disabled={isLoading}
                              whileHover={{ y: -2, boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
                              whileTap={{ y: 0 }}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.02 }}
                            >
                              {formatTime(slot)}
                            </motion.button>
                          ))}
                        </div>
                      ) : (
                        <motion.p 
                          className="text-center text-slate-500 py-3 bg-slate-50 rounded-lg border border-slate-100"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          No available slots for this date
                        </motion.p>
                      )}
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-slate-700">Appointment Type</label>
                    
                    {/* First row always visible */}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {(['general-checkup', 'scaling'] as AppointmentType[]).map((type, index) => {
                        const colorInfo = getAppointmentColor(type);
                        return (
                          <motion.button
                            key={type}
                            className={`p-3 rounded-lg text-center transition-all border ${
                              selectedType === type 
                                ? `${colorInfo.bg} ${colorInfo.border} ${colorInfo.text} font-medium` 
                                : 'hover:bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                            onClick={() => setSelectedType(type)}
                            disabled={isLoading}
                            whileHover={{ y: -2 }}
                            whileTap={{ y: 0 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            {type.replace('-', ' ')}
                          </motion.button>
                        );
                      })}
                    </div>
                    
                    {/* Rest of appointment types in scrollable container */}
                    <div className="max-h-24 overflow-y-auto pr-1 border border-slate-100 rounded-lg bg-slate-50/50">
                      <div className="grid grid-cols-2 gap-2 p-2">
                        {(['extraction', 'bleaching', 'consultation', 'other'] as AppointmentType[]).map((type, index) => {
                          const colorInfo = getAppointmentColor(type);
                          return (
                            <motion.button
                              key={type}
                              className={`p-3 rounded-lg text-center transition-all border ${
                                selectedType === type 
                                  ? `${colorInfo.bg} ${colorInfo.border} ${colorInfo.text} font-medium` 
                                  : 'hover:bg-slate-50 text-slate-700 border-slate-200'
                              }`}
                              onClick={() => setSelectedType(type)}
                              disabled={isLoading}
                              whileHover={{ y: -2 }}
                              whileTap={{ y: 0 }}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 + index * 0.1 }}
                            >
                              {type.replace('-', ' ')}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-slate-700">Notes (Optional)</label>
                    <textarea
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y min-h-[80px]"
                      placeholder="Add any special requests or notes for the doctor..."
                      value={appointmentNotes}
                      onChange={(e) => setAppointmentNotes(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="pt-5 sticky bottom-0 bg-white pb-1 mt-5">
                  <motion.button 
                    onClick={handleBookAppointment}
                    className={`w-full py-3 px-4 rounded-lg font-medium text-white shadow-md transition-all flex items-center justify-center ${
                      !selectedDoctor || !selectedSlot
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg'
                    }`}
                    disabled={!selectedDoctor || !selectedSlot || isLoading}
                    whileHover={!(!selectedDoctor || !selectedSlot || isLoading) ? { scale: 1.02 } : {}}
                    whileTap={!(!selectedDoctor || !selectedSlot || isLoading) ? { scale: 0.98 } : {}}
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ 
                            rotate: 360,
                            transition: { duration: 1, repeat: Infinity, ease: "linear" }
                          }}
                          className="w-4 h-4 mr-2"
                        >
                          <FaSpinner className="w-full h-full" />
                        </motion.div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaCalendarCheck className="mr-2" />
                        Book Appointment
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {showToast && (
            <motion.div 
              className={`fixed bottom-4 right-4 py-3 px-4 rounded-lg shadow-lg flex items-center ${
                toastType === 'success' ? 'bg-green-500 text-white' : 
                toastType === 'error' ? 'bg-red-500 text-white' : 
                'bg-blue-500 text-white'
              }`}
              initial={{ opacity: 0, y: 50, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              {toastType === 'success' && <FaCheckCircle className="mr-2" />}
              {toastType === 'error' && <FaTimesCircle className="mr-2" />}
              {toastType === 'info' && <FaCalendarAlt className="mr-2" />}
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </MotionConfig>
    </Layouts>
  );
};

export default Calendars;                         