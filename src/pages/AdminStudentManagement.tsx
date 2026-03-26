import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Filter,
  Download,
  Upload,
  ArrowLeft,
  X
} from 'lucide-react'
import { adminAPI } from '../services/api'

// Color palette constants
const COLORS = {
  primary: 'rgb(15, 76, 92)',
  accent: 'rgb(244, 163, 0)',
  white: 'rgb(255, 255, 255)',
  success: 'rgb(34, 197, 94)',
  warning: 'rgb(251, 146, 60)',
  error: 'rgb(239, 68, 68)'
}

interface Student {
  id: number
  nis: string
  nama_lengkap: string
  email: string
  kelas: string
  jenis_kelamin: 'L' | 'P'
  tanggal_lahir: string
  alamat: string
  status: 'aktif' | 'tidak_aktif' | 'lulus'
  created_at: string
}

const AdminStudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [newStudent, setNewStudent] = useState({
    nis: '',
    nama_lengkap: '',
    email: '',
    password: '',
    kelas_id: '',
    jenis_kelamin: 'L' as 'L' | 'P',
    tanggal_lahir: '',
    alamat: '',
    no_telepon: ''
  })

  // Mock classes data - in real app, this would come from API
  const classes = [
    { id: '1', nama: 'X IPA 1' },
    { id: '2', nama: 'X IPA 2' },
    { id: '3', nama: 'XI IPA 1' },
    { id: '4', nama: 'XI IPA 2' },
    { id: '5', nama: 'XII IPA 1' },
    { id: '6', nama: 'XII IPA 2' }
  ]

  useEffect(() => {
    loadStudents()
  }, [currentPage, searchTerm, selectedClass, selectedStatus])

  const loadStudents = async () => {
    try {
      setLoading(true)
      
      // For demo purposes, use mock data
      // In real app, uncomment this:
      // const response = await adminAPI.getAllStudents(currentPage, 10, searchTerm)
      
      // Mock data for demo
      const mockStudents: Student[] = [
        {
          id: 1,
          nis: '2024001',
          nama_lengkap: 'Ahmad Rizki Pratama',
          email: 'ahmad.rizki@school.com',
          kelas: 'XII IPA 1',
          jenis_kelamin: 'L',
          tanggal_lahir: '2008-05-15',
          alamat: 'Jl. Sudirman No. 123, Jakarta',
          status: 'aktif',
          created_at: '2024-07-01'
        },
        {
          id: 2,
          nis: '2024002',
          nama_lengkap: 'Siti Nurhaliza',
          email: 'siti.nur@school.com',
          kelas: 'XII IPA 1',
          jenis_kelamin: 'P',
          tanggal_lahir: '2008-03-22',
          alamat: 'Jl. Thamrin No. 456, Jakarta',
          status: 'aktif',
          created_at: '2024-07-01'
        },
        {
          id: 3,
          nis: '2024003',
          nama_lengkap: 'Budi Santoso',
          email: 'budi.santoso@school.com',
          kelas: 'XI IPA 1',
          jenis_kelamin: 'L',
          tanggal_lahir: '2009-01-10',
          alamat: 'Jl. Gatot Subroto No. 789, Jakarta',
          status: 'aktif',
          created_at: '2024-07-01'
        }
      ]

      // Filter mock data based on search and filters
      let filteredStudents = mockStudents
      
      if (searchTerm) {
        filteredStudents = filteredStudents.filter(student =>
          student.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.nis.includes(searchTerm) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      
      if (selectedClass) {
        filteredStudents = filteredStudents.filter(student =>
          student.kelas.includes(selectedClass)
        )
      }
      
      if (selectedStatus) {
        filteredStudents = filteredStudents.filter(student =>
          student.status === selectedStatus
        )
      }

      setStudents(filteredStudents)
      setTotalPages(Math.ceil(filteredStudents.length / 10))
      
    } catch (error) {
      console.error('Error loading students:', error)
      alert('Gagal memuat data siswa')
    } finally {
      setLoading(false)
    }
  }

  const handleAddStudent = async () => {
    try {
      // Validate required fields
      if (!newStudent.nis || !newStudent.nama_lengkap || !newStudent.email) {
        alert('Mohon lengkapi field yang wajib diisi')
        return
      }

      // In real app, use API:
      // await adminAPI.createStudent(newStudent)
      
      alert('Siswa berhasil ditambahkan')
      setShowAddModal(false)
      setNewStudent({
        nis: '',
        nama_lengkap: '',
        email: '',
        password: '',
        kelas_id: '',
        jenis_kelamin: 'L',
        tanggal_lahir: '',
        alamat: '',
        no_telepon: ''
      })
      loadStudents()
    } catch (error) {
      console.error('Error adding student:', error)
      alert('Gagal menambahkan siswa')
    }
  }

  const handleEditStudent = async () => {
    if (!selectedStudent) return

    try {
      // In real app, use API:
      // await adminAPI.updateStudent(selectedStudent.id.toString(), selectedStudent)
      
      alert('Data siswa berhasil diupdate')
      setShowEditModal(false)
      setSelectedStudent(null)
      loadStudents()
    } catch (error) {
      console.error('Error updating student:', error)
      alert('Gagal mengupdate data siswa')
    }
  }

  const handleDeleteStudent = async (student: Student) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus siswa ${student.nama_lengkap}?`)) {
      return
    }

    try {
      // In real app, use API:
      // await adminAPI.deleteStudent(student.id.toString())
      
      alert('Siswa berhasil dihapus')
      loadStudents()
    } catch (error) {
      console.error('Error deleting student:', error)
      alert('Gagal menghapus siswa')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
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
                Manajemen Siswa
              </h1>
              <p style={{
                fontSize: '14px',
                color: '#666',
                margin: 0
              }}>
                Kelola data siswa sekolah
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
              Tambah Siswa
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
        {/* Filters */}
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
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '20px'
          }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
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
                placeholder="Cari siswa..."
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

            {/* Class Filter */}
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                background: 'white'
              }}
            >
              <option value="">Semua Kelas</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.nama}>{cls.nama}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                background: 'white'
              }}
            >
              <option value="">Semua Status</option>
              <option value="aktif">Aktif</option>
              <option value="tidak_aktif">Tidak Aktif</option>
              <option value="lulus">Lulus</option>
            </select>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                style={{
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  background: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px'
                }}
              >
                <Download size={16} />
                Export
              </button>
              <button
                style={{
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  background: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px'
                }}
              >
                <Upload size={16} />
                Import
              </button>
            </div>
          </div>
        </motion.div>

        {/* Students Table */}
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
              <p style={{ color: '#6b7280', margin: 0 }}>Memuat data siswa...</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead style={{ background: '#f9fafb' }}>
                  <tr>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>NIS</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Nama</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Kelas</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Email</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151' }}>JK</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Status</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#374151', fontFamily: 'monospace' }}>
                        {student.nis}
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#374151', fontWeight: '500' }}>
                        {student.nama_lengkap}
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#374151' }}>
                        {student.kelas}
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                        {student.email}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <span style={{
                          background: student.jenis_kelamin === 'L' ? '#dbeafe' : '#fce7f3',
                          color: student.jenis_kelamin === 'L' ? '#1e40af' : '#be185d',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {student.jenis_kelamin}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <span style={{
                          background: student.status === 'aktif' ? '#dcfce7' : student.status === 'lulus' ? '#fef3c7' : '#fee2e2',
                          color: student.status === 'aktif' ? '#166534' : student.status === 'lulus' ? '#92400e' : '#dc2626',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          <button
                            onClick={() => {
                              setSelectedStudent(student)
                              // Show detail modal or navigate to detail page
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
                            onClick={() => {
                              setSelectedStudent(student)
                              setShowEditModal(true)
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
                            onClick={() => handleDeleteStudent(student)}
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

              {students.length === 0 && !loading && (
                <div style={{
                  padding: '60px',
                  textAlign: 'center'
                }}>
                  <Users size={48} color="#d1d5db" style={{ margin: '0 auto 20px' }} />
                  <h3 style={{ fontSize: '18px', color: '#6b7280', margin: '0 0 8px 0' }}>
                    Tidak ada siswa ditemukan
                  </h3>
                  <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
                    Coba ubah filter atau tambahkan siswa baru
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Student Modal */}
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
                Tambah Siswa Baru
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  NIS *
                </label>
                <input
                  type="text"
                  value={newStudent.nis}
                  onChange={(e) => setNewStudent({ ...newStudent, nis: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Masukkan NIS"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={newStudent.nama_lengkap}
                  onChange={(e) => setNewStudent({ ...newStudent, nama_lengkap: e.target.value })}
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
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Kelas
                  </label>
                  <select
                    value={newStudent.kelas_id}
                    onChange={(e) => setNewStudent({ ...newStudent, kelas_id: e.target.value })}
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
                    <option value="">Pilih Kelas</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.nama}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Jenis Kelamin
                  </label>
                  <select
                    value={newStudent.jenis_kelamin}
                    onChange={(e) => setNewStudent({ ...newStudent, jenis_kelamin: e.target.value as 'L' | 'P' })}
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

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  value={newStudent.tanggal_lahir}
                  onChange={(e) => setNewStudent({ ...newStudent, tanggal_lahir: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
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
                  onClick={handleAddStudent}
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

export default AdminStudentManagement
