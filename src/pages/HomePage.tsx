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
      setUser(JSON.parse(userData))
    }

    // Load today's attendance
    loadTodayAttendance()
    loadAttendanceStats()

    return () => clearInterval(timer)
  }, [])

  const loadTodayAttendance = async () => {
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
          {/* Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: `linear-gradient(45deg, ${COLORS.primary}, ${COLORS.accent})`,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              marginRight: '15px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}>
              <BookOpen size={24} />
            </div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: COLORS.primary,
              margin: 0
            }}>
              School App
            </h1>
          </div>

          {/* User Menu */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <button
              onClick={() => window.location.href = '/profile'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 15px',
                background: `${COLORS.primary}10`,
                borderRadius: '25px',
                border: `1px solid ${COLORS.primary}20`,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = `${COLORS.primary}20`
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = `${COLORS.primary}10`
              }}
            >
              <div style={{
                width: '35px',
                height: '35px',
                background: `linear-gradient(45deg, ${COLORS.primary}, ${COLORS.accent})`,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}>
                {userInfo.name?.charAt(0) || 'U'}
              </div>
              <div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: COLORS.primary
                }}>
                  {userInfo.name}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#666'
                }}>
                  {userInfo.role} - {userInfo.class}
                </div>
              </div>
            </button>
            
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: `1px solid ${COLORS.primary}20`,
                color: COLORS.primary,
                padding: '0.75rem 1.5rem',
                borderRadius: '1rem',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = `${COLORS.primary}10`
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '30px 20px'
      }}>
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: COLORS.white,
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            alignItems: 'center',
            gap: '30px'
          }}
        >
          <div>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: COLORS.primary,
              margin: '0 0 10px 0'
            }}>
              Selamat Datang, {userInfo.name}! 👋
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#666',
              margin: '0 0 20px 0'
            }}>
              {user?.tipe_user === 'siswa' 
                ? 'Semoga hari ini menjadi hari yang produktif untuk belajar dan berkembang.'
                : user?.tipe_user === 'guru'
                ? 'Semoga hari ini menjadi hari yang inspiratif untuk mendidik dan membimbing.'
                : user?.tipe_user === 'orang_tua'
                ? 'Pantau perkembangan dan kehadiran anak Anda dengan mudah.'
                : 'Semoga hari ini menjadi hari yang produktif.'
              }
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              fontSize: '14px',
              color: '#888'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} />
                {formatDate(currentTime)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} />
                {formatTime(currentTime)}
              </div>
            </div>
          </div>
          
          <div style={{
            textAlign: 'center'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '48px',
              fontWeight: 'bold',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
            }}>
              {userInfo.name?.charAt(0) || 'U'}
            </div>
          </div>
        </motion.div>
        
        {/* Today's Attendance Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            background: todayAttendance?.waktu_masuk ? '#10b981' : COLORS.accent,
            color: COLORS.white,
            borderRadius: '20px',
            padding: '25px',
            marginBottom: '30px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <CheckCircle size={28} style={{ marginRight: '12px' }} />
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
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
              <p style={{ margin: '10px 0', fontSize: '16px' }}>
                👨‍👩‍👧‍👦 Anda dapat melakukan absensi untuk anak dari lokasi manapun
              </p>
              <p style={{ margin: '10px 0', fontSize: '16px', opacity: 0.9 }}>
                📱 Gunakan menu Absensi untuk mencatat kehadiran anak Anda
              </p>
            </div>
          ) : todayAttendance ? (
            <div>
              <p style={{ margin: '10px 0', fontSize: '16px' }}>
                ✅ Sudah absen masuk: {formatDateTime(todayAttendance.waktu_masuk)}
              </p>
              {todayAttendance.waktu_pulang && (
                <p style={{ margin: '10px 0', fontSize: '16px' }}>
                  ✅ Sudah absen pulang: {formatDateTime(todayAttendance.waktu_pulang)}
                </p>
              )}
              {!todayAttendance.waktu_pulang && (
                <p style={{ margin: '10px 0', fontSize: '16px', opacity: 0.9 }}>
                  ⏰ Jangan lupa absen pulang nanti
                </p>
              )}
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: '16px' }}>
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
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}
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
              style={{
                background: COLORS.white,
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 5px 20px rgba(0, 0, 0, 0.08)',
                border: `1px solid ${stat.color}20`
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '15px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: `${stat.color}15`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <stat.icon size={24} color={stat.color} />
                </div>
                {stat.percentage && (
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: stat.color,
                    background: `${stat.color}10`,
                    padding: '4px 8px',
                    borderRadius: '6px'
                  }}>
                    {stat.percentage}%
                  </div>
                )}
              </div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: COLORS.primary,
                margin: '0 0 5px 0'
              }}>
                {stat.value}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#666',
                margin: 0
              }}>
                {stat.subtitle}
              </p>
            </div>
          ))
          })()}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            background: COLORS.white,
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}
        >
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: COLORS.primary,
            margin: '0 0 20px 0'
          }}>
            Menu Utama
          </h3>
          
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {(() => {
            let menuItems = []
            
            if (user?.tipe_user === 'orang_tua') {
              menuItems = [
                {
                  title: 'Absensi Anak',
                  subtitle: 'Lakukan absensi untuk anak dari mana saja',
                  icon: Clock,
                  color: COLORS.primary,
                  action: () => window.location.href = '/attendance'
                },
                {
                  title: 'Profil Keluarga',
                  subtitle: 'Kelola informasi keluarga dan anak',
                  icon: Users,
                  color: COLORS.accent,
                  action: () => window.location.href = '/profile'
                },
                {
                  title: 'Riwayat Absensi',
                  subtitle: 'Lihat riwayat kehadiran anak',
                  icon: Calendar,
                  color: COLORS.primary,
                  action: () => window.location.href = '/attendance'
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
                  action: () => window.location.href = '/guru/manage-attendance'
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
              style={{
                background: `${action.color}08`,
                border: `2px solid ${action.color}20`,
                borderRadius: '15px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = `${action.color}15`
                e.currentTarget.style.borderColor = `${action.color}40`
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = `${action.color}08`
                e.currentTarget.style.borderColor = `${action.color}20`
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                background: `${action.color}15`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px'
              }}>
                <action.icon size={24} color={action.color} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: COLORS.primary,
                  margin: '0 0 5px 0'
                }}>
                  {action.title}
                </h4>
                <p style={{
                  fontSize: '14px',
                  color: '#666',
                  margin: 0
                }}>
                  {action.subtitle}
                </p>
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
          style={{
            background: COLORS.white,
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}
        >
          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: COLORS.primary,
            margin: '0 0 20px 0'
          }}>
            Aktivitas Terbaru
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}>
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '15px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f9fafb'
                  e.currentTarget.style.borderColor = activity.color + '40'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = '#e5e7eb'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: `${activity.color}15`,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px'
                }}>
                  <activity.icon size={20} color={activity.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: COLORS.primary,
                    margin: '0 0 4px 0'
                  }}>
                    {activity.title}
                  </h4>
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    margin: 0
                  }}>
                    {activity.time}
                  </p>
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