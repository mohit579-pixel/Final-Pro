import React from 'react';
import { Outlet } from 'react-router-dom';
import VoiceCommandButton from '../components/VoiceCommandButton';
import Page from "@/app/dashboard/page";
import { ReactNode } from "react";
interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Page children={children}/>
      <Outlet />
      <VoiceCommandButton />
    </div>
  );
};

export default Layout;