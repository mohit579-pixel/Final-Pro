import Page from "@/app/dashboard/page";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layouts: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Page children={children}/>
      {/* <main className="flex-1">
        {children}
      </main> */}
    </div>
  );
};

export default Layouts;