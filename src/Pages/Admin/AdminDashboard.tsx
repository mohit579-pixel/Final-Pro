// import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserMd, FaUser, FaMoneyBill, FaChartPie, FaChartLine } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Layouts from '@/Layout/Layout';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface LineChartData {
  name: string;
  Revenue: number;
  Expenses: number;
}

interface PieChartData {
  name: string;
  value: number;
}

interface RecentActivity {
  time: string;
  activity: string;
  type: string;
}

export default function AdminDashboard() {
  // Dummy data
  const stats = {
    doctors: 12,
    patients: 320,
    revenue: 42000,
    expenses: 18500,
    appointments: 48,
  };
  const lineData: LineChartData[] = [
    { name: '1/2024', Revenue: 5000, Expenses: 2000 },
    { name: '2/2024', Revenue: 7000, Expenses: 2500 },
    { name: '3/2024', Revenue: 8000, Expenses: 3000 },
    { name: '4/2024', Revenue: 9000, Expenses: 3500 },
    { name: '5/2024', Revenue: 11000, Expenses: 4000 },
    { name: '6/2024', Revenue: 12000, Expenses: 4500 },
  ];
  const pieData: PieChartData[] = [
    { name: 'Consultations', value: 18000 },
    { name: 'Surgeries', value: 12000 },
    { name: 'Diagnostics', value: 8000 },
    { name: 'Other', value: 4000 },
  ];
  const recent: RecentActivity[] = [
    { time: '10 min ago', activity: 'Doctor added', type: 'doctor' },
    { time: '30 min ago', activity: 'Patient registered', type: 'patient' },
    { time: '1 hr ago', activity: 'Appointment booked', type: 'appointment' },
    { time: '2 hr ago', activity: 'Invoice generated', type: 'finance' },
  ];
  const loading = false;

  return (
    <Layouts>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-blue-900 mb-1">Welcome Admin!</h1>
              <p className="text-slate-500">Here is your clinic's real-time overview dashboard.</p>
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center border-t-4 border-blue-400">
              <FaUserMd className="text-blue-500 text-3xl mb-2" />
              <div className="text-gray-500 text-sm font-medium">Total Doctors</div>
              <div className="text-2xl font-bold text-gray-800">{stats.doctors}</div>
            </motion.div>
            <motion.div whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center border-t-4 border-cyan-400">
              <FaUser className="text-cyan-500 text-3xl mb-2" />
              <div className="text-gray-500 text-sm font-medium">Total Patients</div>
              <div className="text-2xl font-bold text-gray-800">{stats.patients}</div>
            </motion.div>
            <motion.div whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center border-t-4 border-green-400">
              <FaMoneyBill className="text-green-500 text-3xl mb-2" />
              <div className="text-gray-500 text-sm font-medium">Revenue</div>
              <div className="text-2xl font-bold text-gray-800">${stats.revenue}</div>
            </motion.div>
            <motion.div whileHover={{ y: -5, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }} className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center border-t-4 border-red-400">
              <FaMoneyBill className="text-red-500 text-3xl mb-2" />
              <div className="text-gray-500 text-sm font-medium">Expenses</div>
              <div className="text-2xl font-bold text-gray-800">${stats.expenses}</div>
            </motion.div>
          </div>
          {/* Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div whileHover={{ scale: 1.01 }} className="bg-white rounded-2xl shadow-xl p-6 col-span-2">
              <div className="flex items-center mb-4">
                <FaChartLine className="text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Monthly Revenue & Expenses</h3>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Revenue" stroke="#00C49F" strokeWidth={3} />
                    <Line type="monotone" dataKey="Expenses" stroke="#FF8042" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.01 }} className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center">
              <div className="flex items-center mb-4">
                <FaChartPie className="text-cyan-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-800">Revenue by Category</h3>
              </div>
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                      {pieData.map((entry, index) => (
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
          {/* Recent Activities & Order Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div whileHover={{ scale: 1.01 }} className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
              <ul className="divide-y divide-gray-100">
                {recent.map((item, idx) => (
                  <li key={idx} className="py-3 flex items-center justify-between">
                    <span className="text-gray-600 text-sm">{item.activity}</span>
                    <span className="text-gray-400 text-xs">{item.time}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div whileHover={{ scale: 1.01 }} className="bg-white rounded-2xl shadow-xl p-6 col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Appointments Overview</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Example: Map over first 5 appointments */}
                    {loading ? (
                      <tr><td colSpan={4} className="text-center py-8 text-gray-400">Loading...</td></tr>
                    ) : (
                      stats.appointments > 0 ? (
                        Array.from({ length: Math.min(5, stats.appointments) }).map((_, idx) => (
                          <tr key={idx}>
                            <td className="px-6 py-4 whitespace-nowrap">Patient {idx + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap">Doctor {idx + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap">2024-06-01</td>
                            <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completed</span></td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={4} className="text-center py-8 text-gray-400">No appointments found.</td></tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layouts>
  );
} 