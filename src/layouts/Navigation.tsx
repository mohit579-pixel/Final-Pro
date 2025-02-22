import LoginPage from '@/app/login/page'
import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from '@radix-ui/react-navigation-menu'
import  { useState } from 'react'

const Navigation = () => {

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isLoginModal, setIsLoginModal] = useState(true);
  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
    setIsLoginModal(false);
  };

  const handleCloseModal = () => {
    setIsLoginModalOpen(false);
    setIsLoginModal(true);
  };
  return (
    <nav className=' p-4 sticky top-0 z-50 '>
      <div className='container mx-auto flex justify-between items-center'>
        {/* Logo */}
        <div className='text-black text-xl font-bold'>
          Logo
        </div>

        {/* Navigation Menu */}
        <NavigationMenu>
          <NavigationMenuList className='flex space-x-8 text-black'>
            <NavigationMenuItem>
              <a href="#home" className='px-4 py-2 hover:bg-gray-700 rounded'>Home</a>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <a href="#about-us" className='px-4 py-2 hover:bg-gray-700 rounded'>About Us</a>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <a href="#our-service" className='px-4 py-2 hover:bg-gray-700 rounded'>Our Service</a>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Login Button */}
        {isLoginModal && (
        <div>
            <Button onClick={handleLoginClick}>Log In</Button>
        </div>
)}
      </div>
      {/* Login Modal */}
      {isLoginModalOpen && (
        <div >
          <div className='bg-white p-8 rounded absolute top-0 left-0 min-h-[100vh] min-w-[100%]'>
            <button onClick={handleCloseModal} className='absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-5xl'>
              &times;
            </button>
            <LoginPage />
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navigation