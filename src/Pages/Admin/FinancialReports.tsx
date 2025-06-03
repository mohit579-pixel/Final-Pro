import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaMoneyBillWave,
  FaReceipt,
  FaChartLine,
  FaPlus,
  FaDownload,
  FaFileInvoice,
  FaCreditCard,
  FaExchangeAlt
} from 'react-icons/fa';
import axiosInstance from '../../Helper/axiosInstance';
import { toast } from 'react-toastify';

interface Transaction {
  _id: string;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  category: string;
  date: string;
  description: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  paymentMethod: string;
  reference: string;
}

interface Invoice {
  _id: string;
  patientName: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
}

const FinancialReports: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedTab, setSelectedTab] = useState<'transactions' | 'invoices' | 'reports' | 'payments'>('transactions');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    try {
      const [transactionsRes, invoicesRes] = await Promise.all([
        axiosInstance.get(`/admin/financial?timeRange=${timeRange}`),
        axiosInstance.get(`/admin/invoices?timeRange=${timeRange}`)
      ]);

      if (transactionsRes.data.success) {
        setTransactions(transactionsRes.data.data);
      }
      if (invoicesRes.data.success) {
        setInvoices(invoicesRes.data.data);
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
                Financial Reports
              </h1>
              <p className="text-gray-600 mt-2">Manage financial operations and reports</p>
            </div>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FaPlus className="inline-block mr-2" />
                New Transaction
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl border border-blue-200 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FaDownload className="inline-block mr-2" />
                Export
              </motion.button>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
          <div className="flex justify-end space-x-4">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as 'week' | 'month' | 'year')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setSelectedTab('transactions')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                selectedTab === 'transactions'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaMoneyBillWave className="inline-block mr-2" />
              Transactions
            </button>
            <button
              onClick={() => setSelectedTab('invoices')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                selectedTab === 'invoices'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaFileInvoice className="inline-block mr-2" />
              Invoices
            </button>
            <button
              onClick={() => setSelectedTab('reports')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                selectedTab === 'reports'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaChartLine className="inline-block mr-2" />
              Reports
            </button>
            <button
              onClick={() => setSelectedTab('payments')}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                selectedTab === 'payments'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaCreditCard className="inline-block mr-2" />
              Payments
            </button>
          </div>

          <AnimatePresence mode="wait">
            {selectedTab === 'transactions' && (
              <motion.div
                key="transactions"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {/* Transactions Content */}
                <div className="space-y-4">
                  {transactions.map(transaction => (
                    <div
                      key={transaction._id}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <FaExchangeAlt className={`mr-2 ${
                            transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                          }`} />
                          <span className="font-medium">{transaction.description}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          transaction.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        <div>Amount: ${transaction.amount.toFixed(2)}</div>
                        <div>Category: {transaction.category}</div>
                        <div>Date: {new Date(transaction.date).toLocaleDateString()}</div>
                        <div>Payment Method: {transaction.paymentMethod}</div>
                        <div>Reference: {transaction.reference}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {selectedTab === 'invoices' && (
              <motion.div
                key="invoices"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Invoices Content */}
                <div className="space-y-4">
                  {invoices.map(invoice => (
                    <div
                      key={invoice._id}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <FaReceipt className="text-blue-600 mr-2" />
                          <span className="font-medium">Invoice #{invoice._id}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          invoice.status === 'PAID'
                            ? 'bg-green-100 text-green-800'
                            : invoice.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : invoice.status === 'OVERDUE'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        <div>Patient: {invoice.patientName}</div>
                        <div>Amount: ${invoice.amount.toFixed(2)}</div>
                        <div>Date: {new Date(invoice.date).toLocaleDateString()}</div>
                        <div>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</div>
                        <div className="mt-2">
                          <strong>Items:</strong>
                          <ul className="list-disc list-inside">
                            {invoice.items.map((item, index) => (
                              <li key={index}>
                                {item.description} - {item.quantity} x ${item.unitPrice.toFixed(2)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {selectedTab === 'reports' && (
              <motion.div
                key="reports"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Reports Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Summary</h3>
                    {/* Add financial summary component here */}
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Analysis</h3>
                    {/* Add revenue analysis component here */}
                  </div>
                </div>
              </motion.div>
            )}

            {selectedTab === 'payments' && (
              <motion.div
                key="payments"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Payments Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Methods</h3>
                    {/* Add payment methods component here */}
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment History</h3>
                    {/* Add payment history component here */}
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

export default FinancialReports; 