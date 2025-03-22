// import React from 'react'

// import DemoPage from "@/app/payments/page";
import { PieCharts } from "@/components/chart-pie-donut-text"
import { HeartbeatChart } from "@/components/hearbeat-chart";
import { LineCharts } from "@/components/line-charts";
import { RadialCharts } from "@/components/radial-charts"
// import { Tooltips } from "@/components/tooltip-charts"
import Layouts from "@/Layout/Layout"
import { ErrorBoundary } from "react-error-boundary";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaTeeth, FaClipboardList, FaBell, FaSpinner } from "react-icons/fa";
import { MdHealthAndSafety, MdTimeline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import axiosInstance from '../Helper/axiosInstance.js';
// Define types for Redux state
interface AuthData {
  _id: string;
  fullName: string;
  // other auth data properties
}

interface AuthState {
  data: AuthData | null;
}

interface RootState {
  auth: AuthState;
}

// Define types for appointment data
interface Doctor {
  _id: string;
  name: string;
}

interface Appointment {
  _id: string;
  startTime: string;
  endTime: string;
  type: string;
  status: string;
  duration: string;
  doctorId: Doctor;
  date?: string; // Added date field
}

// Animated section container for dashboard widgets
const AnimatedSection = ({ 
  children, 
  className = "", 
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

// Widget header component with title and icon
const WidgetHeader = ({ 
  title, 
  icon, 
  action 
}: { 
  title: string; 
  icon: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <div className="flex items-center justify-between border-b border-slate-100 p-4">
    <div className="flex items-center gap-2">
      <div className="text-blue-600">{icon}</div>
      <h3 className="font-semibold text-slate-800">{title}</h3>
    </div>
    {action && <div>{action}</div>}
  </div>
);



const Dashboard = () => {
  const navigate = useNavigate();
  
  // State for appointments
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [appointmentError, setAppointmentError] = useState<string | null>(null);
  const username = useSelector((state: RootState) => state?.auth?.data?.fullName);
  const patientid = useSelector((state: RootState) => state?.auth?.data?._id);
  // Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoadingAppointments(true);
        // const token = localStorage.getItem("token");
        
        const response = await axiosInstance.get(`/appointments/patient/${patientid}`);
        console.log("New:",response.data);
        
        // Check if response.data is an array or contains an appointments property
        if (Array.isArray(response.data)) {
          setAppointments(response.data);
          setAppointmentError(null);
        } else if (response.data && Array.isArray(response.data.appointments)) {
          setAppointments(response.data.appointments);
          setAppointmentError(null);
        } else if (response.data && typeof response.data === 'object') {
          // If the API returns an object with appointment data in a different property
          // Look for any array property that might contain appointments
          const possibleAppointmentsArray = Object.values(response.data)
            .find(value => Array.isArray(value)) as Appointment[] | undefined;
          
          if (possibleAppointmentsArray) {
            setAppointments(possibleAppointmentsArray);
            setAppointmentError(null);
          } else {
            console.error("Response does not contain an appointments array:", response.data);
            setAppointmentError("Invalid appointment data format");
            toast.error("Could not parse appointment data");
          }
        } else {
          console.error("Unexpected response format:", response.data);
          setAppointmentError("Invalid appointment data format");
          toast.error("Could not parse appointment data");
        }
        
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setAppointmentError("Failed to load appointments");
        toast.error("Could not load your appointments");
      } finally {
        setLoadingAppointments(false);
      }
    };
    
    if (patientid) {
      fetchAppointments();
    } else {
      setLoadingAppointments(false);
      setAppointmentError("Patient ID not available");
    }
  }, [patientid]);

  // Mock data for treatment plan
  const treatmentPlan = [
    {
      id: 1,
      procedure: "Cavity Filling",
      status: "Completed",
      date: "April 10, 2023",
      notes: "Upper right molar"
    },
    {
      id: 2,
      procedure: "Root Canal",
      status: "Scheduled",
      date: "May 18, 2023",
      notes: "Lower left incisor"
    },
    {
      id: 3,
      procedure: "Teeth Whitening",
      status: "Recommended",
      date: "June 2023",
      notes: "Professional in-office treatment"
    }
  ];

  // Safely format appointment date
  const formatAppointmentDate = (dateString: string | undefined): string => {
    if (!dateString) return "No date available";
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) return "Invalid date";
      
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date error";
    }
  };

  // Safely format appointment time
  const formatAppointmentTime = (dateString: string | undefined): string => {
    if (!dateString) return "No time available";
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) return "Invalid time";
      
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Time error";
    }
  };

  // Calculate days since last visit and upcoming appointments count
  const calculateStats = () => {
    const today = new Date();
    
    // Sort appointments by date (newest first)
    const sortedAppointments = [...appointments].sort((a, b) => 
      new Date(b.startTime || b.date || "").getTime() - new Date(a.startTime || a.date || "").getTime()
    );
    
    // Find completed appointments (assuming status "completed" indicates a past appointment)
    const completedAppointments = sortedAppointments.filter(
      app => app.status.toLowerCase() === "completed"
    );
    
    // Find upcoming appointments (assuming startTime in the future and not cancelled)
    const upcomingApps = sortedAppointments.filter(app => {
      const appointmentDate = new Date(app.startTime || app.date || "");
      const isValidDate = !isNaN(appointmentDate.getTime());
      const isFutureDate = isValidDate && appointmentDate > today;
      const isNotCancelled = app.status.toLowerCase() !== "cancelled" && 
                             app.status.toLowerCase() !== "canceled";
      
      return isFutureDate && isNotCancelled;
    });
    
    // Calculate days since last visit
    let daysSinceLastVisit = 0;
    let nextCheckupDays = 180; // Default 6 months
    
    if (completedAppointments.length > 0) {
      const lastVisitDate = completedAppointments[0].startTime || completedAppointments[0].date;
      if (lastVisitDate) {
        const lastVisit = new Date(lastVisitDate);
        if (!isNaN(lastVisit.getTime())) {
          const diffTime = Math.abs(today.getTime() - lastVisit.getTime());
          daysSinceLastVisit = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          // Calculate days until next recommended checkup (assuming 6 month intervals)
          nextCheckupDays = Math.max(0, 180 - daysSinceLastVisit);
        }
      }
    }
    
    return {
      daysSinceLastVisit,
      nextCheckupDays,
      upcomingAppointments: upcomingApps.length,
      totalAppointments: appointments.length
    };
  };

  // Get stats
  const stats = calculateStats();

  // Get filtered and sorted appointments for display
  const getUpcomingAppointments = () => {
    const today = new Date();
    
    // Filter for only upcoming and non-cancelled appointments
    return appointments
      .filter(app => {
        const appointmentDate = new Date(app.startTime || app.date || "");
        const isValidDate = !isNaN(appointmentDate.getTime());
        const isFutureDate = isValidDate && appointmentDate > today;
        const isNotCancelled = app.status.toLowerCase() !== "cancelled" && 
                               app.status.toLowerCase() !== "canceled";
        
        return isFutureDate && isNotCancelled;
      })
      // Sort by date (closest first)
      .sort((a, b) => {
        const dateA = new Date(a.startTime || a.date || "");
        const dateB = new Date(b.startTime || b.date || "");
        
        // Handle invalid dates
        if (isNaN(dateA.getTime())) return 1;
        if (isNaN(dateB.getTime())) return -1;
        
        return dateA.getTime() - dateB.getTime();
      });
  };

  // Cancel appointment
  const handleCancelAppointment = async (appointmentId: string): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      
      // Update this URL to match your API endpoint for canceling appointments
      await axiosInstance.patch(`/appointments/cancel/${appointmentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update the local state to reflect cancellation
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment._id === appointmentId 
            ? { ...appointment, status: "cancelled" } 
            : appointment
        )
      );
      
      toast.success("Appointment cancelled successfully");
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("Failed to cancel appointment");
    }
  };

  // Animation variants for staggered children
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Get the filtered and sorted upcoming appointments
  const upcomingAppointments = getUpcomingAppointments();

  return (
    <ErrorBoundary fallback={<div>Something went wrong!</div>}>
      <Layouts>
        <div className="p-6 bg-gradient-to-b from-slate-50 to-white min-h-screen">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Welcome back, <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text">{username}</span></h1>
            <p className="text-slate-500">Here's an overview of your dental health and upcoming appointments</p>
          </motion.div>

          {/* Health Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { 
                title: "Dental Health Score", 
                value: "92", 
                icon: <FaTeeth className="w-5 h-5" />, 
                change: "+2% from last visit",
                color: "bg-green-50 text-green-700"
              },
              { 
                title: "Days Since Last Visit", 
                value: stats.daysSinceLastVisit.toString(), 
                icon: <MdHealthAndSafety className="w-5 h-5" />, 
                change: `Next check-up in ${stats.nextCheckupDays} days`,
                color: "bg-blue-50 text-blue-700"
              },
              { 
                title: "Total Appointments", 
                value: stats.totalAppointments.toString(), 
                icon: <FaCalendarAlt className="w-5 h-5" />, 
                change: `${stats.upcomingAppointments} upcoming`,
                color: "bg-purple-50 text-purple-700"
              },
              { 
                title: "Treatment Progress", 
                value: "67%", 
                icon: <MdTimeline className="w-5 h-5" />, 
                change: "2 of 3 completed",
                color: "bg-amber-50 text-amber-700"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white p-4 rounded-xl shadow-sm border border-slate-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-slate-500 text-sm">{stat.title}</p>
                  <div className={`p-2 rounded-full ${stat.color} bg-opacity-20`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                  <p className="text-xs text-slate-500 pb-1">{stat.change}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Health Trends */}
            <AnimatedSection className="lg:col-span-2" delay={0.2}>
              <WidgetHeader 
                title="Oral Health Trends" 
                icon={<MdHealthAndSafety className="w-5 h-5" />} 
              />
              <div className="p-4 h-[300px]">
                <HeartbeatChart />
              </div>
            </AnimatedSection>
            
            {/* Treatment Distribution */}
            <AnimatedSection delay={0.3}>
              <WidgetHeader 
                title="Treatment Distribution" 
                icon={<FaTeeth className="w-5 h-5" />} 
              />
              <div className="p-4 h-[300px]">
                <PieCharts />
              </div>
            </AnimatedSection>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Upcoming Appointments */}
            <AnimatedSection className="lg:col-span-2" delay={0.4}>
              <WidgetHeader 
                title="Upcoming Appointments" 
                icon={<FaCalendarAlt className="w-5 h-5" />}
                action={
                  <button 
                    onClick={() => navigate("/patient/calendar")}
                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                  >
                    View All
                  </button>
                }
              />
              <div className="p-4">
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {loadingAppointments ? (
                    <div className="flex justify-center items-center p-8">
                      <FaSpinner className="animate-spin text-blue-500 w-8 h-8" />
                    </div>
                  ) : appointmentError ? (
                    <div className="text-center p-6">
                      <p className="text-red-500">{appointmentError}</p>
                      <button 
                        onClick={() => window.location.reload()}
                        className="mt-2 px-4 py-2 rounded-lg text-white bg-blue-600 font-medium text-sm"
                      >
                        Try Again
                      </button>
                      
                      {/* Developer debug info - only shows in development mode */}
                      {process.env.NODE_ENV === 'development' && (
                        <div className="mt-4 p-4 bg-gray-100 rounded-md text-left">
                          <details>
                            <summary className="cursor-pointer font-medium text-sm text-gray-700">Debug Response Data</summary>
                            <div className="mt-2 overflow-auto max-h-48 text-xs">
                              <pre>{JSON.stringify({patientId: patientid}, null, 2)}</pre>
                            </div>
                          </details>
                        </div>
                      )}
                    </div>
                  ) : upcomingAppointments.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingAppointments.map((appointment) => (
                        <motion.div
                          key={appointment._id}
                          variants={item}
                          className="p-3 rounded-lg bg-slate-50 border border-slate-100"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <h4 className="font-medium text-slate-800">{appointment.type || "Appointment"}</h4>
                              </div>
                              <p className="text-sm text-slate-500 mt-1">
                                With {appointment.doctorId?.name || "Your Dentist"}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-sm font-medium text-slate-800">
                                  {formatAppointmentDate(appointment.startTime || appointment.date)}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {formatAppointmentTime(appointment.startTime || appointment.date)} • {appointment.duration || "30"} min
                                </p>
                              </div>
                              <button 
                                className="px-3 py-1 rounded text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                                onClick={() => handleCancelAppointment(appointment._id)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <p className="text-slate-500">No upcoming appointments</p>
                      <button 
                        onClick={() => navigate("/patient/calendar")}
                        className="mt-2 px-4 py-2 rounded-lg text-white bg-gradient-to-r from-blue-600 to-cyan-500 font-medium text-sm"
                      >
                        Book Appointment
                      </button>
                    </div>
                  )}
                </motion.div>
              </div>
            </AnimatedSection>
            
            {/* Treatment Progress */}
            <AnimatedSection delay={0.5}>
              <WidgetHeader 
                title="Treatment Progress" 
                icon={<FaClipboardList className="w-5 h-5" />} 
              />
              <div className="p-4 h-[300px]">
                <RadialCharts />
              </div>
            </AnimatedSection>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Treatment Plan */}
            <AnimatedSection className="lg:col-span-2" delay={0.6}>
              <WidgetHeader 
                title="Your Treatment Plan" 
                icon={<FaClipboardList className="w-5 h-5" />} 
              />
              <div className="p-4">
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 rounded-l-lg">Procedure</th>
                        <th scope="col" className="px-4 py-3">Status</th>
                        <th scope="col" className="px-4 py-3">Date</th>
                        <th scope="col" className="px-4 py-3 rounded-r-lg">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {treatmentPlan.map((treatment, index) => (
                        <motion.tr 
                          key={treatment.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index + 0.6 }}
                          className="bg-white border-b border-slate-100"
                        >
                          <td className="px-4 py-3 font-medium text-slate-800">
                            {treatment.procedure}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              treatment.status === 'Completed' 
                                ? 'bg-green-100 text-green-800' 
                                : treatment.status === 'Scheduled'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {treatment.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-500">{treatment.date}</td>
                          <td className="px-4 py-3 text-slate-500">{treatment.notes}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </AnimatedSection>
            
            {/* Health Reminders */}
            <AnimatedSection delay={0.7}>
              <WidgetHeader 
                title="Health Reminders" 
                icon={<FaBell className="w-5 h-5" />} 
              />
              <div className="p-4">
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="space-y-3"
                >
                  {[
                    {
                      title: "Oral Hygiene Check",
                      description: "Remember to brush twice daily and floss regularly",
                      icon: <FaTeeth className="w-4 h-4" />,
                      color: "bg-blue-100 text-blue-600"
                    },
                    {
                      title: "Mouthwash Reminder",
                      description: "Use antibacterial mouthwash to reduce plaque",
                      icon: <MdHealthAndSafety className="w-4 h-4" />,
                      color: "bg-green-100 text-green-600"
                    },
                    {
                      title: "Regular Checkup",
                      description: "Schedule your next 6-month checkup",
                      icon: <FaCalendarAlt className="w-4 h-4" />,
                      color: "bg-purple-100 text-purple-600"
                    }
                  ].map((reminder, index) => (
                    <motion.div 
                      key={index}
                      variants={item}
                      className="p-3 border border-slate-100 rounded-lg"
                    >
                      <div className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full ${reminder.color} flex items-center justify-center shrink-0`}>
                          {reminder.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-800">{reminder.title}</h4>
                          <p className="text-xs text-slate-500">{reminder.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
          
          {/* Health Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-6 text-white"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold mb-2">Your Dental Health Score is Improving!</h3>
                <p className="text-blue-50">Your regular visits and improved hygiene routine are paying off. Keep up the good work!</p>
              </div>
              <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors text-sm whitespace-nowrap">
                View Full Report
              </button>
            </div>
          </motion.div>

          {/* Health Insights Charts */}
          <AnimatedSection delay={0.75} className="lg:col-span-3 mt-6">
            <WidgetHeader 
              title="Oral Health Analysis" 
              icon={<MdHealthAndSafety className="w-5 h-5" />} 
            />
            <div className="p-4 h-[300px]">
              <LineCharts />
            </div>
          </AnimatedSection>
        </div>
      </Layouts>
    </ErrorBoundary>
  );
};

export default Dashboard
