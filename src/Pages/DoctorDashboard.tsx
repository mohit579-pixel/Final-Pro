import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUsers, FaCalendarCheck, FaUserMd, FaMoneyBillWave,
  FaChartLine, FaBell, FaUserInjured, FaTooth
} from 'react-icons/fa';
import {
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie,
  AreaChart, Area, Cell
} from 'recharts';
import axiosInstance from '../Helper/axiosInstance';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Layout from '@/Layout/Layout';
import { useNavigate } from 'react-router-dom';

interface Activity {
  description: string;
  time: string;
}

interface DashboardStats {
  totalPatients: number;
  totalAppointments: number;
  todayAppointments: number;
  totalRevenue: number;
  appointmentStats: {
    date: string;
    count: number;
  }[];
  appointmentTypes: {
    name: string;
    value: number;
  }[];
  statusDistribution: {
    name: string;
    value: number;
  }[];
  recentActivity: Activity[];
}

interface RootState {
  auth: {
    data: {
      _id: string;
      fullName: string;
      role: string;
    };
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658'];

const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.data);

  // Function to fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/doctors/${user?._id}/dashboard`);
      console.log(response.data);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch {
      const errorMessage = 'Failed to fetch dashboard data';
      // setLoading(false);
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [user?._id]);

  // Initial data fetch
  useEffect(() => {
    if (user?._id) {
      fetchDashboardData();
    }
  }, [user?._id, fetchDashboardData]);

  // Set up polling for real-time updates (every 30 seconds)
  useEffect(() => {
    if (!user?._id) return;

    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [user?._id, fetchDashboardData]);

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
  //       <div className="text-center">
  //         <FaSpinner className="animate-spin text-blue-600 text-4xl mx-auto mb-4" />
  //         <p className="text-gray-600 text-lg font-medium">Loading your dashboard...</p>
  //       </div>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl">
          <div className="text-red-500 text-xl mb-4 font-semibold">{error}</div>
          <p className="text-gray-600 mb-6">We're having trouble loading your dashboard data. Please try again.</p>
          <button 
            onClick={() => {
              // setLoading(true);
              setError(null);
              fetchDashboardData();
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Refresh Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
          <FaChartLine className="text-gray-400 text-5xl mb-4 mx-auto" />
          <p className="text-gray-600 text-xl font-medium">No dashboard data available</p>
          <p className="text-gray-500 mt-2">Please check back later</p>
        </div>
      </div>
    );
  }

  // Calculate percentage changes
  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  // Get percentage changes from the stats
  const patientChange = calculatePercentageChange(
    stats.totalPatients,
    stats.totalPatients - (stats.appointmentStats[0]?.count || 0)
  );

  const appointmentChange = calculatePercentageChange(
    stats.totalAppointments,
    stats.totalAppointments - (stats.appointmentStats[0]?.count || 0)
  );

  const revenueChange = calculatePercentageChange(
    stats.totalRevenue,
    stats.totalRevenue - (stats.appointmentStats[0]?.count * 100 || 0)
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header Section with Animated Welcome */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-blue-100"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <motion.h1 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text"
                >
                  Welcome back, Dr. {user?.fullName}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 mt-2 text-lg"
                >
                  Your dental practice overview
                </motion.p>
              </div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4 md:mt-0 flex space-x-4"
              >
                <button 
                  onClick={() => navigate('/doctor/schedule')}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  View Schedule
                </button>
                <button 
                  onClick={() => navigate('/doctor/appointments/new')}
                  className="bg-white text-blue-600 px-6 py-3 rounded-xl border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  New Appointment
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats Cards with Enhanced Animations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                icon: FaUsers,
                title: "Total Patients",
                value: stats.totalPatients,
                change: patientChange,
                color: "blue",
                bgColor: "bg-blue-100",
                textColor: "text-blue-600"
              },
              {
                icon: FaCalendarCheck,
                title: "Total Appointments",
                value: stats.totalAppointments,
                change: appointmentChange,
                color: "green",
                bgColor: "bg-green-100",
                textColor: "text-green-600"
              },
              {
                icon: FaTooth,
                title: "Today's Appointments",
                value: stats.todayAppointments,
                change: 0,
                color: "yellow",
                bgColor: "bg-yellow-100",
                textColor: "text-yellow-600"
              },
              {
                icon: FaMoneyBillWave,
                title: "Total Revenue",
                value: `$${stats.totalRevenue}`,
                change: revenueChange,
                color: "purple",
                bgColor: "bg-purple-100",
                textColor: "text-purple-600"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
              >
                <div className="flex items-center">
                  <div className={`p-3 ${stat.bgColor} rounded-full`}>
                    <stat.icon className={`${stat.textColor} text-2xl`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                    <p className={`text-xs ${stat.change >= 0 ? 'text-green-500' : 'text-red-500'} mt-1`}>
                      {stat.change >= 0 ? '↑' : '↓'} {Math.abs(stat.change).toFixed(1)}% from last month
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Appointments Over Time with Area Chart */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Appointment Trends</h3>
                <select className="text-sm border rounded-lg px-3 py-2 bg-white">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.appointmentStats}>
                    <defs>
                      <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#8884d8" 
                      fillOpacity={1} 
                      fill="url(#colorAppointments)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Treatment Distribution with Enhanced Pie Chart */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Treatment Distribution</h3>
                <div className="flex space-x-2">
                  <button className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-600">Weekly</button>
                  <button className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600">Monthly</button>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.appointmentTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      animationDuration={1500}
                    >
                      {stats.appointmentTypes?.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend 
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right"
                      wrapperStyle={{
                        paddingLeft: "20px"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Recent Activity and Quick Actions with Enhanced Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity with Timeline */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <AnimatePresence>
                  {stats.recentActivity?.map((activity, index) => (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      key={index}
                      className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg hover:from-blue-100 hover:to-cyan-100 transition-all duration-300"
                    >
                      <div className="p-2 bg-blue-100 rounded-full">
                        <FaUserMd className="text-blue-600" />
                      </div>
                      <div className="ml-4 flex-grow">
                        <p className="text-sm font-medium text-gray-800">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      <button className="ml-4 text-sm text-blue-600 hover:text-blue-700 transition-colors">
                        View Details
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Quick Actions with Enhanced UI */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  {
                    icon: FaCalendarCheck,
                    title: "Schedule Appointment",
                    color: "blue",
                    path: "/doctor/appointments/new"
                  },
                  {
                    icon: FaUserInjured,
                    title: "Add New Patient",
                    color: "green",
                    path: "/doctor/patients/new"
                  },
                  {
                    icon: FaBell,
                    title: "View Notifications",
                    color: "purple",
                    path: "/doctor/notifications"
                  }
                ].map((action, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(action.path)}
                    className={`w-full flex items-center p-4 bg-${action.color}-50 rounded-lg hover:bg-${action.color}-100 transition-all duration-300`}
                  >
                    <action.icon className={`text-${action.color}-600`} />
                    <span className="ml-3 text-sm font-medium text-gray-700">{action.title}</span>
                  </motion.button>
                ))}
              </div>

              {/* Today's Schedule Preview with Enhanced UI */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Today's Schedule</h4>
                <div className="space-y-2">
                  {stats.recentActivity?.slice(0, 2).map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg hover:from-gray-100 hover:to-blue-100 transition-all duration-300"
                    >
                      <p className="text-sm font-medium text-gray-800">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default DoctorDashboard; 