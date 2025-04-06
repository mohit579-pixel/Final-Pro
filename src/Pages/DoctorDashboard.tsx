import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUsers, FaCalendarCheck, FaClock, FaUserMd, FaMoneyBillWave,
  FaChartLine, FaBell, FaUserInjured, FaCalendarAlt, FaSpinner
} from 'react-icons/fa';
import axiosInstance from '../Helper/axiosInstance';
import { useSelector } from 'react-redux';
import Layout from '@/Layout/Layout';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { toast } from 'react-hot-toast';
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.data);

  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get(`/doctors/${user?._id}/dashboard`);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard data:', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (user?._id) {
      fetchDashboardData();
    }
  }, [user?._id]);

  // Set up polling for real-time updates (every 30 seconds)
  useEffect(() => {
    if (!user?._id) return;

    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [user?._id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <FaSpinner className="animate-spin text-blue-600 text-4xl mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl">
          <div className="text-red-500 text-xl mb-4 font-semibold">{error}</div>
          <p className="text-gray-600 mb-6">We're having trouble loading your dashboard data. Please try again.</p>
          <button 
            onClick={() => {
              setLoading(true);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-gray-800"
              >
                Welcome back, Dr. {user?.fullName}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-600 mt-2"
              >
                Here's what's happening with your practice today
              </motion.p>
            </div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-4 md:mt-0"
            >
              <button 
                onClick={() => navigate('/doctor/schedule')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                View Schedule
              </button>
            </motion.div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FaUsers className="text-blue-600 text-2xl" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm font-medium">Total Patients</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stats.totalPatients}</h3>
                  <p className={`text-xs ${patientChange >= 0 ? 'text-green-500' : 'text-red-500'} mt-1`}>
                    {patientChange >= 0 ? '↑' : '↓'} {Math.abs(patientChange).toFixed(1)}% from last month
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <FaCalendarCheck className="text-green-600 text-2xl" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm font-medium">Total Appointments</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stats.totalAppointments}</h3>
                  <p className={`text-xs ${appointmentChange >= 0 ? 'text-green-500' : 'text-red-500'} mt-1`}>
                    {appointmentChange >= 0 ? '↑' : '↓'} {Math.abs(appointmentChange).toFixed(1)}% this week
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <FaClock className="text-yellow-600 text-2xl" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm font-medium">Today's Appointments</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stats.todayAppointments}</h3>
                  <p className="text-xs text-blue-500 mt-1">
                    Next appointment in {stats.recentActivity[0]?.time || 'N/A'}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <FaMoneyBillWave className="text-purple-600 text-2xl" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                  <h3 className="text-2xl font-bold text-gray-800">${stats.totalRevenue}</h3>
                  <p className={`text-xs ${revenueChange >= 0 ? 'text-green-500' : 'text-red-500'} mt-1`}>
                    {revenueChange >= 0 ? '↑' : '↓'} {Math.abs(revenueChange).toFixed(1)}% this month
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Appointments Over Time */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Appointment Trends</h3>
                <select className="text-sm border rounded-lg px-2 py-1">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.appointmentStats}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
                      fill="url(#colorCount)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Appointment Types Distribution */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Appointment Types</h3>
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
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
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
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Recent Activity and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {stats.recentActivity?.map((activity, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    key={index}
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="p-2 bg-blue-100 rounded-full">
                      <FaUserMd className="text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-800">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <button className="ml-auto text-sm text-blue-600 hover:text-blue-700">
                      View Details
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/doctor/appointments/new')}
                  className="w-full flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <FaCalendarAlt className="text-blue-600" />
                  <span className="ml-3 text-sm font-medium text-gray-700">Schedule Appointment</span>
                </button>
                <button 
                  onClick={() => navigate('/doctor/patients/new')}
                  className="w-full flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <FaUserInjured className="text-green-600" />
                  <span className="ml-3 text-sm font-medium text-gray-700">Add New Patient</span>
                </button>
                <button 
                  onClick={() => navigate('/doctor/notifications')}
                  className="w-full flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <FaBell className="text-purple-600" />
                  <span className="ml-3 text-sm font-medium text-gray-700">View Notifications</span>
                </button>
              </div>

              {/* Today's Schedule Preview */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Today's Schedule</h4>
                <div className="space-y-2">
                  {stats.recentActivity?.slice(0, 2).map((activity, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-800">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
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