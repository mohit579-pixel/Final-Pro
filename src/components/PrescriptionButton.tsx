import React, { useState, useEffect } from 'react';
import { FaFilePdf, FaSpinner, FaLock, FaUnlock } from 'react-icons/fa';
import axiosInstance from '../Helper/axiosInstance';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import PaymentButton from './PaymentButton';

export interface PrescriptionButtonProps {
  appointmentId: string;
  status: string;
  paymentStatus?: string;
  className?: string;
  onViewClick?: () => void;
}

const PrescriptionButton: React.FC<PrescriptionButtonProps> = ({
  appointmentId,
  status,
  paymentStatus = 'unpaid',
  className = '',
  onViewClick
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentPaymentStatus, setCurrentPaymentStatus] = useState<string>(paymentStatus);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await axiosInstance.get(`/appointments/${appointmentId}`);
        if (response.data.success) {
          setCurrentPaymentStatus(response.data.data.paymentStatus || 'unpaid');
          setPaymentAmount(response.data.data.paymentAmount || 0);
        }
      } catch (error) {
        console.error('Error fetching payment details:', error);
      }
    };

    if (appointmentId) {
      fetchPaymentDetails();
    }
  }, [appointmentId]);

  const handleGeneratePrescription = async () => {
    if (currentPaymentStatus === 'unpaid' && paymentAmount > 0) {
      setShowPaymentModal(true);
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get(`/prescriptions/${appointmentId}`, {
        responseType: 'blob'
      });

      // Check if the response is an error message (JSON) or a PDF
      const contentType = response.headers['content-type'];
      if (contentType && contentType.includes('application/json')) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result as string);
            toast.error(errorData.message || 'Failed to generate prescription');
          } catch {
            toast.error('Failed to generate prescription');
          }
        };
        reader.readAsText(response.data);
        return;
      }

      // Create a blob URL for the PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `prescription-${appointmentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Prescription downloaded successfully');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          toast.error('Payment required to download prescription');
          setShowPaymentModal(true);
        } else {
          const errorMessage = error.response?.data?.message || 'Failed to generate prescription';
          toast.error(errorMessage);
        }
      } else {
        toast.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setCurrentPaymentStatus('completed');
    setShowPaymentModal(false);
    handleGeneratePrescription();
  };

  return (
    <>
      <button
        onClick={onViewClick}
        className={`${className} px-3 py-1.5 text-xs rounded-lg font-medium flex items-center bg-blue-500 text-white hover:bg-blue-600`}
      >
        View Prescription
      </button>

      <button
        onClick={handleGeneratePrescription}
        disabled={loading || status !== 'completed'}
        className={`flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${className} ${
          loading
            ? 'bg-gray-300 cursor-not-allowed'
            : status !== 'completed'
            ? 'bg-gray-300 cursor-not-allowed'
            : currentPaymentStatus === 'completed'
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {loading ? (
          <FaSpinner className="animate-spin mr-2" />
        ) : currentPaymentStatus === 'completed' ? (
          <FaUnlock className="mr-2" />
        ) : (
          <FaLock className="mr-2" />
        )}
        {loading
          ? 'Generating...'
          : currentPaymentStatus === 'completed'
          ? 'Download Prescription'
          : 'Prescription Locked'}
      </button>

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Payment Required</h3>
            <p className="mb-4">
              To download the prescription, you need to complete the payment of ₹{paymentAmount}.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <PaymentButton
                appointmentId={appointmentId}
                amount={paymentAmount}
                onPaymentSuccess={handlePaymentSuccess}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PrescriptionButton; 