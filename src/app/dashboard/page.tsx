import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useDispatch, useSelector } from "react-redux"
import { Navigate, useLocation, useNavigate } from "react-router-dom"

export default function Page({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  // for checking user logged in or not
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="sticky top-0 z-40">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 sticky top-0 z-40">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {/* <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}

            Logos
          </div>

          {/* <div id="home">Home</div> */}
          {
            location.pathname === "/" && (
              
          <div className="flex items-center w-full px-4">
            {/* Centered Buttons with Equal Spacing */}
            <div className="flex flex-1 justify-center gap-8">
              <button onClick={() => navigate("/")}>
                Home
              </button>
              <button onClick={() => document.getElementById("about-us")?.scrollIntoView({ behavior: "smooth" })}>
                About Us
              </button>
              <button onClick={() => document.getElementById("our-service")?.scrollIntoView({ behavior: "smooth" })}>
                Our Service
              </button>
            </div>

            {/* Login Button at Extreme Right */}
            {
              !isLoggedIn && (
                <button className="ml-auto px-4 py-2 bg-blue-500 text-white rounded-md" onClick={() => navigate("/login")}>
              Login
            </button>
              )
            }
            
          </div>
            )
          }


        </header>
        
          
          {children}
        
      </SidebarInset>
    </SidebarProvider>
  )
}
