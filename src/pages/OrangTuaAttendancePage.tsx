import { useState, useEffect } from 'react'
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
  BookOpen,
  RefreshCw,
  Search,
  ChevronRight,
  FileText,
  Heart
} from 'lucide-react'
import { orangTuaAPI } from '../services/api'
import AttendanceDetailModal from '../components/AttendanceDetailModal'

// Add CSS animation for loading spinner
const spinnerStyle = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Custom DateRange Calendar Styling */
.compact-calendar .rdrCalendarWrapper {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
}

.compact-calendar .rdrDateRangePickerWrapper {
  display: inline-block !important;
}

.compact-calendar .rdrDefinedRangesWrapper {
  display: none !important;
}

.compact-calendar .rdrMonthAndYearWrapper {
  padding: 6px 8px !important;
  height: 32px !important;
  border-bottom: 1px solid #e5e7eb !important;
  margin-bottom: 4px !important;
}

.compact-calendar .rdrMonth {
  width: 288px !important;
  padding: 0 !important;
}

.compact-calendar .rdrWeekDays {
  padding: 4px 8px !important;
}

.compact-calendar .rdrDays {
  padding: 0 8px 8px 8px !important;
}

.compact-calendar .rdrDay {
  height: 26px !important;
  line-height: 26px !important;
  margin: 0.5px !important;
}

.compact-calendar .rdrDayNumber {
  font-size: 11px !important;
  font-weight: 500 !important;
}

.compact-calendar .rdrMonthName {
  font-size: 12px !important;
  font-weight: 600 !important;
  color: #374151 !important;
}

.compact-calendar .rdrYearPicker select {
  font-size: 12px !important;
  padding: 1px 2px !important;
  height: 20px !important;
}

.compact-calendar .rdrNextPrevButton {
  width: 20px !important;
  height: 20px !important;
  background: #f9fafb !important;
  border: 1px solid #e5e7eb !important;
}

.compact-calendar .rdrNextPrevButton:hover {
  background: #f3f4f6 !important;
}

.compact-calendar .rdrWeekDay {
  font-size: 10px !important;
  font-weight: 600 !important;
  color: #6b7280 !important;
  height: 20px !important;
  line-height: 20px !important;
}

.compact-calendar .rdrInRange {
  background: rgba(15, 76, 92, 0.1) !important;
}

.compact-calendar .rdrStartEdge,
.compact-calendar .rdrEndEdge {
  background: rgb(15, 76, 92) !important;
}

.compact-calendar .rdrSelected {
  background: rgb(15, 76, 92) !important;
}
`

// Inject the CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = spinnerStyle
  document.head.appendChild(style)
}

// Color palette constants
const COLORS = {
  primary: 'rgb(15, 76, 92)',
  accent: 'rgb(244, 163, 0)',
  white: 'rgb(255, 255, 255)',
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a'
  },
  success: 'rgb(34, 197, 94)',
  warning: 'rgb(245, 158, 11)',
  danger: 'rgb(239, 68, 68)',
  info: 'rgb(59, 130, 246)',
  text: '#1e293b'
}

// Type definitions
interface Anak {
  siswa_id: number
  nama_lengkap: string
  nis: string
  kelas: string
  jenjang: string
}

interface AbsensiRecord {
  id: number
  siswa_id: number
  kelas_id: number
  tanggal: string
  jenis_absensi: string
  status_kehadiran: string
  jam_masuk: string
  jam_pulang: string
  status_keterlambatan: string
  keterangan: string | null
  foto_evidence_masuk: string | null
  foto_evidence_pulang: string | null
  bukti_surat: string | null
  dicatat_oleh: number
  created_at: string
  updated_at: string
  nama_kelas?: string
  jenjang?: string
  nama_lengkap?: string
}

interface Statistics {
  total: number
  hadir: number
  izin: number
  sakit: number
  alpa: number
  persentase_kehadiran: string
}

export default function OrangTuaAttendancePage() {
  // Data states
  const [anakList, setAnakList] = useState<Anak[]>([])
  const [selectedAnak, setSelectedAnak] = useState<Anak | null>(null)
  const [absensiRecords, setAbsensiRecords] = useState<AbsensiRecord[]>([])
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  
  // Attendance status states
  const [todayCheckedIn, setTodayCheckedIn] = useState(false)
  const [todayCheckedOut, setTodayCheckedOut] = useState(false)
  const [checkInTime, setCheckInTime] = useState<string | null>(null)
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null)
  
  // UI states
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCalendar, setShowCalendar] = useState(false)
  
  // Date range for filtering
  const [dateRange, setDateRange] = useState([
    {
      startDate: (() => {
        const date = new Date()
        date.setDate(date.getDate() - 7) // 7 days ago
        return date
      })(),
      endDate: new Date(),
      key: 'selection'
    }
  ])
  
  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showIzinModal, setShowIzinModal] = useState(false)
  const [detailData, setDetailData] = useState<any>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  
  // Form states for izin
  const [izinForm, setIzinForm] = useState({
    siswa_id: '',
    status_kehadiran: 'sakit',
    keterangan: '',
    tanggal_awal: new Date().toISOString().split('T')[0],
    tanggal_akhir: new Date().toISOString().split('T')[0],
    bukti_surat: null as File | null
  })

  // Load initial data
  useEffect(() => {
    loadDaftarAnak()
  }, [])

  // Load absensi records when anak or date range changes
  useEffect(() => {
    if (selectedAnak) {
      loadAbsensiRecords()
      loadTodayAttendance()
    }
  }, [selectedAnak, dateRange])

  const loadDaftarAnak = async () => {
    try {
      setIsLoading(true)
      const response = await orangTuaAPI.getDaftarAnak()
      if (response.success) {
        const anakData = response.data as Anak[]
        setAnakList(anakData)
        if (anakData.length > 0) {
          setSelectedAnak(anakData[0])
        }
      }
    } catch (error) {
      console.error('Error loading daftar anak:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadTodayAttendance = async () => {
    if (!selectedAnak) return
    
    try {
      // Since getTodayAttendanceAnak might not exist, we can use the attendance records
      // to check today's status by loading recent records and filtering for today
      const today = new Date().toISOString().split('T')[0]
      const response = await orangTuaAPI.getRiwayatAbsensiAnak(
        selectedAnak.siswa_id,
        today, // Start from today
        today  // End at today
      )
      
      if (response.success && response.data) {
        const data = response.data as { riwayat: AbsensiRecord[]; statistik: Statistics }
        const todayRecord = data.riwayat.find(record => 
          record.tanggal === today && record.siswa_id === selectedAnak.siswa_id
        )
        
        if (todayRecord) {
          // Found today's record
          if (todayRecord.jam_masuk) {
            setTodayCheckedIn(true)
            setCheckInTime(todayRecord.jam_masuk)
          } else {
            setTodayCheckedIn(false)
            setCheckInTime(null)
          }
          
          if (todayRecord.jam_pulang) {
            setTodayCheckedOut(true)
            setCheckOutTime(todayRecord.jam_pulang)
          } else {
            setTodayCheckedOut(false)
            setCheckOutTime(null)
          }
        } else {
          // No attendance record for today
          setTodayCheckedIn(false)
          setTodayCheckedOut(false)
          setCheckInTime(null)
          setCheckOutTime(null)
        }
      }
    } catch (error) {
      console.error('Error loading today attendance:', error)
      // Reset states on error
      setTodayCheckedIn(false)
      setTodayCheckedOut(false)
      setCheckInTime(null)
      setCheckOutTime(null)
    }
  }

  const loadAbsensiRecords = async () => {
    if (!selectedAnak) return
    
    try {
      setIsLoading(true)
      const startDate = dateRange[0].startDate.toISOString().split('T')[0]
      const endDate = dateRange[0].endDate.toISOString().split('T')[0]
      
      const response = await orangTuaAPI.getRiwayatAbsensiAnak(
        selectedAnak.siswa_id,
        startDate,
        endDate
      )
      
      if (response.success) {
        const data = response.data as { riwayat: AbsensiRecord[]; statistik: Statistics }
        setAbsensiRecords(data.riwayat)
        setStatistics(data.statistik)
      }
    } catch (error) {
      console.error('Error loading absensi records:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAbsenMasuk = async () => {
    if (!selectedAnak) {
      alert('Pilih anak terlebih dahulu')
      return
    }
    
    try {
      setIsSubmitting(true)
      const response = await orangTuaAPI.absenMasuk(selectedAnak.siswa_id)
      
      if (response.success) {
        const absensiData = (response.data as any)?.absensi
        
        // Update UI immediately with response data or current time
        setTodayCheckedIn(true)
        setCheckInTime(absensiData?.jam_masuk || new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit'
        }))
        
        alert(`✅ Absensi masuk ${selectedAnak.nama_lengkap} berhasil dicatat!`)
        
        // Refresh data with a small delay to ensure backend is updated
        setTimeout(() => {
          loadAbsensiRecords()
          loadTodayAttendance()
        }, 500)
      } else {
        if (response.message && response.message.includes('sudah melakukan absensi')) {
          alert(`ℹ️ ${response.message}`)
          // If already attended, refresh to get current status
          loadTodayAttendance()
        } else {
          alert(response.message || 'Gagal melakukan absensi masuk')
        }
      }
    } catch (error) {
      console.error('Error absen masuk:', error)
      alert('Terjadi kesalahan saat melakukan absensi masuk')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAbsenPulang = async () => {
    if (!selectedAnak) {
      alert('Pilih anak terlebih dahulu')
      return
    }
    
    try {
      setIsSubmitting(true)
      const response = await orangTuaAPI.absenPulang(selectedAnak.siswa_id)
      
      if (response.success) {
        const absensiData = (response.data as any)?.absensi
        
        // Update UI immediately with response data or current time
        setTodayCheckedOut(true)
        setCheckOutTime(absensiData?.jam_pulang || new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit'
        }))
        
        alert(`✅ Absensi pulang ${selectedAnak.nama_lengkap} berhasil dicatat!`)
        
        // Refresh data with a small delay to ensure backend is updated
        setTimeout(() => {
          loadAbsensiRecords()
          loadTodayAttendance()
        }, 500)
      } else {
        if (response.message && response.message.includes('sudah melakukan absensi')) {
          alert(`ℹ️ ${response.message}`)
          // If already attended, refresh to get current status
          loadTodayAttendance()
        } else {
          alert(response.message || 'Gagal melakukan absensi pulang')
        }
      }
    } catch (error) {
      console.error('Error absen pulang:', error)
      alert('Terjadi kesalahan saat melakukan absensi pulang')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitIzin = async () => {
    if (!selectedAnak) return
    
    try {
      setIsSubmitting(true)
      
      const formData = new FormData()
      formData.append('siswa_id', selectedAnak.siswa_id.toString())
      formData.append('status_kehadiran', izinForm.status_kehadiran)
      formData.append('keterangan', izinForm.keterangan)
      formData.append('tanggal_awal', izinForm.tanggal_awal)
      formData.append('tanggal_akhir', izinForm.tanggal_akhir)
      
      if (izinForm.bukti_surat) {
        formData.append('bukti_surat', izinForm.bukti_surat)
      }
      
      const response = await orangTuaAPI.submitIzinAnak(formData)
      
      if (response.success) {
        alert('Izin berhasil diajukan!')
        setShowIzinModal(false)
        // Reset form
        setIzinForm({
          siswa_id: '',
          status_kehadiran: 'sakit',
          keterangan: '',
          tanggal_awal: new Date().toISOString().split('T')[0],
          tanggal_akhir: new Date().toISOString().split('T')[0],
          bukti_surat: null
        })
        loadAbsensiRecords() // Refresh data
      } else {
        alert(response.message || 'Gagal mengajukan izin')
      }
    } catch (error) {
      console.error('Error submit izin:', error)
      alert('Terjadi kesalahan saat mengajukan izin')
    } finally {
      setIsSubmitting(false)
    }
  }

  const loadDetailAbsensi = async (absensiId: number) => {
    try {
      setIsLoadingDetail(true)
      const response = await orangTuaAPI.getDetailAbsensiAnak(absensiId)
      if (response.success) {
        setDetailData(response.data)
        setShowDetailModal(true)
      }
    } catch (error) {
      console.error('Error loading detail absensi:', error)
    } finally {
      setIsLoadingDetail(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hadir': return COLORS.success
      case 'alpa': return COLORS.danger
      case 'sakit': return COLORS.warning
      case 'izin': return COLORS.info
      case 'telat': return COLORS.warning
      default: return COLORS.gray[500]
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'hadir': return CheckCircle
      case 'alpa': return XCircle
      case 'sakit': return AlertCircle
      case 'izin': return BookOpen
      case 'telat': return Clock
      default: return AlertCircle
    }
  }

  // Filter records based on search term
  const filteredRecords = absensiRecords.filter(record =>
    record.nama_lengkap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.status_kehadiran.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.tanggal.includes(searchTerm)
  )

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
              fontSize: '20px',
              fontWeight: '700',
              color: COLORS.primary,
              margin: 0
            }}>
              Absensi Anak
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '30px 20px'
      }}>
        {/* Child Selector Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: COLORS.white,
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px',
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
              <Heart size={24} color="white" />
            </div>
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: COLORS.primary,
                margin: '0 0 5px 0'
              }}>
                Kelola Absensi Anak
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#666',
                margin: 0
              }}>
                Pilih anak untuk melihat dan mengelola kehadiran
              </p>
            </div>
          </div>

          {/* Anak Selector */}
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <span style={{
              fontSize: '16px',
              fontWeight: '600',
              color: COLORS.primary,
              minWidth: 'fit-content'
            }}>
              Pilih Anak:
            </span>
            
            <div style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              {anakList.map((anak) => (
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
                    opacity: 0.8,
                    fontWeight: '500'
                  }}>
                    {anak.kelas}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          {selectedAnak && (
            <div style={{
              marginTop: '30px',
              padding: '25px',
              background: `${COLORS.primary}05`,
              borderRadius: '16px',
              border: `2px solid ${COLORS.primary}10`
            }}>
              {/* Today's Attendance Status */}
              <div style={{
                marginBottom: '25px',
                padding: '20px',
                background: COLORS.white,
                borderRadius: '12px',
                border: `2px solid ${COLORS.primary}15`
              }}>
                <h4 style={{
                  margin: '0 0 15px 0',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: COLORS.primary,
                  textAlign: 'center'
                }}>
                  Status Absensi Hari Ini - {selectedAnak.nama_lengkap}
                </h4>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '15px'
                }}>
                  {/* Check In Status */}
                  <div style={{
                    padding: '15px',
                    borderRadius: '10px',
                    background: todayCheckedIn ? '#10b98115' : '#f3f4f6',
                    border: `2px solid ${todayCheckedIn ? '#10b981' : '#e5e7eb'}`,
                    textAlign: 'center'
                  }}>
                    <CheckCircle 
                      size={28} 
                      color={todayCheckedIn ? '#10b981' : '#9ca3af'} 
                      style={{ marginBottom: '8px' }}
                    />
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: todayCheckedIn ? '#10b981' : '#6b7280',
                      textTransform: 'uppercase',
                      marginBottom: '5px'
                    }}>
                      Absen Masuk
                    </div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: todayCheckedIn ? '#059669' : '#9ca3af'
                    }}>
                      {todayCheckedIn ? checkInTime : 'Belum Absen'}
                    </div>
                  </div>

                  {/* Check Out Status */}
                  <div style={{
                    padding: '15px',
                    borderRadius: '10px',
                    background: todayCheckedOut ? '#10b98115' : '#f3f4f6',
                    border: `2px solid ${todayCheckedOut ? '#10b981' : '#e5e7eb'}`,
                    textAlign: 'center'
                  }}>
                    <Clock 
                      size={28} 
                      color={todayCheckedOut ? '#10b981' : '#9ca3af'} 
                      style={{ marginBottom: '8px' }}
                    />
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: todayCheckedOut ? '#10b981' : '#6b7280',
                      textTransform: 'uppercase',
                      marginBottom: '5px'
                    }}>
                      Absen Pulang
                    </div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: todayCheckedOut ? '#059669' : '#9ca3af'
                    }}>
                      {todayCheckedOut ? checkOutTime : 'Belum Absen'}
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 style={{
                margin: '0 0 20px 0',
                fontSize: '18px',
                fontWeight: '700',
                color: COLORS.primary,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Clock size={20} />
                Aksi Cepat
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '15px'
              }}>
                <motion.button
                  whileHover={{ scale: todayCheckedIn || isSubmitting ? 1 : 1.02, y: todayCheckedIn || isSubmitting ? 0 : -2 }}
                  whileTap={{ scale: todayCheckedIn || isSubmitting ? 1 : 0.98 }}
                  onClick={handleAbsenMasuk}
                  disabled={isSubmitting || todayCheckedIn}
                  style={{
                    background: (isSubmitting || todayCheckedIn) 
                      ? '#9ca3af' 
                      : `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primary})`,
                    color: COLORS.white,
                    border: 'none',
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: (isSubmitting || todayCheckedIn) ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    opacity: (isSubmitting || todayCheckedIn) ? 0.7 : 1,
                    boxShadow: (isSubmitting || todayCheckedIn) 
                      ? 'none'
                      : '0 8px 25px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <CheckCircle size={24} />
                  <span>{todayCheckedIn ? 'Sudah Absen Masuk' : isSubmitting ? 'Memproses...' : 'Absen Masuk'}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: (todayCheckedOut || !todayCheckedIn || isSubmitting) ? 1 : 1.02, y: (todayCheckedOut || !todayCheckedIn || isSubmitting) ? 0 : -2 }}
                  whileTap={{ scale: (todayCheckedOut || !todayCheckedIn || isSubmitting) ? 1 : 0.98 }}
                  onClick={handleAbsenPulang}
                  disabled={isSubmitting || todayCheckedOut || !todayCheckedIn}
                  style={{
                    background: (isSubmitting || todayCheckedOut || !todayCheckedIn) 
                      ? '#9ca3af' 
                      : `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primary})`,
                    color: COLORS.white,
                    border: 'none',
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: (isSubmitting || todayCheckedOut || !todayCheckedIn) ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    opacity: (isSubmitting || todayCheckedOut || !todayCheckedIn) ? 0.7 : 1,
                    boxShadow: (isSubmitting || todayCheckedOut || !todayCheckedIn) 
                      ? 'none'
                      : '0 8px 25px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Clock size={24} />
                  <span>
                    {todayCheckedOut 
                      ? 'Sudah Absen Pulang' 
                      : !todayCheckedIn 
                      ? 'Absen Masuk Dulu'
                      : isSubmitting 
                      ? 'Memproses...' 
                      : 'Absen Pulang'}
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowIzinModal(true)}
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primary})`,
                    color: COLORS.white,
                    border: 'none',
                    borderRadius: '12px',
                    padding: '20px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <FileText size={24} />
                  <span>Ajukan Izin</span>
                </motion.button>
              </div>
              
              {/* Info Text */}
              <div style={{
                marginTop: '20px',
                textAlign: 'center',
                fontSize: '14px',
                color: '#374151',
                fontStyle: 'italic',
                padding: '15px',
                background: `${COLORS.white}90`,
                borderRadius: '10px',
                border: `1px solid ${COLORS.primary}20`
              }}>
                {!todayCheckedIn ? 
                  '📱 Sebagai orang tua, Anda dapat melakukan absensi anak dari lokasi manapun tanpa perlu foto. Klik "Absen Masuk" untuk mencatat kehadiran anak.' :
                  !todayCheckedOut ?
                  '✅ Absensi masuk sudah tercatat. Klik "Absen Pulang" untuk mencatat waktu pulang anak.' :
                  '🎉 Absensi hari ini sudah lengkap. Terima kasih telah membantu mencatat kehadiran anak!'
                }
              </div>
            </div>
          )}
        </motion.div>

        {selectedAnak && (
          <>
            {/* Statistics */}
            {statistics && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
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
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: COLORS.primary,
                    margin: '0 0 10px 0'
                  }}>
                    Statistik Kehadiran
                  </h3>
                  <p style={{
                    fontSize: '16px',
                    color: '#666',
                    margin: 0
                  }}>
                    {selectedAnak.nama_lengkap}
                  </p>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '20px',
                  marginBottom: '30px'
                }}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    style={{
                      background: `${getStatusColor('hadir')}10`,
                      border: `2px solid ${getStatusColor('hadir')}20`,
                      borderRadius: '16px',
                      padding: '25px 20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{
                      fontSize: '32px',
                      fontWeight: '700',
                      color: getStatusColor('hadir'),
                      marginBottom: '10px'
                    }}>
                      {statistics.hadir}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#666',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Hadir
                    </div>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    style={{
                      background: `${getStatusColor('sakit')}10`,
                      border: `2px solid ${getStatusColor('sakit')}20`,
                      borderRadius: '16px',
                      padding: '25px 20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{
                      fontSize: '32px',
                      fontWeight: '700',
                      color: getStatusColor('sakit'),
                      marginBottom: '10px'
                    }}>
                      {statistics.sakit}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#666',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Sakit
                    </div>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    style={{
                      background: `${getStatusColor('izin')}10`,
                      border: `2px solid ${getStatusColor('izin')}20`,
                      borderRadius: '16px',
                      padding: '25px 20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{
                      fontSize: '32px',
                      fontWeight: '700',
                      color: getStatusColor('izin'),
                      marginBottom: '10px'
                    }}>
                      {statistics.izin}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#666',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Izin
                    </div>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    style={{
                      background: `${getStatusColor('alpa')}10`,
                      border: `2px solid ${getStatusColor('alpa')}20`,
                      borderRadius: '16px',
                      padding: '25px 20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{
                      fontSize: '32px',
                      fontWeight: '700',
                      color: getStatusColor('alpa'),
                      marginBottom: '10px'
                    }}>
                      {statistics.alpa}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#666',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Alpha
                    </div>
                  </motion.div>
                </div>
                
                {/* Percentage highlight */}
                <div style={{
                  textAlign: 'center',
                  padding: '25px',
                  background: `linear-gradient(135deg, ${COLORS.accent}15, ${COLORS.accent}05)`,
                  borderRadius: '16px',
                  border: `2px solid ${COLORS.accent}20`
                }}>
                  <div style={{
                    fontSize: '48px',
                    fontWeight: '700',
                    color: COLORS.accent,
                    marginBottom: '8px'
                  }}>
                    {statistics.persentase_kehadiran}%
                  </div>
                  <div style={{
                    fontSize: '16px',
                    color: '#666',
                    fontWeight: '600'
                  }}>
                    Tingkat Kehadiran
                  </div>
                </div>
              </motion.div>
            )}

            {/* Filter & Search Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                background: COLORS.white,
                borderRadius: '20px',
                padding: '30px',
                marginBottom: '30px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '25px'
              }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: COLORS.primary,
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <Search size={22} />
                  Filter & Pencarian
                </h3>
              </div>

              <div style={{
                display: 'flex',
                gap: '15px',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  position: 'relative',
                  flex: 1,
                  minWidth: '300px'
                }}>
                  <Search 
                    size={20} 
                    color="#999"
                    style={{
                      position: 'absolute',
                      left: '15px',
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan tanggal atau status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '15px 15px 15px 50px',
                      border: `2px solid ${COLORS.primary}20`,
                      borderRadius: '12px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.3s ease',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = COLORS.primary
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = `${COLORS.primary}20`
                    }}
                  />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCalendar(!showCalendar)}
                  style={{
                    background: COLORS.primary,
                    color: COLORS.white,
                    border: 'none',
                    borderRadius: '12px',
                    padding: '15px 25px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Calendar size={18} />
                  Filter Tanggal
                </motion.button>
              </div>

              {showCalendar && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: '25px' }}
                  style={{
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <div style={{
                    background: '#f8f9fa',
                    borderRadius: '16px',
                    padding: '20px',
                    border: `2px solid ${COLORS.primary}10`,
                    maxWidth: '350px',
                    overflow: 'hidden'
                  }}>
                    <DateRange
                      editableDateInputs={true}
                      onChange={(ranges: any) => setDateRange([ranges.selection])}
                      moveRangeOnFirstSelection={false}
                      ranges={dateRange}
                      maxDate={new Date()}
                      rangeColors={[COLORS.primary]}
                      className="compact-calendar"
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Records List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              style={{
                background: COLORS.white,
                borderRadius: '20px',
                padding: '30px',
                marginBottom: '30px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '25px'
              }}>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: COLORS.primary,
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <BookOpen size={22} />
                  Riwayat Absensi
                </h3>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={loadAbsensiRecords}
                  disabled={isLoading}
                  style={{
                    background: isLoading 
                      ? '#e2e8f0'
                      : COLORS.primary,
                    color: isLoading ? '#64748b' : COLORS.white,
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: isLoading 
                      ? 'none'
                      : '0 8px 25px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <RefreshCw size={16} className={isLoading ? 'spinning' : ''} />
                  {isLoading ? 'Memuat...' : 'Refresh'}
                </motion.button>
              </div>

              {isLoading ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '80px 20px',
                  flexDirection: 'column',
                  gap: '20px'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    border: '4px solid #e2e8f0',
                    borderTop: `4px solid ${COLORS.primary}`,
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <p style={{
                    color: '#64748b',
                    fontSize: '16px',
                    fontWeight: '500',
                    margin: 0
                  }}>
                    Memuat data absensi...
                  </p>
                </div>
              ) : filteredRecords.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '80px 20px',
                  color: '#64748b'
                }}>
                  <BookOpen size={64} color="#cbd5e1" style={{ marginBottom: '20px' }} />
                  <h4 style={{
                    margin: '0 0 10px 0',
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#475569'
                  }}>
                    Tidak ada data
                  </h4>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '16px',
                    color: '#64748b'
                  }}>
                    Belum ada riwayat absensi untuk periode ini
                  </p>
                </div>
              ) : (
                <div style={{ 
                  display: 'grid',
                  gap: '15px'
                }}>
                  {filteredRecords.map((record) => {
                    const StatusIcon = getStatusIcon(record.status_kehadiran)
                    
                    return (
                      <motion.div
                        key={record.id}
                        whileHover={{ scale: 1.01, y: -2 }}
                        whileTap={{ scale: 0.99 }}
                        style={{
                          background: '#fafafa',
                          borderRadius: '16px',
                          padding: '25px',
                          border: `2px solid ${COLORS.primary}10`,
                          cursor: 'pointer',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => {
                          loadDetailAbsensi(record.id)
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '20px',
                            flex: 1
                          }}>
                            <div style={{
                              width: '56px',
                              height: '56px',
                              borderRadius: '50%',
                              background: `linear-gradient(135deg, ${getStatusColor(record.status_kehadiran)}, ${getStatusColor(record.status_kehadiran)}DD)`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                            }}>
                              <StatusIcon size={26} color={COLORS.white} />
                            </div>
                            
                            <div style={{ flex: 1 }}>
                              <div style={{
                                fontSize: '18px',
                                fontWeight: '700',
                                color: COLORS.primary,
                                marginBottom: '10px'
                              }}>
                                {new Date(record.tanggal).toLocaleDateString('id-ID', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                              
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                flexWrap: 'wrap'
                              }}>
                                <span style={{
                                  background: getStatusColor(record.status_kehadiran),
                                  color: COLORS.white,
                                  padding: '6px 16px',
                                  borderRadius: '20px',
                                  fontSize: '13px',
                                  fontWeight: '700',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px'
                                }}>
                                  {record.status_kehadiran}
                                </span>
                                
                                {record.jam_masuk && (
                                  <span style={{
                                    fontSize: '14px',
                                    color: COLORS.primary,
                                    background: '#f1f5f9',
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    fontWeight: '600'
                                  }}>
                                    Masuk: {record.jam_masuk}
                                  </span>
                                )}
                                
                                {record.jam_pulang && (
                                  <span style={{
                                    fontSize: '14px',
                                    color: COLORS.primary,
                                    background: '#f1f5f9',
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    fontWeight: '600'
                                  }}>
                                    Pulang: {record.jam_pulang}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <ChevronRight size={24} color={COLORS.primary} />
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      <AttendanceDetailModal
        detail={detailData}
        isVisible={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        isLoading={isLoadingDetail}
      />

      {/* Izin Modal */}
      {showIzinModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 76, 92, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px',
          backdropFilter: 'blur(8px)'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: COLORS.white,
              borderRadius: '20px',
              padding: '35px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 25px 50px rgba(15, 76, 92, 0.3)'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '25px'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '22px',
                fontWeight: '700',
                color: COLORS.primary
              }}>
                Ajukan Izin untuk {selectedAnak?.nama_lengkap}
              </h3>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowIzinModal(false)}
                style={{
                  background: '#e2e8f0',
                  border: 'none',
                  borderRadius: '50%',
                  width: '44px',
                  height: '44px',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                ×
              </motion.button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: COLORS.primary,
                  marginBottom: '10px',
                  display: 'block'
                }}>
                  Status Kehadiran
                </label>
                <select
                  value={izinForm.status_kehadiran}
                  onChange={(e) => setIzinForm(prev => ({
                    ...prev,
                    status_kehadiran: e.target.value
                  }))}
                  style={{
                    width: '100%',
                    padding: '15px',
                    border: `2px solid ${COLORS.primary}20`,
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                >
                  <option value="sakit">Sakit</option>
                  <option value="izin">Izin</option>
                </select>
              </div>

              <div>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: COLORS.primary,
                  marginBottom: '10px',
                  display: 'block'
                }}>
                  Tanggal Awal
                </label>
                <input
                  type="date"
                  value={izinForm.tanggal_awal}
                  onChange={(e) => setIzinForm(prev => ({
                    ...prev,
                    tanggal_awal: e.target.value
                  }))}
                  style={{
                    width: '100%',
                    padding: '15px',
                    border: `2px solid ${COLORS.primary}20`,
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: COLORS.primary,
                  marginBottom: '10px',
                  display: 'block'
                }}>
                  Tanggal Akhir
                </label>
                <input
                  type="date"
                  value={izinForm.tanggal_akhir}
                  onChange={(e) => setIzinForm(prev => ({
                    ...prev,
                    tanggal_akhir: e.target.value
                  }))}
                  style={{
                    width: '100%',
                    padding: '15px',
                    border: `2px solid ${COLORS.primary}20`,
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: COLORS.primary,
                  marginBottom: '10px',
                  display: 'block'
                }}>
                  Keterangan
                </label>
                <textarea
                  value={izinForm.keterangan}
                  onChange={(e) => setIzinForm(prev => ({
                    ...prev,
                    keterangan: e.target.value
                  }))}
                  placeholder="Masukkan alasan izin..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '15px',
                    border: `2px solid ${COLORS.primary}20`,
                    borderRadius: '12px',
                    fontSize: '16px',
                    resize: 'vertical',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: COLORS.primary,
                  marginBottom: '10px',
                  display: 'block'
                }}>
                  Bukti Surat (Opsional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setIzinForm(prev => ({
                    ...prev,
                    bukti_surat: e.target.files?.[0] || null
                  }))}
                  style={{
                    width: '100%',
                    padding: '15px',
                    border: `2px solid ${COLORS.primary}20`,
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '15px',
                marginTop: '25px'
              }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowIzinModal(false)}
                  style={{
                    flex: 1,
                    padding: '16px',
                    border: `2px solid ${COLORS.primary}20`,
                    borderRadius: '12px',
                    background: COLORS.white,
                    color: COLORS.primary,
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Batal
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: isSubmitting || !izinForm.keterangan ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting || !izinForm.keterangan ? 1 : 0.98 }}
                  onClick={handleSubmitIzin}
                  disabled={isSubmitting || !izinForm.keterangan}
                  style={{
                    flex: 1,
                    padding: '16px',
                    border: 'none',
                    borderRadius: '12px',
                    background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primary}DD)`,
                    color: COLORS.white,
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: isSubmitting || !izinForm.keterangan ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting || !izinForm.keterangan ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 8px 25px rgba(15, 76, 92, 0.25)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isSubmitting && (
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid #ffffff40',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                  )}
                  Kirim Izin
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinning {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  )
}
