import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import {AppContextProvider} from './context/AppContext.jsx'
import AnimatedRoutes from './Misc/AnimatedRoutes.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AnimatedRoutes>
  <AppContextProvider>
          <App />    
  </AppContextProvider>
  </AnimatedRoutes>
  </BrowserRouter>,
)
