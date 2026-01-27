import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
// @ts-ignore
import { DateRange } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ArrowLeft,
  Users,
  BookOpen,
  Save,
  RefreshCw,
  Search,
  Eye,
  Filter,
  BarChart3,
  School,
  User,
  ChevronRight,
  Edit3
} from 'lucide-react'
import { guruAPI } from '../services/api'
import AttendanceDetailModal from '../components/AttendanceDetailModal'

// Color palette constants
const COLORS = {
  primary: 'rgb(15, 76, 92)',
  accent: 'rgb(244, 163, 0)',
  white: 'rgb(255, 255, 255)'
}

interface Kelas {
  id: number
  nama_kelas: string
  jenjang: string
  tingkat: number
  jurusan: string
  tahun_ajaran: string
}

interface Siswa {
  siswa_id: number
  nama_lengkap: string
  nis: string
  jenis_kelamin: string
  tanggal_lahir: string
  status_siswa: string
}

interface AbsensiRecord {
  absensi_id: number
  siswa_id: number
  nama_lengkap: string
  nis: string
  tanggal: string
  status_kehadiran: string
  status_keterlambatan: string
  keterangan: string | null
}

const GuruAttendancePage: React.FC = () => {
  // Navigation state
  const [currentView, setCurrentView] = useState<'dashboard' | 'kelas-list' | 'kelas-detail' | 'riwayat'>('dashboard')
  const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null)
  
  // Data states
  const [kelasList, setKelasList] = useState<Kelas[]>([])
  const [siswaList, setSiswaList] = useState<Siswa[]>([])
  const [absensiRecords, setAbsensiRecords] = useState<AbsensiRecord[]>([])
  const [absensiStats, setAbsensiStats] = useState<any>({})
  
  // UI states
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  
  // Modal states
  const [selectedDetail, setSelectedDetail] = useState<any>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  
  // Date range state
  const [showCalendar, setShowCalendar] = useState(false)
  const today = new Date()
  const weekAgo = new Date()
  weekAgo.setDate(today.getDate() - 7)
  const [dateRange, setDateRange] = useState([
    {
      startDate: weekAgo,
      endDate: today,
      key: 'selection',
    },
  ])
  
  // Student updates tracking
  const [pendingUpdates, setPendingUpdates] = useState<{[key: number]: string}>({})

  // Load kelas list on mount
  useEffect(() => {
    loadKelasList()
  }, [])

  // Load data based on current view
  useEffect(() => {
    if (currentView === 'kelas-detail' && selectedKelas) {
      loadSiswaList()
    } else if (currentView === 'riwayat' && selectedKelas) {
      loadAbsensiHistory()
    }
  }, [currentView, selectedKelas])

  // Reload history when date range changes
  useEffect(() => {
    if (currentView === 'riwayat' && selectedKelas) {
      loadAbsensiHistory()
    }
  }, [dateRange])

  const loadKelasList = async () => {
    try {
      setIsLoading(true)
      const response = await guruAPI.getKelas()
      if (response.success) {
        setKelasList(response.data as Kelas[])
      }
    } catch (error) {
      console.error('Error loading kelas:', error)
      alert('Gagal memuat daftar kelas')
    } finally {
      setIsLoading(false)
    }
  }

  const loadSiswaList = async () => {
    if (!selectedKelas) return
    try {
      setIsLoading(true)
      const response = await guruAPI.getSiswaKelas(selectedKelas.id)
      if (response.success) {
        setSiswaList(response.data as Siswa[])
      }
    } catch (error) {
      console.error('Error loading siswa:', error)
      alert('Gagal memuat daftar siswa')
    } finally {
      setIsLoading(false)
    }
  }

  const loadAbsensiHistory = async () => {
    if (!selectedKelas) return
    try {
      setIsLoading(true)
      const startDate = dateRange[0].startDate.toISOString().split('T')[0]
      const endDate = dateRange[0].endDate.toISOString().split('T')[0]
      
      const response = await guruAPI.getRiwayatAbsensiKelas(
        selectedKelas.id, 
        startDate, 
        endDate
      )
      
      if (response.success) {
        const data = response.data as any
        setAbsensiRecords(data.absensi || [])
        setAbsensiStats(data.statistik || {})
      }
    } catch (error) {
      console.error('Error loading absensi history:', error)
      alert('Gagal memuat riwayat absensi')
    } finally {
      setIsLoading(false)
    }
  }

  const loadAbsensiDetail = async (absensiId: number) => {
    try {
      setIsLoadingDetail(true)
      const response = await guruAPI.getDetailAbsensiSiswa(absensiId)
      if (response.success) {
        setSelectedDetail(response.data)
        setShowDetailModal(true)
      }
    } catch (error) {
      console.error('Error loading detail:', error)
      alert('Gagal memuat detail absensi')
    } finally {
      setIsLoadingDetail(false)
    }
  }

  const updateStatusSiswa = async (siswaId: number, status: string) => {
    try {
      setIsSaving(true)
      const response = await guruAPI.updateAbsensiSiswa({
        siswa_id: siswaId,
        tanggal: selectedDate,
        status_kehadiran: status
      })
      
      if (response.success) {
        // Remove from pending updates
        const newPending = { ...pendingUpdates }
        delete newPending[siswaId]
        setPendingUpdates(newPending)
        
        alert('Status absensi berhasil diupdate!')
        
        // Reload data if we're in history view
        if (currentView === 'riwayat') {
          loadAbsensiHistory()
        }
      } else {
        alert('Gagal update status: ' + response.message)
      }
    } catch (error: any) {
      console.error('Error updating status:', error)
      alert('Terjadi kesalahan: ' + (error.message || 'Gagal update status'))
    } finally {
      setIsSaving(false)
    }
  }

  const handleStatusChange = (siswaId: number, status: string) => {
    setPendingUpdates(prev => ({
      ...prev,
      [siswaId]: status
    }))
  }

  const saveAllUpdates = async () => {
    const updates = Object.entries(pendingUpdates)
    if (updates.length === 0) {
      alert('Tidak ada perubahan untuk disimpan')
      return
    }

    setIsSaving(true)
    try {
      for (const [siswaId, status] of updates) {
        await updateStatusSiswa(Number(siswaId), status)
      }
      alert('Semua perubahan berhasil disimpan!')
    } catch (error) {
      console.error('Error saving updates:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hadir': return '#10b981'
      case 'alpa': return '#ef4444'
      case 'sakit': return '#8b5cf6'
      case 'izin': return '#06b6d4'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'hadir': return CheckCircle
      case 'alpa': return XCircle
      case 'sakit': return AlertCircle
      case 'izin': return Clock
      default: return Clock
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'hadir': return 'Hadir'
      case 'alpa': return 'Alpha'
      case 'sakit': return 'Sakit'
      case 'izin': return 'Izin'
      default: return status
    }
  }

  const filteredSiswa = siswaList.filter(siswa =>
    siswa.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
    siswa.nis.includes(searchTerm)
  )

  const filteredRecords = absensiRecords.filter(record =>
    record.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.nis.includes(searchTerm)
  )

  // Dashboard View
  if (currentView === 'dashboard') {
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
                Kelola Absensi Siswa
              </h1>
              <p style={{
                fontSize: '14px',
                color: '#666',
                margin: 0
              }}>
                Kelola kehadiran siswa di kelas yang Anda ajar
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
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: COLORS.white,
              borderRadius: '20px',
              padding: '30px',
              marginBottom: '30px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}
          >
            <div style={{
              width: '80px',
              height: '80px',
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <BookOpen size={40} color="white" />
            </div>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: COLORS.primary,
              marginBottom: '10px'
            }}>
              Dashboard Guru
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#666',
              marginBottom: '25px'
            }}>
              Kelola kehadiran siswa dengan mudah dan efisien
            </p>
          </motion.div>

          {/* Action Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {/* Manage Classes Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentView('kelas-list')}
              style={{
                background: COLORS.white,
                borderRadius: '16px',
                padding: '25px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                border: `2px solid transparent`,
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '15px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: `linear-gradient(135deg, ${COLORS.primary}, #1e40af)`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Users size={24} color="white" />
                </div>
                <ChevronRight size={24} color="#ccc" />
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: COLORS.primary,
                marginBottom: '8px'
              }}>
                Kelola Kelas
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#666',
                margin: 0
              }}>
                Lihat dan kelola daftar siswa di kelas Anda
              </p>
            </motion.div>

            {/* Attendance History Card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (kelasList.length > 0) {
                  setSelectedKelas(kelasList[0])
                  setCurrentView('riwayat')
                }
              }}
              style={{
                background: COLORS.white,
                borderRadius: '16px',
                padding: '25px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                border: `2px solid transparent`,
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '15px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: `linear-gradient(135deg, ${COLORS.accent}, #d97706)`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <BarChart3 size={24} color="white" />
                </div>
                <ChevronRight size={24} color="#ccc" />
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: COLORS.primary,
                marginBottom: '8px'
              }}>
                Riwayat Absensi
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#666',
                margin: 0
              }}>
                Lihat statistik dan riwayat kehadiran siswa
              </p>
            </motion.div>
          </div>

          {/* Quick Stats - Show classes */}
          {kelasList.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                background: COLORS.white,
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
              }}
            >
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: COLORS.primary,
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <School size={20} />
                Kelas Yang Anda Ajar ({kelasList.length})
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '15px'
              }}>
                {kelasList.map((kelas) => (
                  <motion.div
                    key={kelas.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setSelectedKelas(kelas)
                      setCurrentView('kelas-detail')
                    }}
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.primary}15, ${COLORS.accent}05)`,
                      border: `2px solid ${COLORS.primary}20`,
                      borderRadius: '12px',
                      padding: '20px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '10px'
                    }}>
                      <h4 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: COLORS.primary,
                        margin: 0
                      }}>
                        {kelas.nama_kelas}
                      </h4>
                      <ChevronRight size={18} color="#ccc" />
                    </div>
                    <p style={{
                      fontSize: '14px',
                      color: '#666',
                      margin: '5px 0'
                    }}>
                      {kelas.jenjang} - Tingkat {kelas.tingkat}
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: '#888',
                      margin: 0
                    }}>
                      {kelas.jurusan} • {kelas.tahun_ajaran}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {isLoading && (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              color: '#666'
            }}>
              <RefreshCw size={40} style={{ animation: 'spin 1s linear infinite' }} />
              <p>Memuat data kelas...</p>
            </div>
          )}
        </div>
        
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // Kelas List View
  if (currentView === 'kelas-list') {
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
              onClick={() => setCurrentView('dashboard')}
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
                Daftar Kelas
              </h1>
              <p style={{
                fontSize: '14px',
                color: '#666',
                margin: 0
              }}>
                Pilih kelas untuk mengelola absensi siswa
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '30px 20px'
        }}>
          {isLoading ? (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              color: '#666'
            }}>
              <RefreshCw size={40} style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: '20px' }}>Memuat daftar kelas...</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {kelasList.map((kelas) => (
                <motion.div
                  key={kelas.id}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedKelas(kelas)
                    setCurrentView('kelas-detail')
                  }}
                  style={{
                    background: COLORS.white,
                    borderRadius: '16px',
                    padding: '25px',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    border: `2px solid ${COLORS.primary}10`,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '15px'
                  }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <School size={24} color="white" />
                    </div>
                    <ChevronRight size={24} color="#ccc" />
                  </div>
                  
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: COLORS.primary,
                    marginBottom: '8px'
                  }}>
                    {kelas.nama_kelas}
                  </h3>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px'
                  }}>
                    <p style={{
                      fontSize: '14px',
                      color: '#666',
                      margin: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <BookOpen size={14} />
                      {kelas.jenjang} - Tingkat {kelas.tingkat}
                    </p>
                    <p style={{
                      fontSize: '14px',
                      color: '#666',
                      margin: 0
                    }}>
                      {kelas.jurusan}
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: '#888',
                      margin: 0,
                      marginTop: '8px',
                      padding: '6px 12px',
                      background: `${COLORS.primary}10`,
                      borderRadius: '20px',
                      display: 'inline-block',
                      width: 'fit-content'
                    }}>
                      Tahun Ajaran: {kelas.tahun_ajaran}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Kelas Detail View - Manage Students
  if (currentView === 'kelas-detail' && selectedKelas) {
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
            justifyContent: 'space-between',
            height: '70px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button
                onClick={() => setCurrentView('kelas-list')}
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
                  {selectedKelas.nama_kelas}
                </h1>
                <p style={{
                  fontSize: '14px',
                  color: '#666',
                  margin: 0
                }}>
                  Kelola absensi siswa untuk tanggal {selectedDate}
                </p>
              </div>
            </div>
            
            {Object.keys(pendingUpdates).length > 0 && (
              <button
                onClick={saveAllUpdates}
                disabled={isSaving}
                style={{
                  background: COLORS.accent,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: isSaving ? 0.7 : 1
                }}
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Simpan Perubahan ({Object.keys(pendingUpdates).length})
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Date Selector */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '20px'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: COLORS.white,
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={20} color={COLORS.primary} />
              <label style={{
                fontSize: '14px',
                fontWeight: '600',
                color: COLORS.primary
              }}>
                Tanggal Absensi:
              </label>
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: '8px 12px',
                border: `2px solid ${COLORS.primary}20`,
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
            <button
              onClick={() => {
                setSelectedKelas(selectedKelas)
                setCurrentView('riwayat')
              }}
              style={{
                background: `${COLORS.primary}10`,
                color: COLORS.primary,
                border: `2px solid ${COLORS.primary}20`,
                borderRadius: '8px',
                padding: '8px 15px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <BarChart3 size={16} />
              Lihat Riwayat
            </button>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: COLORS.white,
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{
              position: 'relative',
              maxWidth: '400px'
            }}>
              <Search 
                size={20} 
                color="#666"
                style={{
                  position: 'absolute',
                  left: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              />
              <input
                type="text"
                placeholder="Cari siswa berdasarkan nama atau NIS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 45px',
                  border: `2px solid ${COLORS.primary}20`,
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
              />
            </div>
          </motion.div>

          {/* Students List */}
          {isLoading ? (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              color: '#666'
            }}>
              <RefreshCw size={40} style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: '20px' }}>Memuat daftar siswa...</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                background: COLORS.white,
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
            >
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: COLORS.primary,
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Users size={20} />
                Daftar Siswa ({filteredSiswa.length})
              </h3>

              {filteredSiswa.length === 0 ? (
                <p style={{
                  textAlign: 'center',
                  color: '#666',
                  padding: '40px'
                }}>
                  {searchTerm ? 'Tidak ada siswa yang ditemukan' : 'Belum ada siswa di kelas ini'}
                </p>
              ) : (
                <div style={{
                  display: 'grid',
                  gap: '12px'
                }}>
                  {filteredSiswa.map((siswa) => {
                    const pendingStatus = pendingUpdates[siswa.siswa_id]
                    
                    return (
                      <motion.div
                        key={siswa.siswa_id}
                        whileHover={{ scale: 1.01 }}
                        style={{
                          border: `2px solid ${pendingStatus ? COLORS.accent + '40' : COLORS.primary + '20'}`,
                          borderRadius: '12px',
                          padding: '20px',
                          background: pendingStatus ? `${COLORS.accent}05` : 'white',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '15px'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px'
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
                              <h4 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: COLORS.primary,
                                margin: 0,
                                marginBottom: '4px'
                              }}>
                                {siswa.nama_lengkap}
                              </h4>
                              <p style={{
                                fontSize: '14px',
                                color: '#666',
                                margin: 0
                              }}>
                                NIS: {siswa.nis} • {siswa.jenis_kelamin}
                              </p>
                            </div>
                          </div>
                          
                          <div style={{
                            display: 'flex',
                            gap: '8px',
                            flexWrap: 'wrap'
                          }}>
                            {['hadir', 'alpa', 'sakit', 'izin'].map((status) => {
                              const isSelected = pendingStatus === status
                              const StatusIcon = getStatusIcon(status)
                              
                              return (
                                <button
                                  key={status}
                                  onClick={() => handleStatusChange(siswa.siswa_id, status)}
                                  style={{
                                    background: isSelected ? getStatusColor(status) : 'white',
                                    color: isSelected ? 'white' : getStatusColor(status),
                                    border: `2px solid ${getStatusColor(status)}`,
                                    borderRadius: '8px',
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    transition: 'all 0.3s ease',
                                    minWidth: '70px',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <StatusIcon size={14} />
                                  {getStatusText(status)}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                        
                        {pendingStatus && (
                          <div style={{
                            marginTop: '15px',
                            padding: '10px',
                            background: `${COLORS.accent}20`,
                            borderRadius: '8px',
                            fontSize: '12px',
                            color: COLORS.primary,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <Edit3 size={12} />
                            Status akan diubah menjadi: <strong>{getStatusText(pendingStatus)}</strong>
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    )
  }

  // Riwayat View
  if (currentView === 'riwayat' && selectedKelas) {
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
              onClick={() => setCurrentView('kelas-detail')}
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
                Riwayat Absensi
              </h1>
              <p style={{
                fontSize: '14px',
                color: '#666',
                margin: 0
              }}>
                {selectedKelas.nama_kelas} • {dateRange[0].startDate.toLocaleDateString()} - {dateRange[0].endDate.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '30px 20px'
        }}>
          {/* Date Range Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: COLORS.white,
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '15px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Filter size={20} color={COLORS.primary} />
                <span style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: COLORS.primary
                }}>
                  Filter Periode
                </span>
              </div>
              
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                style={{
                  background: COLORS.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 15px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Calendar size={16} />
                {dateRange[0].startDate.toLocaleDateString()} - {dateRange[0].endDate.toLocaleDateString()}
              </button>
            </div>

            {showCalendar && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{
                  marginTop: '15px',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <DateRange
                  editableDateInputs={true}
                  onChange={(ranges: any) => setDateRange([ranges.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                  maxDate={new Date()}
                  rangeColors={[COLORS.primary]}
                />
              </motion.div>
            )}
          </motion.div>

          {/* Statistics */}
          {absensiStats && Object.keys(absensiStats).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                background: COLORS.white,
                borderRadius: '16px',
                padding: '25px',
                marginBottom: '20px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
            >
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: COLORS.primary,
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <BarChart3 size={20} />
                Statistik Kehadiran
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px'
              }}>
                {Object.entries(absensiStats).map(([status, count]) => {
                  const StatusIcon = getStatusIcon(status)
                  return (
                    <div
                      key={status}
                      style={{
                        background: `${getStatusColor(status)}10`,
                        border: `2px solid ${getStatusColor(status)}20`,
                        borderRadius: '12px',
                        padding: '20px',
                        textAlign: 'center'
                      }}
                    >
                      <StatusIcon 
                        size={32} 
                        color={getStatusColor(status)}
                        style={{ marginBottom: '10px' }}
                      />
                      <div style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: getStatusColor(status),
                        marginBottom: '5px'
                      }}>
                        {count as number}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#666',
                        fontWeight: '600'
                      }}>
                        {getStatusText(status)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: COLORS.white,
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{
              position: 'relative',
              maxWidth: '400px'
            }}>
              <Search 
                size={20} 
                color="#666"
                style={{
                  position: 'absolute',
                  left: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              />
              <input
                type="text"
                placeholder="Cari siswa berdasarkan nama atau NIS..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 45px',
                  border: `2px solid ${COLORS.primary}20`,
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
              />
            </div>
          </motion.div>

          {/* Records List */}
          {isLoading ? (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              color: '#666'
            }}>
              <RefreshCw size={40} style={{ animation: 'spin 1s linear infinite' }} />
              <p style={{ marginTop: '20px' }}>Memuat riwayat absensi...</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                background: COLORS.white,
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
            >
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: COLORS.primary,
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Clock size={20} />
                Riwayat Absensi ({filteredRecords.length})
              </h3>

              {filteredRecords.length === 0 ? (
                <p style={{
                  textAlign: 'center',
                  color: '#666',
                  padding: '40px'
                }}>
                  {searchTerm ? 'Tidak ada data yang ditemukan' : 'Belum ada data absensi untuk periode ini'}
                </p>
              ) : (
                <div style={{
                  display: 'grid',
                  gap: '12px'
                }}>
                  {filteredRecords.map((record) => {
                    const StatusIcon = getStatusIcon(record.status_kehadiran)
                    
                    return (
                      <motion.div
                        key={record.absensi_id}
                        whileHover={{ scale: 1.01 }}
                        style={{
                          border: `2px solid ${COLORS.primary}20`,
                          borderRadius: '12px',
                          padding: '20px',
                          background: 'white',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '15px'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px'
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
                              <h4 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                color: COLORS.primary,
                                margin: 0,
                                marginBottom: '4px'
                              }}>
                                {record.nama_lengkap}
                              </h4>
                              <p style={{
                                fontSize: '14px',
                                color: '#666',
                                margin: 0
                              }}>
                                NIS: {record.nis} • {new Date(record.tanggal).toLocaleDateString('id-ID')}
                              </p>
                            </div>
                          </div>
                          
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 15px',
                              background: `${getStatusColor(record.status_kehadiran)}15`,
                              borderRadius: '20px',
                              border: `2px solid ${getStatusColor(record.status_kehadiran)}30`
                            }}>
                              <StatusIcon size={16} color={getStatusColor(record.status_kehadiran)} />
                              <span style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: getStatusColor(record.status_kehadiran)
                              }}>
                                {getStatusText(record.status_kehadiran)}
                              </span>
                            </div>
                            
                            <button
                              onClick={() => loadAbsensiDetail(record.absensi_id)}
                              disabled={isLoadingDetail}
                              style={{
                                background: COLORS.primary,
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                cursor: isLoadingDetail ? 'not-allowed' : 'pointer',
                                fontSize: '12px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                opacity: isLoadingDetail ? 0.7 : 1
                              }}
                            >
                              <Eye size={14} />
                              Detail
                            </button>
                          </div>
                        </div>
                        
                        {record.keterangan && (
                          <div style={{
                            marginTop: '15px',
                            padding: '10px',
                            background: '#f8f9fa',
                            borderRadius: '8px',
                            fontSize: '14px',
                            color: '#666'
                          }}>
                            <strong>Keterangan:</strong> {record.keterangan}
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Attendance Detail Modal */}
        <AttendanceDetailModal
          detail={selectedDetail}
          isVisible={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          isLoading={isLoadingDetail}
        />
      </div>
    )
  }

  return null
}

export default GuruAttendancePage
