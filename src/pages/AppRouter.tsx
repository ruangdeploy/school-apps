import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import MultiLoginPage from './MultiLoginPage'
import HomePage from './HomePage'
import AttendancePage from './AttendancePage'
import SchedulePage from './SchedulePage'
import AssignmentsPage from './AssignmentsPage'
import GradesPage from './GradesPage'
import ProfilePage from './ProfilePage'

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<MultiLoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/assignments" element={<AssignmentsPage />} />
        <Route path="/grades" element={<GradesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default AppRouter
