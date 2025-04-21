import React, { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import { toast } from 'react-hot-toast';

interface Prediction {
  class: string;
  confidence: number;
}

const CLASS_NAMES = [
  'Caries',
  'Calculus',
  'Gingivitis',
  'Normal',
  'Periodontitis'
];

const DentalImageAnalyzer: React.FC = () => {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    try {
      setLoading(true);
      // Load the model from your server
      const loadedModel = await tf.loadLayersModel('/models/dental_model/model.json');
      setModel(loadedModel);
      setLoading(false);
    } catch (error) {
      console.error('Error loading model:', error);
      toast.error('Failed to load the analysis model');
      setLoading(false);
    }
  };

  const preprocessImage = async (imageFile: File): Promise<tf.Tensor> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const tensor = tf.browser.fromPixels(img)
          .resizeNearestNeighbor([224, 224])
          .toFloat()
          .div(255.0)
          .expandDims();
        resolve(tensor);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(imageFile);
    });
  };

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
    if (!selectedImage || !model) return;

    try {
      setAnalyzing(true);
      const tensor = await preprocessImage(selectedImage);
      const predictions = await model.predict(tensor) as tf.Tensor;
      const predictionsData = await predictions.data();

      const results = CLASS_NAMES.map((className, index) => ({
        class: className,
        confidence: predictionsData[index]
      }));

      setPredictions(results);
      tensor.dispose();
      predictions.dispose();
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('Failed to analyze the image');
    } finally {
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

      {selectedImage && !loading && (
        <button
          onClick={analyzeImage}
          disabled={analyzing}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {analyzing ? 'Analyzing...' : 'Analyze Image'}
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