import React from 'react'
import ReactDOM from 'react-dom/client'
import MobileResponder from './MobileResponder.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MobileResponder unitId="M51" />
  </React.StrictMode>,
)
