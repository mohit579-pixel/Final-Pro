import React, { useState } from 'react';
import { ImageIcon, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Layout from '@/Layout/Layout';
import axios, { AxiosError } from 'axios';

interface AnalysisResult {
  predictions: {
    [key: string]: {
      confidence: number;
      class_id: number;
    };
  };
  predicted_classes: string[];
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
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      
      reader.onload = async () => {
        try {
          const base64Image = reader.result?.toString().split(',')[1];
          
          const response = await axios({
            method: 'POST',
            url: 'https://serverless.roboflow.com/mouthdity-classification/1',
            params: {
              api_key: 'bnxGkARcQkoHG64jxvtf'
            },
            data: base64Image,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          });

          setAnalysis(response.data);
          toast.success('Analysis completed');
        } catch (error) {
          if (error instanceof AxiosError) {
            toast.error(error.response?.data?.message || 'Failed to analyze image');
          } else {
            toast.error('Failed to analyze image');
          }
        } finally {
          setLoading(false);
        }
      };

      reader.onerror = () => {
        toast.error('Failed to read the image file');
        setLoading(false);
      };
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to analyze image');
      }
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
            ) : analysis && analysis.predicted_classes ? (
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Predicted Class: {analysis.predicted_classes[0]}</span>
                  </div>
                  <div className="space-y-4">
                    {Object.entries(analysis.predictions).map(([className, prediction]) => (
                      <div key={className} className="flex items-center">
                        <div className="w-32">{className}</div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded-full">
                            <div
                              className="h-4 bg-blue-500 rounded-full"
                              style={{ width: `${prediction.confidence * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="w-16 text-right">
                          {(prediction.confidence * 100).toFixed(1)}%
                        </div>
                      </div>
                    ))}
                  </div>
                  <a
                    href="https://final-pro-pink.vercel.app/patient/calendar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
    </Layout>
  );
};

export default DentalAnalysis;