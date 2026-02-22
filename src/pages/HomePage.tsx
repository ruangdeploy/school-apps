import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  BookOpen,
  Award,
  ChevronRight,
  CheckCircle,
  Users
} from 'lucide-react'
import { absensiAPI } from '../services/api'

// Color palette constants - same as login page
const COLORS = {
  primary: 'rgb(15, 76, 92)',
  accent: 'rgb(244, 163, 0)',
  white: 'rgb(255, 255, 255)'
}

const HomePage: React.FC = () => {
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('userData')
    return userData ? JSON.parse(userData) : null
  })
  const [currentTime, setCurrentTime] = useState(new Date())
  const [todayAttendance, setTodayAttendance] = useState<any>(null)
  const [stats, setStats] = useState({
    totalHadir: 0,
    totalTerlambat: 0,
    totalAlpha: 0,
    persentaseKehadiran: 0
  })

  // Helper function to get user display info based on user type
  const getUserDisplayInfo = () => {
    if (!user) return { name: 'User', role: 'Pengguna', class: '-' }
    
    switch (user.tipe_user) {
      case 'siswa':
        return {
          name: user.nama_lengkap,
          role: 'Siswa',
          class: user.siswa?.nama_kelas || '-',
          additional: user.siswa?.jenjang || ''
        }
      case 'guru':
        return {
          name: user.nama_lengkap,
          role: 'Guru',
          class: user.guru?.mata_pelajaran || 'Staff',
          additional: user.guru?.jabatan || ''
        }
      case 'orang_tua':
        const primaryChild = user.anak?.find((child: any) => child.is_primary) || user.anak?.[0]
        return {
          name: user.nama_lengkap,
          role: 'Orang Tua',
          class: primaryChild ? `Anak: ${primaryChild.nama_lengkap}` : '-',
          additional: primaryChild ? `Kelas ${primaryChild.nama_kelas}` : ''
        }
      default:
        return {
          name: user.nama_lengkap || 'User',
          role: user.tipe_user || 'Pengguna',
          class: '-',
          additional: ''
        }
    }
  }

  const userInfo = getUserDisplayInfo()

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Load user data from localStorage
    const userData = localStorage.getItem('userData')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      
      // Only load attendance data for non-parent users
      if (parsedUser.tipe_user !== 'orang_tua') {
        loadTodayAttendance()
        loadAttendanceStats()
      } else {
        console.log('ℹ️ Parent user detected, skipping attendance API calls')
      }
    }

    return () => clearInterval(timer)
  }, [])

  const loadTodayAttendance = async () => {
    // Skip API call for parents as they don't have personal attendance
    if (user?.tipe_user === 'orang_tua') {
      console.log('ℹ️ Skipping attendance load for parent user')
      setTodayAttendance(null)
      return
    }

    try {
      console.log('🔄 Loading today\'s attendance...')
      const response = await absensiAPI.getTodayAttendance()
      
      if (response.success && response.data) {
        console.log('✅ Today attendance loaded successfully:', response.data)
        setTodayAttendance(response.data)
      } else {
        console.log('⚠️ No attendance data for today:', response.message)
        setTodayAttendance(null)
      }
    } catch (error) {
      console.error('❌ Error loading today attendance:', error)
      setTodayAttendance(null)
    }
  }

  const loadAttendanceStats = async () => {
    // Skip API call for parents as they don't have personal attendance stats
    if (user?.tipe_user === 'orang_tua') {
      console.log('ℹ️ Skipping attendance stats for parent user')
      setStats({
        totalHadir: 0,
        totalTerlambat: 0,
        totalAlpha: 0,
        persentaseKehadiran: 0
      })
      return
    }

    try {
      console.log('🔄 Loading attendance statistics...')
      
      // Get current month stats
      const now = new Date()
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

      const response = await absensiAPI.getAttendanceHistory(
        firstDay.toISOString().split('T')[0],
        lastDay.toISOString().split('T')[0]
      )
      
      if (response.success && response.data) {
        console.log('✅ Attendance history loaded successfully:', response.data)
        
        // Calculate stats from attendance history
        let totalHadir = 0
        let totalTerlambat = 0
        let totalAlpha = 0
        
        if (Array.isArray(response.data)) {
          response.data.forEach((record: any) => {
            if (record.status_kehadiran === 'hadir') {
              totalHadir++
              if (record.terlambat || (record.waktu_masuk && record.waktu_masuk > '07:30:00')) {
                totalTerlambat++
              }
            } else if (record.status_kehadiran === 'alpha' || !record.waktu_masuk) {
              totalAlpha++
            }
          })
        }
        
        const totalDays = totalHadir + totalAlpha
        const persentaseKehadiran = totalDays > 0 ? Math.round((totalHadir / totalDays) * 100) : 0
        
        const calculatedStats = {
          totalHadir,
          totalTerlambat,
          totalAlpha,
          persentaseKehadiran
        }
        
        console.log('📊 Calculated stats:', calculatedStats)
        setStats(calculatedStats)
      } else {
        console.log('⚠️ No attendance history data:', response.message)
        setStats({
          totalHadir: 0,
          totalTerlambat: 0,
          totalAlpha: 0,
          persentaseKehadiran: 0
        })
      }
    } catch (error) {
      console.error('❌ Error loading attendance stats:', error)
      setStats({
        totalHadir: 0,
        totalTerlambat: 0,
        totalAlpha: 0,
        persentaseKehadiran: 0
      })
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = '/login'
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Helper function to safely format datetime from backend
  const formatDateTime = (dateTimeString: any) => {
    if (!dateTimeString) return 'Belum tercatat'
    
    try {
      console.log('Formatting datetime:', dateTimeString, 'Type:', typeof dateTimeString)
      
      // Handle different date formats from backend
      let date: Date
      
      // If it's already a Date object
      if (dateTimeString instanceof Date) {
        date = dateTimeString
      }
      // If it's a timestamp number
      else if (typeof dateTimeString === 'number') {
        date = new Date(dateTimeString)
      }
      // If it's a string
      else if (typeof dateTimeString === 'string') {
        if (dateTimeString.includes('T')) {
          // ISO format: 2026-01-26T07:30:00.000Z
          date = new Date(dateTimeString)
        } else if (dateTimeString.includes('-') && dateTimeString.includes(':')) {
          // MySQL datetime format: 2026-01-26 07:30:00
          date = new Date(dateTimeString.replace(' ', 'T'))
        } else if (dateTimeString.match(/^\d{4}-\d{2}-\d{2}$/)) {
          // Date only format: 2026-01-26
          date = new Date(dateTimeString + 'T00:00:00')
        } else {
          // Try parsing as is
          date = new Date(dateTimeString)
        }
      } else {
        // Unknown format
        console.warn('Unknown date format:', dateTimeString, typeof dateTimeString)
        return 'Format tidak dikenal'
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date created from:', dateTimeString)
        return 'Format tanggal tidak valid'
      }
      
      return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      console.error('Error formatting date:', error, 'Input:', dateTimeString)
      return 'Error format tanggal'
    }
  }

  return (
    <div className="home-bg">
      {/* Header */}
      <div className="home-header">
        <div className="home-header-inner">
          {/* Logo */}
          <div className="home-logo-wrap">
            <div className="home-logo">
              <BookOpen size={24} />
            </div>
            <h1 className="home-title">
              School App
            </h1>
          </div>

          {/* User Menu */}
          <div className="home-header-menu">
            <button
              onClick={() => window.location.href = '/profile'}
              className="home-header-profile-btn"
            >
              <div className="home-header-profile-avatar">
                {userInfo.name?.charAt(0) || 'U'}
              </div>
              <div>
                <div className="home-header-profile-name">{userInfo.name}</div>
                <div className="home-header-profile-role">{userInfo.role} - {userInfo.class}</div>
              </div>
            </button>
            
            <button
              onClick={handleLogout}
              className="home-header-logout-btn"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="home-main">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="home-welcome-card"
        >
          <div>
            <h2 className="home-welcome-title">
              Selamat Datang, {userInfo.name}! 👋
            </h2>
            <p className="home-welcome-desc">
              {user?.tipe_user === 'siswa' 
                ? 'Semoga hari ini menjadi hari yang produktif untuk belajar dan berkembang.'
                : user?.tipe_user === 'guru'
                ? 'Semoga hari ini menjadi hari yang inspiratif untuk mendidik dan membimbing.'
                : user?.tipe_user === 'orang_tua'
                ? 'Pantau perkembangan dan kehadiran anak Anda dengan mudah.'
                : 'Semoga hari ini menjadi hari yang produktif.'
              }
            </p>
            <div className="home-welcome-meta">
              <div className="home-welcome-meta-item">
                <Calendar size={16} />
                {formatDate(currentTime)}
              </div>
              <div className="home-welcome-meta-item">
                <Clock size={16} />
                {formatTime(currentTime)}
              </div>
            </div>
          </div>
          
          <div className="home-welcome-avatar-wrap">
            <div className="home-welcome-avatar">
              {userInfo.name?.charAt(0) || 'U'}
            </div>
          </div>
        </motion.div>
        
        {/* Today's Attendance Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`home-attendance-card${todayAttendance?.waktu_masuk ? ' home-attendance-success' : ' home-attendance-warning'}`}
        >
          <div className="home-attendance-header">
            <CheckCircle size={28} className="home-attendance-header-icon" />
            <h3 className="home-attendance-title">
              {user?.tipe_user === 'siswa' 
                ? 'Status Absensi Hari Ini'
                : user?.tipe_user === 'guru'
                ? 'Status Kehadiran Hari Ini'
                : user?.tipe_user === 'orang_tua'
                ? `Status Absensi ${userInfo.additional}`
                : 'Status Absensi Hari Ini'
              }
            </h3>
          </div>
          
          {user?.tipe_user === 'orang_tua' ? (
            <div>
              <p className="home-attendance-desc">
                👨‍👩‍👧‍👦 Anda dapat melakukan absensi untuk anak dari lokasi manapun
              </p>
              <p className="home-attendance-desc home-attendance-desc-secondary">
                📱 Gunakan menu Absensi untuk mencatat kehadiran anak Anda
              </p>
            </div>
          ) : todayAttendance ? (
            <div>
              <p className="home-attendance-desc">
                ✅ Sudah absen masuk: {formatDateTime(todayAttendance.waktu_masuk)}
              </p>
              {todayAttendance.waktu_pulang && (
                <p className="home-attendance-desc">
                  ✅ Sudah absen pulang: {formatDateTime(todayAttendance.waktu_pulang)}
                </p>
              )}
              {!todayAttendance.waktu_pulang && (
                <p className="home-attendance-desc home-attendance-desc-secondary">
                  ⏰ Jangan lupa absen pulang nanti
                </p>
              )}
            </div>
          ) : (
            <p className="home-attendance-desc home-attendance-desc-empty">
              {user?.tipe_user === 'guru'
                ? '⏰ Belum melakukan absensi hari ini'
                : '⏰ Belum melakukan absensi hari ini'
              }
            </p>
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="home-stats-grid"
        >
          {(() => {
            let statsData = []
            
            if (user?.tipe_user === 'orang_tua') {
              statsData = [
                {
                  title: 'Anak Terdaftar',
                  value: `${user.anak?.length || 0} Anak`,
                  subtitle: 'Total anak yang terdaftar',
                  icon: Users,
                  color: '#10b981',
                  percentage: null
                },
                {
                  title: 'Anak Utama',
                  value: user.anak?.find((child: any) => child.is_primary)?.nama_lengkap || '-',
                  subtitle: `Kelas: ${user.anak?.find((child: any) => child.is_primary)?.nama_kelas || '-'}`,
                  icon: BookOpen,
                  color: COLORS.accent,
                  percentage: null
                },
                {
                  title: 'Hubungan',
                  value: (user.anak?.find((child: any) => child.is_primary)?.hubungan || '-').charAt(0).toUpperCase() + (user.anak?.find((child: any) => child.is_primary)?.hubungan || '-').slice(1),
                  subtitle: 'Dengan anak utama',
                  icon: Award,
                  color: COLORS.primary,
                  percentage: null
                }
              ]
            } else if (user?.tipe_user === 'guru') {
              statsData = [
                {
                  title: 'Siswa Dikelola',
                  value: '0 Siswa',
                  subtitle: 'Total siswa yang diajar',
                  icon: Users,
                  color: '#10b981',
                  percentage: null
                },
                {
                  title: 'Mata Pelajaran',
                  value: user.guru?.mata_pelajaran || 'Staff',
                  subtitle: 'Bidang mengajar',
                  icon: BookOpen,
                  color: COLORS.accent,
                  percentage: null
                },
                {
                  title: 'Status Guru',
                  value: user.guru?.jabatan || 'Guru',
                  subtitle: 'Posisi di sekolah',
                  icon: Award,
                  color: COLORS.primary,
                  percentage: null
                }
              ]
            } else {
              statsData = [
                {
                  title: 'Kehadiran Bulan Ini',
                  value: `${stats.totalHadir} hari`,
                  subtitle: `Dari ${stats.totalHadir + stats.totalTerlambat + stats.totalAlpha} hari`,
                  icon: CheckCircle,
                  color: '#10b981',
                  percentage: stats.persentaseKehadiran
                },
                {
                  title: 'Keterlambatan',
                  value: `${stats.totalTerlambat} kali`,
                  subtitle: 'Bulan ini',
                  icon: Clock,
                  color: COLORS.accent,
                  percentage: null
                },
                {
                  title: 'Persentase Hadir',
                  value: `${stats.persentaseKehadiran}%`,
                  subtitle: 'Tingkat kehadiran',
                  icon: Award,
                  color: COLORS.primary,
                  percentage: stats.persentaseKehadiran
                }
              ]
            }
            
            return statsData.map((stat, index) => (
            <div
              key={index}
              className="home-stat-card"
              data-color={stat.color}
            >
              <div className="home-stat-card-header">
                <div className="home-stat-card-icon" data-color={stat.color}>
                  <stat.icon size={24} color={stat.color} />
                </div>
                {stat.percentage && (
                  <div className="home-stat-card-percentage" data-color={stat.color}>
                    {stat.percentage}%
                  </div>
                )}
              </div>
              <h3 className="home-stat-value">{stat.value}</h3>
              <p className="home-stat-subtitle">{stat.subtitle}</p>
            </div>
          ))
          })()}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="home-menu-card"
        >
          <h3 className="home-menu-title">Menu Utama</h3>
        <div className="home-menu-grid">
          {(() => {
            let menuItems = []
            
            if (user?.tipe_user === 'orang_tua') {
              menuItems = [
                {
                  title: 'Absensi Anak',
                  subtitle: 'Lakukan absensi untuk anak dari mana saja',
                  icon: Clock,
                  color: COLORS.primary,
                  action: () => window.location.href = '/orang-tua/attendance'
                },
                {
                  title: 'Profil Keluarga',
                  subtitle: 'Kelola informasi keluarga dan anak',
                  icon: Users,
                  color: COLORS.accent,
                  action: () => window.location.href = '/profile'
                },
                {
                  title: 'Jadwal',
                  subtitle: 'Lihat jadwal pelajaran anak',
                  icon: Calendar,
                  color: COLORS.primary,
                  action: () => window.location.href = '/schedule'
                },
                {
                  title: 'Jadwal Ujian',
                  subtitle: 'Lihat jadwal ujian anak',
                  icon: Calendar,
                  color: COLORS.accent,
                  action: () => window.location.href = '/exam-schedule'
                },
                {
                  title: 'Riwayat Absensi',
                  subtitle: 'Lihat riwayat kehadiran anak',
                  icon: Calendar,
                  color: COLORS.primary,
                  action: () => window.location.href = '/orang-tua/attendance'
                },
                {
                  title: 'Komunikasi',
                  subtitle: 'Hubungi guru dan sekolah',
                  icon: BookOpen,
                  color: COLORS.accent,
                  action: () => window.location.href = '/assignments'
                }
              ]
            } else if (user?.tipe_user === 'guru') {
              menuItems = [
                {
                  title: 'Kelola Absensi Siswa',
                  subtitle: 'Update dan kelola kehadiran siswa',
                  icon: Clock,
                  color: COLORS.primary,
                  action: () => window.location.href = '/guru/attendance'
                },
                {
                  title: 'Absensi Pribadi',
                  subtitle: 'Catat kehadiran Anda sebagai guru',
                  icon: Users,
                  color: COLORS.accent,
                  action: () => window.location.href = '/attendance'
                },
                {
                  title: 'Jadwal Mengajar',
                  subtitle: 'Lihat jadwal dan kelas',
                  icon: Calendar,
                  color: COLORS.primary,
                  action: () => window.location.href = '/schedule'
                },
                {
                  title: 'Jadwal Ujian',
                  subtitle: 'Lihat jadwal ujian',
                  icon: Calendar,
                  color: COLORS.accent,
                  action: () => window.location.href = '/exam-schedule'
                },
                {
                  title: 'Tugas & Penilaian',
                  subtitle: 'Kelola tugas dan nilai siswa',
                  icon: BookOpen,
                  color: COLORS.accent,
                  action: () => window.location.href = '/assignments'
                }
              ]
            } else {
              // Siswa
              menuItems = [
                {
                  title: 'Absensi',
                  subtitle: 'Catat kehadiran hari ini',
                  icon: Clock,
                  color: COLORS.primary,
                  action: () => window.location.href = '/attendance'
                },
                {
                  title: 'Profil',
                  subtitle: 'Lihat dan edit informasi profil',
                  icon: Users,
                  color: COLORS.accent,
                  action: () => window.location.href = '/profile'
                },
                {
                  title: 'Jadwal',
                  subtitle: 'Lihat jadwal pelajaran',
                  icon: Calendar,
                  color: COLORS.primary,
                  action: () => window.location.href = '/schedule'
                },
                {
                  title: 'Jadwal Ujian',
                  subtitle: 'Lihat jadwal ujian',
                  icon: Calendar,
                  color: COLORS.accent,
                  action: () => window.location.href = '/exam-schedule'
                },
                {
                  title: 'Tugas',
                  subtitle: 'Kelola tugas dan PR',
                  icon: BookOpen,
                  color: COLORS.accent,
                  action: () => window.location.href = '/assignments'
                }
              ]
            }
            
            return menuItems.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="home-menu-btn"
              data-color={action.color}
            >
              <div className="home-menu-icon" data-color={action.color}>
                <action.icon size={24} color={action.color} />
              </div>
              <div className="home-menu-content">
                <h4 className="home-menu-action-title">{action.title}</h4>
                <p className="home-menu-action-subtitle">{action.subtitle}</p>
              </div>
              <ChevronRight size={20} color={action.color} />
            </button>
          ))
          })()}
        </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="home-activity-card"
        >
          <h3 className="home-activity-title">Aktivitas Terbaru</h3>
          <div className="home-activity-list">
            {(() => {
              let activities = []
              
              if (user?.tipe_user === 'orang_tua') {
                const primaryChild = user.anak?.find((child: any) => child.is_primary) || user.anak?.[0]
                activities = [
                  {
                    title: `Absensi ${primaryChild?.nama_lengkap || 'anak'}`,
                    time: todayAttendance ? 'Hari ini' : 'Belum melakukan',
                    icon: CheckCircle,
                    color: todayAttendance ? '#10b981' : '#ef4444'
                  },
                  {
                    title: `Total anak: ${user.anak?.length || 0} orang`,
                    time: 'Informasi keluarga',
                    icon: Users,
                    color: COLORS.accent
                  },
                  {
                    title: `Kelas ${primaryChild?.nama_kelas || '-'}`,
                    time: primaryChild?.nama_lengkap || 'Anak utama',
                    icon: BookOpen,
                    color: COLORS.primary
                  },
                  {
                    title: `Status: ${primaryChild?.status_siswa || 'Aktif'}`,
                    time: 'Status pendidikan anak',
                    icon: Award,
                    color: '#6366f1'
                  }
                ]
              } else if (user?.tipe_user === 'guru') {
                activities = [
                  {
                    title: 'Absensi guru hari ini',
                    time: todayAttendance ? 'Sudah tercatat' : 'Belum melakukan',
                    icon: CheckCircle,
                    color: todayAttendance ? '#10b981' : '#ef4444'
                  },
                  {
                    title: `Mata pelajaran: ${user.guru?.mata_pelajaran || 'Staff'}`,
                    time: 'Bidang mengajar',
                    icon: BookOpen,
                    color: COLORS.accent
                  },
                  {
                    title: `Jabatan: ${user.guru?.jabatan || 'Guru'}`,
                    time: 'Posisi di sekolah',
                    icon: Award,
                    color: COLORS.primary
                  },
                  {
                    title: 'Kelola siswa',
                    time: 'Akses data kehadiran siswa',
                    icon: Users,
                    color: '#6366f1'
                  }
                ]
              } else {
                // Siswa
                activities = [
                  {
                    title: 'Absensi hari ini tercatat',
                    time: todayAttendance ? 'Hari ini' : 'Belum melakukan',
                    icon: CheckCircle,
                    color: todayAttendance ? '#10b981' : '#ef4444'
                  },
                  {
                    title: `Persentase kehadiran: ${stats.persentaseKehadiran}%`,
                    time: 'Bulan ini',
                    icon: Award,
                    color: COLORS.accent
                  },
                  {
                    title: `Total kehadiran: ${stats.totalHadir} hari`,
                    time: 'Bulan ini',
                    icon: Clock,
                    color: COLORS.primary
                  },
                  {
                    title: user?.siswa ? `Kelas: ${user.siswa.nama_kelas}` : 'Profil lengkap',
                    time: 'Info pengguna',
                    icon: Users,
                    color: '#6366f1'
                  }
                ]
              }
              
              return activities.map((activity, index) => (
              <div
                key={index}
                className="home-activity-item"
                data-color={activity.color}
              >
                <div className="home-activity-icon" data-color={activity.color}>
                  <activity.icon size={20} color={activity.color} />
                </div>
                <div className="home-activity-content">
                  <h4 className="home-activity-item-title">{activity.title}</h4>
                  <p className="home-activity-item-time">{activity.time}</p>
                </div>
              </div>
            ))
            })()}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default HomePage