import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  BookOpen,
  Award,
  Bell,
  ChevronRight,
  CheckCircle
} from 'lucide-react'

// Color palette constants - same as login page
const COLORS = {
  primary: 'rgb(15, 76, 92)',
  accent: 'rgb(244, 163, 0)',
  white: 'rgb(255, 255, 255)'
}

// Mock user data - in real app this would come from auth store
const mockUser = {
  name: 'John Doe',
  role: 'Siswa',
  class: 'XII IPA 1',
  avatar: null
}

// Mock data for demo
const mockStats = {
  attendance: { present: 85, total: 100 },
  assignments: { completed: 12, total: 15 },
  grades: { average: 87.5, trending: 'up' },
  announcements: 3
}

const HomePage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [user] = useState(mockUser)

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

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

  const quickActions = [
    {
      title: 'Absensi',
      subtitle: 'Catat kehadiran hari ini',
      icon: CheckCircle,
      color: COLORS.primary,
      action: () => window.location.href = '/attendance'
    },
    {
      title: 'Jadwal',
      subtitle: 'Lihat jadwal pelajaran',
      icon: Calendar,
      color: COLORS.accent,
      action: () => window.location.href = '/schedule'
    },
    {
      title: 'Tugas',
      subtitle: 'Kelola tugas dan PR',
      icon: BookOpen,
      color: COLORS.primary,
      action: () => window.location.href = '/assignments'
    },
    {
      title: 'Nilai',
      subtitle: 'Lihat rapor dan nilai',
      icon: Award,
      color: COLORS.accent,
      action: () => window.location.href = '/grades'
    }
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
            <button style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}>
              <Bell size={20} color={COLORS.primary} />
              <div style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                width: '8px',
                height: '8px',
                background: COLORS.accent,
                borderRadius: '50%'
              }}></div>
            </button>

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
                {user.name.charAt(0)}
              </div>
              <div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: COLORS.primary
                }}>
                  {user.name}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#666'
                }}>
                  {user.role} - {user.class}
                </div>
              </div>
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
              Selamat Datang, {user.name}! 👋
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
              {user.name.charAt(0)}
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}
        >
          {[
            {
              title: 'Kehadiran',
              value: `${mockStats.attendance.present}/${mockStats.attendance.total}`,
              subtitle: 'Hari hadir',
              icon: CheckCircle,
              color: COLORS.primary,
              percentage: (mockStats.attendance.present / mockStats.attendance.total) * 100
            },
            {
              title: 'Tugas',
              value: `${mockStats.assignments.completed}/${mockStats.assignments.total}`,
              subtitle: 'Tugas selesai',
              icon: BookOpen,
              color: COLORS.accent,
              percentage: (mockStats.assignments.completed / mockStats.assignments.total) * 100
            },
            {
              title: 'Rata-rata Nilai',
              value: mockStats.grades.average.toString(),
              subtitle: 'Nilai keseluruhan',
              icon: Award,
              color: COLORS.primary,
              percentage: mockStats.grades.average
            },
            {
              title: 'Pengumuman',
              value: mockStats.announcements.toString(),
              subtitle: 'Belum dibaca',
              icon: Bell,
              color: COLORS.accent,
              percentage: null
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
                    color: stat.percentage > 80 ? '#10b981' : stat.percentage > 60 ? COLORS.accent : '#ef4444',
                    fontWeight: '600'
                  }}>
                    {stat.percentage.toFixed(0)}%
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
            Aksi Cepat
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '15px'
          }}>
            {quickActions.map((action, index) => (
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
                  textAlign: 'left'
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px'
                }}>
                  <div style={{
                    width: '45px',
                    height: '45px',
                    background: action.color,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <action.icon size={22} color="white" />
                  </div>
                  <ChevronRight size={20} color={action.color} />
                </div>
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
                title: 'Tugas Matematika dikumpulkan',
                time: '2 jam yang lalu',
                icon: CheckCircle,
                color: '#10b981'
              },
              {
                title: 'Absensi hari ini tercatat',
                time: '3 jam yang lalu',
                icon: Clock,
                color: COLORS.primary
              },
              {
                title: 'Nilai UTS Fisika diumumkan',
                time: '1 hari yang lalu',
                icon: Award,
                color: COLORS.accent
              },
              {
                title: 'Pengumuman libur nasional',
                time: '2 hari yang lalu',
                icon: Bell,
                color: '#6366f1'
              }
            ].map((activity, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '15px',
                  background: '#f9fafb',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: `${activity.color}15`,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <activity.icon size={20} color={activity.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: COLORS.primary,
                    margin: '0 0 5px 0'
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
