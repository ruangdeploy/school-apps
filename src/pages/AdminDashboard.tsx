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
  EyeOff
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
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'students' | 'teachers' | 'classes' | 'reports'>('overview')
  const [stats] = useState(mockAdminStats)

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
    { id: 'users', label: 'Pengguna', icon: Users },
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

        {activeTab === 'users' && <UserManagement />}

        {activeTab === 'students' && <StudentManagementRedirect />}
        {activeTab === 'teachers' && <TeacherManagementRedirect />}
        {activeTab === 'classes' && <ClassManagementRedirect />}
        {activeTab === 'reports' && <ReportsRedirect />}
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
        window.location.href = '/admin/login'
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
      window.location.href = '/admin/login'
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
      case 'admin': return COLORS.error
      case 'guru': return COLORS.primary
      case 'siswa': return COLORS.success
      case 'orang_tua': return COLORS.warning
      default: return '#6b7280'
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
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: COLORS.primary,
            margin: '0 0 8px 0'
          }}>
            Manajemen Pengguna
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: 0
          }}>
            Kelola semua pengguna sistem sekolah
          </p>
        </div>
        
        <button
          onClick={openCreateModal}
          style={{
            background: COLORS.primary,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
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
            background: COLORS.warning,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          Debug Login
        </button>
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
              gridTemplateColumns: '1fr 200px 120px 150px 100px',
              gap: '16px',
              padding: '20px',
              background: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151'
            }}>
              <div>Nama & Email</div>
              <div>No. Telepon</div>
              <div>Tipe User</div>
              <div>Dibuat</div>
              <div>Aksi</div>
            </div>

            {/* Table Body */}
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 200px 120px 150px 100px',
                  gap: '16px',
                  padding: '20px',
                  borderBottom: '1px solid #e5e7eb',
                  fontSize: '14px',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{
                    fontWeight: '500',
                    color: '#1f2937',
                    marginBottom: '4px'
                  }}>
                    {user.nama_lengkap}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '13px' }}>
                    {user.email}
                  </div>
                </div>
                
                <div style={{ color: '#374151' }}>
                  {user.no_telepon || '-'}
                </div>
                
                <div>
                  <span style={{
                    background: `${getUserTypeColor(user.tipe_user)}15`,
                    color: getUserTypeColor(user.tipe_user),
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {getUserTypeLabel(user.tipe_user)}
                  </span>
                </div>
                
                <div style={{ color: '#6b7280', fontSize: '13px' }}>
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID') : '-'}
                </div>
                
                <div style={{
                  display: 'flex',
                  gap: '8px'
                }}>
                  <button
                    onClick={() => openEditModal(user)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '4px',
                      color: COLORS.primary
                    }}
                    title="Edit pengguna"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(user)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '4px',
                      color: COLORS.error
                    }}
                    title="Hapus pengguna"
                  >
                    <Trash2 size={16} />
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
          gap: '8px',
          marginTop: '20px'
        }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: '8px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              background: 'white',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.5 : 1
            }}
          >
            Sebelumnya
          </button>
          
          <span style={{
            padding: '8px 16px',
            fontSize: '14px',
            color: '#374151'
          }}>
            Halaman {currentPage} dari {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              background: 'white',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              opacity: currentPage === totalPages ? 0.5 : 1
            }}
          >
            Selanjutnya
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

export default AdminDashboard
