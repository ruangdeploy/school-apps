import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  BookOpen,
  Award,
  Bell,
  ChevronRight,
  CheckCircle,
  X,
  Users,
  MapPin,
  Eye,
  CalendarDays
} from 'lucide-react'

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
  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null)

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
      const token = localStorage.getItem('accessToken')
      if (!token) return

      const response = await fetch('http://localhost:3000/api/absensi/hari-ini', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setTodayAttendance(result.data)
        }
      }
    } catch (error) {
      console.error('Error loading today attendance:', error)
    }
  }

  const loadAttendanceStats = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) return

      // Get current month stats
      const now = new Date()
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

      const response = await fetch(`http://localhost:3000/api/absensi/riwayat?tanggal_awal=${firstDay.toISOString().split('T')[0]}&tanggal_akhir=${lastDay.toISOString().split('T')[0]}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          const attendance = result.data
          const totalDays = attendance.length
          const hadir = attendance.filter((a: any) => a.status_kehadiran === 'hadir').length
          const terlambat = attendance.filter((a: any) => a.status_kehadiran === 'terlambat').length
          const alpha = totalDays - hadir - terlambat

          setStats({
            totalHadir: hadir,
            totalTerlambat: terlambat,
            totalAlpha: alpha,
            persentaseKehadiran: totalDays > 0 ? Math.round((hadir / totalDays) * 100) : 0
          })
        }
      }
    } catch (error) {
      console.error('Error loading attendance stats:', error)
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
                {user?.nama_lengkap?.charAt(0) || 'U'}
              </div>
              <div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: COLORS.primary
                }}>
                  {user?.nama_lengkap || 'User'}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#666'
                }}>
                  {user?.tipe_user || 'Siswa'} - {user?.siswa?.nama_kelas || '-'}
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
              Selamat Datang, {user?.nama_lengkap || 'User'}! 👋
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#666',
              margin: '0 0 20px 0'
            }}>
              Semoga hari ini menjadi hari yang produktif untuk belajar dan berkembang.
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
              {user?.nama_lengkap?.charAt(0) || 'U'}
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
              Status Absensi Hari Ini
            </h3>
          </div>
          
          {todayAttendance ? (
            <div>
              <p style={{ margin: '10px 0', fontSize: '16px' }}>
                ✅ Sudah absen masuk: {new Date(todayAttendance.waktu_masuk).toLocaleTimeString('id-ID', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              {todayAttendance.waktu_pulang && (
                <p style={{ margin: '10px 0', fontSize: '16px' }}>
                  ✅ Sudah absen pulang: {new Date(todayAttendance.waktu_pulang).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
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
              ⏰ Belum melakukan absensi hari ini
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
          {[
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
          ].map((stat, index) => (
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
          ))}
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
          {[
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
          ].map((action, index) => (
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
          ))}
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
            {[
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
            ].map((activity, index) => (
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
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default HomePage