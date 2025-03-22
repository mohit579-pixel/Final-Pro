import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"

// Define types for props and state
interface PageProps {
  children: React.ReactNode;
}

interface RootState {
  auth?: {
    isLoggedIn: boolean;
  };
}

export default function Page({ children }: PageProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // for checking user logged in or not
  const isLoggedIn = useSelector((state: RootState) => state?.auth?.isLoggedIn);
  
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="sticky top-0 z-40">
        <header className="flex h-16 shrink-0 items-center gap-2 bg-white border-b border-slate-200 shadow-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 sticky top-0 z-40">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors rounded-lg" />
            <Separator orientation="vertical" className="mr-2 h-4 bg-slate-200" />
            <div className="font-bold text-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text" onClick={() => navigate("/")}>DentalCare</div>
          </div>

          {location.pathname === "/" && (
            <div className="flex items-center w-full px-4">
              {/* Centered Buttons with Equal Spacing */}
              <div className="flex flex-1 justify-center gap-8">
                <button 
                  onClick={() => navigate("/")}
                  className="text-slate-600 hover:text-blue-600 font-medium transition-colors py-2 border-b-2 border-transparent hover:border-blue-500"
                >
                  Home
                </button>
                <button 
                  onClick={() => document.getElementById("about-us")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-slate-600 hover:text-blue-600 font-medium transition-colors py-2 border-b-2 border-transparent hover:border-blue-500"
                >
                  About Us
                </button>
                <button 
                  onClick={() => document.getElementById("our-service")?.scrollIntoView({ behavior: "smooth" })}
                  className="text-slate-600 hover:text-blue-600 font-medium transition-colors py-2 border-b-2 border-transparent hover:border-blue-500"
                >
                  Our Service
                </button>
              </div>

              {/* Login Button with enhanced styling */}
              {!isLoggedIn && (
                <button 
                  className="ml-auto px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all hover:scale-105" 
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              )}
            </div>
          )}
        </header>
        
        <main className="min-h-screen bg-slate-50">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
