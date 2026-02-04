import React, { useState, useEffect } from 'react'
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


import { siswaAPI, orangTuaAPI } from '../services/api'

const WEEK_DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']


const SchedulePage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>('Senin')
  const [jadwalPelajaran, setJadwalPelajaran] = useState<any[]>([])
  const [jadwalEkstra, setJadwalEkstra] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userType, setUserType] = useState<string>('')
  const [anakList, setAnakList] = useState<any[]>([])
  const [selectedAnak, setSelectedAnak] = useState<any>(null)

  // Detect user type and fetch anak list if orang tua
  useEffect(() => {
    const userData = localStorage.getItem('userData')
    if (userData) {
      const user = JSON.parse(userData)
      setUserType(user?.tipe_user || '')
      if (user?.tipe_user === 'orang_tua') {
        // Fetch daftar anak
        orangTuaAPI.getDaftarAnak().then(res => {
          if (res.success && Array.isArray(res.data)) {
            setAnakList(res.data)
            setSelectedAnak(res.data[0] || null)
          } else {
            setAnakList([])
            setSelectedAnak(null)
          }
        })
      }
    }
  }, [])

  // Fetch jadwal when day or anak changes
  useEffect(() => {
    const fetchJadwal = async () => {
      setIsLoading(true)
      setError(null)
      try {
        if (userType === 'orang_tua' && selectedAnak) {
          const res = await orangTuaAPI.getJadwalByHari(selectedAnak.id || selectedAnak.siswa_id, selectedDay)
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            const data = res.data[0]
            setJadwalPelajaran(data.jadwal_pelajaran || [])
            setJadwalEkstra(data.jadwal_ekstrakurikuler || [])
          } else {
            setJadwalPelajaran([])
            setJadwalEkstra([])
            setError(res.message || 'Gagal memuat jadwal')
          }
        } else if (userType === 'siswa') {
          const res = await siswaAPI.getJadwalByHari(selectedDay)
          if (res.success && res.data) {
            const data = res.data as any
            setJadwalPelajaran(data.jadwal_pelajaran || [])
            setJadwalEkstra(data.jadwal_ekstrakurikuler || [])
          } else {
            setJadwalPelajaran([])
            setJadwalEkstra([])
            setError(res.message || 'Gagal memuat jadwal')
          }
        }
      } catch (e: any) {
        setError(e?.message || 'Gagal memuat jadwal')
        setJadwalPelajaran([])
        setJadwalEkstra([])
      } finally {
        setIsLoading(false)
      }
    }
    if (userType === 'orang_tua' ? !!selectedAnak : true) {
      fetchJadwal()
    }
  }, [selectedDay, userType, selectedAnak])

  const getCurrentTime = () => {
    const now = new Date()
    return now.getHours() * 100 + now.getMinutes()
  }

  const getClassStatus = (start: string, end: string) => {
    const currentTime = getCurrentTime()
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

          {/* Anak selector for orang tua - styled as card with buttons */}
          {userType === 'orang_tua' && anakList.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: COLORS.white,
                borderRadius: '20px',
                padding: '30px',
                marginBottom: '25px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                marginBottom: '25px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <User size={24} color="white" />
                </div>
                <div>
                  <h2 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: COLORS.primary,
                    margin: '0 0 5px 0'
                  }}>
                    Pilih Anak
                  </h2>
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    margin: 0
                  }}>
                    Pilih anak untuk melihat jadwal
                  </p>
                </div>
              </div>
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                alignItems: 'center'
              }}>
                {anakList.map((anak: any) => (
                  <motion.div
                    key={anak.id || anak.siswa_id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedAnak(anak)}
                    style={{
                      background: (selectedAnak?.id || selectedAnak?.siswa_id) === (anak.id || anak.siswa_id)
                        ? COLORS.primary
                        : COLORS.white,
                      color: (selectedAnak?.id || selectedAnak?.siswa_id) === (anak.id || anak.siswa_id)
                        ? COLORS.white
                        : COLORS.primary,
                      border: (selectedAnak?.id || selectedAnak?.siswa_id) === (anak.id || anak.siswa_id)
                        ? 'none'
                        : `2px solid ${COLORS.primary}20`,
                      borderRadius: '16px',
                      padding: '16px 24px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      boxShadow: (selectedAnak?.id || selectedAnak?.siswa_id) === (anak.id || anak.siswa_id)
                        ? '0 8px 25px rgba(0, 0, 0, 0.15)'
                        : '0 4px 15px rgba(0, 0, 0, 0.05)',
                      textAlign: 'center',
                      minWidth: '120px'
                    }}
                  >
                    <div style={{ marginBottom: '4px' }}>
                      {anak.nama || anak.nama_lengkap || anak.nama_siswa}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      opacity: 0.8,
                      fontWeight: '500'
                    }}>
                      {anak.kelas || anak.kelas_nama || ''}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          {/* Day selector */}
          <div style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '5px'
          }}>
            {WEEK_DAYS.map((day, index) => (
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
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Memuat jadwal...</div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>{error}</div>
          ) : (
            <>
              {/* Jadwal Pelajaran */}
              {jadwalPelajaran.length > 0 && (
                <>
                  <h3 style={{ color: COLORS.primary, fontWeight: 700, fontSize: 18, margin: '10px 0 0 0' }}>Jadwal Pelajaran</h3>
                  {jadwalPelajaran.map((item, index) => {
                    const status = getClassStatus(item.jam_mulai, item.jam_selesai)
                    const statusColor = getStatusColor(status)
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
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                          {/* Time */}
                          <div style={{ minWidth: '120px', textAlign: 'center' }}>
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
                            <p style={{ fontSize: '14px', fontWeight: '600', color: statusColor, margin: '0 0 5px 0' }}>
                              {item.jam_mulai} - {item.jam_selesai}
                            </p>
                            <span style={{ fontSize: '12px', color: statusColor, background: `${statusColor}15`, padding: '4px 8px', borderRadius: '12px', fontWeight: '600' }}>
                              {status === 'current' ? 'Sedang Berlangsung' : status === 'upcoming' ? 'Akan Datang' : 'Selesai'}
                            </span>
                          </div>
                          {/* Content */}
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '15px' }}>
                              <div>
                                <h3 style={{ fontSize: '20px', fontWeight: '700', color: COLORS.primary, margin: '0 0 5px 0' }}>{item.nama_mapel}</h3>
                                <span style={{ fontSize: '12px', color: COLORS.primary, background: `${COLORS.primary}15`, padding: '4px 12px', borderRadius: '15px', fontWeight: '600' }}>Pelajaran Wajib</span>
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '35px', height: '35px', background: `${COLORS.primary}15`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <User size={18} color={COLORS.primary} />
                                </div>
                                <div>
                                  <p style={{ fontSize: '14px', fontWeight: '600', color: COLORS.primary, margin: 0 }}>{item.nama_guru}</p>
                                  <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Pengajar</p>
                                </div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '35px', height: '35px', background: `${COLORS.accent}15`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <MapPin size={18} color={COLORS.accent} />
                                </div>
                                <div>
                                  <p style={{ fontSize: '14px', fontWeight: '600', color: COLORS.primary, margin: 0 }}>{item.ruangan}</p>
                                  <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Ruangan</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </>
              )}
              {/* Jadwal Ekstrakurikuler */}
              {jadwalEkstra.length > 0 && (
                <>
                  <h3 style={{ color: COLORS.accent, fontWeight: 700, fontSize: 18, margin: '20px 0 0 0' }}>Jadwal Ekstrakurikuler</h3>
                  {jadwalEkstra.map((item, index) => {
                    const status = getClassStatus(item.jam_mulai, item.jam_selesai)
                    const statusColor = getStatusColor(status)
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
                            ? `0 10px 30px rgba(244, 163, 0, 0.2)` 
                            : '0 5px 20px rgba(0, 0, 0, 0.08)',
                          border: status === 'current' ? '2px solid #f59e42' : 'none',
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
                            background: COLORS.accent,
                            animation: 'pulse 2s infinite'
                          }} />
                        )}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                          {/* Time */}
                          <div style={{ minWidth: '120px', textAlign: 'center' }}>
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
                            <p style={{ fontSize: '14px', fontWeight: '600', color: statusColor, margin: '0 0 5px 0' }}>
                              {item.jam_mulai} - {item.jam_selesai}
                            </p>
                            <span style={{ fontSize: '12px', color: statusColor, background: `${statusColor}15`, padding: '4px 8px', borderRadius: '12px', fontWeight: '600' }}>
                              {status === 'current' ? 'Sedang Berlangsung' : status === 'upcoming' ? 'Akan Datang' : 'Selesai'}
                            </span>
                          </div>
                          {/* Content */}
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '15px' }}>
                              <div>
                                <h3 style={{ fontSize: '20px', fontWeight: '700', color: COLORS.accent, margin: '0 0 5px 0' }}>{item.nama_ekstrakurikuler}</h3>
                                <span style={{ fontSize: '12px', color: COLORS.accent, background: `${COLORS.accent}15`, padding: '4px 12px', borderRadius: '15px', fontWeight: '600' }}>Ekstrakurikuler</span>
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '35px', height: '35px', background: `${COLORS.accent}15`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <MapPin size={18} color={COLORS.accent} />
                                </div>
                                <div>
                                  <p style={{ fontSize: '14px', fontWeight: '600', color: COLORS.primary, margin: 0 }}>{item.lokasi}</p>
                                  <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Lokasi</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </>
              )}
              {jadwalPelajaran.length === 0 && jadwalEkstra.length === 0 && (
                <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>Tidak ada jadwal hari ini.</div>
              )}
            </>
          )}
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
