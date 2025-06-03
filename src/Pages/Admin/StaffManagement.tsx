import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserMd, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import axiosInstance from '../../Helper/axiosInstance';
import Layouts from "@/Layout/Layout";
interface Doctor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  speciality: string;
  experience: number;
  qualifications: string[];
  bio: string;
  avatar: string;
  available: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08 } }),
};

export default function StaffManagement() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filtered, setFiltered] = useState<Doctor[]>([]);
  const [search, setSearch] = useState('');
  const [editDoctor, setEditDoctor] = useState<Doctor | null>(null);
  const [deleteDoctor, setDeleteDoctor] = useState<Doctor | null>(null);
  const [modalOpen, setModalOpen] = useState<'edit' | 'delete' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctors() {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/doctors');
        console.log(res.data.data);
        setDoctors(res.data.data);
        setFiltered(res.data.data);
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  useEffect(() => {
    setFiltered(
      doctors.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.speciality.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, doctors]);

  const handleEdit = (doctor: Doctor) => {
    setEditDoctor(doctor);
    setModalOpen('edit');
  };
  const handleDelete = (doctor: Doctor) => {
    setDeleteDoctor(doctor);
    setModalOpen('delete');
  };
  const closeModal = () => {
    setModalOpen(null);
    setEditDoctor(null);
    setDeleteDoctor(null);
  };

  // Doctor stats
  const totalDoctors = doctors.length;
  const availableDoctors = doctors.filter(d => d.available).length;
  const specialties = Array.from(new Set(doctors.map(d => d.speciality)));

  return (
    <Layouts>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900 mb-1 flex items-center gap-2">
              <FaUserMd className="text-cyan-500" /> Doctors
            </h1>
            <p className="text-slate-500">Manage, edit, or remove doctors from your clinic.</p>
          </div>
          {/* Add Doctor button can be implemented here if needed */}
        </div>
        <div className="flex items-center justify-between mb-8">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search doctors..."
              className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 shadow focus:outline-none focus:ring-2 focus:ring-cyan-400 w-full"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <AnimatePresence>
            {loading ? (
              <div className="col-span-full flex justify-center items-center h-40">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                  <FaUserMd className="text-5xl text-cyan-400 animate-spin" />
                </motion.div>
              </div>
            ) : filtered.length === 0 ? (
              <motion.div className="col-span-full text-center text-slate-400 text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                No doctors found.
              </motion.div>
            ) : (
              filtered.map((doctor, i) => (
                <motion.div
                  key={doctor._id}
                  className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center relative group hover:shadow-2xl transition-shadow duration-300"
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={cardVariants}
                  whileHover={{ scale: 1.04 }}
                >
                  <img
                    src={doctor.avatar || '/avatars/doctor.jpg'}
                    alt={doctor.name}
                    className="w-20 h-20 rounded-full border-4 border-cyan-200 shadow mb-3 object-cover"
                  />
                  <h2 className="font-bold text-lg text-blue-900 mb-1 text-center">{doctor.name}</h2>
                  <div className="text-cyan-600 font-medium mb-1 text-center">{doctor.speciality}</div>
                  <div className="text-slate-500 text-sm mb-2 text-center">{doctor.experience} yrs experience</div>
                  <div className="flex flex-wrap gap-1 justify-center mb-2">
                    {doctor.qualifications.map(q => (
                      <span key={q} className="bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded text-xs font-semibold">{q}</span>
                    ))}
                  </div>
                  <p className="text-slate-400 text-xs text-center mb-4 line-clamp-2">{doctor.bio}</p>
                  <div className="flex gap-3 mt-auto">
                    <button
                      className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-1.5 rounded-lg font-semibold shadow transition-all duration-200"
                      onClick={() => handleEdit(doctor)}
                    >
                      <FaEdit className="inline mr-1" /> Edit
                    </button>
                    <button
                      className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-1.5 rounded-lg font-semibold shadow transition-all duration-200"
                      onClick={() => handleDelete(doctor)}
                    >
                      <FaTrash className="inline mr-1" /> Delete
                    </button>
                  </div>
                  {/* Card menu dots (optional) */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="inline-block w-2 h-2 bg-slate-300 rounded-full mr-0.5"></span>
                    <span className="inline-block w-2 h-2 bg-slate-300 rounded-full mr-0.5"></span>
                    <span className="inline-block w-2 h-2 bg-slate-300 rounded-full"></span>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Doctor Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex flex-col items-center">
            <FaUserMd className="text-blue-500 text-3xl mb-2" />
            <div className="text-gray-500 text-sm font-medium">Total Doctors</div>
            <div className="text-2xl font-bold text-gray-800">{totalDoctors}</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex flex-col items-center">
            <FaUserMd className="text-green-500 text-3xl mb-2" />
            <div className="text-gray-500 text-sm font-medium">Available Doctors</div>
            <div className="text-2xl font-bold text-gray-800">{availableDoctors}</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex flex-col items-center">
            <FaUserMd className="text-purple-500 text-3xl mb-2" />
            <div className="text-gray-500 text-sm font-medium">Specialties</div>
            <div className="text-2xl font-bold text-gray-800">{specialties.length}</div>
          </div>
        </div>

        {/* Edit Modal */}
        <AnimatePresence>
          {modalOpen === 'edit' && editDoctor && (
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
                <button className="absolute top-3 right-3 text-slate-400 hover:text-slate-600" onClick={closeModal}>&times;</button>
                <h2 className="text-xl font-bold mb-4 text-blue-900">Edit Doctor</h2>
                {/* Form fields for editing doctor (implement as needed) */}
                <div className="mb-3">
                  <label className="block text-sm font-semibold mb-1">Name</label>
                  <input className="w-full border rounded px-3 py-2" defaultValue={editDoctor.name} />
                </div>
                {/* Add more fields as needed */}
                <div className="flex gap-3 mt-6">
                  <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold" onClick={closeModal}>Save</button>
                  <button className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold" onClick={closeModal}>Cancel</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Modal */}
        <AnimatePresence>
          {modalOpen === 'delete' && deleteDoctor && (
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
                <button className="absolute top-3 right-3 text-slate-400 hover:text-slate-600" onClick={closeModal}>&times;</button>
                <h2 className="text-xl font-bold mb-4 text-red-600">Delete Doctor</h2>
                <p className="mb-6">Are you sure you want to delete <span className="font-semibold">{deleteDoctor.name}</span>?</p>
                <div className="flex gap-3">
                  <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold" onClick={closeModal}>Delete</button>
                  <button className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold" onClick={closeModal}>Cancel</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </Layouts>
  );
} 