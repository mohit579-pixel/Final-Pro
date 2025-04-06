import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaNotesMedical, FaFileMedical, FaHistory } from 'react-icons/fa';
import axiosInstance from '../Helper/axiosInstance';
import toast from 'react-hot-toast';
import Layout from '@/Layout/Layout';

interface PatientHistory {
  _id: string;
  patientId: string;
  patientName: string;
  date: string;
  type: 'appointment' | 'treatment' | 'prescription' | 'note';
  description: string;
  doctor: {
    _id: string;
    name: string;
  };
  status: string;
  attachments?: string[];
}

const PatientHistory: React.FC = () => {
  const { patientId } = useParams();
  const [history, setHistory] = useState<PatientHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientHistory = async () => {
      try {
        setLoading(false);
        const response = await axiosInstance.get(`/patients/${patientId}/medical-history`);
        setHistory(response.data);
      } catch (error) {
        toast.error('Failed to fetch patient history');
        console.error('Error fetching patient history:', error);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatientHistory();
    }
  }, [patientId]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <FaCalendarAlt className="text-blue-500" />;
      case 'treatment':
        return <FaNotesMedical className="text-green-500" />;
      case 'prescription':
        return <FaFileMedical className="text-purple-500" />;
      case 'note':
        return <FaHistory className="text-orange-500" />;
      default:
        return null;
    }
  };

  if (!loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Layout>    
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Patient History</h1>

        {history.length === 0 ? (
          <p className="text-gray-600 text-center">No history records found.</p>
        ) : (
          <div className="space-y-6">
            {history.map((record) => (
              <motion.div
                key={record._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    {getIcon(record.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(record.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        record.status === 'completed' ? 'bg-green-100 text-green-800' :
                        record.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-700">{record.description}</p>
                    {record.attachments && record.attachments.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
                        <div className="flex gap-2">
                          {record.attachments.map((attachment, index) => (
                            <a
                              key={index}
                              href={attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700 text-sm underline"
                            >
                              View Document {index + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-3 text-sm text-gray-500">
                      Doctor: {record.doctor.name}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
    </Layout>
  );
};

export default PatientHistory; 