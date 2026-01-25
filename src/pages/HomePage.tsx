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

// Mock user data - in real app this would come from auth store
const mockUser = {
  name: 'John Doe',
  role: 'Siswa',
  class: 'XII IPA 1',
  avatar: null
}

// Mock data for demo
const mockStats = {
  attendance: { 
    present: 85, 
    total: 100,
    todayCheckIn: true,
    todayCheckOut: false,
    checkInTime: '07:45',
    checkOutTime: null
  },
  assignments: { completed: 12, total: 15 },
  grades: { average: 87.5, trending: 'up' },
  announcements: 3
}

// Mock calendar data
const mockCalendarData = {
  currentMonth: 'Januari 2026',
  selectedDate: null,
  events: {
    '2026-01-25': [
      { time: '07:00-08:30', subject: 'Matematika', teacher: 'Bu Sarah', room: 'Kelas XII-A', type: 'lesson' },
      { time: '08:30-10:00', subject: 'Fisika', teacher: 'Pak Ahmad', room: 'Lab Fisika', type: 'lesson' },
      { time: '10:15-11:45', subject: 'Bahasa Indonesia', teacher: 'Bu Sari', room: 'Kelas XII-A', type: 'lesson' }
    ],
    '2026-01-26': [
      { time: '07:00-08:30', subject: 'Kimia', teacher: 'Bu Indira', room: 'Lab Kimia', type: 'lesson' },
      { time: '08:30-10:00', subject: 'Sejarah', teacher: 'Pak Budi', room: 'Kelas XII-A', type: 'lesson' }
    ],
    '2026-01-27': [
      { time: '07:00-08:30', subject: 'Ulangan Matematika', teacher: 'Bu Sarah', room: 'Kelas XII-A', type: 'exam' },
      { time: '10:15-11:45', subject: 'Presentasi Kelompok', teacher: 'Bu Sari', room: 'Kelas XII-A', type: 'presentation' }
    ]
  }
}

// Mock upcoming classes
const mockUpcomingClasses = [
  {
    id: 1,
    subject: 'Matematika',
    teacher: 'Bu Sarah',
    time: '07:00 - 08:30',
    room: 'Kelas XII-A',
    date: '2026-01-25',
    isNext: true
  },
  {
    id: 2,
    subject: 'Fisika',
    teacher: 'Pak Ahmad', 
    time: '08:30 - 10:00',
    room: 'Lab Fisika',
    date: '2026-01-25',
    isNext: false
  },
  {
    id: 3,
    subject: 'Bahasa Indonesia',
    teacher: 'Bu Sari',
    time: '10:15 - 11:45', 
    room: 'Kelas XII-A',
    date: '2026-01-25',
    isNext: false
  }
]

// Mock announcements
const mockAnnouncements = [
  {
    id: 1,
    title: 'Libur Nasional - Hari Raya Nyepi',
    content: 'Sekolah akan libur pada tanggal 29 Maret 2026 dalam rangka memperingati Hari Raya Nyepi. Kegiatan belajar mengajar akan dilanjutkan pada hari Senin, 30 Maret 2026.',
    date: '2026-01-24',
    time: '10:30',
    author: 'Kepala Sekolah',
    isRead: false,
    priority: 'high'
  },
  {
    id: 2,
    title: 'Pendaftaran Ekstrakurikuler Semester 2',
    content: 'Dibuka pendaftaran ekstrakurikuler untuk semester 2. Tersedia berbagai pilihan seperti Robotika, PMR, Pramuka, dan lainnya. Pendaftaran ditutup tanggal 1 Februari 2026.',
    date: '2026-01-23',
    time: '14:15',
    author: 'Wakil Kepala Sekolah',
    isRead: false,
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Perbaikan Sistem IT Sekolah',
    content: 'Akan dilakukan maintenance sistem IT sekolah pada hari Sabtu, 27 Januari 2026 pukul 08:00-12:00. Selama periode ini, akses ke portal siswa mungkin akan terganggu.',
    date: '2026-01-22',
    time: '16:45',
    author: 'Tim IT',
    isRead: true,
    priority: 'low'
  }
]

const HomePage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [user] = useState(mockUser)
  const [showCalendarModal, setShowCalendarModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null)
  const [announcements, setAnnouncements] = useState(mockAnnouncements)
  const [unreadCount, setUnreadCount] = useState(
    mockAnnouncements.filter(ann => !ann.isRead).length
  )

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

  // Handle calendar date selection
  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setShowCalendarModal(true)
  }

  // Handle announcement click
  const handleAnnouncementClick = (announcement: any) => {
    setSelectedAnnouncement(announcement)
    setShowAnnouncementModal(true)
    
    // Mark as read if not already read
    if (!announcement.isRead) {
      setAnnouncements(prev => 
        prev.map(ann => 
          ann.id === announcement.id 
            ? { ...ann, isRead: true }
            : ann
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  // Get events for selected date
  const getEventsForDate = (date: string) => {
    return mockCalendarData.events[date] || []
  }

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const current = new Date(startDate)
    
    for (let i = 0; i < 42; i++) {
      const dateStr = current.toISOString().split('T')[0]
      const isCurrentMonth = current.getMonth() === month
      const isToday = dateStr === today.toISOString().split('T')[0]
      const hasEvents = mockCalendarData.events[dateStr]?.length > 0
      
      days.push({
        date: current.getDate(),
        dateStr,
        isCurrentMonth,
        isToday,
        hasEvents
      })
      
      current.setDate(current.getDate() + 1)
    }
    
    return days
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
            <button 
              onClick={() => setShowAnnouncementModal(true)}
              style={{
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
              }}
            >
              <Bell size={20} color={COLORS.primary} />
              {unreadCount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  width: '18px',
                  height: '18px',
                  background: COLORS.accent,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  {unreadCount}
                </div>
              )}
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
              title: 'Kehadiran Hari Ini',
              value: mockStats.attendance.todayCheckIn && mockStats.attendance.todayCheckOut ? 
                'Lengkap' : mockStats.attendance.todayCheckIn ? 
                'Belum Keluar' : 'Belum Masuk',
              subtitle: mockStats.attendance.todayCheckIn ? 
                `Masuk: ${mockStats.attendance.checkInTime}${mockStats.attendance.todayCheckOut ? 
                  ` | Keluar: ${mockStats.attendance.checkOutTime}` : ''}` : 
                'Lakukan absen masuk',
              icon: CheckCircle,
              color: mockStats.attendance.todayCheckIn && mockStats.attendance.todayCheckOut ? 
                '#10b981' : mockStats.attendance.todayCheckIn ? 
                COLORS.accent : '#ef4444',
              percentage: null
            },
            {
              title: 'Kehadiran Total',
              value: `${mockStats.attendance.present}/${mockStats.attendance.total}`,
              subtitle: 'Hari hadir keseluruhan',
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

        {/* Calendar & Upcoming Classes Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '30px',
          marginBottom: '30px'
        }}>
          {/* Mini Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{
              background: COLORS.white,
              borderRadius: '20px',
              padding: '25px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: COLORS.primary,
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CalendarDays size={20} />
                Calendar
              </h3>
              <button
                onClick={() => setShowCalendarModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: COLORS.accent,
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Lihat Semua
              </button>
            </div>

            {/* Mini Calendar Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '5px',
              marginBottom: '15px'
            }}>
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                <div key={day} style={{
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#666',
                  padding: '8px 4px'
                }}>
                  {day}
                </div>
              ))}
              {generateCalendarDays().slice(0, 21).map((day, index) => (
                <button
                  key={index}
                  onClick={() => day.isCurrentMonth && handleDateSelect(day.dateStr)}
                  style={{
                    border: 'none',
                    background: day.isToday ? 
                      COLORS.primary : 
                      day.hasEvents && day.isCurrentMonth ? 
                      `${COLORS.accent}20` : 
                      'transparent',
                    color: day.isToday ? 
                      'white' : 
                      day.isCurrentMonth ? 
                      COLORS.primary : 
                      '#ccc',
                    borderRadius: '6px',
                    padding: '8px 4px',
                    fontSize: '14px',
                    fontWeight: day.isToday ? '700' : '500',
                    cursor: day.isCurrentMonth ? 'pointer' : 'default',
                    position: 'relative',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    if (day.isCurrentMonth && !day.isToday) {
                      e.currentTarget.style.background = `${COLORS.primary}10`
                    }
                  }}
                  onMouseOut={(e) => {
                    if (day.isCurrentMonth && !day.isToday) {
                      e.currentTarget.style.background = day.hasEvents ? `${COLORS.accent}20` : 'transparent'
                    }
                  }}
                >
                  {day.date}
                  {day.hasEvents && day.isCurrentMonth && (
                    <div style={{
                      position: 'absolute',
                      bottom: '2px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '4px',
                      height: '4px',
                      background: day.isToday ? 'white' : COLORS.accent,
                      borderRadius: '50%'
                    }}></div>
                  )}
                </button>
              ))}
            </div>

            <div style={{
              fontSize: '12px',
              color: '#666',
              textAlign: 'center'
            }}>
              Klik tanggal untuk melihat jadwal pelajaran
            </div>
          </motion.div>

          {/* Upcoming Classes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              background: COLORS.white,
              borderRadius: '20px',
              padding: '25px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}
          >
            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: COLORS.primary,
              margin: '0 0 20px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Clock size={20} />
              Kelas Selanjutnya
            </h3>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {mockUpcomingClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '15px',
                    background: classItem.isNext ? `${COLORS.primary}10` : '#f9fafb',
                    borderRadius: '12px',
                    border: classItem.isNext ? `2px solid ${COLORS.primary}40` : '1px solid #e5e7eb'
                  }}
                >
                  <div style={{
                    width: '45px',
                    height: '45px',
                    background: classItem.isNext ? COLORS.primary : '#9ca3af',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <BookOpen size={20} color="white" />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '5px'
                    }}>
                      <h4 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: COLORS.primary,
                        margin: 0
                      }}>
                        {classItem.subject}
                        {classItem.isNext && (
                          <span style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: COLORS.accent,
                            marginLeft: '8px'
                          }}>
                            • NEXT
                          </span>
                        )}
                      </h4>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: classItem.isNext ? COLORS.primary : '#666'
                      }}>
                        {classItem.time}
                      </span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      fontSize: '14px',
                      color: '#666'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Users size={14} />
                        {classItem.teacher}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <MapPin size={14} />
                        {classItem.room}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

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

      {/* Calendar Modal */}
      {showCalendarModal && (
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
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: COLORS.white,
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: COLORS.primary,
                margin: 0
              }}>
                {selectedDate ? 
                  `Jadwal ${new Date(selectedDate).toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}` : 
                  'Calendar'
                }
              </h3>
              <button
                onClick={() => setShowCalendarModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                <X size={24} />
              </button>
            </div>

            {selectedDate && getEventsForDate(selectedDate).length > 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                {getEventsForDate(selectedDate).map((event, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '15px',
                      background: event.type === 'exam' ? '#fee2e2' : 
                                event.type === 'presentation' ? '#fef3c7' : '#f0f9ff',
                      borderRadius: '12px',
                      border: `1px solid ${
                        event.type === 'exam' ? '#fca5a5' : 
                        event.type === 'presentation' ? '#fcd34d' : '#93c5fd'
                      }`
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '8px'
                    }}>
                      <h4 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: COLORS.primary,
                        margin: 0
                      }}>
                        {event.subject}
                      </h4>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: COLORS.accent
                      }}>
                        {event.time}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#666'
                    }}>
                      <div>👨‍🏫 {event.teacher}</div>
                      <div>📍 {event.room}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: '#666'
              }}>
                <Calendar size={48} color="#ccc" style={{ marginBottom: '15px' }} />
                <p>Tidak ada jadwal pada tanggal ini</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Announcements Modal */}
      {showAnnouncementModal && (
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
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: COLORS.white,
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: COLORS.primary,
                margin: 0
              }}>
                Pengumuman Sekolah
              </h3>
              <button
                onClick={() => setShowAnnouncementModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                <X size={24} />
              </button>
            </div>

            {selectedAnnouncement ? (
              /* Single Announcement View */
              <div>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: COLORS.primary,
                    fontSize: '14px',
                    cursor: 'pointer',
                    marginBottom: '20px'
                  }}
                >
                  ← Kembali ke daftar
                </button>
                
                <div style={{
                  padding: '20px',
                  background: selectedAnnouncement.priority === 'high' ? '#fef2f2' : 
                            selectedAnnouncement.priority === 'medium' ? '#fefbf3' : '#f8fafc',
                  borderRadius: '15px',
                  border: `2px solid ${
                    selectedAnnouncement.priority === 'high' ? '#fca5a5' :
                    selectedAnnouncement.priority === 'medium' ? '#fcd34d' : '#cbd5e1'
                  }`
                }}>
                  <h4 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: COLORS.primary,
                    margin: '0 0 15px 0'
                  }}>
                    {selectedAnnouncement.title}
                  </h4>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '20px'
                  }}>
                    <span>📅 {selectedAnnouncement.date}</span>
                    <span>⏰ {selectedAnnouncement.time}</span>
                    <span>👤 {selectedAnnouncement.author}</span>
                    {selectedAnnouncement.isRead && (
                      <span style={{ color: '#10b981' }}>
                        <Eye size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        Dibaca
                      </span>
                    )}
                  </div>
                  
                  <p style={{
                    fontSize: '16px',
                    lineHeight: '1.6',
                    color: '#374151',
                    margin: 0
                  }}>
                    {selectedAnnouncement.content}
                  </p>
                </div>
              </div>
            ) : (
              /* Announcements List */
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    onClick={() => handleAnnouncementClick(announcement)}
                    style={{
                      padding: '20px',
                      background: announcement.isRead ? '#f9fafb' : `${COLORS.primary}08`,
                      borderRadius: '15px',
                      border: announcement.isRead ? '1px solid #e5e7eb' : `2px solid ${COLORS.primary}20`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '10px'
                    }}>
                      <h4 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: COLORS.primary,
                        margin: 0,
                        flex: 1
                      }}>
                        {announcement.title}
                        {!announcement.isRead && (
                          <span style={{
                            width: '8px',
                            height: '8px',
                            background: COLORS.accent,
                            borderRadius: '50%',
                            display: 'inline-block',
                            marginLeft: '8px'
                          }}></span>
                        )}
                      </h4>
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        color: announcement.priority === 'high' ? '#ef4444' :
                              announcement.priority === 'medium' ? COLORS.accent : '#6b7280',
                        textTransform: 'uppercase',
                        marginLeft: '10px'
                      }}>
                        {announcement.priority}
                      </div>
                    </div>
                    
                    <p style={{
                      fontSize: '14px',
                      color: '#666',
                      margin: '0 0 10px 0',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {announcement.content}
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      fontSize: '12px',
                      color: '#888'
                    }}>
                      <span>{announcement.date} • {announcement.time}</span>
                      <span>{announcement.author}</span>
                      {announcement.isRead && (
                        <span style={{ color: '#10b981' }}>
                          <Eye size={12} style={{ display: 'inline', marginRight: '4px' }} />
                          Dibaca
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default HomePage
