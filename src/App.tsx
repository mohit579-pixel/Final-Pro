import LoginPage from "./app/login/page"
import { ModeToggle } from "./components/mode-toggle"
import { Button } from "./components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from "./layouts/Navigation"
import Home from "./layouts/Home"

function App() {
 

  return (
    // <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    //   {/* <LoginPage /> */}
    //   {/* <ModeToggle/> */}
    // {/* </ThemeProvider> */}
   <Home/>
   
  )
}

export default App
