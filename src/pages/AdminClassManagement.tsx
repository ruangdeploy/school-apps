import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  School, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  ArrowLeft,
  X,
  Users,
  GraduationCap
} from 'lucide-react'

// Color palette constants
const COLORS = {
  primary: 'rgb(15, 76, 92)',
  accent: 'rgb(244, 163, 0)',
  white: 'rgb(255, 255, 255)',
  success: 'rgb(34, 197, 94)',
  warning: 'rgb(251, 146, 60)',
  error: 'rgb(239, 68, 68)'
}

interface Class {
  id: number
  nama_kelas: string
  tingkat: string
  jurusan?: string
  wali_kelas: string
  jumlah_siswa: number
  kapasitas: number
  ruang_kelas: string
  tahun_ajaran: string
}

const AdminClassManagement: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([
    {
      id: 1,
      nama_kelas: 'X IPA 1',
      tingkat: '10',
      jurusan: 'IPA',
      wali_kelas: 'Dr. Siti Aminah, M.Pd',
      jumlah_siswa: 32,
      kapasitas: 35,
      ruang_kelas: 'R.101',
      tahun_ajaran: '2024/2025'
    },
    {
      id: 2,
      nama_kelas: 'XI IPS 1',
      tingkat: '11',
      jurusan: 'IPS',
      wali_kelas: 'Ahmad Rahman, S.Pd., M.Si',
      jumlah_siswa: 28,
      kapasitas: 35,
      ruang_kelas: 'R.201',
      tahun_ajaran: '2024/2025'
    },
    {
      id: 3,
      nama_kelas: 'XII IPA 2',
      tingkat: '12',
      jurusan: 'IPA',
      wali_kelas: 'Dewi Sartika, S.Pd',
      jumlah_siswa: 30,
      kapasitas: 35,
      ruang_kelas: 'R.301',
      tahun_ajaran: '2024/2025'
    }
  ])
  
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)

  const [newClass, setNewClass] = useState({
    nama_kelas: '',
    tingkat: '',
    jurusan: '',
    wali_kelas: '',
    kapasitas: 35,
    ruang_kelas: '',
    tahun_ajaran: '2024/2025'
  })

  const tingkatOptions = [
    { value: '10', label: 'Kelas X' },
    { value: '11', label: 'Kelas XI' },
    { value: '12', label: 'Kelas XII' }
  ]

  const jurusanOptions = [
    'IPA',
    'IPS', 
    'Bahasa',
    'TKJ',
    'RPL',
    'MM',
    'OTKP',
    'AKL',
    'BDP'
  ]

  const waliKelasOptions = [
    'Dr. Siti Aminah, M.Pd',
    'Ahmad Rahman, S.Pd., M.Si',
    'Dewi Sartika, S.Pd',
    'Budi Santoso, S.Pd',
    'Lisa Maharani, S.Pd'
  ]

  const filteredClasses = classes.filter(cls =>
    cls.nama_kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.wali_kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.ruang_kelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cls.jurusan && cls.jurusan.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleAddClass = async () => {
    try {
      // Validate required fields
      if (!newClass.nama_kelas || !newClass.tingkat || !newClass.wali_kelas || !newClass.ruang_kelas) {
        alert('Mohon lengkapi field yang wajib diisi')
        return
      }

      // In real app, use API:
      // await adminAPI.createClass(newClass)
      
      alert('Kelas berhasil ditambahkan')
      setShowAddModal(false)
      setNewClass({
        nama_kelas: '',
        tingkat: '',
        jurusan: '',
        wali_kelas: '',
        kapasitas: 35,
        ruang_kelas: '',
        tahun_ajaran: '2024/2025'
      })
      // loadClasses()
    } catch (error) {
      console.error('Error adding class:', error)
      alert('Gagal menambahkan kelas')
    }
  }

  const handleDeleteClass = async (cls: Class) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kelas ${cls.nama_kelas}?`)) {
      return
    }

    try {
      // In real app, use API:
      // await adminAPI.deleteClass(cls.id.toString())
      
      alert('Kelas berhasil dihapus')
      // loadClasses()
    } catch (error) {
      console.error('Error deleting class:', error)
      alert('Gagal menghapus kelas')
    }
  }

  const getCapacityColor = (current: number, max: number) => {
    const percentage = (current / max) * 100
    if (percentage >= 90) return { bg: '#fee2e2', color: '#dc2626' }
    if (percentage >= 80) return { bg: '#fef3c7', color: '#92400e' }
    return { bg: '#dcfce7', color: '#166534' }
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
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '70px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <button
              onClick={() => window.location.href = '/admin/dashboard'}
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
                Manajemen Kelas
              </h1>
              <p style={{
                fontSize: '14px',
                color: '#666',
                margin: 0
              }}>
                Kelola data kelas sekolah
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                background: COLORS.primary,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Plus size={16} />
              Tambah Kelas
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px'
      }}>
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: COLORS.white,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            marginBottom: '20px'
          }}
        >
          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center'
          }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search
                size={20}
                color="#6b7280"
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              />
              <input
                type="text"
                placeholder="Cari kelas (nama kelas, wali kelas, ruang kelas, jurusan)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 44px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Classes Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {loading ? (
            <div style={{
              padding: '60px',
              textAlign: 'center',
              background: COLORS.white,
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid #e5e7eb',
                borderTop: '3px solid ' + COLORS.primary,
                borderRadius: '50%',
                margin: '0 auto 20px',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p style={{ color: '#6b7280', margin: 0 }}>Memuat data kelas...</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {filteredClasses.map((cls) => (
                <motion.div
                  key={cls.id}
                  whileHover={{ scale: 1.02 }}
                  style={{
                    background: COLORS.white,
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #f3f4f6',
                    position: 'relative'
                  }}
                >
                  {/* Class Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '16px'
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: COLORS.primary,
                        margin: '0 0 4px 0'
                      }}>
                        {cls.nama_kelas}
                      </h3>
                      {cls.jurusan && (
                        <span style={{
                          background: '#e0e7ff',
                          color: '#3730a3',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {cls.jurusan}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          setSelectedClass(cls)
                          setShowDetailModal(true)
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '6px',
                          borderRadius: '6px',
                          color: '#6b7280',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = '#f3f4f6'
                          e.currentTarget.style.color = COLORS.primary
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'none'
                          e.currentTarget.style.color = '#6b7280'
                        }}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '6px',
                          borderRadius: '6px',
                          color: '#6b7280',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = '#f3f4f6'
                          e.currentTarget.style.color = COLORS.accent
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'none'
                          e.currentTarget.style.color = '#6b7280'
                        }}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClass(cls)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '6px',
                          borderRadius: '6px',
                          color: '#6b7280',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = '#fee2e2'
                          e.currentTarget.style.color = '#dc2626'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'none'
                          e.currentTarget.style.color = '#6b7280'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Class Info */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <GraduationCap size={16} color="#6b7280" />
                      <span style={{ fontSize: '14px', color: '#374151' }}>
                        Wali Kelas: {cls.wali_kelas}
                      </span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <School size={16} color="#6b7280" />
                      <span style={{ fontSize: '14px', color: '#374151' }}>
                        Ruang: {cls.ruang_kelas}
                      </span>
                    </div>
                  </div>

                  {/* Capacity Info */}
                  <div style={{
                    background: '#f9fafb',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Users size={16} color="#6b7280" />
                        <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                          Kapasitas Siswa
                        </span>
                      </div>
                      <span style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: getCapacityColor(cls.jumlah_siswa, cls.kapasitas).color
                      }}>
                        {cls.jumlah_siswa}/{cls.kapasitas}
                      </span>
                    </div>
                    
                    {/* Capacity Bar */}
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: '#e5e7eb',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${(cls.jumlah_siswa / cls.kapasitas) * 100}%`,
                        background: getCapacityColor(cls.jumlah_siswa, cls.kapasitas).color,
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>

                  {/* Tahun Ajaran */}
                  <div style={{
                    marginTop: '12px',
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>
                    Tahun Ajaran: {cls.tahun_ajaran}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {filteredClasses.length === 0 && !loading && (
            <div style={{
              padding: '60px',
              textAlign: 'center',
              background: COLORS.white,
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
              <School size={48} color="#d1d5db" style={{ margin: '0 auto 20px' }} />
              <h3 style={{ fontSize: '18px', color: '#6b7280', margin: '0 0 8px 0' }}>
                Tidak ada kelas ditemukan
              </h3>
              <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
                Coba ubah kata kunci pencarian atau tambahkan kelas baru
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Class Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: COLORS.white,
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1f2937',
                margin: 0
              }}>
                Tambah Kelas Baru
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '4px',
                  color: '#6b7280'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Nama Kelas *
                </label>
                <input
                  type="text"
                  value={newClass.nama_kelas}
                  onChange={(e) => setNewClass({ ...newClass, nama_kelas: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Masukkan nama kelas"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Tingkat *
                </label>
                <select
                  value={newClass.tingkat}
                  onChange={(e) => setNewClass({ ...newClass, tingkat: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    background: 'white'
                  }}
                >
                  <option value="">Pilih Tingkat</option>
                  {tingkatOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Jurusan
                </label>
                <select
                  value={newClass.jurusan}
                  onChange={(e) => setNewClass({ ...newClass, jurusan: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    background: 'white'
                  }}
                >
                  <option value="">Pilih Jurusan</option>
                  {jurusanOptions.map(jurusan => (
                    <option key={jurusan} value={jurusan}>{jurusan}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Wali Kelas *
                </label>
                <select
                  value={newClass.wali_kelas}
                  onChange={(e) => setNewClass({ ...newClass, wali_kelas: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    background: 'white'
                  }}
                >
                  <option value="">Pilih Wali Kelas</option>
                  {waliKelasOptions.map(guru => (
                    <option key={guru} value={guru}>{guru}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Ruang Kelas *
                </label>
                <input
                  type="text"
                  value={newClass.ruang_kelas}
                  onChange={(e) => setNewClass({ ...newClass, ruang_kelas: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Masukkan ruang kelas"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Kapasitas
                </label>
                <input
                  type="number"
                  value={newClass.kapasitas}
                  onChange={(e) => setNewClass({ ...newClass, kapasitas: parseInt(e.target.value) || 35 })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  min="1"
                  max="50"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  padding: '12px 24px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  background: 'white',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Batal
              </button>
              <button
                onClick={handleAddClass}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  background: COLORS.primary,
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Simpan
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Class Detail Modal */}
      {showDetailModal && selectedClass && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: COLORS.white,
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1f2937',
                margin: 0
              }}>
                Detail Kelas
              </h3>
              <button
                onClick={() => {
                  setShowDetailModal(false)
                  setSelectedClass(null)
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '4px',
                  color: '#6b7280'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: '#f9fafb',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>
                  {selectedClass.nama_kelas}
                </h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    background: '#e0e7ff',
                    color: '#3730a3',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    Tingkat {selectedClass.tingkat}
                  </span>
                  {selectedClass.jurusan && (
                    <span style={{
                      background: '#fef3c7',
                      color: '#92400e',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {selectedClass.jurusan}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Wali Kelas</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <GraduationCap size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#374151' }}>{selectedClass.wali_kelas}</span>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Ruang Kelas</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <School size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#374151' }}>{selectedClass.ruang_kelas}</span>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Kapasitas Siswa</label>
                <div style={{ marginTop: '8px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Users size={16} color="#6b7280" />
                      <span style={{ fontSize: '14px', color: '#374151' }}>
                        {selectedClass.jumlah_siswa} dari {selectedClass.kapasitas} siswa
                      </span>
                    </div>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: getCapacityColor(selectedClass.jumlah_siswa, selectedClass.kapasitas).color
                    }}>
                      {Math.round((selectedClass.jumlah_siswa / selectedClass.kapasitas) * 100)}%
                    </span>
                  </div>
                  
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: '#e5e7eb',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${(selectedClass.jumlah_siswa / selectedClass.kapasitas) * 100}%`,
                      background: getCapacityColor(selectedClass.jumlah_siswa, selectedClass.kapasitas).color,
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Tahun Ajaran</label>
                <p style={{ fontSize: '14px', color: '#374151', margin: '4px 0 0 0' }}>
                  {selectedClass.tahun_ajaran}
                </p>
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
      `}</style>
    </div>
  )
}

export default AdminClassManagement
