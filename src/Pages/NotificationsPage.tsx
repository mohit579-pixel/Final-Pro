import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification,
  type Notification 
} from '@/Redux/notificationSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBell, FaCheckDouble, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';
import { AppDispatch, RootState } from '@/Redux/store';
import toast from 'react-hot-toast';

const NotificationsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedType, setSelectedType] = useState<'all' | Notification['type']>('all');
  
  const { notifications, unreadCount, isLoading } = useSelector((state: RootState) => state.notifications);
  const userId = useSelector((state: RootState) => state.auth?.data?._id);

  useEffect(() => {
    if (userId) {
      dispatch(fetchNotifications(userId));
    }
  }, [dispatch, userId]);

  const handleMarkAllRead = () => {
    if (userId && unreadCount > 0) {
      dispatch(markAllAsRead(userId));
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    dispatch(markAsRead(notificationId));
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await dispatch(deleteNotification(notificationId)).unwrap();
      toast.success('Notification deleted successfully');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'appointment':
        return <i className="fas fa-calendar-check text-blue-500 text-xl" />;
      case 'reminder':
        return <i className="fas fa-clock text-amber-500 text-xl" />;
      case 'treatment':
        return <i className="fas fa-tooth text-green-500 text-xl" />;
      case 'payment':
        return <i className="fas fa-credit-card text-purple-500 text-xl" />;
      default:
        return <i className="fas fa-bell text-slate-500 text-xl" />;
    }
  };

  const filteredNotifications = notifications.filter((notification: Notification) => {
    if (filter === 'unread' && notification.isRead) return false;
    if (filter === 'read' && !notification.isRead) return false;
    if (selectedType !== 'all' && notification.type !== selectedType) return false;
    return true;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    },
    exit: { 
      x: -100, 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FaBell className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-500">You have {unreadCount} unread notifications</p>
              </div>
            </div>
            <button
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all transform hover:scale-105
                ${unreadCount === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              <FaCheckDouble />
              <span>Mark all as read</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'read')}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as 'all' | Notification['type'])}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="appointment">Appointments</option>
              <option value="reminder">Reminders</option>
              <option value="treatment">Treatments</option>
              <option value="payment">Payments</option>
              <option value="general">General</option>
            </select>
          </div>
        </motion.div>

        {/* Notifications List */}
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-12 text-center"
          >
            <FaBell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No notifications</h3>
            <p className="text-gray-500">You're all caught up! Check back later for new notifications.</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <AnimatePresence>
              {filteredNotifications.map((notification: Notification) => (
                <motion.div
                  key={notification._id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-[1.02] ${
                    !notification.isRead ? 'border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className={`font-semibold ${!notification.isRead ? 'text-blue-800' : 'text-gray-800'}`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">
                              {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(notification._id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Delete notification"
                            >
                              <FaTrash className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                        <p className="mt-1 text-gray-600">{notification.message}</p>
                        {!notification.isRead && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="mt-2 text-sm text-blue-500 hover:text-blue-700"
                          >
                            Mark as read
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage; 