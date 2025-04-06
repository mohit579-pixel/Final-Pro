import * as React from "react"
import {
  ClipboardList,
  Calendar,
  Heart,
  Stethoscope,
  UserCog,
  FileText,
  BarChart3,
  MessageSquare,
  CreditCard,
  UserCircle,
  Home,
  Settings,
  Clock,
  LucideIcon
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Type definitions to fix TypeScript errors
interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
}

interface TeamItem {
  name: string;
  logo: LucideIcon;
  plan: string;
}

interface UserData {
  name: string;
  email: string;
  avatar: string;
}

interface SidebarData {
  user: UserData;
  teams: TeamItem[];
  navMain: NavItem[];
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}

// Doctor data with dental-focused menu items
const Ddata: SidebarData = {
  user: {
    name: "Dr. Smith",
    email: "doctor@dentalcare.com",
    avatar: "/avatars/doctor.jpg",
  },
  teams: [
    {
      name: "DentalCare",
      logo: Stethoscope,
      plan: "Professional",
    }
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/doctor/dashboard",
      icon: Home,
      isActive: true,
      items: [],
    },
    {
      title: "Patient Records",
      url: "/doctor/patients",
      icon: ClipboardList,
      items: [
        {
          title: "View Patient Files",
          url: "/doctor/patients",
        },
        {
          title: "Treatment History",
          url: "/doctor/patients/history",
        },
      ],
    },
    {
      title: "Appointments",
      url: "/doctor/appointments",
      icon: Calendar,
      items: [
        {
          title: "Today's Schedule",
          url: "/doctor/appointments?view=today",
        },
        {
          title: "Manage Appointments",
          url: "/doctor/appointments?view=all",
        },
      ],
    },
    {
      title: "Treatment Plans",
      url: "/doctor/treatment-plans",
      icon: FileText,
      items: [
        {
          title: "Create Plan",
          url: "/doctor/treatment-plans/create",
        },
        {
          title: "Review & Update",
          url: "/doctor/treatment-plans",
        },
      ],
    },
    {
      title: "Analytics",
      url: "/doctor/analytics",
      icon: BarChart3,
      items: [
        {
          title: "Patient Statistics",
          url: "/doctor/analytics?view=patients",
        },
        {
          title: "Treatment Outcomes",
          url: "/doctor/analytics?view=outcomes",
        },
      ],
    },
  ],
  projects: [
    {
      name: "My Profile",
      url: "#",
      icon: UserCircle,
    },
    {
      name: "Settingss",
      url: "#",
      icon: Settings,
    },
  ],
}

// Admin data
const Adata: SidebarData = {
  user: {
    name: "Admin",
    email: "admin@dentalcare.com",
    avatar: "/avatars/admin.jpg",
  },
  teams: [
    {
      name: "DentalCare",
      logo: Stethoscope,
      plan: "Admin",
    }
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Doctor",
          url: "/docter/dashboard",
        },
        {
          title: "User",
          url: "/user/dashboard",
        },
      ],
    },
    {
      title: "Staff Management",
      url: "#",
      icon: UserCog,
      items: [
        {
          title: "Doctors",
          url: "#",
        },
        {
          title: "Support Staff",
          url: "#",
        },
      ],
    },
    {
      title: "Clinic Operations",
      url: "#",
      icon: ClipboardList,
      items: [
        {
          title: "Schedule Management",
          url: "#",
        },
        {
          title: "Treatment Protocols",
          url: "#",
        },
      ],
    },
    {
      title: "Financial Reports",
      url: "#",
      icon: CreditCard,
      items: [
        {
          title: "Revenue Overview",
          url: "#",
        },
        {
          title: "Expense Tracking",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "My Profile",
      url: "#",
      icon: UserCircle,
    },
    {
      name: "Settings",
      url: "#",
      icon: Settings,
    },
  ],
}

// Patient/User data
const Udata: SidebarData = {
  user: {
    name: "Patient",
    email: "patient@example.com",
    avatar: "/avatars/patient.jpg",
  },
  teams: [
    {
      name: "DentalCare",
      logo: Stethoscope,
      plan: "Patient",
    }
  ],
  navMain: [
    {
      title: "My Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Appointments",
      url: "#",
      icon: Calendar,
      items: [
        {
          title: "Book Appointment",
          url: "#",
        },
        {
          title: "Manage Appointments",
          url: "/patient/calendar",
        },
      ],
    },
    {
      title: "My Health",
      url: "#",
      icon: Heart,
      items: [
        {
          title: "Dental History",
          url: "#",
        },
        {
          title: "Treatment Plans",
          url: "#",
        },
      ],
    },
    {
      title: "Records & Files",
      url: "#",
      icon: FileText,
      items: [
        {
          title: "X-rays & Images",
          url: "#",
        },
        {
          title: "Prescriptions",
          url: "#",
        },
      ],
    },
    {
      title: "Billing",
      url: "#",
      icon: CreditCard,
      items: [
        {
          title: "Payment History",
          url: "#",
        },
        {
          title: "Insurance Claims",
          url: "#",
        },
      ],
    },
    {
      title: "Communication",
      url: "#",
      icon: MessageSquare,
      items: [
        {
          title: "Messages",
          url: "#",
        },
        {
          title: "Appointment Reminders",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "My Profile",
      url: "#",
      icon: UserCircle,
    },
    {
      name: "Health Reminders",
      url: "#",
      icon: Clock,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const role = localStorage.getItem("role");
  let data: SidebarData = Udata;
  
  if (role === "ADMIN") {
    data = Adata;
  } else if (role === "DOCTOR") {
    data = Ddata;
  }
  
  return (
    <Sidebar 
      collapsible="icon" 
      className="border-r border-slate-200 bg-white shadow-sm"
      {...props}
    >
      <SidebarHeader className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center">
          <Stethoscope className="h-6 w-6 text-slate-700 mr-2" />
          <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text">
            DentalCare
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <div className="space-y-1">
          <NavMain items={data.navMain} />
        </div>
      </SidebarContent>
      <SidebarFooter className="border-t border-slate-200 bg-white p-3">
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail className="bg-slate-50 border-r border-slate-200" />
    </Sidebar>
  )
}
