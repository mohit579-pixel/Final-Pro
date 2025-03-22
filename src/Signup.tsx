import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAccount } from "@/Redux/authSlice";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaTeeth } from "react-icons/fa";

// Define types for API response and error
interface ApiResponse {
  payload: {
    success: boolean;
    message?: string;
  };
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export default function Signup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER", // Default role
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await dispatch(createAccount(formData)) as unknown as ApiResponse;
      if (response.payload.success) {
        toast.success("Signup successful! Redirecting...");
        navigate("/dashboard");
      } else {
        toast.error(response.payload.message || "Signup failed");
      }
    } catch (error: unknown) {
      console.error(error);
      const apiError = error as ApiError;
      toast.error(apiError.response?.data?.message || apiError.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white p-6 md:p-10">
      <div className={cn("flex flex-col gap-6 w-full max-w-sm md:max-w-3xl", className)} {...props}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden shadow-lg border-slate-200">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex items-center justify-center">
                      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                        <FaTeeth className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text mb-1">Join DentalCare</h1>
                    <p className="text-balance text-slate-500">
                      Create your account for better dental care
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="fullName" className="text-slate-700">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      placeholder="John Smith"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-slate-700">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-slate-700">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword" className="text-slate-700">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="role" className="text-slate-700">Account Type</Label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="DOCTOR">Doctor</option>
                      <option value="USER">Patient</option>
                    </select>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-md transition-all hover:scale-[1.02] text-white font-semibold"
                    disabled={loading}
                  >
                    {loading ? "Signing up..." : "Create Account"}
                  </Button>
                  
                  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-slate-200">
                    <span className="relative z-10 bg-white px-2 text-slate-500">
                      Or continue with
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <Button variant="outline" className="w-full border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-5 h-5 text-slate-700"
                      >
                        <path
                          d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                          fill="currentColor"
                        />
                      </svg>
                      <span className="sr-only">Login with Apple</span>
                    </Button>
                    <Button variant="outline" className="w-full border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-5 h-5 text-slate-700"
                      >
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      <span className="sr-only">Login with Google</span>
                    </Button>
                    <Button variant="outline" className="w-full border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-5 h-5 text-slate-700"
                      >
                        <path
                          d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                          fill="currentColor"
                        />
                      </svg>
                      <span className="sr-only">Login with Meta</span>
                    </Button>
                  </div>
                  
                  <div className="text-center text-sm text-slate-600">
                    Already have an account?{" "}
                    <a 
                      href="/login" 
                      className="font-medium text-blue-600 hover:text-blue-500 underline underline-offset-4"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/login");
                      }}
                    >
                      Sign in
                    </a>
                  </div>
                </div>
              </form>
              
              <div className="relative hidden bg-gradient-to-br from-blue-50 to-cyan-50 md:block">
                <div className="absolute inset-0 bg-opacity-10">
                  {/* Background elements */}
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
                
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="max-w-md text-center">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="mb-6 flex justify-center"
                    >
                      <div className="relative p-4">
                        <motion.div
                          className="absolute inset-0 rounded-full bg-blue-200/50"
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.5, 0.7, 0.5],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 4,
                          }}
                        />
                        <FaTeeth className="relative w-20 h-20 text-blue-600" />
                      </div>
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">Welcome to DentalCare</h3>
                    <p className="text-slate-600 mb-6">Join our platform for the best dental care experience and manage your appointments with ease.</p>
                    
                    <div className="space-y-4">
                      {[
                        "Online appointment booking",
                        "Personalized treatment plans",
                        "Digital dental records",
                        "Communication with your dentist"
                      ].map((feature, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + (i * 0.1) }}
                          className="flex items-center justify-center space-x-2"
                        >
                          <svg 
                            className="h-5 w-5 text-blue-500" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path 
                              fillRule="evenodd" 
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                              clipRule="evenodd" 
                            />
                          </svg>
                          <span className="text-slate-700">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-balance text-center text-xs text-slate-500 [&_a]:underline [&_a]:underline-offset-4 [&_a]:text-blue-600 hover:[&_a]:text-blue-500"
        >
          By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
          and <a href="#">Privacy Policy</a>.
        </motion.div>
      </div>
    </div>
  );
}