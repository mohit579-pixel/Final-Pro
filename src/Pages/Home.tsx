import { useEffect } from 'react';
import { FaHeartbeat, FaUserMd, FaNotesMedical } from 'react-icons/fa';
import Layouts from '@/Layout/Layout';

const Home = () => {
  useEffect(() => {
    const homeSection = document.getElementById('home');
    if (homeSection) {
      homeSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <Layouts>
      <div className="w-full">
        {/* Hero Section */}
        <section id="home" className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-r  text-black p-12">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-5xl font-extrabold mb-6 leading-tight">Your AI-Powered Healthcare Assistant</h1>
            <p className="text-lg opacity-80 mb-6">Advanced AI solutions for symptom checking, appointment booking, and secure medical data management.</p>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-200 transition" onClick={() => window.location.href = '/login'}>Get Started</button>
          </div>
          <div className="md:w-1/2 flex justify-center relative">
            <img src="https://www.sattva.co.in/wp-content/uploads/2022/12/Untitled-1200-%C3%97-630-px-1024x538.png" alt="AI Healthcare" className="w-4/5 max-w-lg rounded-lg shadow-xl" />
            <div className="absolute bottom-4 left-4 bg-white bg-opacity-80 p-4 rounded shadow-md">
              <h2 className="text-xl font-bold text-gray-700">AI Diagnosis</h2>
              <p className="text-gray-600">Instant health insights powered by AI.</p>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about-us" className="min-h-screen p-12 bg-gray-50 text-gray-800 text-center">
          <h1 className="text-4xl font-bold mb-6">About Us</h1>
          <p className="text-lg max-w-3xl mx-auto">We are revolutionizing healthcare with AI-driven diagnostics, patient management, and seamless doctor-patient interactions.</p>
        </section>

        {/* Our Services Section */}
        <section id="our-service" className="min-h-screen p-12 bg-white text-gray-800">
          <h1 className="text-4xl font-bold mb-6 text-center">Our Services</h1>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-lg">
              <FaHeartbeat className="text-4xl text-blue-600 mb-4" />
              <h2 className="text-xl font-semibold">AI Symptom Checker</h2>
              <p className="text-center">Get instant health assessments based on your symptoms.</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-lg">
              <FaUserMd className="text-4xl text-blue-600 mb-4" />
              <h2 className="text-xl font-semibold">Doctor Consultation</h2>
              <p className="text-center">Seamless appointment booking with certified doctors.</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-lg">
              <FaNotesMedical className="text-4xl text-blue-600 mb-4" />
              <h2 className="text-xl font-semibold">Digital Health Records</h2>
              <p className="text-center">Secure cloud-based storage for all your medical reports.</p>
            </div>
          </div>
        </section>
      </div>
    </Layouts>
  );
};

export default Home;