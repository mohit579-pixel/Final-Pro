import React, { useState } from 'react';
import { ImageIcon, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Layout from '@/Layout/Layout';
import axios from 'axios';

interface AnalysisResult {
  predicted_class: string;
  treatment: string;
  annotated_image?: string;
}

const DentalAnalysis: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setAnalysis(null); // Reset analysis when new image is selected
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast.error('Please select an image');
      return;
    }

    setLoading(true);
    setAnalysis(null);
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      const response = await axios.post(
        'http://localhost:5000/api/v1/dental-analysis/analyze',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );
      console.log(response.data);
      setAnalysis(response.data);
      toast.success('Analysis completed');
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Failed to analyze image'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>  
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dental Image Analysis</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            {previewUrl ? (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-64 mx-auto mb-4"
                />
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setPreviewUrl('');
                    setAnalysis(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="py-8">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drag and drop an image here, or click to select
                </p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              Select Image
            </label>
          </div>
          {selectedImage && (
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Upload className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Analyzing...
                </>
              ) : (
                'Analyze Image'
              )}
            </button>
          )}
        </div>
          {/* Analysis Results Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : analysis && analysis.predicted_class ? (
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{analysis.predicted_class}</span>
                  </div>
                  {analysis.annotated_image && (
                    <img
                      src={analysis.annotated_image}
                      alt="Prediction"
                      className="w-64 rounded shadow mb-2"
                    />
                  )}
                  <div className="bg-gray-100 p-4 rounded mb-2">
                    <strong>Treatment Plan:</strong> {analysis.treatment}
                  </div>
                  <a
                    href="https://dpuhospital.com/request-an-appointment/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Book Appointment Now
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Upload an image to see analysis results
              </div>
            )}
          </div>
        </div>
      </div>
    {/* </div> */}
  </Layout>
);
};

export default DentalAnalysis;