import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  FileText,
  MapPin,
  User,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  BookOpen,
  Filter,
  RefreshCw,
  ChevronDown,
  Users
} from 'lucide-react'
import { orangTuaAPI } from '../services/api'

// Color palette constants
const COLORS = {
  primary: 'rgb(15, 76, 92)',
  accent: 'rgb(244, 163, 0)',
  white: 'rgb(255, 255, 255)'
}

// Types for exam data
interface JadwalUjianKelas {
  id: number
  kelas_id: number
  mata_pelajaran_id: number
  guru_id: number
  jenis_ujian: string
  tanggal: string
  jam_mulai: string
  jam_selesai: string
  ruangan: string
  tahun_ajaran: string
  semester: string
  keterangan: string
  is_active: number
  created_at: string
  updated_at: string
  nama_kelas: string
  nama_mapel: string
  nama_guru: string
}

interface JadwalUjianSiswa {
  id: number
  siswa_id: number
  jenis_ujian: string
  mata_pelajaran_id: number
  guru_id: number
  tanggal: string
  jam_mulai: string
  jam_selesai: string
  ruangan: string
  tahun_ajaran: string
  semester: string
  keterangan: string
  is_active: number
  created_at: string
  updated_at: string
  nis: string
  nisn: string
  kelas_id: number
  nama_mapel: string
  nama_guru: string
}

interface ExamData {
  jadwal_ujian_kelas: JadwalUjianKelas[]
  jadwal_ujian_siswa: JadwalUjianSiswa[]
}

interface Anak {
  siswa_id: number
  nama_lengkap: string
  nis: string
  nisn: string
  nama_kelas: string
  jenjang: string
  is_primary?: boolean
}

const OrangTuaExamPage: React.FC = () => {
  const [examData, setExamData] = useState<ExamData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [daftarAnak, setDaftarAnak] = useState<Anak[]>([])
  const [selectedAnak, setSelectedAnak] = useState<Anak | null>(null)
  
  // Filter states
  const [filterType, setFilterType] = useState<'all' | 'upcoming' | 'today'>('all')

  // Load daftar anak on component mount
  useEffect(() => {
    loadDaftarAnak()
  }, [])

  // Load exam data when selectedAnak changes
  useEffect(() => {
    if (selectedAnak) {
      loadExamData()
    }
  }, [selectedAnak])

  const loadDaftarAnak = async () => {
    try {
      const response = await orangTuaAPI.getDaftarAnak()
      
      if (response.success && response.data) {
        const anakList = Array.isArray(response.data) ? response.data : []
        setDaftarAnak(anakList)
        
        // Auto-select primary child or first child
        const primaryChild = anakList.find((child: Anak) => child.is_primary) || anakList[0]
        if (primaryChild) {
          setSelectedAnak(primaryChild)
        }
      }
    } catch (error) {
      console.error('Error loading daftar anak:', error)
    }
  }

  // Load exam data
  const loadExamData = async () => {
    if (!selectedAnak) return

    try {
      setIsLoading(true)
      setError(null)
      
      // Get current date range (current month to next 3 months)
      const startDate = new Date()
      startDate.setDate(1) // First day of current month
      
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + 3)
      endDate.setDate(0) // Last day of the month
      
      const tanggal_mulai = startDate.toISOString().split('T')[0]
      const tanggal_selesai = endDate.toISOString().split('T')[0]
      
      const response = await orangTuaAPI.getJadwalUjianAnak(selectedAnak.siswa_id, tanggal_mulai, tanggal_selesai)
      
      if (response.success && response.data) {
        setExamData(response.data as ExamData)
      } else {
        throw new Error(response.message || 'Gagal memuat data ujian')
      }
    } catch (error) {
      console.error('Error loading exam data:', error)
      
      // More specific error handling
      if (error instanceof Error) {
        // Check if it's an authorization error
        if (error.message.includes('401') || error.message.includes('tidak berhak') || error.message.includes('Unauthorized')) {
          setError('Anda tidak memiliki akses untuk melihat jadwal ujian anak ini. Pastikan Anda login sebagai orang tua yang benar.')
        } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
          setError('Akses ditolak. Anda mungkin tidak memiliki izin untuk melihat data ini.')
        } else if (error.message.includes('404')) {
          setError('Data jadwal ujian tidak ditemukan untuk anak ini.')
        } else if (error.message.includes('500')) {
          setError('Terjadi kesalahan pada server. Silakan coba lagi nanti.')
        } else {
          setError(error.message)
        }
      } else {
        setError('Terjadi kesalahan yang tidak diketahui saat memuat data ujian')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Get exam type color
  const getExamTypeColor = (jenis_ujian: string) => {
    switch (jenis_ujian.toUpperCase()) {
      case 'UTS': return '#f59e0b'
      case 'UAS': return '#dc2626'
      case 'REMEDIAL': return '#8b5cf6'
      case 'UJIAN_HARIAN': 
      case 'HARIAN': return '#10b981'
      case 'PRAKTEK': return '#06b6d4'
      case 'SUSULAN': return '#f97316'
      default: return COLORS.primary
    }
  }

  // Get exam type icon
  const getExamTypeIcon = (jenis_ujian: string) => {
    switch (jenis_ujian.toUpperCase()) {
      case 'UTS':
      case 'UAS': return FileText
      case 'REMEDIAL': return AlertCircle
      case 'UJIAN_HARIAN':
      case 'HARIAN': return BookOpen
      case 'PRAKTEK': return CheckCircle
      case 'SUSULAN': return Clock
      default: return FileText
    }
  }

  // Filter exams
  const filterExams = (exams: (JadwalUjianKelas | JadwalUjianSiswa)[]) => {
    let filtered = [...exams]

    if (filterType === 'today') {
      const today = new Date().toISOString().split('T')[0]
      filtered = filtered.filter(exam => exam.tanggal === today)
    } else if (filterType === 'upcoming') {
      const today = new Date().toISOString().split('T')[0]
      filtered = filtered.filter(exam => exam.tanggal > today)
    }

    return filtered.sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())
  }

  // Get all exams combined
  const getAllExams = () => {
    if (!examData) return []
    const allExams = [
      ...examData.jadwal_ujian_kelas,
      ...examData.jadwal_ujian_siswa
    ]
    return filterExams(allExams)
  }

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Format time for display
  const formatTime = (timeStr: string) => {
    return timeStr.substring(0, 5) // HH:MM
  }

  // Check if exam is today
  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0]
    return dateStr === today
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
              Jadwal Ujian Anak
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#666',
              margin: 0
            }}>
              Pantau jadwal ujian dan bantu persiapan belajar anak
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px'
      }}>
        {/* Child Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: COLORS.white,
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: COLORS.primary,
            fontWeight: '600',
            marginBottom: '15px'
          }}>
            <Users size={18} />
            Pilih Anak
          </div>

          {/* Anak Selection with Buttons (like attendance page) */}
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '15px'
          }}>
            {daftarAnak.map((anak) => (
              <motion.div
                key={anak.siswa_id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedAnak(anak)}
                style={{
                  background: selectedAnak?.siswa_id === anak.siswa_id 
                    ? COLORS.primary 
                    : COLORS.white,
                  color: selectedAnak?.siswa_id === anak.siswa_id ? COLORS.white : COLORS.primary,
                  border: selectedAnak?.siswa_id === anak.siswa_id 
                    ? 'none' 
                    : `2px solid ${COLORS.primary}20`,
                  borderRadius: '16px',
                  padding: '16px 24px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedAnak?.siswa_id === anak.siswa_id 
                    ? '0 8px 25px rgba(0, 0, 0, 0.15)' 
                    : '0 4px 15px rgba(0, 0, 0, 0.05)',
                  textAlign: 'center'
                }}
              >
                <div style={{ marginBottom: '4px' }}>
                  {anak.nama_lengkap}
                </div>
                <div style={{
                  fontSize: '12px',
                  opacity: 0.8
                }}>
                  Kelas {anak.nama_kelas}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dropdown as backup */}
          <div style={{ position: 'relative', marginBottom: '15px' }}>
            <select
              value={selectedAnak?.siswa_id || ''}
              onChange={(e) => {
                const anak = daftarAnak.find(a => a.siswa_id === parseInt(e.target.value))
                setSelectedAnak(anak || null)
              }}
              style={{
                width: '100%',
                padding: '12px 40px 12px 15px',
                border: `1px solid #e5e7eb`,
                borderRadius: '12px',
                fontSize: '16px',
                background: COLORS.white,
                appearance: 'none',
                cursor: 'pointer',
                color: COLORS.primary,
                fontWeight: '500'
              }}
            >
              <option value="">Pilih anak...</option>
              {daftarAnak.map((anak) => (
                <option key={anak.siswa_id} value={anak.siswa_id}>
                  {anak.nama_lengkap} - Kelas {anak.nama_kelas}
                </option>
              ))}
            </select>
            <ChevronDown 
              size={20} 
              color="#666" 
              style={{
                position: 'absolute',
                right: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}
            />
          </div>
        </motion.div>

        {/* Show error if no children loaded */}
        {daftarAnak.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              color: '#dc2626'
            }}
          >
            <AlertCircle size={48} color="#dc2626" style={{ margin: '0 auto 15px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 10px 0' }}>
              Tidak Ada Data Anak
            </h3>
            <p style={{ margin: '0 0 15px 0' }}>
              Tidak dapat memuat daftar anak. Pastikan Anda login sebagai orang tua dan memiliki akses ke data anak.
            </p>
            <button
              onClick={loadDaftarAnak}
              style={{
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Coba Lagi
            </button>
          </motion.div>
        )}

        {!selectedAnak && daftarAnak.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: COLORS.white,
              borderRadius: '16px',
              padding: '40px',
              textAlign: 'center',
              color: '#666'
            }}
          >
            <Users size={48} color="#cbd5e1" style={{ margin: '0 auto 20px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 10px 0' }}>
              Pilih Anak Terlebih Dahulu
            </h3>
            <p style={{ margin: 0 }}>
              Silakan pilih anak dari daftar di atas untuk melihat jadwal ujian
            </p>
          </motion.div>
        )}

        {selectedAnak && (
          <>
            {/* Filter Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: COLORS.white,
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
              }}
            >
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '15px',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: COLORS.primary,
                  fontWeight: '600'
                }}>
                  <Filter size={18} />
                  Filter Ujian untuk {selectedAnak.nama_lengkap}
                </div>
                <button
                  onClick={loadExamData}
                  style={{
                    background: 'none',
                    border: `1px solid ${COLORS.primary}`,
                    borderRadius: '8px',
                    padding: '8px 15px',
                    color: COLORS.primary,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '14px'
                  }}
                >
                  <RefreshCw size={14} />
                  Refresh
                </button>
              </div>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                {[
                  { key: 'all', label: 'Semua' },
                  { key: 'today', label: 'Hari Ini' },
                  { key: 'upcoming', label: 'Mendatang' }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setFilterType(filter.key as 'all' | 'upcoming' | 'today')}
                    style={{
                      background: filterType === filter.key ? COLORS.primary : 'transparent',
                      color: filterType === filter.key ? 'white' : COLORS.primary,
                      border: `1px solid ${COLORS.primary}`,
                      borderRadius: '20px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Content */}
            {error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  color: '#dc2626'
                }}
              >
                <AlertCircle size={48} color="#dc2626" style={{ margin: '0 auto 15px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 10px 0' }}>
                  Terjadi Kesalahan
                </h3>
                <p style={{ margin: '0 0 15px 0' }}>{error}</p>
                <button
                  onClick={loadExamData}
                  style={{
                    background: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Coba Lagi
                </button>
              </motion.div>
            ) : isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: COLORS.white,
                  borderRadius: '16px',
                  padding: '40px',
                  textAlign: 'center',
                  color: '#666'
                }}
              >
                <RefreshCw size={48} color={COLORS.primary} style={{
                  margin: '0 auto 20px',
                  animation: 'spin 1s linear infinite'
                }} />
                <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 10px 0' }}>
                  Memuat Jadwal Ujian
                </h3>
                <p style={{ margin: 0 }}>Mohon tunggu sebentar...</p>
              </motion.div>
            ) : examData && getAllExams().length > 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {getAllExams().map((exam, index) => {
                  const ExamIcon = getExamTypeIcon(exam.jenis_ujian)
                  const examColor = getExamTypeColor(exam.jenis_ujian)
                  const isExamToday = isToday(exam.tanggal)
                  
                  return (
                    <motion.div
                      key={`${exam.id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      style={{
                        background: COLORS.white,
                        borderRadius: '12px',
                        padding: '20px',
                        border: isExamToday ? `2px solid ${COLORS.accent}` : '1px solid #e5e7eb',
                        boxShadow: isExamToday 
                          ? `0 4px 20px ${COLORS.accent}20` 
                          : '0 2px 10px rgba(0, 0, 0, 0.05)',
                        position: 'relative'
                      }}
                    >
                      {/* Today Badge */}
                      {isExamToday && (
                        <div style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '20px',
                          background: COLORS.accent,
                          color: 'white',
                          fontSize: '12px',
                          fontWeight: '600',
                          padding: '4px 12px',
                          borderRadius: '12px'
                        }}>
                          HARI INI
                        </div>
                      )}
                      
                      <div style={{
                        display: 'flex',
                        gap: '15px',
                        alignItems: 'flex-start'
                      }}>
                        {/* Icon */}
                        <div style={{
                          background: `${examColor}20`,
                          borderRadius: '12px',
                          padding: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <ExamIcon size={24} color={examColor} />
                        </div>
                        
                        {/* Content */}
                        <div style={{ flex: 1 }}>
                          {/* Header */}
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '8px',
                            flexWrap: 'wrap',
                            gap: '10px'
                          }}>
                            <div>
                              <h3 style={{
                                fontSize: '18px',
                                fontWeight: '700',
                                color: COLORS.primary,
                                margin: 0
                              }}>
                                {exam.nama_mapel}
                              </h3>
                              <div style={{
                                display: 'inline-block',
                                background: examColor,
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: '600',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                marginTop: '4px'
                              }}>
                                {exam.jenis_ujian}
                              </div>
                            </div>
                            
                            {/* Date/Time */}
                            <div style={{
                              textAlign: 'right',
                              color: '#666'
                            }}>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                fontSize: '14px',
                                fontWeight: '500'
                              }}>
                                <Calendar size={14} />
                                {formatDate(exam.tanggal)}
                              </div>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                fontSize: '14px',
                                marginTop: '4px'
                              }}>
                                <Clock size={14} />
                                {formatTime(exam.jam_mulai)} - {formatTime(exam.jam_selesai)}
                              </div>
                            </div>
                          </div>
                          
                          {/* Details */}
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '12px',
                            marginTop: '15px'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '14px',
                              color: '#666'
                            }}>
                              <User size={16} />
                              <span>{exam.nama_guru}</span>
                            </div>
                            
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '14px',
                              color: '#666'
                            }}>
                              <MapPin size={16} />
                              <span>{exam.ruangan}</span>
                            </div>
                            
                            {'nama_kelas' in exam && (
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '14px',
                                color: '#666'
                              }}>
                                <BookOpen size={16} />
                                <span>Kelas {exam.nama_kelas}</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Description */}
                          {exam.keterangan && (
                            <div style={{
                              marginTop: '15px',
                              padding: '12px',
                              background: '#f8fafc',
                              borderRadius: '8px',
                              fontSize: '14px',
                              color: '#64748b'
                            }}>
                              {exam.keterangan}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: COLORS.white,
                  borderRadius: '16px',
                  padding: '40px',
                  textAlign: 'center',
                  color: '#666'
                }}
              >
                <Calendar size={48} color="#cbd5e1" style={{ margin: '0 auto 20px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 10px 0' }}>
                  Belum Ada Jadwal Ujian
                </h3>
                <p style={{ margin: 0 }}>
                  {filterType === 'today' 
                    ? 'Tidak ada ujian hari ini'
                    : filterType === 'upcoming'
                    ? 'Tidak ada ujian yang akan datang'
                    : 'Belum ada jadwal ujian dalam periode ini'
                  } untuk {selectedAnak.nama_lengkap}
                </p>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default OrangTuaExamPage
