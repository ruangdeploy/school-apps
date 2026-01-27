import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
  Search
} from 'lucide-react'
import { guruAPI } from '../services/api'

// Color palette constants
const COLORS = {
  primary: 'rgb(15, 76, 92)',
  accent: 'rgb(244, 163, 0)',
  white: 'rgb(255, 255, 255)'
}

interface Siswa {
  id: number
  nama_lengkap: string
  nis: string
  kelas_id: number
  nama_kelas: string
  status_kehadiran?: string
}

interface UpdateData {
  siswa_id: number
  tanggal: string
  status_kehadiran: string
}

const GuruManageAttendancePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [daftarSiswa, setDaftarSiswa] = useState<Siswa[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedKelas, setSelectedKelas] = useState<string>('')
  const [kelasList, setKelasList] = useState<any[]>([])
  const [pendingUpdates, setPendingUpdates] = useState<UpdateData[]>([])

  useEffect(() => {
    loadKelasList()
  }, [])

  useEffect(() => {
    if (selectedKelas) {
      loadDaftarSiswa()
    }
  }, [selectedKelas, selectedDate])

  const loadKelasList = async () => {
    try {
      console.log('🔄 Loading daftar kelas...')
      const response = await guruAPI.getKelas()
      
      if (response.success && response.data) {
        console.log('✅ Kelas loaded:', response.data)
        setKelasList(Array.isArray(response.data) ? response.data : [response.data])
        
        // Auto select first class if available
        if (Array.isArray(response.data) && response.data.length > 0) {
          setSelectedKelas(response.data[0].id.toString())
        }
      } else {
        console.log('⚠️ No kelas data:', response.message)
        setKelasList([])
      }
    } catch (error) {
      console.error('❌ Error loading kelas:', error)
      setKelasList([])
    }
  }

  const loadDaftarSiswa = async () => {
    if (!selectedKelas) return
    
    try {
      setIsLoading(true)
      console.log('🔄 Loading daftar siswa untuk kelas:', selectedKelas)
      
      // Load siswa list
      const siswaResponse = await guruAPI.getDaftarSiswa(selectedKelas)
      
      if (siswaResponse.success && siswaResponse.data) {
        console.log('✅ Siswa loaded:', siswaResponse.data)
        let siswaList = Array.isArray(siswaResponse.data) ? siswaResponse.data : [siswaResponse.data]
        
        // Load attendance data for the selected date
        try {
          const absensiResponse = await guruAPI.getAbsensiKelas(selectedKelas, selectedDate)
          if (absensiResponse.success && absensiResponse.data) {
            const absensiData = Array.isArray(absensiResponse.data) ? absensiResponse.data : [absensiResponse.data]
            
            // Merge attendance status with student data
            siswaList = siswaList.map(siswa => {
              const absensi = absensiData.find((item: any) => item.siswa_id === siswa.id)
              return {
                ...siswa,
                status_kehadiran: absensi?.status_kehadiran || 'belum_absen'
              }
            })
          }
        } catch (error) {
          console.log('⚠️ No attendance data for this date')
        }
        
        setDaftarSiswa(siswaList)
      } else {
        console.log('⚠️ No siswa data:', siswaResponse.message)
        setDaftarSiswa([])
      }
    } catch (error) {
      console.error('❌ Error loading siswa:', error)
      setDaftarSiswa([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = (siswaId: number, newStatus: string) => {
    // Update local state immediately
    setDaftarSiswa(prev => prev.map(siswa => 
      siswa.id === siswaId 
        ? { ...siswa, status_kehadiran: newStatus }
        : siswa
    ))

    // Add to pending updates
    const updateData: UpdateData = {
      siswa_id: siswaId,
      tanggal: selectedDate,
      status_kehadiran: newStatus
    }

    setPendingUpdates(prev => {
      const existingIndex = prev.findIndex(update => update.siswa_id === siswaId)
      if (existingIndex >= 0) {
        // Update existing
        const newUpdates = [...prev]
        newUpdates[existingIndex] = updateData
        return newUpdates
      } else {
        // Add new
        return [...prev, updateData]
      }
    })
  }

  const saveAllUpdates = async () => {
    if (pendingUpdates.length === 0) {
      alert('Tidak ada perubahan untuk disimpan')
      return
    }

    setIsSaving(true)
    try {
      console.log('💾 Saving attendance updates:', pendingUpdates)
      
      let successCount = 0
      let errorCount = 0
      
      // Process each update
      for (const update of pendingUpdates) {
        try {
          const response = await guruAPI.updateAbsensiSiswa(update)
          if (response.success) {
            successCount++
            console.log('✅ Updated attendance for siswa:', update.siswa_id)
          } else {
            errorCount++
            console.error('❌ Failed to update siswa:', update.siswa_id, response.message)
          }
        } catch (error) {
          errorCount++
          console.error('❌ Error updating siswa:', update.siswa_id, error)
        }
      }
      
      // Clear pending updates
      setPendingUpdates([])
      
      // Show result
      if (errorCount === 0) {
        alert(`✅ Berhasil menyimpan ${successCount} perubahan absensi!`)
      } else {
        alert(`⚠️ ${successCount} berhasil, ${errorCount} gagal disimpan. Silakan coba lagi untuk yang gagal.`)
      }
      
      // Reload data
      loadDaftarSiswa()
      
    } catch (error) {
      console.error('❌ Error saving updates:', error)
      alert('❌ Terjadi kesalahan saat menyimpan. Silakan coba lagi.')
    } finally {
      setIsSaving(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hadir': return '#10b981'
      case 'sakit': return '#3b82f6'
      case 'izin': return '#8b5cf6'
      case 'alpa': return '#ef4444'
      case 'terlambat': return COLORS.accent
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'hadir': return CheckCircle
      case 'sakit': return AlertCircle
      case 'izin': return Clock
      case 'alpa': return XCircle
      case 'terlambat': return AlertCircle
      default: return Clock
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'hadir': return 'Hadir'
      case 'sakit': return 'Sakit'
      case 'izin': return 'Izin'
      case 'alpa': return 'Alpa'
      case 'terlambat': return 'Terlambat'
      case 'belum_absen': return 'Belum Absen'
      default: return 'Unknown'
    }
  }

  const filteredSiswa = daftarSiswa.filter(siswa =>
    siswa.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
    siswa.nis.includes(searchTerm)
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
              Update kehadiran siswa di kelas Anda
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
        {/* Filters */}
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
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            {/* Date Selector */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: COLORS.primary,
                marginBottom: '8px'
              }}>
                <Calendar size={16} style={{ marginRight: '8px' }} />
                Tanggal
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = COLORS.primary
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb'
                }}
              />
            </div>

            {/* Class Selector */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: COLORS.primary,
                marginBottom: '8px'
              }}>
                <BookOpen size={16} style={{ marginRight: '8px' }} />
                Kelas
              </label>
              <select
                value={selectedKelas}
                onChange={(e) => setSelectedKelas(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  backgroundColor: COLORS.white
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = COLORS.primary
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb'
                }}
              >
                <option value="">Pilih Kelas</option>
                {kelasList.map((kelas) => (
                  <option key={kelas.id} value={kelas.id}>
                    {kelas.nama_kelas} - {kelas.jenjang}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: COLORS.primary,
                marginBottom: '8px'
              }}>
                <Search size={16} style={{ marginRight: '8px' }} />
                Cari Siswa
              </label>
              <input
                type="text"
                placeholder="Nama atau NIS siswa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = COLORS.primary
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb'
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <button
              onClick={loadDaftarSiswa}
              disabled={!selectedKelas || isLoading}
              style={{
                background: COLORS.primary,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: (!selectedKelas || isLoading) ? 'not-allowed' : 'pointer',
                opacity: (!selectedKelas || isLoading) ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <RefreshCw size={16} style={{ 
                animation: isLoading ? 'spin 1s linear infinite' : 'none' 
              }} />
              {isLoading ? 'Memuat...' : 'Refresh Data'}
            </button>

            {pendingUpdates.length > 0 && (
              <button
                onClick={saveAllUpdates}
                disabled={isSaving}
                style={{
                  background: COLORS.accent,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  opacity: isSaving ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <Save size={16} />
                {isSaving ? 'Menyimpan...' : `Simpan ${pendingUpdates.length} Perubahan`}
              </button>
            )}
          </div>
        </motion.div>

        {/* Student List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            background: COLORS.white,
            borderRadius: '20px',
            padding: '30px',
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
              fontSize: '24px',
              fontWeight: '700',
              color: COLORS.primary,
              margin: 0
            }}>
              Daftar Siswa
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#666'
            }}>
              <Users size={16} />
              {filteredSiswa.length} Siswa
            </div>
          </div>

          {isLoading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '60px',
              color: '#666'
            }}>
              <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', marginRight: '12px' }} />
              Memuat data siswa...
            </div>
          ) : filteredSiswa.length > 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {filteredSiswa.map((siswa) => {
                const StatusIcon = getStatusIcon(siswa.status_kehadiran || 'belum_absen')
                const statusColor = getStatusColor(siswa.status_kehadiran || 'belum_absen')
                
                return (
                  <div
                    key={siswa.id}
                    style={{
                      background: '#f8fafc',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '20px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      alignItems: 'center',
                      gap: '20px'
                    }}>
                      {/* Student Info */}
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
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '18px',
                          fontWeight: 'bold'
                        }}>
                          {siswa.nama_lengkap.charAt(0)}
                        </div>
                        <div>
                          <h4 style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: COLORS.primary,
                            margin: '0 0 4px 0'
                          }}>
                            {siswa.nama_lengkap}
                          </h4>
                          <p style={{
                            fontSize: '14px',
                            color: '#666',
                            margin: 0
                          }}>
                            NIS: {siswa.nis} • Kelas: {siswa.nama_kelas}
                          </p>
                        </div>
                      </div>

                      {/* Status Selector */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          background: `${statusColor}15`,
                          borderRadius: '8px',
                          border: `1px solid ${statusColor}30`
                        }}>
                          <StatusIcon size={18} color={statusColor} />
                          <span style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: statusColor
                          }}>
                            {getStatusText(siswa.status_kehadiran || 'belum_absen')}
                          </span>
                        </div>

                        <select
                          value={siswa.status_kehadiran || 'belum_absen'}
                          onChange={(e) => handleStatusChange(siswa.id, e.target.value)}
                          style={{
                            padding: '8px 12px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            outline: 'none',
                            cursor: 'pointer',
                            backgroundColor: COLORS.white,
                            minWidth: '120px'
                          }}
                        >
                          <option value="hadir">Hadir</option>
                          <option value="sakit">Sakit</option>
                          <option value="izin">Izin</option>
                          <option value="alpa">Alpa</option>
                          <option value="terlambat">Terlambat</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              color: '#666'
            }}>
              <Users size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p style={{ fontSize: '18px', margin: '0 0 8px 0' }}>
                {selectedKelas ? 'Tidak ada siswa ditemukan' : 'Silakan pilih kelas terlebih dahulu'}
              </p>
              <p style={{ fontSize: '14px', margin: 0, opacity: 0.7 }}>
                {selectedKelas && searchTerm ? 'Coba ubah kata kunci pencarian' : 'Pilih kelas dari dropdown di atas'}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default GuruManageAttendancePage
