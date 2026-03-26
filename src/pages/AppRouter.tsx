import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import MultiLoginPage from './MultiLoginPage'
import HomePage from './HomePage'
import AttendancePage from './AttendancePage'
import GuruAttendancePage from './GuruAttendancePage'
import OrangTuaAttendancePage from './OrangTuaAttendancePage'
import SchedulePage from './SchedulePage'
import AssignmentsPage from './AssignmentsPage'
import GradesPage from './GradesPage'
import ProfilePage from './ProfilePage'
import TestBackendPage from './TestBackendPage'
import DebugLoginPage from './DebugLoginPage'
import ExamPage from './ExamPage'
import OrangTuaExamPage from './OrangTuaExamPage'
import GuruExamPage from './GuruExamPage'
import AdminDashboard from './AdminDashboard'
import AdminLoginPage from './AdminLoginPage'
import AdminStudentManagement from './AdminStudentManagement'
import AdminTeacherManagement from './AdminTeacherManagement'
import AdminClassManagement from './AdminClassManagement'
import AdminReportsPage from './AdminReportsPage'
import AdminProtectedRoute from '../components/AdminProtectedRoute'

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<MultiLoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/exams" element={<ExamPage />} />
        <Route path="/orang-tua/exams" element={<OrangTuaExamPage />} />
        <Route path="/guru/exams" element={<GuruExamPage />} />
        <Route path="/guru/manage-attendance" element={<Navigate to="/guru/attendance" replace />} />
        <Route path="/guru/attendance" element={<GuruAttendancePage />} />
        <Route path="/orang-tua/attendance" element={<OrangTuaAttendancePage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/assignments" element={<AssignmentsPage />} />
        <Route path="/grades" element={<GradesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/dashboard" element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/students" element={
          <AdminProtectedRoute>
            <AdminStudentManagement />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/teachers" element={
          <AdminProtectedRoute>
            <AdminTeacherManagement />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/classes" element={
          <AdminProtectedRoute>
            <AdminClassManagement />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/reports" element={
          <AdminProtectedRoute>
            <AdminReportsPage />
          </AdminProtectedRoute>
        } />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/test-backend" element={<TestBackendPage />} />
        <Route path="/debug-login" element={<DebugLoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default AppRouter
