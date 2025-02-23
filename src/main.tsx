import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from "./Redux/store.js";
 // ✅ Import your Redux store
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>  {/* ✅ Wrap App with Provider */}
      <App />
      
    </Provider>
  </StrictMode>,
)
