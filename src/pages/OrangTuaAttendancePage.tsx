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
  Filter,
  BarChart3,
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
  background: rgba(59, 130, 246, 0.1) !important;
}

.compact-calendar .rdrStartEdge,
.compact-calendar .rdrEndEdge {
  background: #3b82f6 !important;
}

.compact-calendar .rdrSelected {
  background: #3b82f6 !important;
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
  primary: '#3b82f6',
  secondary: '#64748b', 
  accent: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  success: '#22c55e',
  white: '#ffffff',
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
    try {
      setIsSubmitting(true)
      const response = await orangTuaAPI.absenMasuk()
      
      if (response.success) {
        alert('Absensi masuk berhasil!')
        loadAbsensiRecords() // Refresh data
      } else {
        alert(response.message || 'Gagal melakukan absensi masuk')
      }
    } catch (error) {
      console.error('Error absen masuk:', error)
      alert('Terjadi kesalahan saat melakukan absensi masuk')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAbsenPulang = async () => {
    try {
      setIsSubmitting(true)
      const response = await orangTuaAPI.absenPulang()
      
      if (response.success) {
        alert('Absensi pulang berhasil!')
        loadAbsensiRecords() // Refresh data
      } else {
        alert(response.message || 'Gagal melakukan absensi pulang')
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
      case 'izin': return COLORS.primary
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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: COLORS.white,
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '20px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Heart size={24} color={COLORS.primary} />
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: COLORS.text,
              margin: 0
            }}>
              Absensi Anak
            </h1>
          </div>
          
          <button
            onClick={() => window.history.back()}
            style={{
              background: COLORS.gray[100],
              border: 'none',
              borderRadius: '12px',
              padding: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ArrowLeft size={20} color={COLORS.gray[600]} />
          </button>
        </div>

        {/* Anak Selector */}
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: '600',
            color: COLORS.gray[700]
          }}>
            Pilih Anak:
          </span>
          
          {anakList.map((anak) => (
            <button
              key={anak.siswa_id}
              onClick={() => setSelectedAnak(anak)}
              style={{
                background: selectedAnak?.siswa_id === anak.siswa_id ? COLORS.primary : COLORS.gray[100],
                color: selectedAnak?.siswa_id === anak.siswa_id ? COLORS.white : COLORS.gray[700],
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              {anak.nama_lengkap} - {anak.kelas}
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        {selectedAnak && (
          <div style={{
            marginTop: '16px',
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={handleAbsenMasuk}
              disabled={isSubmitting}
              style={{
                background: COLORS.success,
                color: COLORS.white,
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              <CheckCircle size={16} />
              Absen Masuk
            </button>

            <button
              onClick={handleAbsenPulang}
              disabled={isSubmitting}
              style={{
                background: COLORS.warning,
                color: COLORS.white,
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              <Clock size={16} />
              Absen Pulang
            </button>

            <button
              onClick={() => setShowIzinModal(true)}
              style={{
                background: COLORS.primary,
                color: COLORS.white,
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <FileText size={16} />
              Ajukan Izin
            </button>
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
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '20px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
              }}
            >
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: COLORS.text,
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <BarChart3 size={18} />
                Statistik Kehadiran {selectedAnak.nama_lengkap}
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '12px'
              }}>
                <div style={{
                  background: `${getStatusColor('hadir')}10`,
                  border: `1px solid ${getStatusColor('hadir')}20`,
                  borderRadius: '8px',
                  padding: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: getStatusColor('hadir')
                  }}>
                    {statistics.hadir}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#666',
                    fontWeight: '600'
                  }}>
                    Hadir
                  </div>
                </div>
                
                <div style={{
                  background: `${getStatusColor('alpa')}10`,
                  border: `1px solid ${getStatusColor('alpa')}20`,
                  borderRadius: '8px',
                  padding: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: getStatusColor('alpa')
                  }}>
                    {statistics.alpa}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#666',
                    fontWeight: '600'
                  }}>
                    Alpha
                  </div>
                </div>
                
                <div style={{
                  background: `${getStatusColor('sakit')}10`,
                  border: `1px solid ${getStatusColor('sakit')}20`,
                  borderRadius: '8px',
                  padding: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: getStatusColor('sakit')
                  }}>
                    {statistics.sakit}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#666',
                    fontWeight: '600'
                  }}>
                    Sakit
                  </div>
                </div>
                
                <div style={{
                  background: `${getStatusColor('izin')}10`,
                  border: `1px solid ${getStatusColor('izin')}20`,
                  borderRadius: '8px',
                  padding: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: getStatusColor('izin')
                  }}>
                    {statistics.izin}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#666',
                    fontWeight: '600'
                  }}>
                    Izin
                  </div>
                </div>
                
                <div style={{
                  background: `${COLORS.accent}10`,
                  border: `1px solid ${COLORS.accent}30`,
                  borderRadius: '8px',
                  padding: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: COLORS.accent
                  }}>
                    {statistics.persentase_kehadiran}%
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#666',
                    fontWeight: '600'
                  }}>
                    Kehadiran
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Filter Section */}
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
            {/* Filter Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: showCalendar ? '0px' : '20px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
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
                  borderRadius: '12px',
                  padding: '10px 16px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
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
                <div style={{
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e5e7eb',
                  maxWidth: '304px',
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

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
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
              gap: '12px',
              background: COLORS.gray[50],
              borderRadius: '12px',
              padding: '12px 16px'
            }}>
              <Search size={20} color={COLORS.gray[500]} />
              <input
                type="text"
                placeholder="Cari berdasarkan tanggal atau status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '16px',
                  color: COLORS.text,
                  flex: 1
                }}
              />
            </div>
          </motion.div>

          {/* Records List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
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
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: COLORS.text,
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <BookOpen size={20} />
                Riwayat Absensi
              </h3>
              
              <button
                onClick={loadAbsensiRecords}
                disabled={isLoading}
                style={{
                  background: COLORS.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                <RefreshCw size={16} className={isLoading ? 'spinning' : ''} />
                Refresh
              </button>
            </div>

            {isLoading ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  border: '3px solid #f3f3f3',
                  borderTop: '3px solid #3498db',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              </div>
            ) : filteredRecords.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                color: COLORS.gray[500]
              }}>
                <BookOpen size={48} color={COLORS.gray[400]} style={{ marginBottom: '12px' }} />
                <p style={{ margin: 0, fontSize: '16px' }}>
                  Tidak ada data absensi untuk periode ini
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredRecords.map((record) => {
                  const StatusIcon = getStatusIcon(record.status_kehadiran)
                  
                  return (
                    <motion.div
                      key={record.id}
                      whileHover={{ scale: 1.02 }}
                      style={{
                        background: COLORS.gray[50],
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #e5e7eb',
                        cursor: 'pointer'
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: `${getStatusColor(record.status_kehadiran)}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <StatusIcon size={20} color={getStatusColor(record.status_kehadiran)} />
                          </div>
                          
                          <div>
                            <div style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: COLORS.text,
                              marginBottom: '4px'
                            }}>
                              {new Date(record.tanggal).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                            
                            <div style={{
                              fontSize: '12px',
                              color: COLORS.gray[600],
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <span style={{
                                background: getStatusColor(record.status_kehadiran),
                                color: 'white',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: '600',
                                textTransform: 'uppercase'
                              }}>
                                {record.status_kehadiran}
                              </span>
                              
                              {record.jam_masuk && (
                                <span>Masuk: {record.jam_masuk}</span>
                              )}
                              
                              {record.jam_pulang && (
                                <span>Pulang: {record.jam_pulang}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <ChevronRight size={20} color={COLORS.gray[400]} />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </>
      )}

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
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '600',
                color: COLORS.text
              }}>
                Ajukan Izin untuk {selectedAnak?.nama_lengkap}
              </h3>
              
              <button
                onClick={() => setShowIzinModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: COLORS.gray[500]
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: COLORS.gray[700],
                  marginBottom: '8px',
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
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                >
                  <option value="sakit">Sakit</option>
                  <option value="izin">Izin</option>
                </select>
              </div>

              <div>
                <label style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: COLORS.gray[700],
                  marginBottom: '8px',
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
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: COLORS.gray[700],
                  marginBottom: '8px',
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
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: COLORS.gray[700],
                  marginBottom: '8px',
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
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: COLORS.gray[700],
                  marginBottom: '8px',
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
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '20px'
              }}>
                <button
                  onClick={() => setShowIzinModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    background: 'white',
                    color: COLORS.gray[700],
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                
                <button
                  onClick={handleSubmitIzin}
                  disabled={isSubmitting || !izinForm.keterangan}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: 'none',
                    borderRadius: '8px',
                    background: COLORS.primary,
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: isSubmitting || !izinForm.keterangan ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting || !izinForm.keterangan ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {isSubmitting && (
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #ffffff40',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                  )}
                  Kirim Izin
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
