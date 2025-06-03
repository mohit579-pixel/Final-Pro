import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import { Toaster } from "react-hot-toast";
import Signup from "./Signup";
import { LoginForm } from "./components/login-form";
import Dashboard from "./Pages/Dashboard";
import Calendars from "./Pages/Calendars";
import { Provider } from "react-redux";
import store from "./Redux/store";
import VoiceCommandButton from "./components/VoiceCommandButton";
import NotificationsPage from "./Pages/NotificationsPage";
import DoctorDashboard from './Pages/DoctorDashboard';
import RequireAuth from "./components/Auth/RequireAuth";
import Denied from "./Pages/Denied";
// import PatientRecords from './Pages/PatientRecords';
import PatientHistory from './Pages/PatientHistory';
import DoctorAppointments from './Pages/DoctorAppointments';
import TreatmentPlans from './Pages/TreatmentPlans';
import Analytics from './Pages/Analytics';
import TodayAppointments from "./Pages/TodayAppointments";
import DentalRecords from "./Pages/DentalRecords";
import CreatePlan from "./Pages/CreatePlan";
import PatientFiles from "./Pages/PatientFiles";
import DentalAnalysis from "./Pages/DentalAnalysis";
import AppHandGestureInit from "./AppHandGestureInit";
import ClinicOperations from "./Pages/Admin/ClinicOperations";
import FinancialReports from "./Pages/Admin/FinancialReports";
import StaffManagement from "./Pages/Admin/StaffManagement";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import UserManagement from "./Pages/Admin/UserManagement";
// import UserDashboard from "./Pages/User/UserDashboard";   
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="relative min-h-screen">
          <Routes>
            //not allowed to access
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/denied" element={<Denied />} />
            <Route path="/login" element={<LoginForm />} />

            <Route element={<RequireAuth allowedRoles={["USER"]} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/patient/calendar" element={<Calendars />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>
            {/* <Route path="/doctor/appointments/today" element={<TodayAppointments />} /> */}
            {/* <Route element={<RequireAuth allowedRoles={["DOCTOR"]} />}> */}
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/patients" element={<PatientFiles />} />
              <Route path="/doctor/patients/history" element={<PatientHistory />} />
              <Route path="/doctor/patients/history/:patientId" element={<PatientHistory />} />
              <Route path="/doctor/appointments" element={<DoctorAppointments />} />
              <Route path="/doctor/treatment-plans" element={<TreatmentPlans />} />
              <Route path="/doctor/analytics" element={<Analytics />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/doctor/appointments/today" element={<TodayAppointments />} />
              <Route path="/doctor/dental-analysis" element={<DentalAnalysis />} />
              <Route path="/dental-records" element={<DentalRecords />} />
              <Route path="/dental-records/:patientId" element={<DentalRecords />} />
              <Route path="/doctor/treatment-plans/create" element={<CreatePlan />} />
              <Route path="/doctor/clinic-operations" element={<ClinicOperations />} />
              <Route path ="/admin/finance" element={<FinancialReports/>}/>
              <Route path ="/admin/staff-management" element={<StaffManagement/>}/>
              <Route path ="/admin/dashboard" element={<AdminDashboard/>}/>
              <Route path ="/admin/user-management" element={<UserManagement/>}/>
            {/* </Route> */}
          </Routes>
          <VoiceCommandButton />
          <AppHandGestureInit />
          <Toaster 
            position="bottom-center" 
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
            }} 
          />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
