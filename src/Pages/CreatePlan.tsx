import React, { useState } from 'react';
import Layout from '@/Layout/Layout';
import axiosInstance from '../Helper/axiosInstance';
import { toast } from 'react-hot-toast';

interface TreatmentStep {
  description: string;
  date: string;
  duration: number;
}

interface TreatmentPlan {
  name: string;
  description: string;
  estimatedTotalDuration: number;
  totalCost: number;
  steps: TreatmentStep[];
}

const CreatePlan: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const [treatmentPlan, setTreatmentPlan] = useState<TreatmentPlan>({
    name: '',
    description: '',
    estimatedTotalDuration: 1,
    totalCost: 0,
    steps: [],
  });

  // Add a new step
  const addStep = () => {
    setTreatmentPlan(prev => ({
      ...prev,
      steps: [
        ...prev.steps,
        { description: '', date: '', duration: 1 },
      ],
    }));
  };

  // Update a step
  const updateStep = (idx: number, field: keyof TreatmentStep, value: string | number) => {
    setTreatmentPlan(prev => {
      const updatedSteps = prev.steps.map((step, i) =>
        i === idx ? { ...step, [field]: value } : step
      );
      return { ...prev, steps: updatedSteps };
    });
  };

  // Remove a step
  const removeStep = (idx: number) => {
    setTreatmentPlan(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== idx),
    }));
  };

  // Create treatment plan
  const createTreatmentPlan = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/treatment-plans', treatmentPlan);
      if (response.data.success) {
        toast.success('Treatment plan created successfully');
        setTreatmentPlan({
          name: '',
          description: '',
          estimatedTotalDuration: 1,
          totalCost: 0,
          steps: [],
        });
      }
    } catch (error) {
      console.error('Error creating treatment plan:', error);
      toast.error('Failed to create treatment plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8">
        <h2 className="text-2xl font-bold mb-6">Create Treatment Plan</h2>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={treatmentPlan.name}
                onChange={e => setTreatmentPlan({ ...treatmentPlan, name: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter treatment name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Total Duration (days)</label>
              <input
                type="number"
                value={treatmentPlan.estimatedTotalDuration}
                onChange={e => setTreatmentPlan({ ...treatmentPlan, estimatedTotalDuration: parseInt(e.target.value) })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Cost ($)</label>
              <input
                type="number"
                value={treatmentPlan.totalCost}
                onChange={e => setTreatmentPlan({ ...treatmentPlan, totalCost: parseFloat(e.target.value) })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                min="0"
                step="0.01"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={treatmentPlan.description}
                onChange={e => setTreatmentPlan({ ...treatmentPlan, description: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                rows={3}
                placeholder="Enter treatment details"
              />
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Treatment Steps</h3>
            {treatmentPlan.steps.map((step, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Step Description</label>
                  <input
                    type="text"
                    value={step.description}
                    onChange={e => updateStep(idx, 'description', e.target.value)}
                    className="w-full p-2 border rounded-lg"
                    placeholder="Description"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={step.date}
                    onChange={e => updateStep(idx, 'date', e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Duration (min)</label>
                    <input
                      type="number"
                      value={step.duration}
                      min="1"
                      onChange={e => updateStep(idx, 'duration', parseInt(e.target.value))}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeStep(idx)}
                    className="p-2 ml-2 text-red-500 hover:bg-red-100 rounded-lg"
                    title="Remove Step"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addStep}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
            >
              Add Step
            </button>
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={createTreatmentPlan}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Plan'}
            </button>
            <button
              onClick={() => setTreatmentPlan({ name: '', description: '', estimatedTotalDuration: 1, totalCost: 0, steps: [] })}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              disabled={loading}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePlan;