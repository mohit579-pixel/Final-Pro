import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaChartLine, FaUsers, FaTooth, FaCalendarCheck,
  FaSpinner, FaChartPie, FaChartBar, FaMoneyBillWave
} from 'react-icons/fa';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import axiosInstance from '../Helper/axiosInstance';
import Layout from '@/Layout/Layout';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';

interface AnalyticsData {
  patientStats: {
    totalPatients: number;
    newPatients: number;
    activePatients: number;
    patientsByAge: {
      name: string;
      value: number;
    }[];
    patientsByGender: {
      name: string;
      value: number;
    }[];
  };
  treatmentStats: {
    totalTreatments: number;
    completedTreatments: number;
    ongoingTreatments: number;
    treatmentsByType: {
      name: string;
      value: number;
    }[];
    treatmentSuccess: {
      name: string;
      value: number;
    }[];
    monthlyTreatments: {
      month: string;
      treatments: number;
    }[];
  };
  revenueStats: {
    totalRevenue: number;
    monthlyRevenue: {
      month: string;
      revenue: number;
    }[];
    revenueByTreatment: {
      name: string;
      value: number;
    }[];
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const doctorId = useSelector((state: any) => state.auth.data?._id);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange, doctorId]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/analytics/doctor/${doctorId}?timeRange=${timeRange}`);
      setData(response.data.data);
      setError(null);
    } catch (error) {
      setError('Failed to fetch analytics data');
      toast.error('Error loading analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
          <div className="text-center max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl">
            <div className="text-red-500 text-xl mb-4 font-semibold">{error}</div>
            <button 
              onClick={fetchAnalyticsData}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <FaSpinner className="animate-spin text-blue-500 text-4xl" />
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
            <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Track your practice performance and patient outcomes</p>
          </motion.div>

          {/* Time Range Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="flex space-x-4">
              <button
                onClick={() => setTimeRange('week')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeRange === 'week'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeRange === 'month'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => setTimeRange('year')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeRange === 'year'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                This Year
              </button>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Patients */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FaUsers className="text-blue-600 text-xl" />
                </div>
                <span className="text-sm font-medium text-blue-600">Patients</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{data.patientStats.totalPatients}</h3>
              <p className="text-sm text-gray-500 mt-2">
                <span className="text-green-500">↑ {data.patientStats.newPatients}</span> new this {timeRange}
              </p>
            </motion.div>

            {/* Total Treatments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <FaTooth className="text-green-600 text-xl" />
                </div>
                <span className="text-sm font-medium text-green-600">Treatments</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">{data.treatmentStats.totalTreatments}</h3>
              <p className="text-sm text-gray-500 mt-2">
                <span className="text-green-500">{data.treatmentStats.completedTreatments}</span> completed
              </p>
            </motion.div>

            {/* Success Rate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <FaChartLine className="text-yellow-600 text-xl" />
                </div>
                <span className="text-sm font-medium text-yellow-600">Success Rate</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                {Math.round((data.treatmentStats.completedTreatments / data.treatmentStats.totalTreatments) * 100)}%
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Based on completed treatments
              </p>
            </motion.div>

            {/* Revenue */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <FaMoneyBillWave className="text-purple-600 text-xl" />
                </div>
                <span className="text-sm font-medium text-purple-600">Revenue</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                {formatCurrency(data.revenueStats.totalRevenue)}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Total revenue this {timeRange}
              </p>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Monthly Treatments */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Treatment Trends</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data.treatmentStats.monthlyTreatments}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="treatments"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Revenue by Treatment */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Revenue by Treatment</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.revenueStats.revenueByTreatment}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#82ca9d">
                      {data.revenueStats.revenueByTreatment.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Patient Demographics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Age Distribution */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Patient Age Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.patientStats.patientsByAge}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.patientStats.patientsByAge.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Treatment Success Rate */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Treatment Success Rate</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.treatmentStats.treatmentSuccess}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.treatmentStats.treatmentSuccess.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics; 