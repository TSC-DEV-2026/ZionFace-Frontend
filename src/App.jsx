import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import EnrollPage from './pages/EnrollPage'
import VerifyPage from './pages/VerifyPage'
import IdentifyPage from "./pages/IdentifyPage";

export default function App() {
  return (
    <div className="min-h-screen bg-void">
      <Navbar />
      <main>
        <div className="pt-20">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/enroll" element={<EnrollPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/identify" element={<IdentifyPage />} />
        </Routes>
        </div>
      </main>
    </div>
  )
}
