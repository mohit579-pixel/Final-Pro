import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useDispatch } from "react-redux"

// This is sample data.
const Ddata = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: AudioWaveform,
      isActive: true,
      // items: [
      //   {
      //     title: "Docter",
      //     url: "/docter/dashboard",
      //   },
      //   {
      //     title: "User",
      //     url: "/user/dashboard",
      //   },
        // {
        //   title: "Settings",
        //   url: "#",
        // },
      // ],
    },
    {
      title: "AI & Diagnosis",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "AI Symptom Analysis",
          url: "#",
        },
        {
          title: "AI-Assisted X-ray & Scan Interpretation",
          url: "#",
        },
        // {
        //   title: "Quantum",
        //   url: "#",
        // },
      ],
    },
    {
      title: "Patient Management",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "View & Manage Patient Records",
          url: "#",
        },
        {
          title: "Approve/Decline Appointments",
          url: "#",
        },
        {
          title: "Prescriptions & Recommendations",
          url: "#",
        },
        // {
        //   title: "Changelog",
        //   url: "#",
        // },
      ],
    },
    {
      title: "Collaboration & Communication",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Refer Patients to Specialists",
          url: "#",
        },
        {
          title: "Chat with Other Doctors",
          url: "#",
        },
        // {
        //   title: "Billing",
        //   url: "#",
        // },
        // {
        //   title: "Limits",
        //   url: "#",
        // },
      ],
    },
    {
      title: "Reports & Analytics",
      url: "#",
      icon: GalleryVerticalEnd,
      items: [
        {
          title: "View Trends in Patient Diagnoses",
          url: "#",
        },
        {
          title: "Treatment Success Rate Analysis",
          url: "#",
        },
        // {
        //   title: "Billing",
        //   url: "#",
        // },
        // {
        //   title: "Limits",
        //   url: "#",
        // },
      ],
    },
  ],
  projects: [
    {
      name: "Dashboard",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}
const Adata = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Docter",
          url: "/docter/dashboard",
        },
        {
          title: "User",
          url: "/user/dashboard",
        },
        // {
        //   title: "Settings",
        //   url: "#",
        // },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Dashboard",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

const Udata = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",

        },
        // {
        //   title: "User",
        //   url: "/user/dashboard",
        // },
        // {
        //   title: "Settings",
        //   url: "#",
        // },
      ],
    },
    {
      title: "AI Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "AI Symptom Checker",
          url: "#",
        },
        {
          title: "AI-Powered Medical Report Analysis",
          url: "#",
        },
        // {
        //   title: "Quantum",
        //   url: "#",
        // },
      ],
    },
    {
      title: "Appointments",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Book Appointment",
          url: "#",
        },
        {
          title: "View & Manage Appointments",
          url: "/patient/calendar",
        },
        // {
        //   title: "Tutorials",
        //   url: "#",
        // },
        // {
        //   title: "Changelog",
        //   url: "#",
        // },
      ],
    },
    {
      title: "Health Records",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "View & Upload Medical Reports (X-rays, Prescriptions)",
          url: "#",
        },
        {
          title: "Digital Health History",
          url: "#",
        },
        // {
        //   title: "Billing",
        //   url: "#",
        // },
        // {
        //   title: "Limits",
        //   url: "#",
        // },
      ],
    },
    {
      title: "Billing & Payments",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Payment History & Invoices",
          url: "#",
        },
        {
          title: "Insurance & Claim Processing",
          url: "#",
        },
        // {
        //   title: "Billing",
        //   url: "#",
        // },
        // {
        //   title: "Limits",
        //   url: "#",
        // },
      ],
    },
  ],
  projects: [
    // {
    //   name: "Dashboard",
    //   url: "#",
    //   icon: Frame,
    // },
    // {
    //   name: "Sales & Marketing",
    //   url: "#",
    //   icon: PieChart,
    // },
    // {
    //   name: "Travel",
    //   url: "#",
    //   icon: Map,
    // },
  ],
}

// const dispatch = useDispatch();

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // const dispatch=useDispatch();
  const role=localStorage.getItem("role");
  let data=Udata;
  if(role==="ADMIN"){
     data=Adata;
  }
  else if(role==="DOCTOR"){
     data=Ddata;
  }
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
