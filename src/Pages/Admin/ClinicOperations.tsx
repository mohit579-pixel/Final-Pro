import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCalendarAlt,
  FaPlus,
  FaUserMd,
  FaBox,
  FaDoorOpen,
  FaComments
} from 'react-icons/fa';
import axiosInstance from '../../Helper/axiosInstance';
import { toast } from 'react-toastify';

interface Appointment {
  _id: string;
  patientName: string;
  date: string;
  time: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  doctor: string;
  room: string;
}

interface Inventory {
  _id: string;
  name: string;
  quantity: number;
  minimumQuantity: number;
  category: string;
  lastRestocked: string;
}

interface Room {
  _id: string;
  number: string;
  status: 'AVAILABLE' | 'IN_USE' | 'CLEANING';
  currentAppointment?: string;
  lastCleaned: string;
}

const ClinicOperations: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedTab, setSelectedTab] = useState<'appointments' | 'inventory' | 'rooms' | 'inquiries'>('appointments');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appointmentsRes, inventoryRes, roomsRes] = await Promise.all([
        axiosInstance.get('/admin/appointments'),
        axiosInstance.get('/admin/inventory'),
        axiosInstance.get('/admin/rooms')
      ]);

      if (appointmentsRes.data.success) {
        setAppointments(appointmentsRes.data.data);
      }
      if (inventoryRes.data.success) {
        setInventory(inventoryRes.data.data);
      }
      if (roomsRes.data.success) {
        setRooms(roomsRes.data.data);
      }
    } catch {
      toast.error('Failed to fetch data');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-blue-100">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text">
                Clinic Operations
              </h1>
              <p className="text-gray-600 mt-2">Manage day-to-day clinic operations</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <FaPlus className="inline-block mr-2" />
              New Appointment
            </motion.button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setSelectedTab('appointments')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                selectedTab === 'appointments'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaCalendarAlt className="inline-block mr-2" />
              Appointments
            </button>
            <button
              onClick={() => setSelectedTab('inventory')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                selectedTab === 'inventory'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaBox className="inline-block mr-2" />
              Inventory
            </button>
            <button
              onClick={() => setSelectedTab('rooms')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                selectedTab === 'rooms'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaDoorOpen className="inline-block mr-2" />
              Room Management
            </button>
            <button
              onClick={() => setSelectedTab('inquiries')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                selectedTab === 'inquiries'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaComments className="inline-block mr-2" />
              Inquiries
            </button>
          </div>

          <AnimatePresence mode="wait">
            {selectedTab === 'appointments' && (
              <motion.div
                key="appointments"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {/* Appointments Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Appointments</h3>
                    <div className="space-y-4">
                      {appointments.map(appointment => (
                        <div key={appointment._id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <FaUserMd className="text-blue-600 mr-2" />
                              <span className="font-medium">{appointment.patientName}</span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              appointment.status === 'COMPLETED'
                                ? 'bg-green-100 text-green-800'
                                : appointment.status === 'IN_PROGRESS'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {appointment.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            <div>Time: {appointment.time}</div>
                            <div>Doctor: {appointment.doctor}</div>
                            <div>Room: {appointment.room}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Waiting Time</h3>
                    {/* Add waiting time component here */}
                  </div>
                </div>
              </motion.div>
            )}

            {selectedTab === 'inventory' && (
              <motion.div
                key="inventory"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Inventory Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Low Stock Items</h3>
                    <div className="space-y-4">
                      {inventory
                        .filter(item => item.quantity <= item.minimumQuantity)
                        .map(item => (
                          <div key={item._id} className="p-4 bg-red-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <FaBox className="text-red-600 mr-2" />
                                <span className="font-medium">{item.name}</span>
                              </div>
                              <span className="text-red-600">
                                {item.quantity} remaining
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">
                              <div>Category: {item.category}</div>
                              <div>Last Restocked: {new Date(item.lastRestocked).toLocaleDateString()}</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Inventory Alerts</h3>
                    {/* Add inventory alerts component here */}
                  </div>
                </div>
              </motion.div>
            )}

            {selectedTab === 'rooms' && (
              <motion.div
                key="rooms"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Room Management Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Room Status</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {rooms.map(room => (
                        <div key={room._id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <FaDoorOpen className="text-blue-600 mr-2" />
                              <span className="font-medium">Room {room.number}</span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              room.status === 'AVAILABLE'
                                ? 'bg-green-100 text-green-800'
                                : room.status === 'IN_USE'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {room.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            <div>Last Cleaned: {new Date(room.lastCleaned).toLocaleDateString()}</div>
                            {room.currentAppointment && (
                              <div>Current Appointment: {room.currentAppointment}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Cleaning Schedule</h3>
                    {/* Add cleaning schedule component here */}
                  </div>
                </div>
              </motion.div>
            )}

            {selectedTab === 'inquiries' && (
              <motion.div
                key="inquiries"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Inquiries Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Inquiries</h3>
                    {/* Add inquiries list component here */}
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Feedback</h3>
                    {/* Add feedback component here */}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ClinicOperations; 