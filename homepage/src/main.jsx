import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import FluidUtilitiesDemo from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FluidUtilitiesDemo />
  </StrictMode>,
)
