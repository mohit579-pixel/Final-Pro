import  { useEffect } from 'react';
import Navigation from './Navigation';

const Home = () => {
  useEffect(() => {
    // Scroll to the "Home" section when the component mounts
    const homeSection = document.getElementById('home');
    if (homeSection) {
      homeSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div>
      <Navigation />
      <div className="pt-16"> {/* Adjust the padding as needed */}
        <section id="home" className="min-h-screen p-8 bg-gray-100 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold mb-4">Home</h1>
            <p className="text-lg">Welcome to our homepage. Here you can find the latest updates and news.</p>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 relative">
            <img src="https://res-console.cloudinary.com/dymfsdc1w/media_explorer_thumbnails/1584f6110512af59ed8ed3c504dd144d/detailed" alt="Home Image" className="w-full h-auto rounded" />
            <div className="absolute bottom-4 left-4 bg-white bg-opacity-75 p-4 rounded">
              <h2 className="text-2xl font-bold">Image Title</h2>
              <p className="text-md">This is a description of the image. It provides more context and details about what is shown in the image.</p>
            </div>
          </div>
        </section>
        <section id="about-us" className="min-h-screen p-8 pt-20 bg-white">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-lg">Learn more about our company, our values, and our mission.</p>
        </section>
        <section id="our-service" className="min-h-screen p-8 pt-20 bg-gray-100">
          <h1 className="text-4xl font-bold mb-4">Our Service</h1>
          <p className="text-lg">Discover the services we offer and how we can help you achieve your goals.</p>
        </section>
      </div>
    </div>
  );
};

export default Home;