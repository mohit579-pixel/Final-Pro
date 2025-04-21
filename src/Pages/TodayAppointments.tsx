import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUserMd, FaTooth, FaNotesMedical, FaSpinner, 
  FaCheck, FaTimes, FaFileAlt,
  FaDownload, FaImage, FaFilePdf, FaFileImage,
  FaSearch
} from 'react-icons/fa';
import Layout from '@/Layout/Layout';
import axiosInstance from '../Helper/axiosInstance';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { teethData, commonDentalConditions } from '../data/teethData';

interface Appointment {
  _id: string;
  patientId: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    age?: number;
    gender?: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  status: string;
  paymentAmount: string;
  notes?: string;
  diagnosis?: Diagnosis[];
}

interface DentalRecord {
  _id: string;
  patientId: string;
  title: string;
  description: string;
  fileType: 'xray' | 'image' | 'document';
  fileUrl: string;
  uploadDate: string;
  tags: string[];
}

interface Diagnosis {
  toothNumber: string;
  condition: string;
  severity: 'low' | 'medium' | 'high';
  treatment?: string;
  notes?: string;
  images?: {
    url: string;
    publicId: string;
    uploadedAt: Date;
  }[];
  createdAt?: Date;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface RootState {
  auth: {
    data: {
      _id: string;
    };
  };
}

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
}

// DentalChart component with improved realistic UI
const DentalChart: React.FC<{
  selectedTooth: string;
  onToothClick: (toothId: string) => void;
  diagnosedTeeth: Record<string, Diagnosis>;
}> = ({ selectedTooth, onToothClick, diagnosedTeeth }) => {
  const getSeverityColor = (severity?: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#22c55e';
      default: return '#e5e7eb';
    }
  };

  const getToothColor = (tooth: typeof teethData[0]) => {
    if (diagnosedTeeth[tooth.id]) {
      return getSeverityColor(diagnosedTeeth[tooth.id].severity);
    } else if (selectedTooth === tooth.id) {
      return '#93c5fd'; // Blue for selected tooth
    } else {
      // Different colors based on tooth type for better visual distinction
      switch (tooth.type) {
        case 'molar': return '#f8fafc';
        case 'premolar': return '#f1f5f9';
        case 'canine': return '#e2e8f0';
        case 'incisor': return '#e2e8f0';
        default: return '#f1f5f9';
      }
    }
  };

  // Get specific styles for different tooth types
  const getToothStyle = (tooth: typeof teethData[0]) => {
    // Different stroke widths and styles for different tooth types
    return {
      strokeWidth: tooth.type === 'molar' ? 1.5 : 1,
      stroke: diagnosedTeeth[tooth.id] ? '#334155' : '#64748b'
    };
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <FaTooth className="text-blue-500 mr-2" /> Dental Chart
        </h3>
        <div className="flex space-x-3">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span className="text-xs text-gray-600">Low</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
            <span className="text-xs text-gray-600">Medium</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
            <span className="text-xs text-gray-600">High</span>
          </div>
        </div>
      </div>
      
      <div className="relative">
        {/* Realistic mouth background */}
        <div className="absolute inset-0 mx-auto w-11/12 h-full">
          {/* Upper palate shape */}
          <svg viewBox="0 0 340 220" className="w-full h-full" style={{ position: 'absolute' }}>
            {/* Upper arch (palate) */}
            <path 
              d="M10,80 C35,10 145,-20 255,10 C320,35 330,80 330,80 L330,100 C330,100 320,85 255,60 C145,30 35,60 10,100 Z" 
              fill="#fee2e2" 
              opacity="0.3"
            />
            {/* Lower arch (floor of mouth) */}
            <path 
              d="M10,140 C35,210 145,240 255,210 C320,185 330,140 330,140 L330,120 C330,120 320,135 255,160 C145,190 35,160 10,120 Z" 
              fill="#fee2e2" 
              opacity="0.3"
            />
            {/* Midline */}
            <line x1="170" y1="10" x2="170" y2="210" stroke="#f9a8d4" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.4" />
          </svg>
        </div>
      
        <svg viewBox="0 0 340 220" className="w-full" style={{ zIndex: 10, position: 'relative' }}>
          {/* Upper jaw label */}
          <text x="170" y="10" textAnchor="middle" className="text-xs font-medium fill-gray-600">Upper Jaw (Maxillary)</text>
          
          {/* Lower jaw label */}
          <text x="170" y="215" textAnchor="middle" className="text-xs font-medium fill-gray-600">Lower Jaw (Mandibular)</text>
          
          {/* Upper right quadrant label */}
          <text x="260" y="40" textAnchor="middle" className="text-[9px] fill-gray-400 italic">Upper Right</text>
          
          {/* Upper left quadrant label */}
          <text x="80" y="40" textAnchor="middle" className="text-[9px] fill-gray-400 italic">Upper Left</text>
          
          {/* Lower left quadrant label */}
          <text x="80" y="180" textAnchor="middle" className="text-[9px] fill-gray-400 italic">Lower Left</text>
          
          {/* Lower right quadrant label */}
          <text x="260" y="180" textAnchor="middle" className="text-[9px] fill-gray-400 italic">Lower Right</text>
          
          {teethData.map((tooth) => (
            <g 
              key={tooth.id} 
              onClick={() => onToothClick(tooth.id)} 
              className="cursor-pointer transition-transform duration-200 hover:scale-110"
              data-tooth-id={tooth.id}
              data-tooth-type={tooth.type}
            >
              <path
                d={tooth.path}
                fill={getToothColor(tooth)}
                stroke={getToothStyle(tooth).stroke}
                strokeWidth={getToothStyle(tooth).strokeWidth}
                className="transition-all duration-200"
              />
              <text
                x={tooth.x}
                y={tooth.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="9"
                fontWeight={selectedTooth === tooth.id ? "bold" : "normal"}
                fill={selectedTooth === tooth.id ? "#1e40af" : "#475569"}
                className="select-none pointer-events-none"
              >
                {tooth.id}
              </text>
              {diagnosedTeeth[tooth.id] && (
                <title>{`Tooth ${tooth.id}: ${diagnosedTeeth[tooth.id].condition} (${diagnosedTeeth[tooth.id].severity} severity)`}</title>
              )}
              
              {/* Show a subtle highlight ring around selected tooth */}
              {selectedTooth === tooth.id && (
                <circle
                  cx={tooth.x}
                  cy={tooth.y}
                  r="15"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  strokeDasharray="2,2"
                  className="animate-pulse"
                />
              )}
            </g>
          ))}
          
          {/* Guide text at the bottom */}
          <text x="170" y="205" textAnchor="middle" className="text-[8px] fill-gray-400">Click on a tooth to diagnose</text>
        </svg>
      </div>
      
      {/* Selected tooth information */}
      {selectedTooth && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-7 h-7 bg-blue-50 rounded-full flex items-center justify-center mr-2">
                <FaTooth className="text-blue-500 text-sm" />
              </div>
              <div>
                <p className="font-medium text-gray-700">Tooth #{selectedTooth}</p>
                <p className="text-xs text-gray-500">
                  {(() => {
                    const selectedToothData = teethData.find(t => t.id === selectedTooth);
                    if (!selectedToothData) return 'Unknown';
                    
                    const typeDisplay = selectedToothData.type.charAt(0).toUpperCase() + selectedToothData.type.slice(1);
                    const jawDisplay = selectedToothData.jaw === 'upper' ? 'Upper' : 'Lower';
                    return `${typeDisplay} • ${jawDisplay} Jaw`;
                  })()}
                </p>
              </div>
            </div>
            {diagnosedTeeth[selectedTooth] && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${  
                diagnosedTeeth[selectedTooth].severity === 'high' ? 'bg-red-100 text-red-800' :
                diagnosedTeeth[selectedTooth].severity === 'medium' ? 'bg-amber-100 text-amber-800' :
                'bg-green-100 text-green-800'
              }`}>
                {diagnosedTeeth[selectedTooth].severity} severity
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const TodayAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [patientRecords, setPatientRecords] = useState<DentalRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [recordFilterType, setRecordFilterType] = useState<'all' | 'xray' | 'image' | 'document'>('all');
  const [recordSearchTerm, setRecordSearchTerm] = useState('');
  const [selectedTooth, setSelectedTooth] = useState<string>('');
  const [diagnosedTeeth] = useState<Record<string, Diagnosis>>({});
  const [diagnosis, setDiagnosis] = useState<Diagnosis>({
    toothNumber: '',
    condition: '',
    severity: 'low',
    treatment: '',
    notes: '',
    images: [],
  });
  const [diagnosisList, setDiagnosisList] = useState<Diagnosis[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedImages, setSelectedImages] = useState<{ [key: string]: File[] }>({});
  const [paymentAmount,setPaymentAmount]=useState(0);
  const doctorId = useSelector((state: RootState) => state.auth.data?._id);

  const commonConditions = commonDentalConditions;

  const fetchTodayAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/doctors/${doctorId}/appointments/today`);
      const confirmedAppointments = response.data.data.filter(
        (app: Appointment) => app.status === 'confirmed'
      );
      setAppointments(confirmedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    fetchTodayAppointments();
  }, [fetchTodayAppointments]);

  useEffect(() => {
    if (selectedAppointment?.patientId?._id && showDiagnosisModal) {
      fetchPatientRecords(selectedAppointment.patientId._id);
    }
  }, [selectedAppointment, showDiagnosisModal]);

  const fetchPatientRecords = async (patientId: string) => {
    try {
      setLoadingRecords(true);
      const response = await axiosInstance.get(`/dental-records/${patientId}`);
      if (response.data.success) {
        setPatientRecords(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching patient records:', error);
      toast.error('Failed to load patient dental records');
    } finally {
      setLoadingRecords(false);
    }
  };

  const filteredRecords = patientRecords
    .filter(record => recordFilterType === 'all' || record.fileType === recordFilterType)
    .filter(record => 
      record.title.toLowerCase().includes(recordSearchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(recordSearchTerm.toLowerCase()) ||
      record.tags.some(tag => tag.toLowerCase().includes(recordSearchTerm.toLowerCase()))
    );

  const handleToothClick = (toothId: string) => {
    setSelectedTooth(toothId);
    setDiagnosis(prev => ({
      ...prev,
      toothNumber: toothId
    }));
  };

  const addDiagnosisToList = () => {
    if (!diagnosis.toothNumber || !diagnosis.condition) {
      toast.error('Please select a tooth and condition');
      return;
    }

    const newDiagnosis = {
      ...diagnosis,
      createdAt: new Date()
    };

    setDiagnosisList(prev => [...prev, newDiagnosis]);
    setDiagnosis({
      toothNumber: '',
      condition: '',
      severity: 'low',
      treatment: '',
      notes: '',
      images: []
    });
    setSelectedTooth('');
    toast.success('Diagnosis added to list');
  };

  const handleImageSelect = (files: FileList, toothNumber: string) => {
    setSelectedImages(prev => ({
      ...prev,
      [toothNumber]: Array.from(files)
    }));
  };

  const uploadImages = async (files: File[], toothNumber: string) => {
    try {
      setUploadingImages(true);
      const formData = new FormData();
      files.forEach(file => {
        formData.append('file', file);
      });
      formData.append('appointmentId', selectedAppointment?._id || '');
      formData.append('toothNumber', toothNumber);

      const response = await axiosInstance.post('/appointments/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        return response.data.images.map((img: CloudinaryResponse) => ({
          url: img.secure_url,
          publicId: img.public_id,
          uploadedAt: new Date()
        }));
      }
      return [];
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
      return [];
    } finally {
      setUploadingImages(false);
    }
  };

  const saveDiagnosis = async () => {
    if (!diagnosisList.length) {
      toast.error('Please add at least one diagnosis before saving');
      return;
    }

    try {
      // Upload images for each diagnosis
      const updatedDiagnosisList = await Promise.all(
        diagnosisList.map(async (diagnosis) => {
          const images = selectedImages[diagnosis.toothNumber] || [];
          const uploadedImages = images.length > 0 ? await uploadImages(images, diagnosis.toothNumber) : [];
          
          return {
            ...diagnosis,
            images: [...(diagnosis.images || []), ...uploadedImages]
          };
        })
      );

      // Format medications as an array of strings
      const formattedMedications = medications.map(med => 
        `${med.name} - ${med.dosage} (${med.frequency}, ${med.duration}) - ${med.instructions}`
      );



      const response = await axiosInstance.post(
        `/appointments/${selectedAppointment?._id}/diagnosis`,
        {
          diagnoses: updatedDiagnosisList.map(diagnosis => ({
            toothNumber: diagnosis.toothNumber,
            condition: diagnosis.condition,
            severity: diagnosis.severity,
            treatment: diagnosis.treatment,
            notes: diagnosis.notes,
            images: diagnosis.images || []
          })),
          prescription: updatedDiagnosisList[0]?.treatment || '',
          followUpDate: new Date().toISOString(),
          medications: formattedMedications,
          paymentAmount: paymentAmount,
          paymentStatus: 'unpaid'
        }
      );

      if (response.data) {
        toast.success('Diagnosis saved successfully');
        setShowDiagnosisModal(false);
        setDiagnosisList([]);
        setMedications([]);
        setSelectedImages({});
        fetchTodayAppointments();
      }
    } catch (error) {
      console.error('Error saving diagnosis:', error);
      toast.error('Failed to save diagnosis');
    }
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaUserMd className="mr-3 text-blue-500" />
              Today's Confirmed Appointments
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and diagnose your confirmed appointments for today
            </p>
          </motion.div>

          {/* Appointments List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="animate-spin text-blue-500 text-4xl" />
            </div>
          ) : appointments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center"
            >
              <FaTooth className="text-gray-400 text-5xl mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700">No Confirmed Appointments</h2>
              <p className="text-gray-500 mt-2">You have no confirmed appointments for today.</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <motion.div
                  key={appointment._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Left section with time */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:w-48 flex flex-row md:flex-col items-center justify-center md:justify-start space-x-4 md:space-x-0">
                      <div className="text-center">
                        <div className="text-sm text-blue-600 font-medium mb-1">Appointment Time</div>
                        <div className="text-2xl font-bold text-gray-800">{formatTime(appointment.startTime)}</div>
                        <div className="text-sm text-gray-500">to {formatTime(appointment.endTime)}</div>
                      </div>
                    </div>

                    {/* Main content section */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col md:flex-row justify-between">
                        {/* Patient info */}
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                              {appointment.patientId?.fullName.split(' ').map(name => name[0]).join('')}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">
                                {appointment.patientId?.fullName}
                              </h3>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-sm text-gray-500">{appointment.patientId?.email}</span>
                                <span className="text-gray-300">•</span>
                                <span className="text-sm text-gray-500">{appointment.patientId?.phone}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status and actions */}
                        <div className="flex flex-col items-end justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                              Confirmed
                            </span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                              {appointment.type}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Additional info and actions */}
                      <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between">
                        <div className="flex items-center space-x-6">
                          {appointment.patientId?.age && (
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center mr-2">
                                <span className="text-purple-600 text-sm font-medium">{appointment.patientId.age}</span>
                              </div>
                              <span className="text-sm text-gray-500">Age</span>
                            </div>
                          )}
                          {appointment.patientId?.gender && (
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center mr-2">
                                <span className="text-pink-600 text-sm font-medium">{appointment.patientId.gender.charAt(0).toUpperCase()}</span>
                              </div>
                              <span className="text-sm text-gray-500">Gender</span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowDiagnosisModal(true);
                          }}
                          className="mt-4 md:mt-0 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
                        >
                          <FaNotesMedical />
                          <span>Start Diagnosis</span>
                        </button>
                      </div>

                      {appointment.notes && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Notes:</span> {appointment.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Diagnosis Modal */}
        <AnimatePresence>
          {showDiagnosisModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 10, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden"
              >
                <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                        <FaUserMd className="text-white text-xl" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">
                          Patient Diagnosis
                        </h2>
                        <p className="text-blue-100 text-sm">
                          {selectedAppointment?.patientId?.fullName} • {new Date(selectedAppointment?.date || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      onClick={() => setShowDiagnosisModal(false)}
                      className="bg-white/20 p-2 rounded-full text-white hover:bg-white/30 backdrop-blur-sm"
                    >
                      <FaTimes />
                    </motion.button>
                  </div>
                </div>

                <div className="p-6 max-h-[80vh] overflow-y-auto">
                  {/* Patient profile and stats */}
                  <div className="flex flex-wrap gap-6 mb-8">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl border border-gray-100 flex-grow">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl overflow-hidden">
                        {selectedAppointment?.patientId?.fullName.split(' ').map(name => name[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{selectedAppointment?.patientId?.fullName}</h3>
                        <div className="text-sm text-gray-500 mt-1">{selectedAppointment?.patientId?.email}</div>
                        <div className="flex items-center mt-1 gap-4">
                          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                            {selectedAppointment?.patientId?.age || '?'} years
                          </span>
                          <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full capitalize">
                            {selectedAppointment?.patientId?.gender || 'Not specified'}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex gap-4 flex-wrap flex-grow sm:justify-end">
                      <div className="bg-blue-50 p-3 rounded-xl w-28 text-center">
                        <div className="text-3xl font-bold text-blue-600">{diagnosisList.length}</div>
                        <div className="text-xs text-blue-700 mt-1">Diagnoses</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-xl w-28 text-center">
                        <div className="text-3xl font-bold text-green-600">{patientRecords.length}</div>
                        <div className="text-xs text-green-700 mt-1">Records</div>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-xl w-28 text-center">
                        <div className="text-3xl font-bold text-purple-600">{selectedAppointment?.type ? selectedAppointment.type.charAt(0) : '-'}</div>
                        <div className="text-xs text-purple-700 mt-1">Priority</div>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Two column layout for dental chart and patient documents */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Left column: Dental Chart */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white border border-gray-100 rounded-xl shadow-sm p-4"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                          <FaTooth className="text-blue-500 mr-2" /> Dental Chart
                        </h3>
                        <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                          Tooth #{selectedTooth || 'None selected'}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4">
                        <DentalChart
                          selectedTooth={selectedTooth}
                          onToothClick={handleToothClick}
                          diagnosedTeeth={diagnosedTeeth}
                        />
                      </div>
                      <div className="mt-4 flex justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                            <span className="text-xs text-gray-600">High</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
                            <span className="text-xs text-gray-600">Medium</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                            <span className="text-xs text-gray-600">Low</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">Click on a tooth to diagnose</div>
                      </div>
                    </motion.div>
                    
                    {/* Right column: Patient Documents */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-white border border-gray-100 rounded-xl shadow-sm p-4"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                          <FaFileAlt className="text-blue-500 mr-2" /> Patient Documents
                        </h3>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: "spring", stiffness: 400 }}
                          className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm font-medium flex items-center"
                        >
                          {patientRecords.length} files
                        </motion.div>
                      </div>
                      
                      {/* Search and filter bar */}
                      <div className="flex flex-col sm:flex-row gap-3 mb-4">
                        <div className="relative flex-1">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Search documents..."
                            value={recordSearchTerm}
                            onChange={(e) => setRecordSearchTerm(e.target.value)}
                          />
                        </div>
                        <div className="sm:w-40">
                          <select
                            className="block w-full py-2 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={recordFilterType}
                            onChange={(e) => setRecordFilterType(e.target.value as 'all' | 'xray' | 'image' | 'document')}
                          >
                            <option value="all">All Types</option>
                            <option value="xray">X-Rays</option>
                            <option value="image">Images</option>
                            <option value="document">Documents</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* Document list with scrollable container */}
                      <div className="bg-gray-50 rounded-xl p-3 h-60 overflow-y-auto custom-scrollbar">
                        {loadingRecords ? (
                          <div className="h-full flex items-center justify-center">
                            <FaSpinner className="text-blue-500 text-2xl animate-spin" />
                          </div>
                        ) : filteredRecords.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-gray-500">
                            <FaFileAlt className="text-gray-300 text-4xl mb-2" />
                            <p>No documents found</p>
                          </div>
                        ) : (
                          <AnimatePresence>
                            <div className="space-y-2">
                              {filteredRecords.map((record, index) => (
                                <motion.div
                                  key={record._id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  transition={{ duration: 0.2, delay: index * 0.05 }}
                                  className="bg-white rounded-lg p-3 hover:shadow-md transition-shadow flex items-start gap-3 border border-gray-100"
                                >
                                  <div className="p-2 rounded-lg bg-blue-50 text-blue-500">
                                    {record.fileType === 'xray' ? (
                                      <FaFileImage className="text-2xl" />
                                    ) : record.fileType === 'image' ? (
                                      <FaImage className="text-2xl" />
                                    ) : (
                                      <FaFilePdf className="text-2xl" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-gray-900 truncate">{record.title}</h4>
                                    <p className="text-sm text-gray-500 truncate">{record.description || 'No description'}</p>
                                    <div className="flex items-center mt-1">
                                      <span className="text-xs text-gray-400">
                                        {new Date(record.uploadDate).toLocaleDateString()}
                                      </span>
                                      {record.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 ml-2">
                                          {record.tags.slice(0, 2).map((tag, i) => (
                                            <span key={i} className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                                              {tag}
                                            </span>
                                          ))}
                                          {record.tags.length > 2 && (
                                            <span className="text-xs bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded">
                                              +{record.tags.length - 2}
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <a 
                                    href={record.fileUrl} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="p-1.5 text-gray-400 hover:text-blue-500 rounded-full hover:bg-blue-50 transition-colors"
                                    title="View document"
                                  >
                                    <FaDownload className="text-sm" />
                                  </a>
                                </motion.div>
                              ))}
                            </div>
                          </AnimatePresence>
                        )}
                      </div>
                    </motion.div>
                  </div>
                 
                  {/* Diagnosis Form */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 bg-white border border-gray-100 rounded-xl shadow-sm p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <FaNotesMedical className="text-blue-500 mr-2" /> Diagnosis Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Selected Tooth
                          </label>
                          <div className="flex items-center">
                            <div className="bg-white p-3 rounded-lg border border-gray-200 w-full text-center">
                              <span className="text-2xl font-bold text-blue-600">{diagnosis.toothNumber || 'Not selected'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Condition
                          </label>
                          <select
                            value={diagnosis.condition}
                            onChange={(e) => setDiagnosis({ ...diagnosis, condition: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          >
                            <option value="">Select condition</option>
                            {commonConditions.map((condition) => (
                              <option key={condition} value={condition}>
                                {condition}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className="flex flex-col justify-between">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Severity
                          </label>
                          <div className="flex justify-between mb-4">
                            {['low', 'medium', 'high'].map((level) => (
                              <motion.label 
                                key={level} 
                                className={`flex flex-col items-center justify-center w-full p-3 rounded-xl cursor-pointer transition-all ${diagnosis.severity === level ? 
                                  level === 'low' ? 'bg-green-50 border-2 border-green-400' : 
                                  level === 'medium' ? 'bg-amber-50 border-2 border-amber-400' : 
                                  'bg-red-50 border-2 border-red-400'
                                  : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'}`}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                              >
                                <input
                                  type="radio"
                                  value={level}
                                  checked={diagnosis.severity === level}
                                  onChange={(e) => setDiagnosis({ ...diagnosis, severity: e.target.value as 'low' | 'medium' | 'high' })}
                                  className="sr-only"
                                />
                                <div className={`w-6 h-6 rounded-full mb-1 ${level === 'low' ? 'bg-green-500' : level === 'medium' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                                <span className="capitalize text-sm">{level}</span>
                              </motion.label>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Recommended Treatment
                          </label>
                          <textarea
                            value={diagnosis.treatment}
                            onChange={(e) => setDiagnosis({ ...diagnosis, treatment: e.target.value })}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 transition-all"
                            placeholder="Describe the recommended treatment..."
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        value={diagnosis.notes}
                        onChange={(e) => setDiagnosis({ ...diagnosis, notes: e.target.value })}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 transition-all"
                        placeholder="Add any additional notes..."
                      />
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Images
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleImageSelect(e.target.files, diagnosis.toothNumber);
                          }
                        }}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                      />
                      {uploadingImages && (
                        <div className="mt-2 text-sm text-blue-600">
                          Uploading images...
                        </div>
                      )}
                      {selectedImages[diagnosis.toothNumber]?.length > 0 && (
                        <div className="mt-2 text-sm text-gray-600">
                          {selectedImages[diagnosis.toothNumber].length} image(s) selected
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Previous Diagnoses */}
                  {diagnosisList.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mt-6 bg-white border border-gray-100 rounded-xl shadow-sm p-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        Previous Diagnoses
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {diagnosisList.map((d, index) => (
                          <motion.div 
                            key={index} 
                            className={`border rounded-xl overflow-hidden shadow-sm
                              ${d.severity === 'high' ? 'border-l-4 border-l-red-500' :
                              d.severity === 'medium' ? 'border-l-4 border-l-amber-500' :
                              'border-l-4 border-l-green-500'}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 * index }}
                            whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)' }}
                          >
                            <div className="p-4 bg-gradient-to-r from-gray-50 to-white">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-gray-800 flex items-center">
                                    <FaTooth className="text-blue-500 mr-2" />
                                    Tooth #{d.toothNumber}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">{d.condition}</p>
                                  {d.treatment && (
                                    <p className="text-xs text-gray-500 mt-2 line-clamp-1">{d.treatment}</p>
                                  )}
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${  
                                  d.severity === 'high' ? 'bg-red-100 text-red-800' :
                                  d.severity === 'medium' ? 'bg-amber-100 text-amber-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {d.severity}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <div className="mt-6 flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.02, boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={saveDiagnosis}
                          className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 flex items-center transition-all font-medium shadow-md"
                        >
                          <FaCheck className="mr-2" />
                          Save All Diagnoses
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* Add Medications Section */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Medications</h3>
                    <div className="space-y-4">
                      {medications.map((med, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Name</label>
                              <input
                                type="text"
                                value={med.name}
                                onChange={(e) => {
                                  const newMeds = [...medications];
                                  newMeds[index].name = e.target.value;
                                  setMedications(newMeds);
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Dosage</label>
                              <input
                                type="text"
                                value={med.dosage}
                                onChange={(e) => {
                                  const newMeds = [...medications];
                                  newMeds[index].dosage = e.target.value;
                                  setMedications(newMeds);
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Frequency</label>
                              <input
                                type="text"
                                value={med.frequency}
                                onChange={(e) => {
                                  const newMeds = [...medications];
                                  newMeds[index].frequency = e.target.value;
                                  setMedications(newMeds);
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Duration</label>
                              <input
                                type="text"
                                value={med.duration}
                                onChange={(e) => {
                                  const newMeds = [...medications];
                                  newMeds[index].duration = e.target.value;
                                  setMedications(newMeds);
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Instructions</label>
                            <textarea
                              value={med.instructions}
                              onChange={(e) => {
                                const newMeds = [...medications];
                                newMeds[index].instructions = e.target.value;
                                setMedications(newMeds);
                              }}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              rows={2}
                            />
                          </div>
                          <button
                            onClick={() => {
                              const newMeds = medications.filter((_, i) => i !== index);
                              setMedications(newMeds);
                            }}
                            className="mt-2 text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove Medication
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => setMedications([...medications, {
                          name: '',
                          dosage: '',
                          frequency: '',
                          duration: '',
                          instructions: ''
                        }])}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        + Add Medication
                      </button>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h3>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payment Amount
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(parseFloat(e.target.value) )}
                            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter payment amount"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDiagnosisModal(false)}
                    className="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={addDiagnosisToList}
                    disabled={!diagnosis.toothNumber || !diagnosis.condition}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-md"
                  >
                    <FaCheck className="mr-2" />
                    Add Diagnosis
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default TodayAppointments; 