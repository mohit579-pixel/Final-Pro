import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import { Toaster } from "react-hot-toast";
import Signup from "./Signup";
// import { AppSidebar } from "./components/app-sidebar";
// import Page from "./app/dashboard/page";
// import HomePage from "./Pages/HomePage";
import { LoginForm } from "./components/login-form";
import Dashboard from "./Pages/Dashboard";
// import {Signup} from "./Signup"
function App() {
  return (
    <BrowserRouter>  {/* ✅ Wrap Routes inside BrowserRouter */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Toaster position="bottom-center" reverseOrder={false} />

    </BrowserRouter>
  );
}

export default App;
