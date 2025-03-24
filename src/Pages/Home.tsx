import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { FaTeeth, FaCalendarAlt, FaUserMd, FaCertificate, FaArrowRight, FaQuoteLeft } from 'react-icons/fa';
import { MdHealthAndSafety, MdFamilyRestroom, MdOutlineCleaningServices } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Layouts from '@/Layout/Layout';

// Animated Tooth Icon Component
const AnimatedTooth = () => {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <motion.div
        className="absolute w-72 h-72 bg-blue-50 rounded-full"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: "easeInOut",
        }}
      />
      <motion.div 
        className="relative z-10 text-blue-600"
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut", 
        }}
      >
        <FaTeeth className="w-32 h-32" />
      </motion.div>
      
      {/* Orbiting elements */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"
          initial={{ 
            x: 0, 
            y: 0,
            opacity: 0.7,
          }}
          animate={{
            x: Math.cos(Math.PI * 2 / 3 * i) * 120,
            y: Math.sin(Math.PI * 2 / 3 * i) * 120,
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 6,
            delay: i * 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          {i === 0 ? <MdHealthAndSafety className="w-6 h-6" /> : 
           i === 1 ? <MdFamilyRestroom className="w-6 h-6" /> : 
           <MdOutlineCleaningServices className="w-6 h-6" />}
        </motion.div>
      ))}
    </div>
  );
};

// ImageSlider Component
const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    "https://res.cloudinary.com/dymfsdc1w/image/upload/v1742664647/Final/luo6akkypn8sjvcwzg7j.jpg",
    "https://res.cloudinary.com/dymfsdc1w/image/upload/v1742664634/Final/zxgiluzccyq6hik1xrzj.jpg",
    "https://res.cloudinary.com/dymfsdc1w/image/upload/v1742664733/Final/vyee3iu9udrpapvova9e.jpg",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl">
      <AnimatePresence initial={false}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Dental care image ${currentIndex + 1}`}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.7 }}
        />
      </AnimatePresence>
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              currentIndex === index ? "bg-white scale-125" : "bg-white/50"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const exploreRef = useRef(null);
  
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  
  useEffect(() => {
    const timer = setTimeout(() => {}, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layouts>
      <div className="w-full overflow-hidden">
        {/* Hero Section with Animated Elements */}
        <section 
          ref={heroRef}
          className="min-h-screen relative flex items-center justify-center overflow-hidden"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white" />
            
            {/* Animated Waves */}
            <div className="absolute bottom-0 left-0 right-0 h-64 overflow-hidden">
              <motion.div
                className="absolute bottom-[-10%] left-[-5%] right-[-5%] h-64 bg-blue-50 rounded-[100%]"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 7,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-[-20%] left-[-10%] right-[-10%] h-64 bg-blue-100/30 rounded-[100%]"
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 8,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              />
            </div>
            
            {/* Floating Elements */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-blue-100"
                style={{
                  width: Math.random() * 100 + 50,
                  height: Math.random() * 100 + 50,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: 0.4
                }}
                animate={{
                  y: [0, Math.random() * 30 - 15],
                  scale: [1, Math.random() * 0.2 + 0.9]
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: 'reverse',
                  duration: Math.random() * 5 + 3
                }}
              />
            ))}
          </div>
          
          <div className="container mx-auto px-6 z-10 flex flex-col lg:flex-row items-center">
            <motion.div 
              className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{ opacity: heroOpacity, y: heroY }}
            >
              <motion.h1 
                className="text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text">
                  Advanced Dental Care
                </span>
                <br />
                <span className="text-gray-800">for Your Perfect Smile</span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                Experience the perfect blend of expert dental care and cutting-edge technology for your oral health.
              </motion.p>
              
              <motion.div
                className="flex flex-wrap gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center" onClick={()=>navigate("/login")}>
                    Book Appointment
                    <motion.span
                      className="inline-block ml-2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <FaArrowRight />
                    </motion.span>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-blue-500"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                  />
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition overflow-hidden group"
                >
                  <span className="relative z-10">Virtual Consultation</span>
                  <motion.div
                    className="absolute inset-0 bg-blue-100"
                    initial={{ y: "-100%" }}
                    whileHover={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                  />
                </motion.button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2 h-[400px] lg:h-[600px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
            >
              {/* Animated Dental Visual */}
              <AnimatedTooth />
            </motion.div>
          </div>
        </section>

        {/* Advantages Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <FaTeeth />,
                  title: "Advanced Technology",
                  desc: "State-of-the-art equipment for precise diagnostics and treatment"
                },
                {
                  icon: <FaUserMd />,
                  title: "Expert Dentists",
                  desc: "Highly qualified professionals with years of experience"
                },
                {
                  icon: <FaCalendarAlt />,
                  title: "Flexible Scheduling",
                  desc: "Convenient appointment times to fit your busy lifestyle"
                },
                {
                  icon: <FaCertificate />,
                  title: "Personalized Care",
                  desc: "Custom treatment plans tailored to your specific needs"
                }
              ].map((advantage, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-lg"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -10, boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="text-blue-600 mb-4 text-4xl">
                    {advantage.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{advantage.title}</h3>
                  <p className="text-gray-600">{advantage.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section with Parallax */}
        <section 
          ref={servicesRef}
          className="py-24 bg-gradient-to-b from-white to-blue-50"
        >
          <div className="container mx-auto px-6">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold mb-4">Our Dental Services</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We provide comprehensive dental care with the latest technology and expertise.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { 
                  icon: <FaTeeth className="text-4xl" />, 
                  title: "General Dentistry",
                  desc: "Regular check-ups and preventative care for optimal oral health."
                },
                { 
                  icon: <FaCalendarAlt className="text-4xl" />, 
                  title: "Cosmetic Procedures",
                  desc: "Transform your smile with our state-of-the-art cosmetic treatments."
                },
                { 
                  icon: <FaUserMd className="text-4xl" />, 
                  title: "Specialized Care",
                  desc: "Advanced treatments for complex dental conditions."
                },
                { 
                  icon: <FaCertificate className="text-4xl" />, 
                  title: "Emergency Services",
                  desc: "Immediate care for dental emergencies and pain relief."
                },
                { 
                  icon: <MdFamilyRestroom className="text-4xl" />, 
                  title: "Family Dentistry",
                  desc: "Comprehensive care for patients of all ages, from children to seniors."
                },
                { 
                  icon: <MdHealthAndSafety className="text-4xl" />, 
                  title: "Preventive Care",
                  desc: "Education and treatments to prevent dental issues before they start."
                }
              ].map((service, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center hover:shadow-2xl transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ 
                    y: -10,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-center">{service.desc}</p>
                  <motion.button
                    className="mt-6 text-blue-600 font-semibold flex items-center group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Learn More
                    <motion.span
                      className="ml-2 inline-block"
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <FaArrowRight />
                    </motion.span>
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Dental Explorer Section */}
        <section ref={exploreRef} className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4">Explore Your Dental Health</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Interactive resources to help you understand your dental health better.
              </p>
            </motion.div>
            
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-10 flex flex-col justify-center">
                  <motion.h3 
                    className="text-2xl font-bold mb-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    Interactive Dental Guides
                  </motion.h3>
                  <motion.p
                    className="text-gray-600 mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                  >
                    Explore dental health topics and learn about different treatments.
                    Our interactive guides help you understand procedures and make
                    informed decisions about your oral health journey.
                  </motion.p>
                  <motion.button
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold self-start flex items-center group"
                    whileHover={{ scale: 1.05, backgroundColor: "#2563EB" }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    Explore Guides
                    <motion.span
                      className="ml-2 inline-block"
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                    >
                      <FaArrowRight />
                    </motion.span>
                  </motion.button>
                </div>
                <div className="h-[400px] bg-blue-50 p-4">
                  <ImageSlider />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials with Parallax */}
        <section className="py-24 bg-gradient-to-b from-white to-blue-50">
          <div className="container mx-auto px-6">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4">Patient Testimonials</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See what our patients have to say about their experience.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  text: "The visualization tools really helped me understand my treatment plan. Amazing experience!",
                  rating: 5
                },
                {
                  name: "Michael Chen",
                  text: "The most advanced dental clinic I've ever visited. The staff is incredibly knowledgeable.",
                  rating: 5
                },
                {
                  name: "Emily Rodriguez",
                  text: "I was amazed by how they used technology to make my dental experience more comfortable.",
                  rating: 4
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-lg relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, boxShadow: "0 15px 30px -10px rgba(0, 0, 0, 0.1)" }}
                >
                  <FaQuoteLeft className="text-blue-100 text-4xl absolute top-4 left-4" />
                  <p className="text-gray-600 mb-6 relative z-10">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-600 mr-4">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                        ))}
                      </div>
                    </div>
            </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-6 text-center">
            <motion.h2 
              className="text-4xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Ready to Transform Your Smile?
            </motion.h2>
            <motion.p 
              className="text-xl mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Schedule your appointment today and experience our advanced dental care.
            </motion.p>
            <motion.button 
              className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition relative overflow-hidden"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <span className="relative z-10 flex items-center">
                Book Your Visit
                <motion.span
                  className="inline-block ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <FaArrowRight />
                </motion.span>
              </span>
              <motion.div
                className="absolute inset-0 bg-blue-50"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
              />
            </motion.button>
          </div>
        </section>
      </div>
    </Layouts>
  );
};

export default Home;