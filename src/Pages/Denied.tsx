import React from 'react';
import { motion } from 'framer-motion';
import { FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Layout from '@/Layout/Layout';

const Denied: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <div className="bg-red-100 p-4 rounded-full">
                <FaLock className="text-red-500 text-4xl" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-center text-gray-800 mb-2"
            >
              Access Denied
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 text-center mb-8"
            >
              You don't have permission to access this page. Please contact the administrator if you believe this is a mistake.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col gap-4"
            >
              <button
                onClick={() => navigate('/')}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Go to Home
              </button>
              <button
                onClick={() => navigate(-1)}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Go Back
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-50 px-6 py-4 border-t border-gray-200"
          >
            <p className="text-center text-sm text-gray-500">
              Need help?{' '}
              <a href="/contact" className="text-blue-500 hover:text-blue-600">
                Contact Support
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Denied; 