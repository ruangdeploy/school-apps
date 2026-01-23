import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import MultiLoginPage from './MultiLoginPage'
import HomePage from './HomePage'
import StudentsPage from './StudentsPage'
import AttendancePage from './AttendancePage'
import ProfilePage from './ProfilePage'

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<MultiLoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default AppRouter
