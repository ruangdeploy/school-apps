import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ArrowLeft,
  MapPin
} from 'lucide-react'

// Color palette constants - same as login page
const COLORS = {
  primary: 'rgb(15, 76, 92)',
  accent: 'rgb(244, 163, 0)',
  white: 'rgb(255, 255, 255)'
}

// Mock attendance data
const mockAttendanceData = {
  todayStats: {
    present: 28,
    absent: 2,
    late: 1,
    total: 31
  },
  recentRecords: [
    { date: '2026-01-24', status: 'present', timeIn: '07:45', timeOut: '15:30', location: 'Kelas XII IPA 1' },
    { date: '2026-01-23', status: 'present', timeIn: '07:50', timeOut: '15:25', location: 'Kelas XII IPA 1' },
    { date: '2026-01-22', status: 'late', timeIn: '08:15', timeOut: '15:35', location: 'Kelas XII IPA 1' },
    { date: '2026-01-21', status: 'present', timeIn: '07:40', timeOut: '15:20', location: 'Kelas XII IPA 1' },
    { date: '2026-01-20', status: 'present', timeIn: '07:55', timeOut: '15:30', location: 'Kelas XII IPA 1' }
  ]
}

const AttendancePage: React.FC = () => {
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [todayCheckedIn, setTodayCheckedIn] = useState(false)
  const [todayCheckedOut, setTodayCheckedOut] = useState(false)
  const [checkInTime, setCheckInTime] = useState<string | null>(null)
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null)

  const handleCheckIn = () => {
    setIsCheckingIn(true)
    // Simulate check-in process
    setTimeout(() => {
      setIsCheckingIn(false)
      setTodayCheckedIn(true)
      const currentTime = new Date().toLocaleTimeString('id-ID')
      setCheckInTime(currentTime)
      console.log('Absen masuk berhasil! Anda hadir pada ' + currentTime)
    }, 2000)
  }

  const handleCheckOut = () => {
    setIsCheckingOut(true)
    // Simulate check-out process
    setTimeout(() => {
      setIsCheckingOut(false)
      setTodayCheckedOut(true)
      const currentTime = new Date().toLocaleTimeString('id-ID')
      setCheckOutTime(currentTime)
      console.log('Absen keluar berhasil! Anda pulang pada ' + currentTime)
    }, 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return '#10b981'
      case 'late': return COLORS.accent
      case 'absent': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return CheckCircle
      case 'late': return AlertCircle
      case 'absent': return XCircle
      default: return Clock
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present': return 'Hadir'
      case 'late': return 'Terlambat'
      case 'absent': return 'Tidak Hadir'
      default: return 'Unknown'
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
              Absensi
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#666',
              margin: 0
            }}>
              Kelola kehadiran harian Anda
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
        {/* Check-in Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: COLORS.white,
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
            }}>
              <Clock size={48} color="white" />
            </div>

            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: COLORS.primary,
              margin: '0 0 10px 0'
            }}>
              Absensi Hari Ini
            </h2>

            <p style={{
              fontSize: '16px',
              color: '#666',
              margin: '0 0 25px 0'
            }}>
              Catat waktu masuk dan keluar sekolah Anda
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              fontSize: '14px',
              color: '#888',
              marginBottom: '25px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} />
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} />
                {new Date().toLocaleTimeString('id-ID', { 
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>

          {/* Attendance Status */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {/* Check In Status */}
            <div style={{
              padding: '20px',
              borderRadius: '15px',
              background: todayCheckedIn ? '#10b98115' : '#f3f4f6',
              border: `2px solid ${todayCheckedIn ? '#10b981' : '#e5e7eb'}`,
              textAlign: 'center'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: todayCheckedIn ? '#10b981' : '#9ca3af',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px auto'
              }}>
                <CheckCircle size={24} color="white" />
              </div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: COLORS.primary,
                margin: '0 0 5px 0'
              }}>
                Absen Masuk
              </h4>
              <p style={{
                fontSize: '14px',
                color: todayCheckedIn ? '#10b981' : '#666',
                margin: 0,
                fontWeight: '500'
              }}>
                {todayCheckedIn ? `Tercatat: ${checkInTime}` : 'Belum absen'}
              </p>
            </div>

            {/* Check Out Status */}
            <div style={{
              padding: '20px',
              borderRadius: '15px',
              background: todayCheckedOut ? '#10b98115' : '#f3f4f6',
              border: `2px solid ${todayCheckedOut ? '#10b981' : '#e5e7eb'}`,
              textAlign: 'center'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: todayCheckedOut ? '#10b981' : '#9ca3af',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px auto'
              }}>
                <CheckCircle size={24} color="white" />
              </div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: COLORS.primary,
                margin: '0 0 5px 0'
              }}>
                Absen Keluar
              </h4>
              <p style={{
                fontSize: '14px',
                color: todayCheckedOut ? '#10b981' : '#666',
                margin: 0,
                fontWeight: '500'
              }}>
                {todayCheckedOut ? `Tercatat: ${checkOutTime}` : 'Belum absen'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px'
          }}>
            {/* Check In Button */}
            <button
              onClick={handleCheckIn}
              disabled={isCheckingIn || todayCheckedIn}
              style={{
                background: (isCheckingIn || todayCheckedIn)
                  ? '#9ca3af' 
                  : `linear-gradient(45deg, ${COLORS.primary}, #1e40af)`,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '15px 20px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: (isCheckingIn || todayCheckedIn) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isCheckingIn ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Memproses...
                </>
              ) : todayCheckedIn ? (
                <>
                  <CheckCircle size={20} />
                  Sudah Absen Masuk
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Absen Masuk
                </>
              )}
            </button>

            {/* Check Out Button */}
            <button
              onClick={handleCheckOut}
              disabled={isCheckingOut || todayCheckedOut || !todayCheckedIn}
              style={{
                background: (isCheckingOut || todayCheckedOut || !todayCheckedIn)
                  ? '#9ca3af' 
                  : `linear-gradient(45deg, ${COLORS.accent}, #d97706)`,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '15px 20px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: (isCheckingOut || todayCheckedOut || !todayCheckedIn) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isCheckingOut ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Memproses...
                </>
              ) : todayCheckedOut ? (
                <>
                  <CheckCircle size={20} />
                  Sudah Absen Keluar
                </>
              ) : !todayCheckedIn ? (
                <>
                  <XCircle size={20} />
                  Absen Masuk Dulu
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Absen Keluar
                </>
              )}
            </button>
          </div>

          {/* Info Text */}
          <div style={{
            marginTop: '20px',
            textAlign: 'center',
            fontSize: '14px',
            color: '#666',
            fontStyle: 'italic'
          }}>
            {!todayCheckedIn ? 
              'Lakukan absen masuk terlebih dahulu sebelum absen keluar' :
              !todayCheckedOut ?
              'Jangan lupa absen keluar saat pulang sekolah' :
              'Absensi hari ini telah lengkap. Terima kasih!'
            }
          </div>
        </motion.div>

        {/* Recent Records */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
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
            Riwayat Absensi
          </h3>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {mockAttendanceData.recentRecords.map((record, index) => {
              const StatusIcon = getStatusIcon(record.status)
              const statusColor = getStatusColor(record.status)

              return (
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
                    width: '45px',
                    height: '45px',
                    background: `${statusColor}15`,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <StatusIcon size={22} color={statusColor} />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <h4 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: COLORS.primary,
                        margin: 0
                      }}>
                        {getStatusText(record.status)}
                      </h4>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: statusColor,
                        display: 'flex',
                        gap: '10px'
                      }}>
                        <span>Masuk: {record.timeIn}</span>
                        <span>Keluar: {record.timeOut}</span>
                      </div>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      fontSize: '14px',
                      color: '#666'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Calendar size={14} />
                        {new Date(record.date).toLocaleDateString('id-ID')}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <MapPin size={14} />
                        {record.location}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

export default AttendancePage
