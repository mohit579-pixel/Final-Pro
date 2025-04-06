import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications, markAsRead, markAllAsRead } from '../Redux/notificationSlice';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaCheckDouble, FaDotCircle, FaEllipsisH } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  const { notifications, unreadCount, isLoading } = useSelector(state => state.notifications);
  const userId = useSelector(state => state.auth?.data?._id);
  
  useEffect(() => {
    if (userId) {
      dispatch(fetchNotifications(userId));
      
      // Set up polling to check for new notifications every minute
      const interval = setInterval(() => {
        dispatch(fetchNotifications(userId));
      }, 60000);
      
      return () => clearInterval(interval);
    }
  }, [dispatch, userId]);
  
  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const handleMarkAllAsRead = () => {
    if (userId && unreadCount > 0) {
      dispatch(markAllAsRead(userId));
    }
  };
  
  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.isRead) {
      dispatch(markAsRead(notification._id));
    }
    
    // Navigate to linked page if available
    if (notification.linkTo) {
      navigate(notification.linkTo);
      setIsOpen(false);
    }
  };
  
  // Format relative time (e.g., "2 hours ago")
  const getRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin} min${diffMin !== 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };
  
  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment':
        return <i className="fas fa-calendar-check text-blue-500" />;
      case 'reminder':
        return <i className="fas fa-clock text-amber-500" />;
      case 'treatment':
        return <i className="fas fa-tooth text-green-500" />;
      case 'payment':
        return <i className="fas fa-credit-card text-purple-500" />;
      default:
        return <i className="fas fa-bell text-slate-500" />;
    }
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={handleToggleDropdown}
        className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
        aria-label="Notifications"
      >
        <FaBell className="w-5 h-5" />
        
        {/* Notification Badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>
      
      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 md:w-96 overflow-hidden bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
              <h3 className="font-bold">Notifications</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs py-1 px-2 bg-blue-700 hover:bg-blue-800 rounded-md transition flex items-center gap-1"
                  disabled={unreadCount === 0}
                >
                  <FaCheckDouble className="w-3 h-3" />
                  <span>Mark all read</span>
                </button>
              </div>
            </div>
            
            {/* Notification List */}
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center p-8">
                  <div className="w-6 h-6 border-2 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <div className="mb-2 flex justify-center">
                    <FaBell className="w-10 h-10 text-gray-300" />
                  </div>
                  <p>No notifications yet</p>
                </div>
              ) : (
                <ul>
                  {notifications.map((notification) => (
                    <li
                      key={notification._id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Status Dot */}
                        {!notification.isRead && (
                          <div className="mt-1">
                            <FaDotCircle className="w-2 h-2 text-blue-500" />
                          </div>
                        )}
                        
                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h4 className={`text-sm font-semibold ${!notification.isRead ? 'text-blue-800' : 'text-gray-800'}`}>
                              {notification.title}
                            </h4>
                            <span className="text-xs text-gray-500 ml-2">
                              {getRelativeTime(notification.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                <button
                  onClick={() => {
                    navigate('/notifications');
                    setIsOpen(false);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell; 