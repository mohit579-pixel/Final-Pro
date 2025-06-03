import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import axiosInstance from '../../Helper/axiosInstance';
import Layouts from '@/Layout/Layout';

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  avatar?: {
    public_id?: string;
    secure_url?: string;
  };
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08 } }),
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState<'edit' | 'delete' | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/user');
        console.log(res.data);
        setUsers(res.data.data);
        setFiltered(res.data.data);
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    setFiltered(
      users.filter(u =>
        u.fullName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, users]);

  const handleEdit = (user: User) => {
    setEditUser(user);
    setModalOpen('edit');
  };
  const handleDelete = (user: User) => {
    setDeleteUser(user);
    setModalOpen('delete');
  };
  const closeModal = () => {
    setModalOpen(null);
    setEditUser(null);
    setDeleteUser(null);
    setError(null);
  };

  // When opening edit modal, prefill form
  useEffect(() => {
    if (editUser) {
      setEditForm({
        fullName: editUser.fullName,
        email: editUser.email,
        role: editUser.role,
      });
    }
  }, [editUser]);

  // Handle edit user
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleConfirmEdit = async () => {
    if (!editUser) return;
    setActionLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.patch(`/user/${editUser._id}`, editForm);
      setUsers(prev => prev.map(u => u._id === editUser._id ? res.data.data : u));
      setFiltered(prev => prev.map(u => u._id === editUser._id ? res.data.data : u));
      closeModal();
    } catch {
      setError('Failed to update user.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle delete user
  const handleConfirmDelete = async () => {
    if (!deleteUser) return;
    setActionLoading(true);
    setError(null);
    try {
      await axiosInstance.delete(`/user/${deleteUser._id}`);
      setUsers(prev => prev.filter(u => u._id !== deleteUser._id));
      setFiltered(prev => prev.filter(u => u._id !== deleteUser._id));
      closeModal();
    } catch {
      setError('Failed to delete user.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Layouts>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-blue-900 mb-1 flex items-center gap-2">
                <FaUser className="text-cyan-500" /> Users
              </h1>
              <p className="text-slate-500">Manage, edit, or remove users from your clinic.</p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-8">
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                placeholder="Search users..."
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
                    <FaUser className="text-5xl text-cyan-400 animate-spin" />
                  </motion.div>
                </div>
              ) : filtered.length === 0 ? (
                <motion.div className="col-span-full text-center text-slate-400 text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  No users found.
                </motion.div>
              ) : (
                filtered.map((user, i) => (
                  <motion.div
                    key={user._id}
                    className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center relative group hover:shadow-2xl transition-shadow duration-300"
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={cardVariants}
                    whileHover={{ scale: 1.04 }}
                  >
                    <img
                      src={user.avatar?.secure_url || '/avatars/user.jpg'}
                      alt={user.fullName}
                      className="w-20 h-20 rounded-full border-4 border-cyan-200 shadow mb-3 object-cover"
                    />
                    <h2 className="font-bold text-lg text-blue-900 mb-1 text-center">{user.fullName}</h2>
                    <div className="text-cyan-600 font-medium mb-1 text-center">{user.email}</div>
                    <div className="text-slate-500 text-sm mb-2 text-center">{user.role}</div>
                    <div className="flex gap-3 mt-auto">
                      <button
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-1.5 rounded-lg font-semibold shadow transition-all duration-200"
                        onClick={() => handleEdit(user)}
                      >
                        <FaEdit className="inline mr-1" /> Edit
                      </button>
                      <button
                        className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-1.5 rounded-lg font-semibold shadow transition-all duration-200"
                        onClick={() => handleDelete(user)}
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

          {/* Edit Modal */}
          <AnimatePresence>
            {modalOpen === 'edit' && editUser && (
              <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
                  <button className="absolute top-3 right-3 text-slate-400 hover:text-slate-600" onClick={closeModal}>&times;</button>
                  <h2 className="text-xl font-bold mb-4 text-blue-900">Edit User</h2>
                  {error && <div className="text-red-500 mb-2">{error}</div>}
                  <div className="mb-3">
                    <label className="block text-sm font-semibold mb-1">Name</label>
                    <input name="fullName" className="w-full border rounded px-3 py-2" value={editForm.fullName || ''} onChange={handleEditInputChange} />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-semibold mb-1">Email</label>
                    <input name="email" className="w-full border rounded px-3 py-2" value={editForm.email || ''} onChange={handleEditInputChange} />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-semibold mb-1">Role</label>
                    <select name="role" className="w-full border rounded px-3 py-2" value={editForm.role || ''} onChange={handleEditInputChange}>
                      <option value="USER">USER</option>
                      <option value="DOCTOR">DOCTOR</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-60" onClick={handleConfirmEdit} disabled={actionLoading}>{actionLoading ? 'Saving...' : 'Save'}</button>
                    <button className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold" onClick={closeModal} disabled={actionLoading}>Cancel</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Delete Modal */}
          <AnimatePresence>
            {modalOpen === 'delete' && deleteUser && (
              <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative" initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}>
                  <button className="absolute top-3 right-3 text-slate-400 hover:text-slate-600" onClick={closeModal}>&times;</button>
                  <h2 className="text-xl font-bold mb-4 text-red-600">Delete User</h2>
                  {error && <div className="text-red-500 mb-2">{error}</div>}
                  <p className="mb-6">Are you sure you want to delete <span className="font-semibold">{deleteUser.fullName}</span>?</p>
                  <div className="flex gap-3">
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-60" onClick={handleConfirmDelete} disabled={actionLoading}>{actionLoading ? 'Deleting...' : 'Delete'}</button>
                    <button className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold" onClick={closeModal} disabled={actionLoading}>Cancel</button>
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