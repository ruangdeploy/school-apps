import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  GraduationCap, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  ArrowLeft,
  X,
  Mail,
  Phone
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

interface Teacher {
  id: number
  nip: string
  nama_lengkap: string
  email: string
  mata_pelajaran: string
  no_telepon: string
  alamat: string
  status: 'aktif' | 'tidak_aktif' | 'pensiun'
  jenis_kelamin: 'L' | 'P'
  tanggal_lahir: string
}

const AdminTeacherManagement: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: 1,
      nip: '197501012005011001',
      nama_lengkap: 'Dr. Siti Aminah, M.Pd',
      email: 'siti.aminah@school.com',
      mata_pelajaran: 'Matematika',
      no_telepon: '081234567890',
      alamat: 'Jl. Pendidikan No. 123, Jakarta',
      status: 'aktif',
      jenis_kelamin: 'P',
      tanggal_lahir: '1975-01-01'
    },
    {
      id: 2,
      nip: '198003152006041002',
      nama_lengkap: 'Ahmad Rahman, S.Pd., M.Si',
      email: 'ahmad.rahman@school.com',
      mata_pelajaran: 'Fisika',
      no_telepon: '081234567891',
      alamat: 'Jl. Ilmu No. 456, Jakarta',
      status: 'aktif',
      jenis_kelamin: 'L',
      tanggal_lahir: '1980-03-15'
    },
    {
      id: 3,
      nip: '197812201999032003',
      nama_lengkap: 'Dewi Sartika, S.Pd',
      email: 'dewi.sartika@school.com',
      mata_pelajaran: 'Bahasa Indonesia',
      no_telepon: '081234567892',
      alamat: 'Jl. Sastra No. 789, Jakarta',
      status: 'aktif',
      jenis_kelamin: 'P',
      tanggal_lahir: '1978-12-20'
    }
  ])
  
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)

  const [newTeacher, setNewTeacher] = useState({
    nip: '',
    nama_lengkap: '',
    email: '',
    password: '',
    mata_pelajaran: '',
    no_telepon: '',
    alamat: '',
    jenis_kelamin: 'L' as 'L' | 'P',
    tanggal_lahir: ''
  })

  const subjects = [
    'Matematika',
    'Fisika', 
    'Kimia',
    'Biologi',
    'Bahasa Indonesia',
    'Bahasa Inggris',
    'Sejarah',
    'Geografi',
    'Ekonomi',
    'Sosiologi',
    'Seni Budaya',
    'Pendidikan Jasmani',
    'Informatika'
  ]

  const filteredTeachers = teachers.filter(teacher =>
    teacher.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.nip.includes(searchTerm) ||
    teacher.mata_pelajaran.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddTeacher = async () => {
    try {
      // Validate required fields
      if (!newTeacher.nip || !newTeacher.nama_lengkap || !newTeacher.email || !newTeacher.mata_pelajaran) {
        alert('Mohon lengkapi field yang wajib diisi')
        return
      }

      // In real app, use API:
      // await adminAPI.createTeacher(newTeacher)
      
      alert('Guru berhasil ditambahkan')
      setShowAddModal(false)
      setNewTeacher({
        nip: '',
        nama_lengkap: '',
        email: '',
        password: '',
        mata_pelajaran: '',
        no_telepon: '',
        alamat: '',
        jenis_kelamin: 'L',
        tanggal_lahir: ''
      })
      // loadTeachers()
    } catch (error) {
      console.error('Error adding teacher:', error)
      alert('Gagal menambahkan guru')
    }
  }

  const handleDeleteTeacher = async (teacher: Teacher) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus guru ${teacher.nama_lengkap}?`)) {
      return
    }

    try {
      // In real app, use API:
      // await adminAPI.deleteTeacher(teacher.id.toString())
      
      alert('Guru berhasil dihapus')
      // loadTeachers()
    } catch (error) {
      console.error('Error deleting teacher:', error)
      alert('Gagal menghapus guru')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aktif': return { bg: '#dcfce7', color: '#166534' }
      case 'tidak_aktif': return { bg: '#fee2e2', color: '#dc2626' }
      case 'pensiun': return { bg: '#fef3c7', color: '#92400e' }
      default: return { bg: '#f3f4f6', color: '#374151' }
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
                Manajemen Guru
              </h1>
              <p style={{
                fontSize: '14px',
                color: '#666',
                margin: 0
              }}>
                Kelola data guru sekolah
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
              Tambah Guru
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
                placeholder="Cari guru (nama, NIP, mata pelajaran, email)..."
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

        {/* Teachers Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: COLORS.white,
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}
        >
          {loading ? (
            <div style={{
              padding: '60px',
              textAlign: 'center'
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
              <p style={{ color: '#6b7280', margin: 0 }}>Memuat data guru...</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead style={{ background: '#f9fafb' }}>
                  <tr>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>NIP</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Nama</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Mata Pelajaran</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Email</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Status</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '16px', fontSize: '12px', color: '#374151', fontFamily: 'monospace' }}>
                        {teacher.nip}
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                        <div>
                          <div>{teacher.nama_lengkap}</div>
                          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                            {teacher.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#374151' }}>
                        <span style={{
                          background: '#e0e7ff',
                          color: '#3730a3',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {teacher.mata_pelajaran}
                        </span>
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                        {teacher.email}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <span style={{
                          background: getStatusColor(teacher.status).bg,
                          color: getStatusColor(teacher.status).color,
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {teacher.status.charAt(0).toUpperCase() + teacher.status.slice(1)}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          <button
                            onClick={() => {
                              setSelectedTeacher(teacher)
                              setShowDetailModal(true)
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '6px',
                              borderRadius: '4px',
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
                              borderRadius: '4px',
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
                            onClick={() => handleDeleteTeacher(teacher)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '6px',
                              borderRadius: '4px',
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredTeachers.length === 0 && !loading && (
                <div style={{
                  padding: '60px',
                  textAlign: 'center'
                }}>
                  <GraduationCap size={48} color="#d1d5db" style={{ margin: '0 auto 20px' }} />
                  <h3 style={{ fontSize: '18px', color: '#6b7280', margin: '0 0 8px 0' }}>
                    Tidak ada guru ditemukan
                  </h3>
                  <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
                    Coba ubah kata kunci pencarian atau tambahkan guru baru
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Teacher Modal */}
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
                Tambah Guru Baru
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
                  NIP *
                </label>
                <input
                  type="text"
                  value={newTeacher.nip}
                  onChange={(e) => setNewTeacher({ ...newTeacher, nip: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Masukkan NIP"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={newTeacher.nama_lengkap}
                  onChange={(e) => setNewTeacher({ ...newTeacher, nama_lengkap: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Masukkan nama lengkap"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Masukkan email"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Mata Pelajaran *
                </label>
                <select
                  value={newTeacher.mata_pelajaran}
                  onChange={(e) => setNewTeacher({ ...newTeacher, mata_pelajaran: e.target.value })}
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
                  <option value="">Pilih Mata Pelajaran</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  No. Telepon
                </label>
                <input
                  type="tel"
                  value={newTeacher.no_telepon}
                  onChange={(e) => setNewTeacher({ ...newTeacher, no_telepon: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Masukkan no telepon"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Jenis Kelamin
                </label>
                <select
                  value={newTeacher.jenis_kelamin}
                  onChange={(e) => setNewTeacher({ ...newTeacher, jenis_kelamin: e.target.value as 'L' | 'P' })}
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
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Alamat
              </label>
              <textarea
                value={newTeacher.alamat}
                onChange={(e) => setNewTeacher({ ...newTeacher, alamat: e.target.value })}
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
                placeholder="Masukkan alamat lengkap"
              />
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
                onClick={handleAddTeacher}
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

      {/* Teacher Detail Modal */}
      {showDetailModal && selectedTeacher && (
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
                Detail Guru
              </h3>
              <button
                onClick={() => {
                  setShowDetailModal(false)
                  setSelectedTeacher(null)
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
                  {selectedTeacher.nama_lengkap}
                </h4>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>
                  NIP: {selectedTeacher.nip}
                </p>
                <span style={{
                  background: '#e0e7ff',
                  color: '#3730a3',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {selectedTeacher.mata_pelajaran}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Email</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <Mail size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#374151' }}>{selectedTeacher.email}</span>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>No. Telepon</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <Phone size={16} color="#6b7280" />
                    <span style={{ fontSize: '14px', color: '#374151' }}>{selectedTeacher.no_telepon}</span>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Alamat</label>
                <p style={{ fontSize: '14px', color: '#374151', margin: '4px 0 0 0' }}>
                  {selectedTeacher.alamat}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Jenis Kelamin</label>
                  <p style={{ fontSize: '14px', color: '#374151', margin: '4px 0 0 0' }}>
                    {selectedTeacher.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>Status</label>
                  <div style={{ marginTop: '4px' }}>
                    <span style={{
                      background: getStatusColor(selectedTeacher.status).bg,
                      color: getStatusColor(selectedTeacher.status).color,
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {selectedTeacher.status.charAt(0).toUpperCase() + selectedTeacher.status.slice(1)}
                    </span>
                  </div>
                </div>
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

export default AdminTeacherManagement
