import React, { useState, useRef } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

interface Prediction {
  confidence: number;
  class_id: number;
}

interface ApiResponse {
  predictions: {
    [key: string]: Prediction;
  };
  predicted_classes: string[];
}

const DentalImageAnalyzer: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [predictions, setPredictions] = useState<{ class: string; confidence: number }[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
      toast.error('Please select a valid image file (JPEG or PNG)');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPredictions([]);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    try {
      setAnalyzing(true);
      
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

          const data: ApiResponse = response.data;
          
          // Convert predictions to array format
          const results = Object.entries(data.predictions).map(([className, prediction]) => ({
            class: className,
            confidence: prediction.confidence
          }));

          setPredictions(results);
        } catch (error) {
          console.error('Error analyzing image:', error);
          if (error instanceof AxiosError) {
            toast.error(error.response?.data?.message || 'Failed to analyze the image');
          } else {
            toast.error('Failed to analyze the image');
          }
        } finally {
          setAnalyzing(false);
        }
      };

      reader.onerror = () => {
        toast.error('Failed to read the image file');
        setAnalyzing(false);
      };
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('Failed to analyze the image');
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/jpeg,image/png"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-500 transition-colors"
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Selected"
              className="max-h-64 mx-auto"
            />
          ) : (
            <div className="text-gray-500">
              Click to select an image or drag and drop
            </div>
          )}
        </button>
      </div>

      {selectedImage && !analyzing && (
        <button
          onClick={analyzeImage}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Analyze Image
        </button>
      )}

      {predictions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>
          <div className="space-y-4">
            {predictions.map((prediction) => (
              <div key={prediction.class} className="flex items-center">
                <div className="w-32">{prediction.class}</div>
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
        </div>
      )}
    </div>
  );
};

export default DentalImageAnalyzer; 