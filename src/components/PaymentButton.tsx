import React, { useState, useEffect } from 'react';
import { FaCreditCard, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import axiosInstance from '../Helper/axiosInstance';
import { AxiosError } from 'axios';

interface PaymentButtonProps {
  appointmentId: string;
  amount: number;
  treatmentPlanId: string;
  onPaymentSuccess?: () => void;
  className?: string;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface ErrorResponse {
  message: string;
}

declare global {
  interface Window {
    Razorpay: {
      new(options: Record<string, unknown>): {
        open: () => void;
      };
    };
  }
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  appointmentId,
  amount,
  treatmentPlanId,
  onPaymentSuccess,
  className = '',
}) => {
  const [loading, setLoading] = useState(false);
  const [razorpayKey, setRazorpayKey] = useState<string | null>(null);

  useEffect(() => {
    // Check if Razorpay key is available
    const key = "rzp_test_yMBJEWv59e57JT";
    if (!key) {
      console.error('Razorpay key is missing. Please add VITE_RAZORPAY_KEY_ID to your .env file.');
    }
    setRazorpayKey(key || null);
  }, []);

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // Check if Razorpay key is available
      if (!razorpayKey) {
        toast.error('Payment service is not configured properly. Please contact the administrator.');
        setLoading(false);
        return;
      }
      
      // Create payment order
      const response = await axiosInstance.post(`/payment/create-order`, { treatmentPlanId });
      const order = response.data.data;
      
      // Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
      
      script.onload = () => {
        const options = {
          key: razorpayKey,
          amount: order.amount,
          currency: order.currency,
          name: 'Dental Clinic',
          description: 'Appointment Payment',
          order_id: order.id,
          handler: async (response: RazorpayResponse) => {
            try {
              // Verify payment
              await axiosInstance.post(`/payment/verify/${appointmentId}`, {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              });
              
              toast.success('Payment successful!');
              if (onPaymentSuccess) {
                onPaymentSuccess();
              }
            } catch (error) {
              const axiosError = error as AxiosError<ErrorResponse>;
              toast.error(axiosError.response?.data?.message || 'Payment verification failed');
            }
          },
          prefill: {
            name: 'Patient',
            email: 'patient@example.com',
            contact: '9999999999',
          },
          theme: {
            color: '#3b82f6',
          },
        };
        
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      };
      
      script.onerror = () => {
        toast.error('Failed to load payment gateway');
        setLoading(false);
      };
      
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data?.message || 'Failed to create payment order');
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading || !razorpayKey}
      className={`flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${className} ${
        loading || !razorpayKey ? 'opacity-70 cursor-not-allowed' : ''
      }`}
    >
      {loading ? (
        <FaSpinner className="animate-spin mr-2" />
      ) : (
        <FaCreditCard className="mr-2" />
      )}
      {!razorpayKey ? 'Payment Unavailable' : loading ? 'Processing...' : `Pay ₹${amount}`}
    </button>
  );
};

export default PaymentButton; 