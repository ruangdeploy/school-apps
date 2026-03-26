import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  GraduationCap,
  UserCheck,
  BarChart3,
  Settings,
  FileText,
  ArrowLeft
} from 'lucide-react'

// Color palette constants
const COLORS = {
  primary: 'rgb(15, 76, 92)',
  accent: 'rgb(244, 163, 0)',
  white: 'rgb(255, 255, 255)',
  success: 'rgb(34, 197, 94)',
  warning: 'rgb(251, 146, 60)',
  error: 'rgb(239, 68, 68)'
}

// Mock admin data
const mockAdminStats = {
  totalStudents: 245,
  totalTeachers: 18,
  totalClasses: 12,
  todayAttendance: {
    present: 220,
    absent: 15,
    late: 10,
    percentage: 89.8
  },
  recentActivities: [
    {
      id: 1,
      type: 'attendance',
      message: 'Absensi kelas XII IPA 1 telah dilengkapi',
      time: '10 menit yang lalu',
      user: 'Guru Matematika'
    },
    {
      id: 2,
      type: 'student',
      message: 'Siswa baru terdaftar: Ahmad Rizki',
      time: '30 menit yang lalu',
      user: 'Admin'
    },
    {
      id: 3,
      type: 'assignment',
      message: 'Tugas Fisika baru ditambahkan untuk kelas XI',
      time: '1 jam yang lalu',
      user: 'Pak Andi Rahman'
    }
  ]
}

interface AdminDashboardProps {}

const AdminDashboard: React.FC<AdminDashboardProps> = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'teachers' | 'classes' | 'reports'>('overview')
  const [stats, setStats] = useState(mockAdminStats)

  const statCards = [
    {
      title: 'Total Siswa',
      value: stats.totalStudents,
      icon: Users,
      color: COLORS.primary,
      change: '+5 dari bulan lalu'
    },
    {
      title: 'Total Guru',
      value: stats.totalTeachers,
      icon: GraduationCap,
      color: COLORS.accent,
      change: '+2 dari bulan lalu'
    },
    {
      title: 'Total Kelas',
      value: stats.totalClasses,
      icon: FileText,
      color: COLORS.success,
      change: 'Tidak berubah'
    },
    {
      title: 'Kehadiran Hari Ini',
      value: `${stats.todayAttendance.percentage}%`,
      icon: UserCheck,
      color: COLORS.warning,
      change: `${stats.todayAttendance.present}/${stats.totalStudents} hadir`
    }
  ]

  const adminTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'students', label: 'Siswa', icon: Users },
    { id: 'teachers', label: 'Guru', icon: GraduationCap },
    { id: 'classes', label: 'Kelas', icon: FileText },
    { id: 'reports', label: 'Laporan', icon: BarChart3 }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${COLORS.primary} 0%, rgba(244, 163, 0, 0.1) 100%)`,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: COLORS.white,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '70px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <button
              onClick={() => window.history.back()}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ArrowLeft size={24} color={COLORS.primary} />
            </button>
            <div>
              <h1 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: COLORS.primary,
                margin: 0
              }}>
                Admin Dashboard
              </h1>
              <p style={{
                fontSize: '14px',
                color: '#666',
                margin: 0
              }}>
                Kelola sistem sekolah
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <button style={{
              background: COLORS.primary,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Settings size={16} />
              Pengaturan
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        background: COLORS.white,
        borderBottom: '1px solid #e5e7eb',
        padding: '0 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          gap: '0'
        }}>
          {adminTabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '16px 24px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? COLORS.primary : '#6b7280',
                  borderBottom: isActive ? `2px solid ${COLORS.primary}` : '2px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px'
      }}>
        {activeTab === 'overview' && (
          <div>
            {/* Statistics Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '30px'
            }}>
              {statCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    background: COLORS.white,
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    border: `2px solid transparent`,
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  whileHover={{
                    y: -5,
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                    borderColor: card.color
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      background: `${card.color}15`,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <card.icon size={24} color={card.color} />
                    </div>
                  </div>
                  
                  <h3 style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#1f2937',
                    margin: '0 0 8px 0'
                  }}>
                    {card.value}
                  </h3>
                  
                  <p style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#6b7280',
                    margin: '0 0 8px 0'
                  }}>
                    {card.title}
                  </p>
                  
                  <p style={{
                    fontSize: '14px',
                    color: '#9ca3af',
                    margin: 0
                  }}>
                    {card.change}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                background: COLORS.white,
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            >
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
                margin: '0 0 20px 0'
              }}>
                Aktivitas Terkini
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {stats.recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      background: '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb'
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: COLORS.primary,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {activity.type === 'attendance' && <UserCheck size={20} color="white" />}
                      {activity.type === 'student' && <Users size={20} color="white" />}
                      {activity.type === 'assignment' && <FileText size={20} color="white" />}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#1f2937',
                        margin: '0 0 4px 0'
                      }}>
                        {activity.message}
                      </p>
                      <p style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        margin: 0
                      }}>
                        {activity.time} • oleh {activity.user}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'students' && <StudentManagementRedirect />}
        {activeTab === 'teachers' && <TeacherManagementRedirect />}
        {activeTab === 'classes' && <ClassManagementRedirect />}
        {activeTab === 'reports' && <ReportsRedirect />}
      </div>
    </div>
  )
}

// Redirect to Student Management Page
const StudentManagementRedirect: React.FC = () => {
  React.useEffect(() => {
    window.location.href = '/admin/students'
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: COLORS.white,
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}
    >
      <h3 style={{ color: COLORS.primary, margin: '0 0 16px 0' }}>
        Mengalihkan ke Manajemen Siswa...
      </h3>
      <p style={{ color: '#666', margin: 0 }}>
        Anda akan diarahkan ke halaman manajemen siswa dalam beberapa detik
      </p>
    </motion.div>
  )
}

// Redirect to Teacher Management Page
const TeacherManagementRedirect: React.FC = () => {
  React.useEffect(() => {
    window.location.href = '/admin/teachers'
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: COLORS.white,
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}
    >
      <h3 style={{ color: COLORS.primary, margin: '0 0 16px 0' }}>
        Mengalihkan ke Manajemen Guru...
      </h3>
      <p style={{ color: '#666', margin: 0 }}>
        Anda akan diarahkan ke halaman manajemen guru dalam beberapa detik
      </p>
    </motion.div>
  )
}

// Redirect to Class Management Page
const ClassManagementRedirect: React.FC = () => {
  React.useEffect(() => {
    window.location.href = '/admin/classes'
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: COLORS.white,
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}
    >
      <h3 style={{ color: COLORS.primary, margin: '0 0 16px 0' }}>
        Mengalihkan ke Manajemen Kelas...
      </h3>
      <p style={{ color: '#666', margin: 0 }}>
        Anda akan diarahkan ke halaman manajemen kelas dalam beberapa detik
      </p>
    </motion.div>
  )
}

// Redirect to Reports Page
const ReportsRedirect: React.FC = () => {
  React.useEffect(() => {
    window.location.href = '/admin/reports'
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: COLORS.white,
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}
    >
      <h3 style={{ color: COLORS.primary, margin: '0 0 16px 0' }}>
        Mengalihkan ke Laporan Akademik...
      </h3>
      <p style={{ color: '#666', margin: 0 }}>
        Anda akan diarahkan ke halaman laporan akademik dalam beberapa detik
      </p>
    </motion.div>
  )
}

// Reports Management Component (simplified)
const ReportsManagement: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    style={{
      background: COLORS.white,
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      textAlign: 'center'
    }}
  >
    <BarChart3 size={48} color={COLORS.primary} style={{ margin: '0 auto 16px' }} />
    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
      Laporan & Analitik
    </h3>
    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
      Fitur laporan dan analitik dalam pengembangan
    </p>
  </motion.div>
)

export default AdminDashboard
