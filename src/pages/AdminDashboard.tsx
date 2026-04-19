import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  GraduationCap,
  UserCheck,
  BarChart3,
  Settings,
  FileText,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Search,
  Eye,
  EyeOff,
  ArrowRightLeft,
  Download,
  Calendar,
  School,
  BookOpen,
  Clock,
  TrendingUp,
  TrendingDown
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
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'students' | 'teachers' | 'guru' | 'classes' | 'subjects' | 'schedules' | 'reports'>('overview')
  const [stats] = useState(mockAdminStats)
  const [loading, setLoading] = useState(false)
  const [realStats, setRealStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    todayAttendance: {
      present: 0,
      absent: 0,
      late: 0,
      percentage: 0
    }
  })

  // Get auth token function
  const getAuthToken = () => {
    const userData = localStorage.getItem('userData')
    if (userData) {
      try {
        const parsed = JSON.parse(userData)
        if (parsed.accessToken) {
          return parsed.accessToken
        }
      } catch (error) {
        console.log('Error parsing userData:', error)
      }
    }
    
    const directToken = localStorage.getItem('accessToken')
    if (directToken) {
      return directToken
    }
    
    const cookieToken = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1]
    if (cookieToken) {
      return cookieToken
    }
    
    return null
  }

  // API call function
  const apiCall = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken()
    
    if (!token) {
      console.error('No authentication token found')
      return null
    }
    
    try {
      const response = await fetch(`http://localhost:3000${url}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers
        },
        ...options
      })
      
      if (!response.ok) {
        console.error('API call failed:', response.status, response.statusText)
        return null
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error making API call:', error)
      return null
    }
  }

  // Fetch real statistics
  const fetchRealStats = async () => {
    setLoading(true)
    try {
      // Fetch all data in parallel
      const [studentsResponse, teachersResponse, classesResponse] = await Promise.all([
        apiCall('/api/siswa/list?limit=1000'),
        apiCall('/api/guru/list?limit=1000'),
        apiCall('/api/kelas/list?limit=1000')
      ])

      const newStats = {
        totalStudents: studentsResponse?.paging?.total || 0,
        totalTeachers: teachersResponse?.paging?.total || 0,
        totalClasses: classesResponse?.paging?.total || 0,
        todayAttendance: {
          present: Math.floor((studentsResponse?.paging?.total || 0) * 0.85), // Mock calculation
          absent: Math.floor((studentsResponse?.paging?.total || 0) * 0.10),
          late: Math.floor((studentsResponse?.paging?.total || 0) * 0.05),
          percentage: 85.0 // Mock percentage
        }
      }

      setRealStats(newStats)
    } catch (error) {
      console.error('Error fetching statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch data when component mounts and when overview tab is active
  React.useEffect(() => {
    if (activeTab === 'overview') {
      fetchRealStats()
    }
  }, [activeTab])

  const statCards = [
    {
      title: 'Total Siswa',
      value: loading ? '...' : realStats.totalStudents,
      icon: Users,
      color: COLORS.primary,
      change: '+5 dari bulan lalu'
    },
    {
      title: 'Total Guru',
      value: loading ? '...' : realStats.totalTeachers,
      icon: GraduationCap,
      color: COLORS.accent,
      change: '+2 dari bulan lalu'
    },
    {
      title: 'Total Kelas',
      value: loading ? '...' : realStats.totalClasses,
      icon: FileText,
      color: COLORS.success,
      change: 'Tidak berubah'
    },
    {
      title: 'Kehadiran Hari Ini',
      value: loading ? '...' : `${realStats.todayAttendance.percentage}%`,
      icon: UserCheck,
      color: COLORS.warning,
      change: loading ? '...' : `${realStats.todayAttendance.present}/${realStats.totalStudents} hadir`
    }
  ]

  const adminTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Pengguna', icon: Users },
    { id: 'students', label: 'Siswa', icon: Users },
    { id: 'teachers', label: 'Orang Tua', icon: GraduationCap },
    { id: 'guru', label: 'Guru', icon: UserCheck },
    { id: 'classes', label: 'Kelas', icon: FileText },
    { id: 'subjects', label: 'Mata Pelajaran', icon: BookOpen },
    { id: 'schedules', label: 'Jadwal Pelajaran', icon: Calendar },
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
            
            <button
              onClick={() => {
                // Clear all auth data
                localStorage.removeItem('userData')
                localStorage.removeItem('accessToken')
                localStorage.removeItem('userType')
                localStorage.removeItem('userRole')
                
                // Clear cookies
                document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
                
                // Redirect to login
                alert('Anda telah logout dari sistem admin.')
                window.location.href = '/login'
              }}
              style={{
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#b91c1c'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#dc2626'
              }}
              title="Logout dari sistem admin"
            >
              <ArrowRightLeft size={16} />
              Logout
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
            {/* Header with refresh button */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <div style={{
                background: COLORS.white,
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(0, 0, 0, 0.05)'
              }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#1e293b',
                  margin: '0 0 4px 0'
                }}>
                  Dashboard Overview
                </h2>
                <p style={{
                  fontSize: '14px',
                  color: '#64748b',
                  margin: 0
                }}>
                  Statistik real-time sistem sekolah
                </p>
              </div>
              
              <button
                onClick={fetchRealStats}
                disabled={loading}
                style={{
                  background: loading ? '#f3f4f6' : `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
                  color: loading ? '#9ca3af' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
              >
                <motion.div
                  animate={loading ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }}
                >
                  ↻
                </motion.div>
                {loading ? 'Memuat...' : 'Refresh Data'}
              </button>
            </div>

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
                    transition: 'all 0.3s',
                    opacity: loading ? 0.7 : 1
                  }}
                  whileHover={!loading ? {
                    y: -5,
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                    borderColor: card.color
                  } : {}}
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
                    {loading ? (
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{ 
                          background: '#e5e7eb',
                          height: '32px',
                          width: '80px',
                          borderRadius: '4px'
                        }}
                      />
                    ) : (
                      card.value
                    )}
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
                    {loading ? (
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{ 
                          background: '#f3f4f6',
                          height: '14px',
                          width: '120px',
                          borderRadius: '2px'
                        }}
                      />
                    ) : (
                      card.change
                    )}
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
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  background: '#f0f9ff',
                  borderRadius: '8px',
                  border: '1px solid #e0f2fe'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: COLORS.primary,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Users size={20} color="white" />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1f2937',
                      margin: '0 0 4px 0'
                    }}>
                      Data statistik telah diperbarui
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      margin: 0
                    }}>
                      {realStats.totalStudents} siswa, {realStats.totalTeachers} guru, {realStats.totalClasses} kelas • {new Date().toLocaleTimeString('id-ID')}
                    </p>
                  </div>
                </div>

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

        {activeTab === 'users' && <UserManagement />}

        {activeTab === 'students' && <StudentManagement />}
        {activeTab === 'teachers' && <ParentManagement />}
        {activeTab === 'guru' && <TeacherManagement />}
        {activeTab === 'classes' && <ClassManagement />}
        {activeTab === 'subjects' && <SubjectManagement />}
        {activeTab === 'schedules' && <ScheduleManagement />}
        {activeTab === 'reports' && <ReportsManagement />}
      </div>
    </div>
  )
}

// User Management Component
interface User {
  id: number;
  email: string;
  nama_lengkap: string;
  tipe_user: 'siswa' | 'orang_tua' | 'guru' | 'admin';
  is_active: number;
  no_telepon?: string;
  created_at?: string;
}

interface UserFormData {
  email: string;
  password: string;
  nama_lengkap: string;
  tipe_user: 'siswa' | 'orang_tua' | 'guru' | 'admin';
  no_telepon: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'create' | 'edit' | 'delete'>('create')
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    password: '',
    nama_lengkap: '',
    tipe_user: 'siswa',
    no_telepon: ''
  })

  const ITEMS_PER_PAGE = 20

  // Get auth token
  const getAuthToken = () => {
    console.log('=== DEBUG: Checking for auth tokens ===') // Debug log
    
    // Check localStorage userData
    const userData = localStorage.getItem('userData')
    console.log('userData from localStorage:', userData) // Debug log
    if (userData) {
      try {
        const parsed = JSON.parse(userData)
        console.log('Parsed userData:', parsed) // Debug log
        console.log('Found userData with token:', !!parsed.accessToken) // Debug log
        if (parsed.accessToken) {
          return parsed.accessToken
        }
      } catch (error) {
        console.log('Error parsing userData:', error)
      }
    }
    
    // Check direct accessToken
    const directToken = localStorage.getItem('accessToken')
    console.log('Direct accessToken:', directToken) // Debug log
    if (directToken) {
      console.log('Found direct accessToken') // Debug log
      return directToken
    }
    
    // Check cookies
    const cookieToken = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1]
    console.log('Cookie token:', cookieToken) // Debug log
    if (cookieToken) {
      console.log('Found cookie token') // Debug log
      return cookieToken
    }
    
    // Check all localStorage items
    console.log('All localStorage items:')
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      const value = localStorage.getItem(key!)
      console.log(`${key}: ${value}`)
    }
    
    console.log('=== No auth token found anywhere ===') // Debug log
    return null
  }

  // API Functions
  const apiCall = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken()
    
    if (!token) {
      throw new Error('No authentication token found. Please login again.')
    }
    
    console.log('Making API call to:', `http://localhost:3000${url}`) // Debug log
    console.log('Using token:', token.substring(0, 20) + '...') // Debug log (partial)
    
    const response = await fetch(`http://localhost:3000${url}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      },
      ...options
    })
    
    console.log('API Response status:', response.status) // Debug log
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log('API Error response:', errorText) // Debug log
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`)
    }
    
    const data = await response.json()
    console.log('API Response data:', data) // Debug log
    return data
  }

  const fetchUsers = async (page = 1, limit = ITEMS_PER_PAGE) => {
    setLoading(true)
    try {
      const response = await apiCall(`/api/admin/user/list?page=${page}&limit=${limit}`)
      console.log('API Response:', response) // Debug log
      
      if (response.success && response.data) {
        setUsers(response.data)
        setTotalUsers(response.paging?.total || response.data.length)
      } else {
        throw new Error('Invalid API response format')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      // Special handling for authentication errors
      if (errorMessage.includes('No authentication token found')) {
        alert('Sesi login telah berakhir. Silakan login ulang sebagai admin untuk mengakses manajemen pengguna.')
        // Redirect to login page
        window.location.href = '/login'
        return
      }
      
      alert(`Error memuat data pengguna: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const createUser = async () => {
    setLoading(true)
    try {
      await apiCall('/api/admin/user', {
        method: 'POST',
        body: JSON.stringify(formData)
      })
      alert('Pengguna berhasil dibuat!')
      fetchUsers(currentPage)
      closeModal()
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Error membuat pengguna')
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (id: number) => {
    setLoading(true)
    try {
      await apiCall(`/api/admin/user/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      })
      alert('Pengguna berhasil diperbarui!')
      fetchUsers(currentPage)
      closeModal()
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Error memperbarui pengguna')
    } finally {
      setLoading(false)
    }
  }

  const deleteUser = async (id: number) => {
    setLoading(true)
    try {
      await apiCall(`/api/admin/user/${id}`, {
        method: 'DELETE'
      })
      alert('Pengguna berhasil dihapus!')
      fetchUsers(currentPage)
      closeModal()
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error menghapus pengguna')
    } finally {
      setLoading(false)
    }
  }

  // Modal Functions
  const openCreateModal = () => {
    setFormData({
      email: '',
      password: '',
      nama_lengkap: '',
      tipe_user: 'siswa',
      no_telepon: ''
    })
    setModalType('create')
    setShowModal(true)
  }

  const openEditModal = (user: User) => {
    setSelectedUser(user)
    setFormData({
      email: user.email,
      password: '',
      nama_lengkap: user.nama_lengkap,
      tipe_user: user.tipe_user,
      no_telepon: user.no_telepon || ''
    })
    setModalType('edit')
    setShowModal(true)
  }

  const openDeleteModal = (user: User) => {
    setSelectedUser(user)
    setModalType('delete')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedUser(null)
    setShowPassword(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (modalType === 'create') {
      createUser()
    } else if (modalType === 'edit' && selectedUser) {
      updateUser(selectedUser.id)
    } else if (modalType === 'delete' && selectedUser) {
      deleteUser(selectedUser.id)
    }
  }

  React.useEffect(() => {
    // Check if user is logged in and is admin
    const token = getAuthToken()
    const userType = localStorage.getItem('userType')
    const userData = localStorage.getItem('userData')
    
    console.log('=== Admin Dashboard Authentication Check ===')
    console.log('Token exists:', !!token)
    console.log('User type:', userType)
    console.log('User data exists:', !!userData)
    
    if (!token) {
      alert('Anda perlu login sebagai admin untuk mengakses halaman ini.')
      window.location.href = '/login'
      return
    }
    
    if (userType !== 'admin') {
      alert('Akses ditolak. Anda bukan administrator.')
      window.location.href = '/login'
      return
    }
    
    fetchUsers()
  }, [currentPage])

  const filteredUsers = users.filter(user =>
    user.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.tipe_user.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE)

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case 'admin': return '#dc2626' // Red for admin
      case 'guru': return COLORS.primary // Primary blue for teacher
      case 'siswa': return '#059669' // Green for student
      case 'orang_tua': return '#d97706' // Orange for parent
      default: return '#6b7280'
    }
  }

  const getUserTypeBgColor = (type: string) => {
    switch (type) {
      case 'admin': return '#fef2f2' // Light red background
      case 'guru': return '#f0f9ff' // Light blue background
      case 'siswa': return '#f0fdf4' // Light green background
      case 'orang_tua': return '#fffbeb' // Light orange background
      default: return '#f9fafb'
    }
  }

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'admin': return 'Administrator'
      case 'guru': return 'Guru'
      case 'siswa': return 'Siswa'
      case 'orang_tua': return 'Orang Tua'
      default: return type
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        background: COLORS.white,
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1e293b',
              margin: '0 0 8px 0',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              Manajemen Pengguna
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#475569',
              margin: 0,
              fontWeight: '500'
            }}>
              Kelola semua pengguna sistem sekolah
            </p>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center'
          }}>
            <button
              onClick={openCreateModal}
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '14px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(15, 76, 92, 0.3)',
                transform: 'translateY(0)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(15, 76, 92, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 76, 92, 0.3)'
              }}
            >
              <Plus size={16} />
              Tambah Pengguna
            </button>
            
            {/* Debug button - temporary */}
            <button
              onClick={() => {
                const token = getAuthToken()
                const userType = localStorage.getItem('userType')
                const userData = localStorage.getItem('userData')
                console.log('=== DEBUG INFO ===')
                console.log('Token:', token ? token.substring(0, 20) + '...' : 'None')
                console.log('User Type:', userType)
                console.log('User Data:', userData)
                alert(`Login Status:\nToken: ${token ? 'Found' : 'Missing'}\nUser Type: ${userType}\nUser Data: ${userData ? 'Found' : 'Missing'}`)
              }}
              style={{
                background: '#f8fafc',
                color: '#64748b',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '10px 16px',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Debug authentication status"
            >
              🔍 Debug
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{
        background: COLORS.white,
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ position: 'relative' }}>
          <Search 
            size={20} 
            color="#6b7280" 
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />
          <input
            type="text"
            placeholder="Cari pengguna berdasarkan nama, email, atau tipe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 44px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Users Table */}
      <div style={{
        background: COLORS.white,
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            Memuat data...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            Tidak ada pengguna ditemukan
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 180px 140px 130px 100px',
              gap: '16px',
              padding: '16px 20px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              borderBottom: '2px solid #e2e8f0',
              fontSize: '13px',
              fontWeight: '700',
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <div>Nama & Email</div>
              <div>No. Telepon</div>
              <div>Tipe User</div>
              <div>Status</div>
              <div style={{ textAlign: 'center' }}>Aksi</div>
            </div>

            {/* Table Body */}
            {filteredUsers.map((user, index) => (
              <div
                key={user.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 180px 140px 130px 100px',
                  gap: '16px',
                  padding: '16px 20px',
                  borderBottom: '1px solid #e5e7eb',
                  fontSize: '14px',
                  alignItems: 'center',
                  background: index % 2 === 0 ? 'white' : '#fafbfc',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0f9ff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#fafbfc'
                }}
              >
                <div>
                  <div style={{
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '4px'
                  }}>
                    {user.nama_lengkap}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '13px' }}>
                    {user.email}
                  </div>
                </div>
                
                <div style={{ 
                  color: '#374151',
                  fontSize: '13px'
                }}>
                  {user.no_telepon || '-'}
                </div>
                
                <div>
                  <span style={{
                    background: getUserTypeBgColor(user.tipe_user),
                    color: getUserTypeColor(user.tipe_user),
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    border: `1px solid ${getUserTypeColor(user.tipe_user)}20`
                  }}>
                    {getUserTypeLabel(user.tipe_user)}
                  </span>
                </div>
                
                <div style={{ 
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: user.is_active ? '#10b981' : '#ef4444'
                  }}></div>
                  <span style={{ color: user.is_active ? '#10b981' : '#ef4444', fontWeight: '500' }}>
                    {user.is_active ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <button
                    onClick={() => openEditModal(user)}
                    style={{
                      background: '#f3f4f6',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      padding: '6px 8px',
                      color: '#374151',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Edit pengguna"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#e5e7eb'
                      e.currentTarget.style.color = COLORS.primary
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f3f4f6'
                      e.currentTarget.style.color = '#374151'
                    }}
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(user)}
                    style={{
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      padding: '6px 8px',
                      color: '#dc2626',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Hapus pengguna"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fee2e2'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fef2f2'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          marginTop: '24px'
        }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              background: currentPage === 1 ? '#f9fafb' : 'white',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.5 : 1,
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            ← Sebelumnya
          </button>
          
          <span style={{
            padding: '10px 16px',
            fontSize: '14px',
            color: '#475569',
            fontWeight: '500',
            background: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            Halaman {currentPage} dari {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              background: currentPage === totalPages ? '#f9fafb' : 'white',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.5 : 1,
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            Selanjutnya →
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              width: '100%',
              maxWidth: '500px',
              margin: '20px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {modalType === 'delete' ? (
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 16px 0'
                }}>
                  Hapus Pengguna
                </h3>
                
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0 0 24px 0',
                  lineHeight: '1.5'
                }}>
                  Apakah Anda yakin ingin menghapus pengguna <strong>{selectedUser?.nama_lengkap}</strong>? 
                  Tindakan ini tidak dapat dibatalkan.
                </p>
                
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={closeModal}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      background: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '6px',
                      background: COLORS.error,
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {loading ? 'Menghapus...' : 'Hapus'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 20px 0'
                }}>
                  {modalType === 'create' ? 'Tambah Pengguna Baru' : 'Edit Pengguna'}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nama_lengkap}
                      onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Password {modalType === 'edit' ? '(kosongkan jika tidak ingin mengubah)' : '*'}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required={modalType === 'create'}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '10px 40px 10px 12px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#6b7280'
                        }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Tipe User *
                    </label>
                    <select
                      required
                      value={formData.tipe_user}
                      onChange={(e) => setFormData({...formData, tipe_user: e.target.value as any})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        background: 'white'
                      }}
                    >
                      <option value="siswa">Siswa</option>
                      <option value="orang_tua">Orang Tua</option>
                      <option value="guru">Guru</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      No. Telepon *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.no_telepon}
                      onChange={(e) => setFormData({...formData, no_telepon: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                  marginTop: '24px'
                }}>
                  <button
                    type="button"
                    onClick={closeModal}
                    style={{
                      padding: '10px 20px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      background: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '6px',
                      background: COLORS.primary,
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {loading ? 'Menyimpan...' : modalType === 'create' ? 'Tambah' : 'Simpan'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}

// Class Management Component
interface Class {
  id: number;
  nama_kelas: string;
  jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK';
  tingkat: number;
  jurusan?: string | null;
  tahun_ajaran: string;
  kapasitas: number;
  is_active: number;
}

interface ClassFormData {
  nama_kelas: string;
  jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK';
  tingkat: number;
  jurusan: string;
  tahun_ajaran: string;
  kapasitas: number;
}

const ClassManagement: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalClasses, setTotalClasses] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'create' | 'edit' | 'delete'>('create')
  
  const [formData, setFormData] = useState<ClassFormData>({
    nama_kelas: '',
    jenjang: 'SD',
    tingkat: 1,
    jurusan: '',
    tahun_ajaran: '2025/2026',
    kapasitas: 25
  })

  const ITEMS_PER_PAGE = 10

  // Get auth token - reuse from UserManagement
  const getAuthToken = () => {
    const userData = localStorage.getItem('userData')
    if (userData) {
      try {
        const parsed = JSON.parse(userData)
        if (parsed.accessToken) {
          return parsed.accessToken
        }
      } catch (error) {
        console.log('Error parsing userData:', error)
      }
    }
    
    const directToken = localStorage.getItem('accessToken')
    if (directToken) {
      return directToken
    }
    
    const cookieToken = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1]
    if (cookieToken) {
      return cookieToken
    }
    
    return null
  }

  // API Functions
  const apiCall = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken()
    
    if (!token) {
      throw new Error('No authentication token found. Please login again.')
    }
    
    console.log('Making API call to:', `http://localhost:3000${url}`)
    
    const response = await fetch(`http://localhost:3000${url}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      },
      ...options
    })
    
    console.log('API Response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log('API Error response:', errorText)
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`)
    }
    
    const data = await response.json()
    console.log('API Response data:', data)
    return data
  }

  const fetchClasses = async (page = 1, limit = ITEMS_PER_PAGE, search = '') => {
    setLoading(true)
    try {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : ''
      const response = await apiCall(`/api/kelas/list?page=${page}&limit=${limit}${searchParam}`)
      
      if (response.success && response.data) {
        setClasses(response.data)
        setTotalClasses(response.paging?.total || response.data.length)
      } else {
        throw new Error('Invalid API response format')
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      if (errorMessage.includes('No authentication token found')) {
        alert('Sesi login telah berakhir. Silakan login ulang sebagai admin.')
        window.location.href = '/login'
        return
      }
      
      alert(`Error memuat data kelas: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const createClass = async () => {
    setLoading(true)
    try {
      const submitData = { ...formData }
      // Remove jurusan if empty for SD/SMP
      if (formData.jenjang === 'SD' || formData.jenjang === 'SMP') {
        submitData.jurusan = ''
      }
      
      await apiCall('/api/kelas', {
        method: 'POST',
        body: JSON.stringify(submitData)
      })
      alert('Kelas berhasil dibuat!')
      fetchClasses(currentPage, ITEMS_PER_PAGE, searchTerm)
      closeModal()
    } catch (error) {
      console.error('Error creating class:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error membuat kelas: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const updateClass = async (id: number) => {
    setLoading(true)
    try {
      const submitData = { ...formData }
      // Remove jurusan if empty for SD/SMP
      if (formData.jenjang === 'SD' || formData.jenjang === 'SMP') {
        submitData.jurusan = ''
      }
      
      await apiCall(`/api/kelas/${id}`, {
        method: 'PUT',
        body: JSON.stringify(submitData)
      })
      alert('Kelas berhasil diperbarui!')
      fetchClasses(currentPage, ITEMS_PER_PAGE, searchTerm)
      closeModal()
    } catch (error) {
      console.error('Error updating class:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error memperbarui kelas: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const deleteClass = async (id: number) => {
    setLoading(true)
    try {
      await apiCall(`/api/kelas/${id}`, {
        method: 'DELETE'
      })
      alert('Kelas berhasil dihapus!')
      fetchClasses(currentPage, ITEMS_PER_PAGE, searchTerm)
      closeModal()
    } catch (error) {
      console.error('Error deleting class:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error menghapus kelas: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // Modal Functions
  const openCreateModal = () => {
    setFormData({
      nama_kelas: '',
      jenjang: 'SD',
      tingkat: 1,
      jurusan: '',
      tahun_ajaran: '2025/2026',
      kapasitas: 25
    })
    setModalType('create')
    setShowModal(true)
  }

  const openEditModal = (classItem: Class) => {
    setSelectedClass(classItem)
    setFormData({
      nama_kelas: classItem.nama_kelas,
      jenjang: classItem.jenjang,
      tingkat: classItem.tingkat,
      jurusan: classItem.jurusan || '',
      tahun_ajaran: classItem.tahun_ajaran,
      kapasitas: classItem.kapasitas
    })
    setModalType('edit')
    setShowModal(true)
  }

  const openDeleteModal = (classItem: Class) => {
    setSelectedClass(classItem)
    setModalType('delete')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedClass(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (modalType === 'create') {
      createClass()
    } else if (modalType === 'edit' && selectedClass) {
      updateClass(selectedClass.id)
    } else if (modalType === 'delete' && selectedClass) {
      deleteClass(selectedClass.id)
    }
  }

  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue)
    setCurrentPage(1)
    fetchClasses(1, ITEMS_PER_PAGE, searchValue)
  }

  // Handle jenjang change to update tingkat options
  const handleJenjangChange = (jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK') => {
    let defaultTingkat = 1
    if (jenjang === 'SMP') defaultTingkat = 7
    else if (jenjang === 'SMA' || jenjang === 'SMK') defaultTingkat = 10
    
    setFormData({
      ...formData,
      jenjang,
      tingkat: defaultTingkat,
      jurusan: (jenjang === 'SD' || jenjang === 'SMP') ? '' : formData.jurusan
    })
  }

  React.useEffect(() => {
    fetchClasses(currentPage, ITEMS_PER_PAGE, searchTerm)
  }, [currentPage])

  const filteredClasses = classes.filter(classItem =>
    classItem.nama_kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.jenjang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.tahun_ajaran.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(totalClasses / ITEMS_PER_PAGE)

  const getJenjangColor = (jenjang: string) => {
    switch (jenjang) {
      case 'SD': return '#059669' // Green
      case 'SMP': return COLORS.primary // Blue
      case 'SMA': return '#dc2626' // Red
      case 'SMK': return '#d97706' // Orange
      default: return '#6b7280'
    }
  }

  const getJenjangBgColor = (jenjang: string) => {
    switch (jenjang) {
      case 'SD': return '#f0fdf4' // Light green
      case 'SMP': return '#f0f9ff' // Light blue
      case 'SMA': return '#fef2f2' // Light red
      case 'SMK': return '#fffbeb' // Light orange
      default: return '#f9fafb'
    }
  }

  const getTingkatOptions = (jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK') => {
    switch (jenjang) {
      case 'SD': return [1, 2, 3, 4, 5, 6]
      case 'SMP': return [7, 8, 9]
      case 'SMA':
      case 'SMK': return [10, 11, 12]
      default: return [1]
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        background: COLORS.white,
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1e293b',
              margin: '0 0 8px 0',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              Manajemen Kelas
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#475569',
              margin: 0,
              fontWeight: '500'
            }}>
              Kelola semua kelas di sistem sekolah
            </p>
          </div>
          
          <button
            onClick={openCreateModal}
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(15, 76, 92, 0.3)',
              transform: 'translateY(0)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(15, 76, 92, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 76, 92, 0.3)'
            }}
          >
            <Plus size={16} />
            Tambah Kelas
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{
        background: COLORS.white,
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ position: 'relative' }}>
          <Search 
            size={20} 
            color="#6b7280" 
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />
          <input
            type="text"
            placeholder="Cari kelas berdasarkan nama, jenjang, atau tahun ajaran..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 44px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Classes Table */}
      <div style={{
        background: COLORS.white,
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            Memuat data...
          </div>
        ) : filteredClasses.length === 0 ? (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            Tidak ada kelas ditemukan
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 100px 80px 120px 150px 100px 80px 100px',
              gap: '16px',
              padding: '16px 20px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              borderBottom: '2px solid #e2e8f0',
              fontSize: '13px',
              fontWeight: '700',
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <div>Nama Kelas</div>
              <div>Jenjang</div>
              <div>Tingkat</div>
              <div>Jurusan</div>
              <div>Tahun Ajaran</div>
              <div>Kapasitas</div>
              <div>Status</div>
              <div style={{ textAlign: 'center' }}>Aksi</div>
            </div>

            {/* Table Body */}
            {filteredClasses.map((classItem, index) => (
              <div
                key={classItem.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 100px 80px 120px 150px 100px 80px 100px',
                  gap: '16px',
                  padding: '16px 20px',
                  borderBottom: '1px solid #e5e7eb',
                  fontSize: '14px',
                  alignItems: 'center',
                  background: index % 2 === 0 ? 'white' : '#fafbfc',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0f9ff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#fafbfc'
                }}
              >
                <div>
                  <div style={{
                    fontWeight: '600',
                    color: '#1f2937'
                  }}>
                    {classItem.nama_kelas}
                  </div>
                </div>
                
                <div>
                  <span style={{
                    background: getJenjangBgColor(classItem.jenjang),
                    color: getJenjangColor(classItem.jenjang),
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    border: `1px solid ${getJenjangColor(classItem.jenjang)}20`
                  }}>
                    {classItem.jenjang}
                  </span>
                </div>
                
                <div style={{ 
                  color: '#374151',
                  fontWeight: '500'
                }}>
                  {classItem.tingkat}
                </div>
                
                <div style={{ 
                  color: '#6b7280',
                  fontSize: '13px'
                }}>
                  {classItem.jurusan || '-'}
                </div>
                
                <div style={{ 
                  color: '#374151',
                  fontSize: '13px'
                }}>
                  {classItem.tahun_ajaran}
                </div>
                
                <div style={{ 
                  color: '#374151',
                  fontSize: '13px'
                }}>
                  {classItem.kapasitas}
                </div>
                
                <div style={{ 
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: classItem.is_active ? '#10b981' : '#ef4444'
                  }}></div>
                  <span style={{ color: classItem.is_active ? '#10b981' : '#ef4444', fontWeight: '500' }}>
                    {classItem.is_active ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <button
                    onClick={() => openEditModal(classItem)}
                    style={{
                      background: '#f3f4f6',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      padding: '6px 8px',
                      color: '#374151',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Edit kelas"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#e5e7eb'
                      e.currentTarget.style.color = COLORS.primary
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f3f4f6'
                      e.currentTarget.style.color = '#374151'
                    }}
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(classItem)}
                    style={{
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      padding: '6px 8px',
                      color: '#dc2626',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Hapus kelas"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fee2e2'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fef2f2'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          marginTop: '24px'
        }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              background: currentPage === 1 ? '#f9fafb' : 'white',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.5 : 1,
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            ← Sebelumnya
          </button>
          
          <span style={{
            padding: '10px 16px',
            fontSize: '14px',
            color: '#475569',
            fontWeight: '500',
            background: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            Halaman {currentPage} dari {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              background: currentPage === totalPages ? '#f9fafb' : 'white',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.5 : 1,
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            Selanjutnya →
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              width: '100%',
              maxWidth: '600px',
              margin: '20px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {modalType === 'delete' ? (
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 16px 0'
                }}>
                  Hapus Kelas
                </h3>
                
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0 0 24px 0',
                  lineHeight: '1.5'
                }}>
                  Apakah Anda yakin ingin menghapus kelas <strong>{selectedClass?.nama_kelas}</strong>? 
                  Tindakan ini tidak dapat dibatalkan.
                </p>
                
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={closeModal}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      background: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '6px',
                      background: COLORS.error,
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {loading ? 'Menghapus...' : 'Hapus'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 20px 0'
                }}>
                  {modalType === 'create' ? 'Tambah Kelas Baru' : 'Edit Kelas'}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Nama Kelas *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nama_kelas}
                      onChange={(e) => setFormData({...formData, nama_kelas: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="Contoh: 7A, XII IPA 1"
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Jenjang *
                    </label>
                    <select
                      required
                      value={formData.jenjang}
                      onChange={(e) => handleJenjangChange(e.target.value as any)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        background: 'white'
                      }}
                    >
                      <option value="SD">SD</option>
                      <option value="SMP">SMP</option>
                      <option value="SMA">SMA</option>
                      <option value="SMK">SMK</option>
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Tingkat *
                    </label>
                    <select
                      required
                      value={formData.tingkat}
                      onChange={(e) => setFormData({...formData, tingkat: parseInt(e.target.value)})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        background: 'white'
                      }}
                    >
                      {getTingkatOptions(formData.jenjang).map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  {(formData.jenjang === 'SMA' || formData.jenjang === 'SMK') && (
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Jurusan {formData.jenjang === 'SMA' || formData.jenjang === 'SMK' ? '*' : ''}
                      </label>
                      <select
                        required={formData.jenjang === 'SMA' || formData.jenjang === 'SMK'}
                        value={formData.jurusan}
                        onChange={(e) => setFormData({...formData, jurusan: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none',
                          background: 'white'
                        }}
                      >
                        <option value="">Pilih Jurusan</option>
                        <option value="IPA">IPA</option>
                        <option value="IPS">IPS</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Tahun Ajaran *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.tahun_ajaran}
                      onChange={(e) => setFormData({...formData, tahun_ajaran: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="2025/2026"
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Kapasitas *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="50"
                      value={formData.kapasitas}
                      onChange={(e) => setFormData({...formData, kapasitas: parseInt(e.target.value)})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                  marginTop: '24px'
                }}>
                  <button
                    type="button"
                    onClick={closeModal}
                    style={{
                      padding: '10px 20px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      background: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '6px',
                      background: COLORS.primary,
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {loading ? 'Menyimpan...' : modalType === 'create' ? 'Tambah' : 'Simpan'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}

// Parent Management Component
interface Parent {
  orang_tua_id: number;
  nama_lengkap: string;
  nik: string;
  jenis_kelamin: 'L' | 'P';
  pekerjaan: string;
  alamat: string;
  email: string;
  no_telepon: string;
}

interface AssignParentFormData {
  user_id: number | '';
  nik: string;
  jenis_kelamin: 'L' | 'P';
  pekerjaan: string;
  alamat: string;
}

interface AssignParentStudentFormData {
  orang_tua_id: number | '';
  siswa_id: number | '';
  hubungan: 'ayah' | 'ibu' | 'wali' | 'lainnya';
  is_primary: boolean;
}

const ParentManagement: React.FC = () => {
  const [parents, setParents] = useState<Parent[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalParents, setTotalParents] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedParent, setSelectedParent] = useState<Parent | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'assign' | 'assign-student' | 'delete'>('assign')
  
  const [assignParentFormData, setAssignParentFormData] = useState<AssignParentFormData>({
    user_id: '',
    nik: '',
    jenis_kelamin: 'L',
    pekerjaan: '',
    alamat: ''
  })

  const [assignParentStudentFormData, setAssignParentStudentFormData] = useState<AssignParentStudentFormData>({
    orang_tua_id: '',
    siswa_id: '',
    hubungan: 'ayah',
    is_primary: true
  })

  const ITEMS_PER_PAGE = 10

  // API Functions (reusing from other components)
  const getAuthToken = () => {
    const userData = localStorage.getItem('userData')
    if (userData) {
      try {
        const parsed = JSON.parse(userData)
        if (parsed.accessToken) {
          return parsed.accessToken
        }
      } catch (error) {
        console.log('Error parsing userData:', error)
      }
    }
    
    const directToken = localStorage.getItem('accessToken')
    if (directToken) {
      return directToken
    }
    
    const cookieToken = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1]
    if (cookieToken) {
      return cookieToken
    }
    
    return null
  }

  const apiCall = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken()
    
    if (!token) {
      throw new Error('No authentication token found. Please login again.')
    }
    
    console.log('Making API call to:', `http://localhost:3000${url}`)
    
    const response = await fetch(`http://localhost:3000${url}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      },
      ...options
    })
    
    console.log('API Response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log('API Error response:', errorText)
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`)
    }
    
    const data = await response.json()
    console.log('API Response data:', data)
    return data
  }

  const fetchParents = async (page = 1, limit = ITEMS_PER_PAGE, search = '') => {
    setLoading(true)
    try {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : ''
      const response = await apiCall(`/api/orang-tua/list?page=${page}&limit=${limit}${searchParam}`)
      
      if (response.success && response.data) {
        setParents(response.data)
        setTotalParents(response.paging?.total || response.data.length)
      } else {
        throw new Error('Invalid API response format')
      }
    } catch (error) {
      console.error('Error fetching parents:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      if (errorMessage.includes('No authentication token found')) {
        alert('Sesi login telah berakhir. Silakan login ulang sebagai admin.')
        window.location.href = '/login'
        return
      }
      
      alert(`Error memuat data orang tua: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await apiCall('/api/users/list?limit=1000')
      if (response.success && response.data) {
        // Filter only users that could be parents
        const parentUsers = response.data.filter((user: User) => 
          user.tipe_user === 'orang_tua'
        )
        setUsers(parentUsers)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await apiCall('/api/siswa/list?limit=1000')
      if (response.success && response.data) {
        setStudents(response.data)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const assignParent = async () => {
    setLoading(true)
    try {
      await apiCall('/api/assign/orang-tua', {
        method: 'POST',
        body: JSON.stringify(assignParentFormData)
      })
      alert('Orang tua berhasil ditugaskan!')
      fetchParents(currentPage, ITEMS_PER_PAGE, searchTerm)
      closeModal()
    } catch (error) {
      console.error('Error assigning parent:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error menugaskan orang tua: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const assignParentStudent = async () => {
    setLoading(true)
    try {
      await apiCall('/api/assign/orang-tua-siswa', {
        method: 'POST',
        body: JSON.stringify(assignParentStudentFormData)
      })
      alert('Hubungan orang tua-siswa berhasil dibuat!')
      closeModal()
    } catch (error) {
      console.error('Error assigning parent to student:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error menghubungkan orang tua-siswa: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const deleteParent = async (id: number) => {
    setLoading(true)
    try {
      await apiCall(`/api/orang-tua/${id}`, {
        method: 'DELETE'
      })
      alert('Orang tua berhasil dihapus!')
      fetchParents(currentPage, ITEMS_PER_PAGE, searchTerm)
      closeModal()
    } catch (error) {
      console.error('Error deleting parent:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error menghapus orang tua: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // Modal Functions
  const openAssignModal = () => {
    setAssignParentFormData({
      user_id: '',
      nik: '',
      jenis_kelamin: 'L',
      pekerjaan: '',
      alamat: ''
    })
    setModalType('assign')
    setShowModal(true)
  }

  const openAssignStudentModal = (parent: Parent) => {
    setSelectedParent(parent)
    setAssignParentStudentFormData({
      orang_tua_id: parent.orang_tua_id,
      siswa_id: '',
      hubungan: 'ayah',
      is_primary: true
    })
    setModalType('assign-student')
    setShowModal(true)
  }

  const openDeleteModal = (parent: Parent) => {
    setSelectedParent(parent)
    setModalType('delete')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedParent(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (modalType === 'assign') {
      assignParent()
    } else if (modalType === 'assign-student') {
      assignParentStudent()
    } else if (modalType === 'delete' && selectedParent) {
      deleteParent(selectedParent.orang_tua_id)
    }
  }

  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue)
    setCurrentPage(1)
    fetchParents(1, ITEMS_PER_PAGE, searchValue)
  }

  React.useEffect(() => {
    fetchParents(currentPage, ITEMS_PER_PAGE, searchTerm)
  }, [currentPage])

  React.useEffect(() => {
    fetchUsers()
    fetchStudents()
  }, [])

  const filteredParents = parents.filter(parent =>
    parent.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parent.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(totalParents / ITEMS_PER_PAGE)

  const getHubunganOptions = () => [
    { value: 'ayah', label: 'Ayah' },
    { value: 'ibu', label: 'Ibu' },
    { value: 'wali', label: 'Wali' },
    { value: 'lainnya', label: 'Lainnya' }
  ]

  return (
    <div>
      {/* Header */}
      <div style={{
        background: COLORS.white,
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1e293b',
              margin: '0 0 8px 0',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              Manajemen Orang Tua
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#475569',
              margin: 0,
              fontWeight: '500'
            }}>
              Kelola orang tua dan hubungan dengan siswa
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={openAssignModal}
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '14px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(15, 76, 92, 0.3)',
                transform: 'translateY(0)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(15, 76, 92, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 76, 92, 0.3)'
              }}
            >
              <Plus size={16} />
              Tugaskan Orang Tua
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{
        background: COLORS.white,
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ position: 'relative' }}>
          <Search 
            size={20} 
            color="#6b7280" 
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />
          <input
            type="text"
            placeholder="Cari orang tua berdasarkan nama, NIK, atau email..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 44px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Parents Table */}
      <div style={{
        background: COLORS.white,
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            Memuat data...
          </div>
        ) : filteredParents.length === 0 ? (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            Tidak ada orang tua ditemukan
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 150px 100px 150px 120px 1fr 120px',
              gap: '16px',
              padding: '16px 20px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              borderBottom: '2px solid #e2e8f0',
              fontSize: '13px',
              fontWeight: '700',
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <div>Nama Lengkap</div>
              <div>NIK</div>
              <div>Gender</div>
              <div>Pekerjaan</div>
              <div>No. Telepon</div>
              <div>Alamat</div>
              <div style={{ textAlign: 'center' }}>Aksi</div>
            </div>

            {/* Table Body */}
            {filteredParents.map((parent, index) => (
              <div
                key={parent.orang_tua_id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 150px 100px 150px 120px 1fr 120px',
                  gap: '16px',
                  padding: '16px 20px',
                  borderBottom: '1px solid #e5e7eb',
                  fontSize: '14px',
                  alignItems: 'center',
                  background: index % 2 === 0 ? 'white' : '#fafbfc',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0f9ff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#fafbfc'
                }}
              >
                <div>
                  <div style={{
                    fontWeight: '600',
                    color: '#1f2937'
                  }}>
                    {parent.nama_lengkap}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    marginTop: '2px'
                  }}>
                    {parent.email}
                  </div>
                </div>
                
                <div style={{ 
                  color: '#374151',
                  fontWeight: '500',
                  fontSize: '13px'
                }}>
                  {parent.nik}
                </div>
                
                <div>
                  <span style={{
                    background: parent.jenis_kelamin === 'L' ? '#dbeafe' : '#fdf2f8',
                    color: parent.jenis_kelamin === 'L' ? '#1d4ed8' : '#ec4899',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {parent.jenis_kelamin === 'L' ? 'L' : 'P'}
                  </span>
                </div>
                
                <div style={{
                  color: '#374151',
                  fontSize: '13px'
                }}>
                  {parent.pekerjaan}
                </div>
                
                <div style={{
                  color: '#6b7280',
                  fontSize: '13px'
                }}>
                  {parent.no_telepon}
                </div>
                
                <div style={{
                  color: '#6b7280',
                  fontSize: '12px',
                  lineHeight: '1.4'
                }}>
                  {parent.alamat}
                </div>
                
                <div style={{
                  display: 'flex',
                  gap: '6px',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <button
                    onClick={() => openAssignStudentModal(parent)}
                    style={{
                      background: '#f0f9ff',
                      border: '1px solid #0ea5e9',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      padding: '6px 8px',
                      color: '#0ea5e9',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Hubungkan dengan siswa"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#0ea5e9'
                      e.currentTarget.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f0f9ff'
                      e.currentTarget.style.color = '#0ea5e9'
                    }}
                  >
                    <Users size={14} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(parent)}
                    style={{
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      padding: '6px 8px',
                      color: '#dc2626',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Hapus orang tua"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fee2e2'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fef2f2'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          marginTop: '24px'
        }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              background: currentPage === 1 ? '#f9fafb' : 'white',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.5 : 1,
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            ← Sebelumnya
          </button>
          
          <span style={{
            padding: '10px 16px',
            fontSize: '14px',
            color: '#475569',
            fontWeight: '500',
            background: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            Halaman {currentPage} dari {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              background: currentPage === totalPages ? '#f9fafb' : 'white',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.5 : 1,
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            Selanjutnya →
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              width: '100%',
              maxWidth: modalType === 'assign' ? '600px' : '500px',
              margin: '20px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {modalType === 'delete' ? (
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 16px 0'
                }}>
                  Hapus Orang Tua
                </h3>
                
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0 0 24px 0',
                  lineHeight: '1.5'
                }}>
                  Apakah Anda yakin ingin menghapus orang tua <strong>{selectedParent?.nama_lengkap}</strong>? 
                  Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait.
                </p>
                
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={closeModal}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      background: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '6px',
                      background: COLORS.error,
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {loading ? 'Menghapus...' : 'Hapus'}
                  </button>
                </div>
              </div>
            ) : modalType === 'assign' ? (
              <form onSubmit={handleSubmit}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 20px 0'
                }}>
                  Tugaskan Orang Tua
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Pengguna *
                    </label>
                    <select
                      required
                      value={assignParentFormData.user_id}
                      onChange={(e) => setAssignParentFormData({...assignParentFormData, user_id: parseInt(e.target.value)})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        background: 'white'
                      }}
                    >
                      <option value="">Pilih Pengguna</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.nama_lengkap} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        NIK *
                      </label>
                      <input
                        type="text"
                        required
                        value={assignParentFormData.nik}
                        onChange={(e) => setAssignParentFormData({...assignParentFormData, nik: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                        placeholder="Nomor Induk Kependudukan"
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Jenis Kelamin *
                      </label>
                      <select
                        required
                        value={assignParentFormData.jenis_kelamin}
                        onChange={(e) => setAssignParentFormData({...assignParentFormData, jenis_kelamin: e.target.value as 'L' | 'P'})}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none',
                          background: 'white'
                        }}
                      >
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Pekerjaan *
                    </label>
                    <input
                      type="text"
                      required
                      value={assignParentFormData.pekerjaan}
                      onChange={(e) => setAssignParentFormData({...assignParentFormData, pekerjaan: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="Pekerjaan orang tua"
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Alamat *
                    </label>
                    <textarea
                      required
                      value={assignParentFormData.alamat}
                      onChange={(e) => setAssignParentFormData({...assignParentFormData, alamat: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        minHeight: '80px',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                      placeholder="Alamat lengkap orang tua"
                    />
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                  marginTop: '24px'
                }}>
                  <button
                    type="button"
                    onClick={closeModal}
                    style={{
                      padding: '10px 20px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      background: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '6px',
                      background: COLORS.primary,
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {loading ? 'Menyimpan...' : 'Tugaskan'}
                  </button>
                </div>
              </form>
            ) : modalType === 'assign-student' ? (
              <form onSubmit={handleSubmit}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 20px 0'
                }}>
                  Hubungkan dengan Siswa
                </h3>

                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '20px'
                }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    margin: '0 0 8px 0'
                  }}>
                    Data Orang Tua
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                    <strong>{selectedParent?.nama_lengkap}</strong><br/>
                    NIK: {selectedParent?.nik}<br/>
                    Email: {selectedParent?.email}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Siswa *
                    </label>
                    <select
                      required
                      value={assignParentStudentFormData.siswa_id}
                      onChange={(e) => setAssignParentStudentFormData({...assignParentStudentFormData, siswa_id: parseInt(e.target.value)})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        background: 'white'
                      }}
                    >
                      <option value="">Pilih Siswa</option>
                      {students.map(student => (
                        <option key={student.siswa_id} value={student.siswa_id}>
                          {student.nama_lengkap} - {student.nis} ({student.nama_kelas})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Hubungan *
                      </label>
                      <select
                        required
                        value={assignParentStudentFormData.hubungan}
                        onChange={(e) => setAssignParentStudentFormData({...assignParentStudentFormData, hubungan: e.target.value as any})}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none',
                          background: 'white'
                        }}
                      >
                        {getHubunganOptions().map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Status
                      </label>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: '10px'
                      }}>
                        <input
                          type="checkbox"
                          checked={assignParentStudentFormData.is_primary}
                          onChange={(e) => setAssignParentStudentFormData({...assignParentStudentFormData, is_primary: e.target.checked})}
                          style={{ marginRight: '8px' }}
                        />
                        <label style={{ fontSize: '14px', color: '#374151' }}>
                          Orang tua utama
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                  marginTop: '24px'
                }}>
                  <button
                    type="button"
                    onClick={closeModal}
                    style={{
                      padding: '10px 20px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      background: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '6px',
                      background: '#0ea5e9',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {loading ? 'Menghubungkan...' : 'Hubungkan'}
                  </button>
                </div>
              </form>
            ) : null}
          </motion.div>
        </div>
      )}
    </div>
  )
}

// Teacher Management Component
interface Teacher {
  guru_id: number;
  nama_lengkap: string;
  nip: string;
  jenis_kelamin: 'L' | 'P';
  tanggal_lahir: string;
  alamat: string;
  tanggal_bergabung: string;
  email: string;
  no_telepon: string;
}

interface WaliKelas {
  wali_kelas_id: number;
  guru_id?: number;
  tahun_ajaran: string;
  nama_guru: string;
  nip: string;
  jenis_kelamin: 'L' | 'P';
  kelas_id: number;
  nama_kelas: string;
  tingkat: number;
  jurusan?: string | null;
  tahun_ajaran_kelas: string;
}

interface AssignTeacherFormData {
  user_id: number | '';
  nip: string;
  jenis_kelamin: 'L' | 'P';
  tanggal_lahir: string;
  alamat: string;
  tanggal_bergabung: string;
}

interface EditTeacherFormData {
  nip: string;
  jenis_kelamin: 'L' | 'P';
  tanggal_lahir: string;
  alamat: string;
  tanggal_bergabung: string;
}

interface AssignWaliKelasFormData {
  guru_id: number | '';
  kelas_id: number | '';
  tahun_ajaran: string;
}

const TeacherManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [waliKelas, setWaliKelas] = useState<WaliKelas[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalTeachers, setTotalTeachers] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [selectedWaliKelas, setSelectedWaliKelas] = useState<WaliKelas | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'assign' | 'edit' | 'delete' | 'assign-wali' | 'edit-wali' | 'delete-wali' | 'view-wali'>('assign')
  const [activeView, setActiveView] = useState<'teachers' | 'wali-kelas'>('teachers')
  
  const [assignTeacherFormData, setAssignTeacherFormData] = useState<AssignTeacherFormData>({
    user_id: '',
    nip: '',
    jenis_kelamin: 'L',
    tanggal_lahir: '',
    alamat: '',
    tanggal_bergabung: new Date().toISOString().split('T')[0]
  })

  const [editTeacherFormData, setEditTeacherFormData] = useState<EditTeacherFormData>({
    nip: '',
    jenis_kelamin: 'L',
    tanggal_lahir: '',
    alamat: '',
    tanggal_bergabung: ''
  })

  const [assignWaliKelasFormData, setAssignWaliKelasFormData] = useState<AssignWaliKelasFormData>({
    guru_id: '',
    kelas_id: '',
    tahun_ajaran: '2026/2027'
  })

  const ITEMS_PER_PAGE = 10

  // API Functions
  const getAuthToken = () => {
    const userData = localStorage.getItem('userData')
    if (userData) {
      try {
        const parsed = JSON.parse(userData)
        if (parsed.accessToken) {
          return parsed.accessToken
        }
      } catch (error) {
        console.log('Error parsing userData:', error)
      }
    }
    
    const directToken = localStorage.getItem('accessToken')
    if (directToken) {
      return directToken
    }
    
    const cookieToken = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1]
    if (cookieToken) {
      return cookieToken
    }
    
    return null
  }

  const apiCall = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken()
    
    if (!token) {
      throw new Error('No authentication token found. Please login again.')
    }
    
    console.log('Making API call to:', `http://localhost:3000${url}`)
    
    const response = await fetch(`http://localhost:3000${url}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      },
      ...options
    })
    
    console.log('API Response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log('API Error response:', errorText)
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`)
    }
    
    const data = await response.json()
    console.log('API Response data:', data)
    return data
  }

  const fetchTeachers = async (page = 1, limit = ITEMS_PER_PAGE, search = '') => {
    setLoading(true)
    try {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : ''
      const response = await apiCall(`/api/guru/list?page=${page}&limit=${limit}${searchParam}`)
      
      if (response.success && response.data) {
        setTeachers(response.data)
        setTotalTeachers(response.paging?.total || response.data.length)
      } else {
        throw new Error('Invalid API response format')
      }
    } catch (error) {
      console.error('Error fetching teachers:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      if (errorMessage.includes('No authentication token found')) {
        alert('Sesi login telah berakhir. Silakan login ulang sebagai admin.')
        window.location.href = '/login'
        return
      }
      
      alert(`Error memuat data guru: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchWaliKelas = async () => {
    try {
      const response = await apiCall('/api/guru/walikelas')
      if (response.success && response.data) {
        setWaliKelas(response.data)
      }
    } catch (error) {
      console.error('Error fetching wali kelas:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await apiCall('/api/users/list?limit=1000')
      if (response.success && response.data) {
        // Filter only users that could be teachers
        const teacherUsers = response.data.filter((user: User) => 
          user.tipe_user === 'guru'
        )
        setUsers(teacherUsers)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchClasses = async () => {
    try {
      const response = await apiCall('/api/kelas/list?limit=1000')
      if (response.success && response.data) {
        setClasses(response.data)
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const assignTeacher = async () => {
    setLoading(true)
    try {
      await apiCall('/api/assign/guru', {
        method: 'POST',
        body: JSON.stringify(assignTeacherFormData)
      })
      alert('Guru berhasil ditugaskan!')
      fetchTeachers(currentPage, ITEMS_PER_PAGE, searchTerm)
      closeModal()
    } catch (error) {
      console.error('Error assigning teacher:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error menugaskan guru: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const updateTeacher = async (id: number) => {
    setLoading(true)
    try {
      await apiCall(`/api/guru/${id}`, {
        method: 'PUT',
        body: JSON.stringify(editTeacherFormData)
      })
      alert('Data guru berhasil diperbarui!')
      fetchTeachers(currentPage, ITEMS_PER_PAGE, searchTerm)
      closeModal()
    } catch (error) {
      console.error('Error updating teacher:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error memperbarui data guru: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const deleteTeacher = async (id: number) => {
    setLoading(true)
    try {
      await apiCall(`/api/guru/${id}`, {
        method: 'DELETE'
      })
      alert('Guru berhasil dihapus!')
      fetchTeachers(currentPage, ITEMS_PER_PAGE, searchTerm)
      closeModal()
    } catch (error) {
      console.error('Error deleting teacher:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error menghapus guru: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const assignWaliKelas = async () => {
    setLoading(true)
    try {
      await apiCall('/api/assign/wali-kelas', {
        method: 'POST',
        body: JSON.stringify(assignWaliKelasFormData)
      })
      alert('Wali kelas berhasil ditugaskan!')
      fetchWaliKelas()
      closeModal()
    } catch (error) {
      console.error('Error assigning wali kelas:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error menugaskan wali kelas: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const updateWaliKelas = async (id: number) => {
    setLoading(true)
    try {
      await apiCall(`/api/guru/walikelas/${id}`, {
        method: 'PUT',
        body: JSON.stringify(assignWaliKelasFormData)
      })
      alert('Wali kelas berhasil diperbarui!')
      fetchWaliKelas()
      closeModal()
    } catch (error) {
      console.error('Error updating wali kelas:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error memperbarui wali kelas: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const deleteWaliKelas = async (id: number) => {
    setLoading(true)
    try {
      await apiCall(`/api/guru/walikelas/${id}`, {
        method: 'DELETE'
      })
      alert('Wali kelas berhasil dihapus!')
      fetchWaliKelas()
      closeModal()
    } catch (error) {
      console.error('Error deleting wali kelas:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error menghapus wali kelas: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // Modal Functions
  const openAssignModal = () => {
    setAssignTeacherFormData({
      user_id: '',
      nip: '',
      jenis_kelamin: 'L',
      tanggal_lahir: '',
      alamat: '',
      tanggal_bergabung: new Date().toISOString().split('T')[0]
    })
    setModalType('assign')
    setShowModal(true)
  }

  const openEditModal = (teacher: Teacher) => {
    setSelectedTeacher(teacher)
    setEditTeacherFormData({
      nip: teacher.nip,
      jenis_kelamin: teacher.jenis_kelamin,
      tanggal_lahir: teacher.tanggal_lahir,
      alamat: teacher.alamat,
      tanggal_bergabung: teacher.tanggal_bergabung
    })
    setModalType('edit')
    setShowModal(true)
  }

  const openDeleteModal = (teacher: Teacher) => {
    setSelectedTeacher(teacher)
    setModalType('delete')
    setShowModal(true)
  }

  const openAssignWaliModal = () => {
    setAssignWaliKelasFormData({
      guru_id: '',
      kelas_id: '',
      tahun_ajaran: '2026/2027'
    })
    setModalType('assign-wali')
    setShowModal(true)
  }

  const openEditWaliModal = (wali: WaliKelas) => {
    setSelectedWaliKelas(wali)
    setAssignWaliKelasFormData({
      guru_id: wali.guru_id || '',
      kelas_id: wali.kelas_id,
      tahun_ajaran: wali.tahun_ajaran
    })
    setModalType('edit-wali')
    setShowModal(true)
  }

  const openDeleteWaliModal = (wali: WaliKelas) => {
    setSelectedWaliKelas(wali)
    setModalType('delete-wali')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedTeacher(null)
    setSelectedWaliKelas(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (modalType === 'assign') {
      assignTeacher()
    } else if (modalType === 'edit' && selectedTeacher) {
      updateTeacher(selectedTeacher.guru_id)
    } else if (modalType === 'delete' && selectedTeacher) {
      deleteTeacher(selectedTeacher.guru_id)
    } else if (modalType === 'assign-wali') {
      assignWaliKelas()
    } else if (modalType === 'edit-wali' && selectedWaliKelas) {
      updateWaliKelas(selectedWaliKelas.wali_kelas_id)
    } else if (modalType === 'delete-wali' && selectedWaliKelas) {
      deleteWaliKelas(selectedWaliKelas.wali_kelas_id)
    }
  }

  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue)
    setCurrentPage(1)
    fetchTeachers(1, ITEMS_PER_PAGE, searchValue)
  }

  React.useEffect(() => {
    if (activeView === 'teachers') {
      fetchTeachers(currentPage, ITEMS_PER_PAGE, searchTerm)
    } else {
      fetchWaliKelas()
    }
  }, [currentPage, activeView])

  React.useEffect(() => {
    fetchUsers()
    fetchClasses()
  }, [])

  const filteredTeachers = teachers.filter(teacher =>
    teacher.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(totalTeachers / ITEMS_PER_PAGE)

  return (
    <div>
      {/* Header */}
      <div style={{
        background: COLORS.white,
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1e293b',
              margin: '0 0 8px 0',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              Manajemen Guru
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#475569',
              margin: 0,
              fontWeight: '500'
            }}>
              Kelola guru dan wali kelas
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* View Toggle */}
            <div style={{
              display: 'flex',
              background: '#f1f5f9',
              borderRadius: '10px',
              padding: '6px',
              border: '1px solid #e2e8f0'
            }}>
              <button
                onClick={() => setActiveView('teachers')}
                style={{
                  padding: '10px 18px',
                  border: 'none',
                  borderRadius: '8px',
                  background: activeView === 'teachers' 
                    ? `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`
                    : 'transparent',
                  color: activeView === 'teachers' ? 'white' : '#64748b',
                  fontSize: '14px',
                  fontWeight: activeView === 'teachers' ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: activeView === 'teachers' ? '0 2px 8px rgba(15, 76, 92, 0.3)' : 'none'
                }}
              >
                Guru
              </button>
              <button
                onClick={() => setActiveView('wali-kelas')}
                style={{
                  padding: '10px 18px',
                  border: 'none',
                  borderRadius: '8px',
                  background: activeView === 'wali-kelas' 
                    ? `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`
                    : 'transparent',
                  color: activeView === 'wali-kelas' ? 'white' : '#64748b',
                  fontSize: '14px',
                  fontWeight: activeView === 'wali-kelas' ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: activeView === 'wali-kelas' ? '0 2px 8px rgba(15, 76, 92, 0.3)' : 'none'
                }}
              >
                Wali Kelas
              </button>
            </div>

            <button
              onClick={activeView === 'teachers' ? openAssignModal : openAssignWaliModal}
              style={{
                background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '14px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(15, 76, 92, 0.3)',
                transform: 'translateY(0)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(15, 76, 92, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 76, 92, 0.3)'
              }}
            >
              <Plus size={16} />
              {activeView === 'teachers' ? 'Tugaskan Guru' : 'Tugaskan Wali Kelas'}
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      {activeView === 'teachers' && (
        <div style={{
          background: COLORS.white,
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ position: 'relative' }}>
            <Search 
              size={20} 
              color="#6b7280" 
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            />
            <input
              type="text"
              placeholder="Cari guru berdasarkan nama, NIP, atau email..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 44px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
        </div>
      )}

      {/* Content */}
      {activeView === 'teachers' ? (
        /* Teachers Table */
        <div style={{
          background: COLORS.white,
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          {loading ? (
            <div style={{
              padding: '60px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              Memuat data...
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div style={{
              padding: '60px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              Tidak ada guru ditemukan
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 150px 100px 120px 150px 1fr 120px',
                gap: '16px',
                padding: '16px 20px',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderBottom: '2px solid #e2e8f0',
                fontSize: '13px',
                fontWeight: '700',
                color: '#475569',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                <div>Nama Guru</div>
                <div>NIP</div>
                <div>Gender</div>
                <div>Tgl Bergabung</div>
                <div>No. Telepon</div>
                <div>Alamat</div>
                <div style={{ textAlign: 'center' }}>Aksi</div>
              </div>

              {/* Table Body */}
              {filteredTeachers.map((teacher, index) => (
                <div
                  key={teacher.guru_id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 150px 100px 120px 150px 1fr 120px',
                    gap: '16px',
                    padding: '16px 20px',
                    borderBottom: '1px solid #e5e7eb',
                    fontSize: '14px',
                    alignItems: 'center',
                    background: index % 2 === 0 ? 'white' : '#fafbfc',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f0f9ff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#fafbfc'
                  }}
                >
                  <div>
                    <div style={{
                      fontWeight: '600',
                      color: '#1f2937'
                    }}>
                      {teacher.nama_lengkap}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      marginTop: '2px'
                    }}>
                      {teacher.email}
                    </div>
                  </div>
                  
                  <div style={{ 
                    color: '#374151',
                    fontWeight: '500',
                    fontSize: '13px'
                  }}>
                    {teacher.nip}
                  </div>
                  
                  <div>
                    <span style={{
                      background: teacher.jenis_kelamin === 'L' ? '#dbeafe' : '#fdf2f8',
                      color: teacher.jenis_kelamin === 'L' ? '#1d4ed8' : '#ec4899',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {teacher.jenis_kelamin === 'L' ? 'L' : 'P'}
                    </span>
                  </div>
                  
                  <div style={{
                    color: '#374151',
                    fontSize: '13px'
                  }}>
                    {new Date(teacher.tanggal_bergabung).toLocaleDateString('id-ID')}
                  </div>
                  
                  <div style={{
                    color: '#6b7280',
                    fontSize: '13px'
                  }}>
                    {teacher.no_telepon}
                  </div>
                  
                  <div style={{
                    color: '#6b7280',
                    fontSize: '12px',
                    lineHeight: '1.4'
                  }}>
                    {teacher.alamat}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <button
                      onClick={() => openEditModal(teacher)}
                      style={{
                        background: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        padding: '6px 8px',
                        color: '#374151',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Edit guru"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e5e7eb'
                        e.currentTarget.style.color = COLORS.primary
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f3f4f6'
                        e.currentTarget.style.color = '#374151'
                      }}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(teacher)}
                      style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        padding: '6px 8px',
                        color: '#dc2626',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Hapus guru"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fee2e2'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fef2f2'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      ) : (
        /* Wali Kelas Table */
        <div style={{
          background: COLORS.white,
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          {waliKelas.length === 0 ? (
            <div style={{
              padding: '60px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              Tidak ada wali kelas ditemukan
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 150px 150px 120px 120px 100px',
                gap: '16px',
                padding: '16px 20px',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderBottom: '2px solid #e2e8f0',
                fontSize: '13px',
                fontWeight: '700',
                color: '#475569',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                <div>Nama Guru</div>
                <div>NIP</div>
                <div>Kelas</div>
                <div>Tingkat</div>
                <div>Tahun Ajaran</div>
                <div style={{ textAlign: 'center' }}>Aksi</div>
              </div>

              {/* Table Body */}
              {waliKelas.map((wali, index) => (
                <div
                  key={wali.wali_kelas_id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 150px 150px 120px 120px 100px',
                    gap: '16px',
                    padding: '16px 20px',
                    borderBottom: '1px solid #e5e7eb',
                    fontSize: '14px',
                    alignItems: 'center',
                    background: index % 2 === 0 ? 'white' : '#fafbfc',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f0f9ff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#fafbfc'
                  }}
                >
                  <div>
                    <div style={{
                      fontWeight: '600',
                      color: '#1f2937'
                    }}>
                      {wali.nama_guru}
                    </div>
                  </div>
                  
                  <div style={{ 
                    color: '#374151',
                    fontWeight: '500',
                    fontSize: '13px'
                  }}>
                    {wali.nip}
                  </div>
                  
                  <div style={{
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    {wali.nama_kelas}
                  </div>
                  
                  <div style={{
                    color: '#6b7280',
                    fontSize: '13px'
                  }}>
                    {wali.tingkat}
                  </div>
                  
                  <div style={{
                    color: '#6b7280',
                    fontSize: '13px'
                  }}>
                    {wali.tahun_ajaran}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <button
                      onClick={() => openEditWaliModal(wali)}
                      style={{
                        background: '#f3f4f6',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        padding: '6px 8px',
                        color: '#374151',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Edit wali kelas"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e5e7eb'
                        e.currentTarget.style.color = COLORS.primary
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f3f4f6'
                        e.currentTarget.style.color = '#374151'
                      }}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => openDeleteWaliModal(wali)}
                      style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        padding: '6px 8px',
                        color: '#dc2626',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Hapus wali kelas"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fee2e2'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#fef2f2'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* Pagination */}
      {activeView === 'teachers' && totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          marginTop: '24px'
        }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              background: currentPage === 1 ? '#f9fafb' : 'white',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.5 : 1,
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            ← Sebelumnya
          </button>
          
          <span style={{
            padding: '10px 16px',
            fontSize: '14px',
            color: '#475569',
            fontWeight: '500',
            background: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            Halaman {currentPage} dari {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              background: currentPage === totalPages ? '#f9fafb' : 'white',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.5 : 1,
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            Selanjutnya →
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              width: '100%',
              maxWidth: modalType.includes('delete') ? '500px' : '600px',
              margin: '20px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {modalType.includes('delete') ? (
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 16px 0'
                }}>
                  {modalType === 'delete' ? 'Hapus Guru' : 'Hapus Wali Kelas'}
                </h3>
                
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0 0 24px 0',
                  lineHeight: '1.5'
                }}>
                  Apakah Anda yakin ingin menghapus {modalType === 'delete' ? 'guru' : 'wali kelas'} <strong>
                    {modalType === 'delete' ? selectedTeacher?.nama_lengkap : selectedWaliKelas?.nama_guru}
                  </strong>? 
                  Tindakan ini tidak dapat dibatalkan.
                </p>
                
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={closeModal}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      background: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '6px',
                      background: COLORS.error,
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {loading ? 'Menghapus...' : 'Hapus'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 20px 0'
                }}>
                  {modalType === 'assign' ? 'Tugaskan Guru' : 
                   modalType === 'edit' ? 'Edit Data Guru' :
                   modalType === 'assign-wali' ? 'Tugaskan Wali Kelas' :
                   'Edit Wali Kelas'}
                </h3>

                {/* Teacher Assignment/Edit Forms */}
                {(modalType === 'assign' || modalType === 'edit') && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {modalType === 'assign' && (
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '6px'
                        }}>
                          Pengguna *
                        </label>
                        <select
                          required
                          value={assignTeacherFormData.user_id}
                          onChange={(e) => setAssignTeacherFormData({...assignTeacherFormData, user_id: parseInt(e.target.value)})}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            fontSize: '14px',
                            outline: 'none',
                            background: 'white'
                          }}
                        >
                          <option value="">Pilih Pengguna</option>
                          {users.map(user => (
                            <option key={user.id} value={user.id}>
                              {user.nama_lengkap} ({user.email})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        NIP *
                      </label>
                      <input
                        type="text"
                        required
                        value={modalType === 'assign' ? assignTeacherFormData.nip : editTeacherFormData.nip}
                        onChange={(e) => {
                          if (modalType === 'assign') {
                            setAssignTeacherFormData({...assignTeacherFormData, nip: e.target.value})
                          } else {
                            setEditTeacherFormData({...editTeacherFormData, nip: e.target.value})
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                        placeholder="Nomor Induk Pegawai"
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Jenis Kelamin *
                      </label>
                      <select
                        required
                        value={modalType === 'assign' ? assignTeacherFormData.jenis_kelamin : editTeacherFormData.jenis_kelamin}
                        onChange={(e) => {
                          if (modalType === 'assign') {
                            setAssignTeacherFormData({...assignTeacherFormData, jenis_kelamin: e.target.value as 'L' | 'P'})
                          } else {
                            setEditTeacherFormData({...editTeacherFormData, jenis_kelamin: e.target.value as 'L' | 'P'})
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none',
                          background: 'white'
                        }}
                      >
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Tanggal Lahir *
                      </label>
                      <input
                        type="date"
                        required
                        value={modalType === 'assign' ? assignTeacherFormData.tanggal_lahir : editTeacherFormData.tanggal_lahir}
                        onChange={(e) => {
                          if (modalType === 'assign') {
                            setAssignTeacherFormData({...assignTeacherFormData, tanggal_lahir: e.target.value})
                          } else {
                            setEditTeacherFormData({...editTeacherFormData, tanggal_lahir: e.target.value})
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Tanggal Bergabung *
                      </label>
                      <input
                        type="date"
                        required
                        value={modalType === 'assign' ? assignTeacherFormData.tanggal_bergabung : editTeacherFormData.tanggal_bergabung}
                        onChange={(e) => {
                          if (modalType === 'assign') {
                            setAssignTeacherFormData({...assignTeacherFormData, tanggal_bergabung: e.target.value})
                          } else {
                            setEditTeacherFormData({...editTeacherFormData, tanggal_bergabung: e.target.value})
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none'
                        }}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Alamat *
                      </label>
                      <textarea
                        required
                        value={modalType === 'assign' ? assignTeacherFormData.alamat : editTeacherFormData.alamat}
                        onChange={(e) => {
                          if (modalType === 'assign') {
                            setAssignTeacherFormData({...assignTeacherFormData, alamat: e.target.value})
                          } else {
                            setEditTeacherFormData({...editTeacherFormData, alamat: e.target.value})
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none',
                          minHeight: '80px',
                          resize: 'vertical',
                          fontFamily: 'inherit'
                        }}
                        placeholder="Alamat lengkap guru"
                      />
                    </div>
                  </div>
                )}

                {/* Wali Kelas Assignment/Edit Forms */}
                {(modalType === 'assign-wali' || modalType === 'edit-wali') && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151',
                        marginBottom: '6px'
                      }}>
                        Guru *
                      </label>
                      <select
                        required
                        value={assignWaliKelasFormData.guru_id}
                        onChange={(e) => setAssignWaliKelasFormData({...assignWaliKelasFormData, guru_id: parseInt(e.target.value)})}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          fontSize: '14px',
                          outline: 'none',
                          background: 'white'
                        }}
                      >
                        <option value="">Pilih Guru</option>
                        {teachers.map(teacher => (
                          <option key={teacher.guru_id} value={teacher.guru_id}>
                            {teacher.nama_lengkap} - {teacher.nip}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '6px'
                        }}>
                          Kelas *
                        </label>
                        <select
                          required
                          value={assignWaliKelasFormData.kelas_id}
                          onChange={(e) => setAssignWaliKelasFormData({...assignWaliKelasFormData, kelas_id: parseInt(e.target.value)})}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            fontSize: '14px',
                            outline: 'none',
                            background: 'white'
                          }}
                        >
                          <option value="">Pilih Kelas</option>
                          {classes.map(cls => (
                            <option key={cls.id} value={cls.id}>
                              {cls.nama_kelas} - {cls.jenjang} Tingkat {cls.tingkat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '6px'
                        }}>
                          Tahun Ajaran *
                        </label>
                        <input
                          type="text"
                          required
                          value={assignWaliKelasFormData.tahun_ajaran}
                          onChange={(e) => setAssignWaliKelasFormData({...assignWaliKelasFormData, tahun_ajaran: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                          placeholder="2026/2027"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                  marginTop: '24px'
                }}>
                  <button
                    type="button"
                    onClick={closeModal}
                    style={{
                      padding: '10px 20px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      background: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '6px',
                      background: COLORS.primary,
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {loading ? 'Menyimpan...' : 
                     modalType === 'assign' ? 'Tugaskan' :
                     modalType === 'edit' ? 'Simpan' :
                     modalType === 'assign-wali' ? 'Tugaskan' :
                     'Simpan'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}

// Helper functions for jenjang colors (shared between components)
const getJenjangColor = (jenjang: string) => {
  switch (jenjang) {
    case 'SD': return '#059669' // Green
    case 'SMP': return COLORS.primary // Blue
    case 'SMA': return '#dc2626' // Red
    case 'SMK': return '#d97706' // Orange
    default: return '#6b7280'
  }
}

const getJenjangBgColor = (jenjang: string) => {
  switch (jenjang) {
    case 'SD': return '#f0fdf4' // Light green
    case 'SMP': return '#f0f9ff' // Light blue
    case 'SMA': return '#fef2f2' // Light red
    case 'SMK': return '#fffbeb' // Light orange
    default: return '#f9fafb'
  }
}

// Student Management Component
interface Student {
  siswa_id: number;
  nama_lengkap: string;
  nis: string;
  nisn: string;
  jenis_kelamin: 'L' | 'P';
  tanggal_lahir: string;
  tempat_lahir: string;
  alamat: string;
  tanggal_masuk: string;
  status_siswa: string;
  nama_kelas: string;
  jenjang: string;
  tingkat: number;
  jurusan?: string | null;
  tahun_ajaran: string;
}

interface AssignStudentFormData {
  user_id: number | '';
  kelas_id: number | '';
  nis: string;
  nisn: string;
  jenis_kelamin: 'L' | 'P';
  tanggal_lahir: string;
  tempat_lahir: string;
  alamat: string;
  tanggal_masuk: string;
}

interface TransferStudentFormData {
  siswa_id: number | '';
  kelas_id_baru: number | '';
  tahun_ajaran: string;
  tanggal_mulai: string;
  status_kenaikan: 'naik_kelas' | 'tinggal_kelas' | 'pindah_kelas' | 'lulus' | 'keluar';
  catatan: string;
}

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalStudents, setTotalStudents] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'assign' | 'transfer' | 'delete'>('assign')
  
  const [assignFormData, setAssignFormData] = useState<AssignStudentFormData>({
    user_id: '',
    kelas_id: '',
    nis: '',
    nisn: '',
    jenis_kelamin: 'L',
    tanggal_lahir: '',
    tempat_lahir: '',
    alamat: '',
    tanggal_masuk: new Date().toISOString().split('T')[0]
  })

  const [transferFormData, setTransferFormData] = useState<TransferStudentFormData>({
    siswa_id: '',
    kelas_id_baru: '',
    tahun_ajaran: '2026/2027',
    tanggal_mulai: new Date().toISOString().split('T')[0],
    status_kenaikan: 'naik_kelas',
    catatan: ''
  })

  const ITEMS_PER_PAGE = 10

  // API Functions (reusing from UserManagement and ClassManagement)
  const getAuthToken = () => {
    const userData = localStorage.getItem('userData')
    if (userData) {
      try {
        const parsed = JSON.parse(userData)
        if (parsed.accessToken) {
          return parsed.accessToken
        }
      } catch (error) {
        console.log('Error parsing userData:', error)
      }
    }
    
    const directToken = localStorage.getItem('accessToken')
    if (directToken) {
      return directToken
    }
    
    const cookieToken = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1]
    if (cookieToken) {
      return cookieToken
    }
    
    return null
  }

  const apiCall = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken()
    
    if (!token) {
      throw new Error('No authentication token found. Please login again.')
    }
    
    console.log('Making API call to:', `http://localhost:3000${url}`)
    
    const response = await fetch(`http://localhost:3000${url}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      },
      ...options
    })
    
    console.log('API Response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log('API Error response:', errorText)
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`)
    }
    
    const data = await response.json()
    console.log('API Response data:', data)
    return data
  }

  const fetchStudents = async (page = 1, limit = ITEMS_PER_PAGE, search = '') => {
    setLoading(true)
    try {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : ''
      const response = await apiCall(`/api/siswa/list?page=${page}&limit=${limit}${searchParam}`)
      
      if (response.success && response.data) {
        setStudents(response.data)
        setTotalStudents(response.paging?.total || response.data.length)
      } else {
        throw new Error('Invalid API response format')
      }
    } catch (error) {
      console.error('Error fetching students:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      if (errorMessage.includes('No authentication token found')) {
        alert('Sesi login telah berakhir. Silakan login ulang sebagai admin.')
        window.location.href = '/login'
        return
      }
      
      alert(`Error memuat data siswa: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await apiCall('/api/users/list?limit=1000')
      if (response.success && response.data) {
        // Filter only users that could be students (not admin/guru)
        const studentUsers = response.data.filter((user: User) => 
          user.tipe_user === 'siswa'
        )
        setUsers(studentUsers)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchClasses = async () => {
    try {
      const response = await apiCall('/api/kelas/list?limit=1000')
      if (response.success && response.data) {
        setClasses(response.data)
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const assignStudent = async () => {
    setLoading(true)
    try {
      await apiCall('/api/assign/siswa', {
        method: 'POST',
        body: JSON.stringify(assignFormData)
      })
      alert('Siswa berhasil ditugaskan ke kelas!')
      fetchStudents(currentPage, ITEMS_PER_PAGE, searchTerm)
      closeModal()
    } catch (error) {
      console.error('Error assigning student:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error menugaskan siswa: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const transferStudent = async () => {
    setLoading(true)
    try {
      await apiCall('/api/assign/siswa/pindah-kelas', {
        method: 'POST',
        body: JSON.stringify(transferFormData)
      })
      alert('Siswa berhasil dipindahkan ke kelas baru!')
      fetchStudents(currentPage, ITEMS_PER_PAGE, searchTerm)
      closeModal()
    } catch (error) {
      console.error('Error transferring student:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error memindahkan siswa: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const deleteStudent = async (id: number) => {
    setLoading(true)
    try {
      await apiCall(`/api/siswa/${id}`, {
        method: 'DELETE'
      })
      alert('Siswa berhasil dihapus!')
      fetchStudents(currentPage, ITEMS_PER_PAGE, searchTerm)
      closeModal()
    } catch (error) {
      console.error('Error deleting student:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error menghapus siswa: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // Modal Functions
  const openAssignModal = () => {
    setAssignFormData({
      user_id: '',
      kelas_id: '',
      nis: '',
      nisn: '',
      jenis_kelamin: 'L',
      tanggal_lahir: '',
      tempat_lahir: '',
      alamat: '',
      tanggal_masuk: new Date().toISOString().split('T')[0]
    })
    setModalType('assign')
    setShowModal(true)
  }

  const openTransferModal = (student: Student) => {
    setSelectedStudent(student)
    setTransferFormData({
      siswa_id: student.siswa_id,
      kelas_id_baru: '',
      tahun_ajaran: '2026/2027',
      tanggal_mulai: new Date().toISOString().split('T')[0],
      status_kenaikan: 'naik_kelas',
      catatan: ''
    })
    setModalType('transfer')
    setShowModal(true)
  }

  const openDeleteModal = (student: Student) => {
    setSelectedStudent(student)
    setModalType('delete')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedStudent(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (modalType === 'assign') {
      assignStudent()
    } else if (modalType === 'transfer') {
      transferStudent()
    } else if (modalType === 'delete' && selectedStudent) {
      deleteStudent(selectedStudent.siswa_id)
    }
  }

  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue)
    setCurrentPage(1)
    fetchStudents(1, ITEMS_PER_PAGE, searchValue)
  }

  React.useEffect(() => {
    fetchStudents(currentPage, ITEMS_PER_PAGE, searchTerm)
  }, [currentPage])

  React.useEffect(() => {
    fetchUsers()
    fetchClasses()
  }, [])

  const filteredStudents = students.filter(student =>
    student.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.nis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.nama_kelas.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(totalStudents / ITEMS_PER_PAGE)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aktif': return '#10b981'
      case 'tidak_aktif': return '#ef4444'
      case 'lulus': return '#6366f1'
      case 'keluar': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  const getStatusKenaikans = () => [
    { value: 'naik_kelas', label: 'Naik Kelas' },
    { value: 'tinggal_kelas', label: 'Tinggal Kelas' },
    { value: 'pindah_kelas', label: 'Pindah Kelas' },
    { value: 'lulus', label: 'Lulus' },
    { value: 'keluar', label: 'Keluar' }
  ]

  return (
    <div>
      {/* Header */}
      <div style={{
        background: COLORS.white,
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1e293b',
              margin: '0 0 8px 0',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              Manajemen Siswa
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#475569',
              margin: 0,
              fontWeight: '500'
            }}>
              Kelola siswa dan penugasan kelas
            </p>
          </div>
          
          <button
            onClick={openAssignModal}
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(15, 76, 92, 0.3)',
              transform: 'translateY(0)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(15, 76, 92, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 76, 92, 0.3)'
            }}
          >
            <Plus size={16} />
            Tugaskan Siswa
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{
        background: COLORS.white,
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ position: 'relative' }}>
          <Search 
            size={20} 
            color="#6b7280" 
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />
          <input
            type="text"
            placeholder="Cari siswa berdasarkan nama, NIS, atau kelas..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 44px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Students Table */}
      <div style={{
        background: COLORS.white,
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            Memuat data...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            Tidak ada siswa ditemukan
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 100px 120px 100px 150px 100px 80px 120px',
              gap: '16px',
              padding: '16px 20px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              borderBottom: '2px solid #e2e8f0',
              fontSize: '13px',
              fontWeight: '700',
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <div>Nama Siswa</div>
              <div>NIS</div>
              <div>NISN</div>
              <div>Gender</div>
              <div>Kelas</div>
              <div>Jenjang</div>
              <div>Status</div>
              <div style={{ textAlign: 'center' }}>Aksi</div>
            </div>

            {/* Table Body */}
            {filteredStudents.map((student, index) => (
              <div
                key={student.siswa_id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 100px 120px 100px 150px 100px 80px 120px',
                  gap: '16px',
                  padding: '16px 20px',
                  borderBottom: '1px solid #e5e7eb',
                  fontSize: '14px',
                  alignItems: 'center',
                  background: index % 2 === 0 ? 'white' : '#fafbfc',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0f9ff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#fafbfc'
                }}
              >
                <div>
                  <div style={{
                    fontWeight: '600',
                    color: '#1f2937'
                  }}>
                    {student.nama_lengkap}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    marginTop: '2px'
                  }}>
                    {student.tempat_lahir}
                  </div>
                </div>
                
                <div style={{ 
                  color: '#374151',
                  fontWeight: '500',
                  fontSize: '13px'
                }}>
                  {student.nis}
                </div>
                
                <div style={{ 
                  color: '#6b7280',
                  fontSize: '13px'
                }}>
                  {student.nisn}
                </div>
                
                <div>
                  <span style={{
                    background: student.jenis_kelamin === 'L' ? '#dbeafe' : '#fdf2f8',
                    color: student.jenis_kelamin === 'L' ? '#1d4ed8' : '#ec4899',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {student.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </span>
                </div>
                
                <div>
                  <div style={{
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '13px'
                  }}>
                    {student.nama_kelas}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#6b7280'
                  }}>
                    {student.tahun_ajaran}
                  </div>
                </div>
                
                <div>
                  <span style={{
                    background: getJenjangBgColor(student.jenjang),
                    color: getJenjangColor(student.jenjang),
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    border: `1px solid ${getJenjangColor(student.jenjang)}20`
                  }}>
                    {student.jenjang}
                  </span>
                </div>
                
                <div style={{ 
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: getStatusColor(student.status_siswa)
                  }}></div>
                  <span style={{ 
                    color: getStatusColor(student.status_siswa), 
                    fontWeight: '500',
                    fontSize: '12px'
                  }}>
                    {student.status_siswa}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  gap: '6px',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <button
                    onClick={() => openTransferModal(student)}
                    style={{
                      background: '#f0f9ff',
                      border: '1px solid #0ea5e9',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      padding: '6px 8px',
                      color: '#0ea5e9',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Pindah kelas"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#0ea5e9'
                      e.currentTarget.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f0f9ff'
                      e.currentTarget.style.color = '#0ea5e9'
                    }}
                  >
                    <ArrowRightLeft size={14} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(student)}
                    style={{
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      padding: '6px 8px',
                      color: '#dc2626',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Hapus siswa"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fee2e2'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fef2f2'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          marginTop: '24px'
        }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              background: currentPage === 1 ? '#f9fafb' : 'white',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.5 : 1,
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            ← Sebelumnya
          </button>
          
          <span style={{
            padding: '10px 16px',
            fontSize: '14px',
            color: '#475569',
            fontWeight: '500',
            background: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            Halaman {currentPage} dari {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              background: currentPage === totalPages ? '#f9fafb' : 'white',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.5 : 1,
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            Selanjutnya →
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              width: '100%',
              maxWidth: modalType === 'assign' ? '700px' : '600px',
              margin: '20px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {modalType === 'delete' ? (
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 16px 0'
                }}>
                  Hapus Siswa
                </h3>
                
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0 0 24px 0',
                  lineHeight: '1.5'
                }}>
                  Apakah Anda yakin ingin menghapus siswa <strong>{selectedStudent?.nama_lengkap}</strong>? 
                  Tindakan ini tidak dapat dibatalkan dan akan menghapus semua data terkait.
                </p>
                
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={closeModal}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      background: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '6px',
                      background: COLORS.error,
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {loading ? 'Menghapus...' : 'Hapus'}
                  </button>
                </div>
              </div>
            ) : modalType === 'assign' ? (
              <form onSubmit={handleSubmit}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 20px 0'
                }}>
                  Tugaskan Siswa ke Kelas
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Pengguna *
                    </label>
                    <select
                      required
                      value={assignFormData.user_id}
                      onChange={(e) => setAssignFormData({...assignFormData, user_id: parseInt(e.target.value)})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        background: 'white'
                      }}
                    >
                      <option value="">Pilih Pengguna</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.nama_lengkap} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Kelas *
                    </label>
                    <select
                      required
                      value={assignFormData.kelas_id}
                      onChange={(e) => setAssignFormData({...assignFormData, kelas_id: parseInt(e.target.value)})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        background: 'white'
                      }}
                    >
                      <option value="">Pilih Kelas</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>
                          {cls.nama_kelas} - {cls.jenjang} Tingkat {cls.tingkat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      NIS *
                    </label>
                    <input
                      type="text"
                      required
                      value={assignFormData.nis}
                      onChange={(e) => setAssignFormData({...assignFormData, nis: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="Nomor Induk Siswa"
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      NISN *
                    </label>
                    <input
                      type="text"
                      required
                      value={assignFormData.nisn}
                      onChange={(e) => setAssignFormData({...assignFormData, nisn: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="Nomor Induk Siswa Nasional"
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Jenis Kelamin *
                    </label>
                    <select
                      required
                      value={assignFormData.jenis_kelamin}
                      onChange={(e) => setAssignFormData({...assignFormData, jenis_kelamin: e.target.value as 'L' | 'P'})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        background: 'white'
                      }}
                    >
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Tanggal Lahir *
                    </label>
                    <input
                      type="date"
                      required
                      value={assignFormData.tanggal_lahir}
                      onChange={(e) => setAssignFormData({...assignFormData, tanggal_lahir: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Tempat Lahir *
                    </label>
                    <input
                      type="text"
                      required
                      value={assignFormData.tempat_lahir}
                      onChange={(e) => setAssignFormData({...assignFormData, tempat_lahir: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="Tempat lahir siswa"
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Tanggal Masuk *
                    </label>
                    <input
                      type="date"
                      required
                      value={assignFormData.tanggal_masuk}
                      onChange={(e) => setAssignFormData({...assignFormData, tanggal_masuk: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Alamat *
                  </label>
                  <textarea
                    required
                    value={assignFormData.alamat}
                    onChange={(e) => setAssignFormData({...assignFormData, alamat: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      minHeight: '80px',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                    placeholder="Alamat lengkap siswa"
                  />
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                  marginTop: '24px'
                }}>
                  <button
                    type="button"
                    onClick={closeModal}
                    style={{
                      padding: '10px 20px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      background: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '6px',
                      background: COLORS.primary,
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {loading ? 'Menyimpan...' : 'Tugaskan'}
                  </button>
                </div>
              </form>
            ) : modalType === 'transfer' ? (
              <form onSubmit={handleSubmit}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 20px 0'
                }}>
                  Pindah Kelas Siswa
                </h3>

                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '20px'
                }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    margin: '0 0 8px 0'
                  }}>
                    Data Siswa
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                    <strong>{selectedStudent?.nama_lengkap}</strong> - {selectedStudent?.nis}<br/>
                    Kelas saat ini: {selectedStudent?.nama_kelas} ({selectedStudent?.jenjang})
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Kelas Baru *
                    </label>
                    <select
                      required
                      value={transferFormData.kelas_id_baru}
                      onChange={(e) => setTransferFormData({...transferFormData, kelas_id_baru: parseInt(e.target.value)})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        background: 'white'
                      }}
                    >
                      <option value="">Pilih Kelas Baru</option>
                      {classes.filter(cls => cls.id !== selectedStudent?.siswa_id).map(cls => (
                        <option key={cls.id} value={cls.id}>
                          {cls.nama_kelas} - {cls.jenjang} Tingkat {cls.tingkat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Tahun Ajaran *
                    </label>
                    <input
                      type="text"
                      required
                      value={transferFormData.tahun_ajaran}
                      onChange={(e) => setTransferFormData({...transferFormData, tahun_ajaran: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="2026/2027"
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Tanggal Mulai *
                    </label>
                    <input
                      type="date"
                      required
                      value={transferFormData.tanggal_mulai}
                      onChange={(e) => setTransferFormData({...transferFormData, tanggal_mulai: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Status Kenaikan *
                    </label>
                    <select
                      required
                      value={transferFormData.status_kenaikan}
                      onChange={(e) => setTransferFormData({...transferFormData, status_kenaikan: e.target.value as any})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        background: 'white'
                      }}
                    >
                      {getStatusKenaikans().map(status => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Catatan
                  </label>
                  <textarea
                    value={transferFormData.catatan}
                    onChange={(e) => setTransferFormData({...transferFormData, catatan: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      minHeight: '80px',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                    placeholder="Catatan tambahan tentang perpindahan kelas..."
                  />
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                  marginTop: '24px'
                }}>
                  <button
                    type="button"
                    onClick={closeModal}
                    style={{
                      padding: '10px 20px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      background: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '6px',
                      background: '#0ea5e9',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {loading ? 'Memindahkan...' : 'Pindah Kelas'}
                  </button>
                </div>
              </form>
            ) : null}
          </motion.div>
        </div>
      )}
    </div>
  )
}

// Subject Management Component
interface Subject {
  id: number;
  kode_mapel: string;
  nama_mapel: string;
  jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK' | 'ALL';
  tingkat_min: number;
  tingkat_max: number;
  kkm: number;
  deskripsi: string | null;
  is_active: number;
  created_at: string;
  updated_at: string;
}

interface SubjectFormData {
  kode_mapel: string;
  nama_mapel: string;
  jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK' | 'ALL';
  tingkat_min: number;
  tingkat_max: number;
  kkm: number;
  deskripsi: string;
  is_active: number;
}

const SubjectManagement: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalSubjects, setTotalSubjects] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'create' | 'edit' | 'delete'>('create')
  
  const [formData, setFormData] = useState<SubjectFormData>({
    kode_mapel: '',
    nama_mapel: '',
    jenjang: 'ALL',
    tingkat_min: 1,
    tingkat_max: 12,
    kkm: 75,
    deskripsi: '',
    is_active: 1
  })

  const ITEMS_PER_PAGE = 20

  // Get auth token
  const getAuthToken = () => {
    const userData = localStorage.getItem('userData')
    if (userData) {
      try {
        const parsed = JSON.parse(userData)
        if (parsed.accessToken) {
          return parsed.accessToken
        }
      } catch (error) {
        console.log('Error parsing userData:', error)
      }
    }
    
    const directToken = localStorage.getItem('accessToken')
    if (directToken) {
      return directToken
    }
    
    const cookieToken = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1]
    if (cookieToken) {
      return cookieToken
    }
    
    return null
  }

  // API Functions
  const apiCall = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken()
    
    if (!token) {
      throw new Error('No authentication token found. Please login again.')
    }
    
    const response = await fetch(`http://localhost:3000${url}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      },
      ...options
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`)
    }
    
    const data = await response.json()
    return data
  }

  const fetchSubjects = async (page = 1, limit = ITEMS_PER_PAGE, search = '') => {
    setLoading(true)
    try {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : ''
      const response = await apiCall(`/api/mata-pelajaran/list?page=${page}&limit=${limit}${searchParam}`)
      
      if (response.success && response.data) {
        setSubjects(response.data)
        setTotalSubjects(response.paging?.total || response.data.length)
      } else {
        throw new Error('Invalid API response format')
      }
    } catch (error) {
      console.error('Error fetching subjects:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      if (errorMessage.includes('No authentication token found')) {
        alert('Sesi login telah berakhir. Silakan login ulang sebagai admin.')
        window.location.href = '/login'
        return
      }
      
      alert(`Error memuat data mata pelajaran: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const createSubject = async () => {
    setLoading(true)
    try {
      await apiCall('/api/mata-pelajaran', {
        method: 'POST',
        body: JSON.stringify(formData)
      })
      alert('Mata pelajaran berhasil dibuat!')
      fetchSubjects(currentPage, ITEMS_PER_PAGE, searchTerm)
      closeModal()
    } catch (error) {
      console.error('Error creating subject:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error membuat mata pelajaran: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const updateSubject = async (id: number) => {
    setLoading(true)
    try {
      await apiCall(`/api/mata-pelajaran/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      })
      alert('Mata pelajaran berhasil diperbarui!')
      fetchSubjects(currentPage, ITEMS_PER_PAGE, searchTerm)
      closeModal()
    } catch (error) {
      console.error('Error updating subject:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error memperbarui mata pelajaran: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const deleteSubject = async (id: number) => {
    setLoading(true)
    try {
      await apiCall(`/api/mata-pelajaran/${id}`, {
        method: 'DELETE'
      })
      alert('Mata pelajaran berhasil dihapus!')
      fetchSubjects(currentPage, ITEMS_PER_PAGE, searchTerm)
      closeModal()
    } catch (error) {
      console.error('Error deleting subject:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error menghapus mata pelajaran: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // Modal Functions
  const openCreateModal = () => {
    setFormData({
      kode_mapel: '',
      nama_mapel: '',
      jenjang: 'ALL',
      tingkat_min: 1,
      tingkat_max: 12,
      kkm: 75,
      deskripsi: '',
      is_active: 1
    })
    setModalType('create')
    setShowModal(true)
  }

  const openEditModal = (subject: Subject) => {
    setSelectedSubject(subject)
    setFormData({
      kode_mapel: subject.kode_mapel,
      nama_mapel: subject.nama_mapel,
      jenjang: subject.jenjang,
      tingkat_min: subject.tingkat_min,
      tingkat_max: subject.tingkat_max,
      kkm: subject.kkm,
      deskripsi: subject.deskripsi || '',
      is_active: subject.is_active
    })
    setModalType('edit')
    setShowModal(true)
  }

  const openDeleteModal = (subject: Subject) => {
    setSelectedSubject(subject)
    setModalType('delete')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedSubject(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (modalType === 'create') {
      createSubject()
    } else if (modalType === 'edit' && selectedSubject) {
      updateSubject(selectedSubject.id)
    } else if (modalType === 'delete' && selectedSubject) {
      deleteSubject(selectedSubject.id)
    }
  }

  const handleSearch = (searchValue: string) => {
    setSearchTerm(searchValue)
    setCurrentPage(1)
    fetchSubjects(1, ITEMS_PER_PAGE, searchValue)
  }

  // Handle jenjang change to update tingkat options
  const handleJenjangChange = (jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK' | 'ALL') => {
    let tingkatMin = 1
    let tingkatMax = 12
    
    if (jenjang === 'SD') {
      tingkatMin = 1
      tingkatMax = 6
    } else if (jenjang === 'SMP') {
      tingkatMin = 7
      tingkatMax = 9
    } else if (jenjang === 'SMA' || jenjang === 'SMK') {
      tingkatMin = 10
      tingkatMax = 12
    }
    
    setFormData({
      ...formData,
      jenjang,
      tingkat_min: tingkatMin,
      tingkat_max: tingkatMax
    })
  }

  React.useEffect(() => {
    fetchSubjects(currentPage, ITEMS_PER_PAGE, searchTerm)
  }, [currentPage])

  const filteredSubjects = subjects.filter(subject =>
    subject.nama_mapel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.kode_mapel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.jenjang.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(totalSubjects / ITEMS_PER_PAGE)

  const getJenjangColor = (jenjang: string) => {
    switch (jenjang) {
      case 'SD': return '#059669'
      case 'SMP': return COLORS.primary
      case 'SMA': return '#dc2626'
      case 'SMK': return '#d97706'
      case 'ALL': return '#7c3aed'
      default: return '#6b7280'
    }
  }

  const getJenjangBgColor = (jenjang: string) => {
    switch (jenjang) {
      case 'SD': return '#f0fdf4'
      case 'SMP': return '#f0f9ff'
      case 'SMA': return '#fef2f2'
      case 'SMK': return '#fffbeb'
      case 'ALL': return '#f5f3ff'
      default: return '#f9fafb'
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        background: COLORS.white,
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1e293b',
              margin: '0 0 8px 0',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              Manajemen Mata Pelajaran
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#475569',
              margin: 0,
              fontWeight: '500'
            }}>
              Kelola data mata pelajaran sekolah
            </p>
          </div>
          
          <button
            onClick={openCreateModal}
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(15, 76, 92, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(15, 76, 92, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 76, 92, 0.3)'
            }}
          >
            <Plus size={16} />
            Tambah Mata Pelajaran
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{
        background: COLORS.white,
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ position: 'relative' }}>
          <Search 
            size={20} 
            color="#6b7280" 
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />
          <input
            type="text"
            placeholder="Cari mata pelajaran berdasarkan nama, kode, atau jenjang..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 44px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Subjects Table */}
      <div style={{
        background: COLORS.white,
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            Memuat data...
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            Tidak ada mata pelajaran ditemukan
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '100px 1fr 100px 120px 80px 80px 100px',
              gap: '16px',
              padding: '16px 20px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              borderBottom: '2px solid #e2e8f0',
              fontSize: '13px',
              fontWeight: '700',
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <div>Kode</div>
              <div>Nama Mata Pelajaran</div>
              <div>Jenjang</div>
              <div>Tingkat</div>
              <div>KKM</div>
              <div>Status</div>
              <div style={{ textAlign: 'center' }}>Aksi</div>
            </div>

            {/* Table Body */}
            {filteredSubjects.map((subject, index) => (
              <div
                key={subject.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr 100px 120px 80px 80px 100px',
                  gap: '16px',
                  padding: '16px 20px',
                  borderBottom: '1px solid #e5e7eb',
                  fontSize: '14px',
                  alignItems: 'center',
                  background: index % 2 === 0 ? 'white' : '#fafbfc',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0f9ff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#fafbfc'
                }}
              >
                <div style={{ 
                  fontWeight: '600',
                  color: COLORS.primary,
                  fontFamily: 'monospace',
                  fontSize: '13px'
                }}>
                  {subject.kode_mapel}
                </div>
                
                <div style={{ fontWeight: '500', color: '#1f2937' }}>
                  {subject.nama_mapel}
                </div>
                
                <div>
                  <span style={{
                    background: getJenjangBgColor(subject.jenjang),
                    color: getJenjangColor(subject.jenjang),
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {subject.jenjang}
                  </span>
                </div>
                
                <div style={{ color: '#6b7280', fontSize: '13px' }}>
                  {subject.tingkat_min} - {subject.tingkat_max}
                </div>
                
                <div style={{ 
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  {subject.kkm}
                </div>
                
                <div>
                  <span style={{
                    background: subject.is_active ? '#dcfce7' : '#fee2e2',
                    color: subject.is_active ? '#166534' : '#dc2626',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {subject.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  gap: '6px',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <button
                    onClick={() => openEditModal(subject)}
                    style={{
                      background: '#f3f4f6',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      padding: '6px 8px',
                      color: '#374151',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Edit mata pelajaran"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#e5e7eb'
                      e.currentTarget.style.color = COLORS.primary
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f3f4f6'
                      e.currentTarget.style.color = '#374151'
                    }}
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(subject)}
                    style={{
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      padding: '6px 8px',
                      color: '#dc2626',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Hapus mata pelajaran"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fee2e2'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fef2f2'
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          marginTop: '24px'
        }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              background: currentPage === 1 ? '#f9fafb' : 'white',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.5 : 1,
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            ← Sebelumnya
          </button>
          
          <span style={{
            padding: '10px 16px',
            fontSize: '14px',
            color: '#475569',
            fontWeight: '500',
            background: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            Halaman {currentPage} dari {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              background: currentPage === totalPages ? '#f9fafb' : 'white',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.5 : 1,
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            Selanjutnya →
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              width: '100%',
              maxWidth: modalType === 'delete' ? '500px' : '600px',
              margin: '20px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {modalType === 'delete' ? (
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 16px 0'
                }}>
                  Hapus Mata Pelajaran
                </h3>
                
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0 0 24px 0',
                  lineHeight: '1.5'
                }}>
                  Apakah Anda yakin ingin menghapus mata pelajaran <strong>{selectedSubject?.nama_mapel}</strong> ({selectedSubject?.kode_mapel})? 
                  Tindakan ini tidak dapat dibatalkan.
                </p>
                
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={closeModal}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      background: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '6px',
                      background: COLORS.error,
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {loading ? 'Menghapus...' : 'Hapus'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 20px 0'
                }}>
                  {modalType === 'create' ? 'Tambah Mata Pelajaran Baru' : 'Edit Mata Pelajaran'}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Kode Mapel *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.kode_mapel}
                      onChange={(e) => setFormData({...formData, kode_mapel: e.target.value.toUpperCase()})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        textTransform: 'uppercase'
                      }}
                      placeholder="Contoh: MAT, BIN"
                      maxLength={10}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Nama Mata Pelajaran *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nama_mapel}
                      onChange={(e) => setFormData({...formData, nama_mapel: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="Contoh: Matematika"
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Jenjang *
                    </label>
                    <select
                      required
                      value={formData.jenjang}
                      onChange={(e) => handleJenjangChange(e.target.value as any)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        background: 'white'
                      }}
                    >
                      <option value="ALL">Semua Jenjang</option>
                      <option value="SD">SD</option>
                      <option value="SMP">SMP</option>
                      <option value="SMA">SMA</option>
                      <option value="SMK">SMK</option>
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      KKM *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={formData.kkm}
                      onChange={(e) => setFormData({...formData, kkm: parseInt(e.target.value) || 75})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Tingkat Min *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={12}
                      value={formData.tingkat_min}
                      onChange={(e) => setFormData({...formData, tingkat_min: parseInt(e.target.value) || 1})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Tingkat Max *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={12}
                      value={formData.tingkat_max}
                      onChange={(e) => setFormData({...formData, tingkat_max: parseInt(e.target.value) || 12})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Deskripsi
                    </label>
                    <textarea
                      value={formData.deskripsi}
                      onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        minHeight: '80px',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                      placeholder="Deskripsi mata pelajaran (opsional)"
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={formData.is_active === 1}
                        onChange={(e) => setFormData({...formData, is_active: e.target.checked ? 1 : 0})}
                        style={{ width: '16px', height: '16px' }}
                      />
                      Aktif
                    </label>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                  marginTop: '24px'
                }}>
                  <button
                    type="button"
                    onClick={closeModal}
                    style={{
                      padding: '10px 20px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      background: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '6px',
                      background: COLORS.primary,
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {loading ? 'Menyimpan...' : modalType === 'create' ? 'Tambah' : 'Simpan'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}

// Schedule Management Component
interface Schedule {
  id: number;
  kelas_id: number;
  mata_pelajaran_id: number;
  guru_id: number;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  jam_mulai: string;
  jam_selesai: string;
  tahun_ajaran: string;
  ruangan: string;
  is_active: number;
  created_at: string;
  nama_mapel: string;
  nama_guru: string;
  nama_kelas?: string;
}

interface ScheduleFormData {
  kelas_id: number | '';
  mata_pelajaran_id: number | '';
  guru_id: number | '';
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  jam_mulai: string;
  jam_selesai: string;
  tahun_ajaran: string;
  ruangan: string;
}

const ScheduleManagement: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'create' | 'edit' | 'delete'>('create')
  const [filterHari, setFilterHari] = useState<string>('')
  
  const [formData, setFormData] = useState<ScheduleFormData>({
    kelas_id: '',
    mata_pelajaran_id: '',
    guru_id: '',
    hari: 'Senin',
    jam_mulai: '07:00:00',
    jam_selesai: '08:30:00',
    tahun_ajaran: '2025/2026',
    ruangan: ''
  })

  const hariOptions = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

  // Get auth token
  const getAuthToken = () => {
    const userData = localStorage.getItem('userData')
    if (userData) {
      try {
        const parsed = JSON.parse(userData)
        if (parsed.accessToken) {
          return parsed.accessToken
        }
      } catch (error) {
        console.log('Error parsing userData:', error)
      }
    }
    
    const directToken = localStorage.getItem('accessToken')
    if (directToken) {
      return directToken
    }
    
    const cookieToken = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1]
    if (cookieToken) {
      return cookieToken
    }
    
    return null
  }

  // API Functions
  const apiCall = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken()
    
    if (!token) {
      throw new Error('No authentication token found. Please login again.')
    }
    
    const response = await fetch(`http://localhost:3000${url}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      },
      ...options
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`)
    }
    
    const data = await response.json()
    return data
  }

  const fetchSchedules = async () => {
    setLoading(true)
    try {
      const response = await apiCall('/api/jadwal/pelajaran')
      
      if (response.success && response.data) {
        setSchedules(response.data)
      } else {
        throw new Error('Invalid API response format')
      }
    } catch (error) {
      console.error('Error fetching schedules:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      
      if (errorMessage.includes('No authentication token found')) {
        alert('Sesi login telah berakhir. Silakan login ulang sebagai admin.')
        window.location.href = '/login'
        return
      }
      
      alert(`Error memuat data jadwal: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchSubjects = async () => {
    try {
      const response = await apiCall('/api/mata-pelajaran/list?limit=100')
      if (response.success && response.data) {
        setSubjects(response.data)
      }
    } catch (error) {
      console.error('Error fetching subjects:', error)
    }
  }

  const fetchTeachers = async () => {
    try {
      const response = await apiCall('/api/guru/list?limit=100')
      if (response.success && response.data) {
        setTeachers(response.data)
      }
    } catch (error) {
      console.error('Error fetching teachers:', error)
    }
  }

  const fetchClasses = async () => {
    try {
      const response = await apiCall('/api/kelas/list?limit=100')
      if (response.success && response.data) {
        setClasses(response.data)
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const createSchedule = async () => {
    setLoading(true)
    try {
      await apiCall('/api/jadwal/pelajaran', {
        method: 'POST',
        body: JSON.stringify(formData)
      })
      alert('Jadwal pelajaran berhasil dibuat!')
      fetchSchedules()
      closeModal()
    } catch (error) {
      console.error('Error creating schedule:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error membuat jadwal: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const updateSchedule = async (id: number) => {
    setLoading(true)
    try {
      await apiCall(`/api/jadwal/pelajaran/${id}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      })
      alert('Jadwal pelajaran berhasil diperbarui!')
      fetchSchedules()
      closeModal()
    } catch (error) {
      console.error('Error updating schedule:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error memperbarui jadwal: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const deleteSchedule = async (id: number) => {
    setLoading(true)
    try {
      await apiCall(`/api/jadwal/pelajaran/${id}`, {
        method: 'DELETE'
      })
      alert('Jadwal pelajaran berhasil dihapus!')
      fetchSchedules()
      closeModal()
    } catch (error) {
      console.error('Error deleting schedule:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error menghapus jadwal: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // Modal Functions
  const openCreateModal = () => {
    setFormData({
      kelas_id: '',
      mata_pelajaran_id: '',
      guru_id: '',
      hari: 'Senin',
      jam_mulai: '07:00:00',
      jam_selesai: '08:30:00',
      tahun_ajaran: '2025/2026',
      ruangan: ''
    })
    setModalType('create')
    setShowModal(true)
  }

  const openEditModal = (schedule: Schedule) => {
    setSelectedSchedule(schedule)
    setFormData({
      kelas_id: schedule.kelas_id,
      mata_pelajaran_id: schedule.mata_pelajaran_id,
      guru_id: schedule.guru_id,
      hari: schedule.hari,
      jam_mulai: schedule.jam_mulai,
      jam_selesai: schedule.jam_selesai,
      tahun_ajaran: schedule.tahun_ajaran,
      ruangan: schedule.ruangan
    })
    setModalType('edit')
    setShowModal(true)
  }

  const openDeleteModal = (schedule: Schedule) => {
    setSelectedSchedule(schedule)
    setModalType('delete')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedSchedule(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (modalType === 'create') {
      createSchedule()
    } else if (modalType === 'edit' && selectedSchedule) {
      updateSchedule(selectedSchedule.id)
    } else if (modalType === 'delete' && selectedSchedule) {
      deleteSchedule(selectedSchedule.id)
    }
  }

  React.useEffect(() => {
    fetchSchedules()
    fetchSubjects()
    fetchTeachers()
    fetchClasses()
  }, [])

  const filteredSchedules = schedules.filter(schedule => {
    const matchSearch = 
      schedule.nama_mapel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.nama_guru.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.ruangan.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchHari = filterHari ? schedule.hari === filterHari : true
    
    return matchSearch && matchHari
  })

  // Group schedules by day
  const groupedSchedules = hariOptions.reduce((acc, hari) => {
    acc[hari] = filteredSchedules.filter(s => s.hari === hari).sort((a, b) => a.jam_mulai.localeCompare(b.jam_mulai))
    return acc
  }, {} as Record<string, Schedule[]>)

  const getHariColor = (hari: string) => {
    switch (hari) {
      case 'Senin': return '#3b82f6'
      case 'Selasa': return '#10b981'
      case 'Rabu': return '#f59e0b'
      case 'Kamis': return '#8b5cf6'
      case 'Jumat': return '#ec4899'
      case 'Sabtu': return '#6366f1'
      default: return '#6b7280'
    }
  }

  const getClassName = (kelasId: number) => {
    const kelas = classes.find(c => c.id === kelasId)
    return kelas ? kelas.nama_kelas : `Kelas ${kelasId}`
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        background: COLORS.white,
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1e293b',
              margin: '0 0 8px 0',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              Manajemen Jadwal Pelajaran
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#475569',
              margin: 0,
              fontWeight: '500'
            }}>
              Kelola jadwal pelajaran sekolah
            </p>
          </div>
          
          <button
            onClick={openCreateModal}
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.accent} 100%)`,
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(15, 76, 92, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(15, 76, 92, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 76, 92, 0.3)'
            }}
          >
            <Plus size={16} />
            Tambah Jadwal
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div style={{
        background: COLORS.white,
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <Search 
              size={20} 
              color="#6b7280" 
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}
            />
            <input
              type="text"
              placeholder="Cari jadwal berdasarkan mapel, guru, atau ruangan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 12px 12px 44px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          
          <select
            value={filterHari}
            onChange={(e) => setFilterHari(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              background: 'white',
              minWidth: '150px'
            }}
          >
            <option value="">Semua Hari</option>
            {hariOptions.map(hari => (
              <option key={hari} value={hari}>{hari}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Schedules Display */}
      <div style={{
        background: COLORS.white,
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            Memuat data...
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div style={{
            padding: '60px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            Tidak ada jadwal ditemukan
          </div>
        ) : (
          <div style={{ padding: '20px' }}>
            {hariOptions.map(hari => {
              const daySchedules = groupedSchedules[hari] || []
              if (filterHari && filterHari !== hari) return null
              if (daySchedules.length === 0 && !filterHari) return null
              
              return (
                <div key={hari} style={{ marginBottom: '24px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: getHariColor(hari)
                    }} />
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1f2937',
                      margin: 0
                    }}>
                      {hari}
                    </h3>
                    <span style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      background: '#f3f4f6',
                      padding: '4px 8px',
                      borderRadius: '4px'
                    }}>
                      {daySchedules.length} jadwal
                    </span>
                  </div>
                  
                  {daySchedules.length === 0 ? (
                    <div style={{
                      padding: '20px',
                      textAlign: 'center',
                      color: '#9ca3af',
                      background: '#f9fafb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}>
                      Tidak ada jadwal untuk hari ini
                    </div>
                  ) : (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                      gap: '12px'
                    }}>
                      {daySchedules.map(schedule => (
                        <div
                          key={schedule.id}
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '10px',
                            padding: '16px',
                            borderLeft: `4px solid ${getHariColor(hari)}`,
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                            e.currentTarget.style.transform = 'translateY(-2px)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = 'none'
                            e.currentTarget.style.transform = 'translateY(0)'
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '12px'
                          }}>
                            <div>
                              <h4 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#1f2937',
                                margin: '0 0 4px 0'
                              }}>
                                {schedule.nama_mapel}
                              </h4>
                              <p style={{
                                fontSize: '13px',
                                color: '#6b7280',
                                margin: 0
                              }}>
                                {schedule.nama_guru}
                              </p>
                            </div>
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button
                                onClick={() => openEditModal(schedule)}
                                style={{
                                  background: 'white',
                                  border: '1px solid #d1d5db',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  padding: '4px 6px',
                                  color: '#374151',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                <Edit size={12} />
                              </button>
                              <button
                                onClick={() => openDeleteModal(schedule)}
                                style={{
                                  background: '#fef2f2',
                                  border: '1px solid #fecaca',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  padding: '4px 6px',
                                  color: '#dc2626',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                          
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '8px',
                            fontSize: '13px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                              <Clock size={14} />
                              {schedule.jam_mulai.slice(0, 5)} - {schedule.jam_selesai.slice(0, 5)}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                              <School size={14} />
                              {getClassName(schedule.kelas_id)}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                              <FileText size={14} />
                              {schedule.ruangan}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
                              <Calendar size={14} />
                              {schedule.tahun_ajaran}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              width: '100%',
              maxWidth: modalType === 'delete' ? '500px' : '650px',
              margin: '20px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {modalType === 'delete' ? (
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 16px 0'
                }}>
                  Hapus Jadwal Pelajaran
                </h3>
                
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0 0 24px 0',
                  lineHeight: '1.5'
                }}>
                  Apakah Anda yakin ingin menghapus jadwal <strong>{selectedSchedule?.nama_mapel}</strong> pada hari <strong>{selectedSchedule?.hari}</strong> ({selectedSchedule?.jam_mulai} - {selectedSchedule?.jam_selesai})? 
                  Tindakan ini tidak dapat dibatalkan.
                </p>
                
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={closeModal}
                    style={{
                      padding: '8px 16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      background: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '6px',
                      background: COLORS.error,
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {loading ? 'Menghapus...' : 'Hapus'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 20px 0'
                }}>
                  {modalType === 'create' ? 'Tambah Jadwal Pelajaran' : 'Edit Jadwal Pelajaran'}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Kelas *
                    </label>
                    <select
                      required
                      value={formData.kelas_id}
                      onChange={(e) => setFormData({...formData, kelas_id: parseInt(e.target.value)})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        background: 'white'
                      }}
                    >
                      <option value="">Pilih Kelas</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>
                          {cls.nama_kelas} - {cls.jenjang}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Mata Pelajaran *
                    </label>
                    <select
                      required
                      value={formData.mata_pelajaran_id}
                      onChange={(e) => setFormData({...formData, mata_pelajaran_id: parseInt(e.target.value)})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        background: 'white'
                      }}
                    >
                      <option value="">Pilih Mata Pelajaran</option>
                      {subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>
                          {subject.nama_mapel} ({subject.kode_mapel})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Guru *
                    </label>
                    <select
                      required
                      value={formData.guru_id}
                      onChange={(e) => setFormData({...formData, guru_id: parseInt(e.target.value)})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        background: 'white'
                      }}
                    >
                      <option value="">Pilih Guru</option>
                      {teachers.map(teacher => (
                        <option key={teacher.guru_id} value={teacher.guru_id}>
                          {teacher.nama_lengkap}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Hari *
                    </label>
                    <select
                      required
                      value={formData.hari}
                      onChange={(e) => setFormData({...formData, hari: e.target.value as any})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        background: 'white'
                      }}
                    >
                      {hariOptions.map(hari => (
                        <option key={hari} value={hari}>{hari}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Jam Mulai *
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.jam_mulai.slice(0, 5)}
                      onChange={(e) => setFormData({...formData, jam_mulai: e.target.value + ':00'})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Jam Selesai *
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.jam_selesai.slice(0, 5)}
                      onChange={(e) => setFormData({...formData, jam_selesai: e.target.value + ':00'})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Ruangan *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.ruangan}
                      onChange={(e) => setFormData({...formData, ruangan: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="Contoh: Ruang 1, Lab Komputer"
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '6px'
                    }}>
                      Tahun Ajaran *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.tahun_ajaran}
                      onChange={(e) => setFormData({...formData, tahun_ajaran: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      placeholder="Contoh: 2025/2026"
                    />
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                  marginTop: '24px'
                }}>
                  <button
                    type="button"
                    onClick={closeModal}
                    style={{
                      padding: '10px 20px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      background: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '6px',
                      background: COLORS.primary,
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {loading ? 'Menyimpan...' : modalType === 'create' ? 'Tambah' : 'Simpan'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}

// Reports Management Component
interface ReportData {
  periode: string
  siswaAktif: number
  guruAktif: number
  kelasAktif: number
  tingkatKehadiran: number
  rataRataNilai: number
  tugasDiserahkan: number
  totalTugas: number
}

const ReportsManagement: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-semester-1')

  // Mock report data
  const reportData: ReportData = {
    periode: 'Semester 1, 2024/2025',
    siswaAktif: 847,
    guruAktif: 45,
    kelasAktif: 24,
    tingkatKehadiran: 94.2,
    rataRataNilai: 82.5,
    tugasDiserahkan: 2134,
    totalTugas: 2450
  }

  const monthlyAttendance = [
    { month: 'Jan', attendance: 95.2 },
    { month: 'Feb', attendance: 93.8 },
    { month: 'Mar', attendance: 94.5 },
    { month: 'Apr', attendance: 92.1 },
    { month: 'May', attendance: 94.8 },
    { month: 'Jun', attendance: 96.3 }
  ]

  const gradeDistribution = [
    { grade: 'A', count: 234, percentage: 27.6 },
    { grade: 'B', count: 312, percentage: 36.8 },
    { grade: 'C', count: 203, percentage: 24.0 },
    { grade: 'D', count: 76, percentage: 9.0 },
    { grade: 'E', count: 22, percentage: 2.6 }
  ]

  const periodOptions = [
    { value: '2024-semester-1', label: 'Semester 1, 2024/2025' },
    { value: '2023-semester-2', label: 'Semester 2, 2023/2024' },
    { value: '2023-semester-1', label: 'Semester 1, 2023/2024' }
  ]

  const handleExportReport = () => {
    alert('Laporan akan diunduh sebagai PDF')
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return COLORS.success
      case 'B': return '#10b981'
      case 'C': return COLORS.accent
      case 'D': return COLORS.warning
      case 'E': return COLORS.error
      default: return '#6b7280'
    }
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        background: COLORS.white,
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1e293b',
              margin: '0 0 8px 0'
            }}>
              Laporan Akademik
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              margin: 0
            }}>
              Analisis data dan statistik sekolah
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                background: 'white'
              }}
            >
              {periodOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            
            <button
              onClick={handleExportReport}
              style={{
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
              }}
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}
      >
        <div style={{
          background: COLORS.white,
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{
              background: '#dbeafe',
              padding: '12px',
              borderRadius: '12px'
            }}>
              <Users size={24} color={COLORS.primary} />
            </div>
            <TrendingUp size={20} color={COLORS.success} />
          </div>
          <h3 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: COLORS.primary,
            margin: '0 0 4px 0'
          }}>
            {reportData.siswaAktif.toLocaleString()}
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: 0
          }}>
            Total Siswa Aktif
          </p>
        </div>

        <div style={{
          background: COLORS.white,
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{
              background: '#fef3c7',
              padding: '12px',
              borderRadius: '12px'
            }}>
              <GraduationCap size={24} color={COLORS.accent} />
            </div>
            <TrendingUp size={20} color={COLORS.success} />
          </div>
          <h3 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: COLORS.primary,
            margin: '0 0 4px 0'
          }}>
            {reportData.guruAktif}
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: 0
          }}>
            Total Guru Aktif
          </p>
        </div>

        <div style={{
          background: COLORS.white,
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{
              background: '#dcfce7',
              padding: '12px',
              borderRadius: '12px'
            }}>
              <School size={24} color={COLORS.success} />
            </div>
            <TrendingUp size={20} color={COLORS.success} />
          </div>
          <h3 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: COLORS.primary,
            margin: '0 0 4px 0'
          }}>
            {reportData.kelasAktif}
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: 0
          }}>
            Total Kelas Aktif
          </p>
        </div>

        <div style={{
          background: COLORS.white,
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{
              background: '#f3e8ff',
              padding: '12px',
              borderRadius: '12px'
            }}>
              <BarChart3 size={24} color="#7c3aed" />
            </div>
            <TrendingDown size={20} color={COLORS.warning} />
          </div>
          <h3 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: COLORS.primary,
            margin: '0 0 4px 0'
          }}>
            {reportData.tingkatKehadiran}%
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: 0
          }}>
            Tingkat Kehadiran
          </p>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Monthly Attendance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: COLORS.white,
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: COLORS.primary,
              margin: 0
            }}>
              Tingkat Kehadiran Bulanan
            </h3>
            <Calendar size={20} color="#6b7280" />
          </div>
          
          <div style={{ height: '200px', display: 'flex', alignItems: 'end', gap: '16px', padding: '0 8px' }}>
            {monthlyAttendance.map((item, index) => (
              <div key={item.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: '100%',
                  height: `${(item.attendance / 100) * 150}px`,
                  background: index === monthlyAttendance.length - 1 ? COLORS.primary : '#e0e7ff',
                  borderRadius: '8px 8px 4px 4px',
                  marginBottom: '8px',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#374151',
                    whiteSpace: 'nowrap'
                  }}>
                    {item.attendance}%
                  </div>
                </div>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Grade Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: COLORS.white,
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: COLORS.primary,
              margin: 0
            }}>
              Distribusi Nilai
            </h3>
            <BarChart3 size={20} color="#6b7280" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {gradeDistribution.map((item) => (
              <div key={item.grade} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: getGradeColor(item.grade),
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {item.grade}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '4px'
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                      Grade {item.grade}
                    </span>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      {item.count} siswa ({item.percentage}%)
                    </span>
                  </div>
                  
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: '#f3f4f6',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${item.percentage}%`,
                      height: '100%',
                      background: getGradeColor(item.grade),
                      borderRadius: '4px',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Academic Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{
          background: COLORS.white,
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f3f4f6'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: COLORS.primary,
            margin: 0
          }}>
            Performa Akademik
          </h3>
          <FileText size={20} color="#6b7280" />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            background: '#f9fafb',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <h4 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: COLORS.primary,
              margin: '0 0 8px 0'
            }}>
              {reportData.rataRataNilai}
            </h4>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0
            }}>
              Rata-rata Nilai Keseluruhan
            </p>
          </div>

          <div style={{
            background: '#f9fafb',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <h4 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: COLORS.primary,
              margin: '0 0 8px 0'
            }}>
              {reportData.tugasDiserahkan}/{reportData.totalTugas}
            </h4>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0
            }}>
              Tugas Diserahkan
            </p>
          </div>

          <div style={{
            background: '#f9fafb',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            textAlign: 'center'
          }}>
            <h4 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: COLORS.primary,
              margin: '0 0 8px 0'
            }}>
              {Math.round((reportData.tugasDiserahkan / reportData.totalTugas) * 100)}%
            </h4>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0
            }}>
              Tingkat Penyelesaian Tugas
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminDashboard
