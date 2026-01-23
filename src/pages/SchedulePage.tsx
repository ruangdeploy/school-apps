import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin,
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

// Color palette constants
const COLORS = {
  primary: 'rgb(15, 76, 92)',
  accent: 'rgb(244, 163, 0)',
  white: 'rgb(255, 255, 255)'
}

// Mock schedule data
const mockScheduleData = {
  today: [
    {
      id: 1,
      time: '07:00 - 07:45',
      subject: 'Matematika',
      teacher: 'Pak Budi Santoso',
      room: 'Ruang XII-A',
      type: 'Pelajaran Wajib'
    },
    {
      id: 2,
      time: '07:45 - 08:30',
      subject: 'Bahasa Indonesia',
      teacher: 'Bu Sari Indah',
      room: 'Ruang XII-A',
      type: 'Pelajaran Wajib'
    },
    {
      id: 3,
      time: '08:30 - 09:15',
      subject: 'Fisika',
      teacher: 'Pak Andi Rahman',
      room: 'Lab Fisika',
      type: 'Pelajaran Wajib'
    },
    {
      id: 4,
      time: '09:30 - 10:15',
      subject: 'Kimia',
      teacher: 'Bu Maya Sari',
      room: 'Lab Kimia',
      type: 'Pelajaran Wajib'
    },
    {
      id: 5,
      time: '10:15 - 11:00',
      subject: 'Biologi',
      teacher: 'Bu Rina Kusuma',
      room: 'Lab Biologi',
      type: 'Pelajaran Wajib'
    },
    {
      id: 6,
      time: '11:15 - 12:00',
      subject: 'Olahraga',
      teacher: 'Pak Joko Susilo',
      room: 'Lapangan',
      type: 'Ekstrakurikuler'
    }
  ],
  week: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
}

const SchedulePage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState('today')

  const getCurrentTime = () => {
    const now = new Date()
    return now.getHours() * 100 + now.getMinutes()
  }

  const getClassStatus = (timeRange: string) => {
    const currentTime = getCurrentTime()
    const [start, end] = timeRange.split(' - ')
    const [startHour, startMinute] = start.split(':').map(Number)
    const [endHour, endMinute] = end.split(':').map(Number)
    
    const startTime = startHour * 100 + startMinute
    const endTime = endHour * 100 + endMinute
    
    if (currentTime < startTime) return 'upcoming'
    if (currentTime >= startTime && currentTime <= endTime) return 'current'
    return 'finished'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return '#10b981'
      case 'upcoming': return COLORS.accent
      case 'finished': return '#9ca3af'
      default: return '#6b7280'
    }
  }

  const getTypeColor = (type: string) => {
    return type === 'Ekstrakurikuler' ? COLORS.accent : COLORS.primary
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
          alignItems: 'center',
          height: '70px',
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
              Jadwal Pelajaran
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#666',
              margin: 0
            }}>
              Kelola jadwal harian dan mingguan
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '30px 20px'
      }}>
        {/* Date Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: COLORS.white,
            borderRadius: '20px',
            padding: '25px',
            marginBottom: '25px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: COLORS.primary,
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Calendar size={24} />
              {new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h2>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <button style={{
                background: 'none',
                border: `1px solid ${COLORS.primary}30`,
                borderRadius: '10px',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ChevronLeft size={20} color={COLORS.primary} />
              </button>
              <button style={{
                background: 'none',
                border: `1px solid ${COLORS.primary}30`,
                borderRadius: '10px',
                padding: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ChevronRight size={20} color={COLORS.primary} />
              </button>
            </div>
          </div>

          {/* Day selector */}
          <div style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '5px'
          }}>
            <button
              onClick={() => setSelectedDay('today')}
              style={{
                background: selectedDay === 'today' 
                  ? `linear-gradient(45deg, ${COLORS.primary}, ${COLORS.accent})` 
                  : 'transparent',
                color: selectedDay === 'today' ? 'white' : COLORS.primary,
                border: selectedDay === 'today' ? 'none' : `1px solid ${COLORS.primary}30`,
                borderRadius: '25px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              Hari Ini
            </button>
            {mockScheduleData.week.map((day, index) => (
              <button
                key={index}
                onClick={() => setSelectedDay(day)}
                style={{
                  background: selectedDay === day 
                    ? `linear-gradient(45deg, ${COLORS.primary}, ${COLORS.accent})` 
                    : 'transparent',
                  color: selectedDay === day ? 'white' : COLORS.primary,
                  border: selectedDay === day ? 'none' : `1px solid ${COLORS.primary}30`,
                  borderRadius: '25px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                {day}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Schedule List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}
        >
          {mockScheduleData.today.map((item, index) => {
            const status = getClassStatus(item.time)
            const statusColor = getStatusColor(status)
            const typeColor = getTypeColor(item.type)

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                style={{
                  background: COLORS.white,
                  borderRadius: '20px',
                  padding: '25px',
                  boxShadow: status === 'current' 
                    ? `0 10px 30px rgba(16, 185, 129, 0.2)` 
                    : '0 5px 20px rgba(0, 0, 0, 0.08)',
                  border: status === 'current' ? '2px solid #10b981' : 'none',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {status === 'current' && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: '#10b981',
                    animation: 'pulse 2s infinite'
                  }} />
                )}

                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px'
                }}>
                  {/* Time */}
                  <div style={{
                    minWidth: '120px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: `${statusColor}15`,
                      borderRadius: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 10px auto'
                    }}>
                      <Clock size={28} color={statusColor} />
                    </div>
                    <p style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: statusColor,
                      margin: '0 0 5px 0'
                    }}>
                      {item.time}
                    </p>
                    <span style={{
                      fontSize: '12px',
                      color: statusColor,
                      background: `${statusColor}15`,
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontWeight: '600'
                    }}>
                      {status === 'current' ? 'Sedang Berlangsung' : 
                       status === 'upcoming' ? 'Akan Datang' : 'Selesai'}
                    </span>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: '15px'
                    }}>
                      <div>
                        <h3 style={{
                          fontSize: '20px',
                          fontWeight: '700',
                          color: COLORS.primary,
                          margin: '0 0 5px 0'
                        }}>
                          {item.subject}
                        </h3>
                        <span style={{
                          fontSize: '12px',
                          color: typeColor,
                          background: `${typeColor}15`,
                          padding: '4px 12px',
                          borderRadius: '15px',
                          fontWeight: '600'
                        }}>
                          {item.type}
                        </span>
                      </div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '15px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <div style={{
                          width: '35px',
                          height: '35px',
                          background: `${COLORS.primary}15`,
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <User size={18} color={COLORS.primary} />
                        </div>
                        <div>
                          <p style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: COLORS.primary,
                            margin: 0
                          }}>
                            {item.teacher}
                          </p>
                          <p style={{
                            fontSize: '12px',
                            color: '#666',
                            margin: 0
                          }}>
                            Pengajar
                          </p>
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <div style={{
                          width: '35px',
                          height: '35px',
                          background: `${COLORS.accent}15`,
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <MapPin size={18} color={COLORS.accent} />
                        </div>
                        <div>
                          <p style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: COLORS.primary,
                            margin: 0
                          }}>
                            {item.room}
                          </p>
                          <p style={{
                            fontSize: '12px',
                            color: '#666',
                            margin: 0
                          }}>
                            Ruangan
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}

export default SchedulePage
