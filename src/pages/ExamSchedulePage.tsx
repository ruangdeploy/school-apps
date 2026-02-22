import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock } from 'lucide-react'
import { siswaAPI } from '../services/api'

const ExamSchedulePage: React.FC = () => {
  // State for filter
  const [tanggalMulai, setTanggalMulai] = useState('2026-01-01')
  const [tanggalSelesai, setTanggalSelesai] = useState('2026-03-30')
  const [jadwalUjianKelas, setJadwalUjianKelas] = useState<any[]>([])
  const [jadwalUjianSiswa, setJadwalUjianSiswa] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJadwalUjian = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await siswaAPI.getJadwalUjian(tanggalMulai, tanggalSelesai)
        if (res.success && typeof res.data === 'object' && res.data !== null) {
          const data: any = res.data as any
          setJadwalUjianKelas(Array.isArray(data.jadwal_ujian_kelas) ? data.jadwal_ujian_kelas : [])
          setJadwalUjianSiswa(Array.isArray(data.jadwal_ujian_siswa) ? data.jadwal_ujian_siswa : [])
        } else {
          setJadwalUjianKelas([])
          setJadwalUjianSiswa([])
          setError(res.message || 'Gagal memuat jadwal ujian')
        }
      } catch (e: any) {
        setError(e?.message || 'Gagal memuat jadwal ujian')
        setJadwalUjianKelas([])
        setJadwalUjianSiswa([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchJadwalUjian()
  }, [tanggalMulai, tanggalSelesai])

  return (
    <div className="exam-bg">
      {/* Header */}
      <div className="exam-header">
        <div className="exam-header-inner">
          <div>
            <h1 className="exam-title">
              <Calendar size={28} /> Jadwal Ujian
            </h1>
            <p className="exam-desc">
              Kelola dan lihat jadwal ujian
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="exam-main">
        {/* Filter tanggal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="exam-card"
        >
          <div className="exam-filter">
            <label className="exam-label">Tanggal Mulai:</label>
            <input
              type="date"
              value={tanggalMulai}
              onChange={e => setTanggalMulai(e.target.value)}
              className="exam-input"
            />
            <label className="exam-label">Tanggal Selesai:</label>
            <input
              type="date"
              value={tanggalSelesai}
              onChange={e => setTanggalSelesai(e.target.value)}
              className="exam-input"
            />
          </div>
          {/* Jadwal ujian list */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Memuat jadwal ujian...</div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>{error}</div>
          ) : (
            <>
              {/* Jadwal Ujian Kelas */}
              <h3 className="exam-section-title">Jadwal Ujian Kelas</h3>
              {jadwalUjianKelas.length === 0 ? (
                <div className="exam-list-empty">Tidak ada jadwal ujian kelas pada rentang tanggal ini.</div>
              ) : (
                jadwalUjianKelas.map((item, index) => (
                  <motion.div
                    key={item.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="exam-list-item"
                  >
                    <div className="exam-list-time">
                      <div className="exam-list-time-icon">
                        <Clock size={28} color="#F4A300" />
                      </div>
                      <p className="exam-list-time-info">
                        {item.tanggal} {item.jam_mulai} - {item.jam_selesai}
                      </p>
                      <span className="exam-list-time-badge">
                        {item.jenis_ujian} | {item.semester} | {item.tahun_ajaran}
                      </span>
                    </div>
                    <div className="exam-list-content">
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <div>
                          <h3 className="exam-list-content-title">{item.nama_mapel}</h3>
                          <span className="exam-list-content-badge">Kelas {item.nama_kelas}</span>
                        </div>
                      </div>
                      <div className="exam-list-content-meta">
                        <div className="exam-list-content-meta-item">
                          <div className="exam-list-content-meta-icon">
                            <Calendar size={18} color="#0F4C5C" />
                          </div>
                          <div>
                            <p className="exam-list-content-meta-title">{item.nama_guru}</p>
                            <p className="exam-list-content-meta-desc">Guru</p>
                          </div>
                        </div>
                        <div className="exam-list-content-meta-item">
                          <div className="exam-list-content-meta-icon exam-list-content-meta-icon-accent">
                            <Calendar size={18} color="#F4A300" />
                          </div>
                          <div>
                            <p className="exam-list-content-meta-title">{item.ruangan}</p>
                            <p className="exam-list-content-meta-desc">Ruangan</p>
                          </div>
                        </div>
                      </div>
                      <div className="exam-list-content-keterangan">{item.keterangan}</div>
                    </div>
                  </motion.div>
                ))
              )}
              {/* Jadwal Ujian Siswa */}
              <h3 className="exam-section-title" style={{ color: '#F4A300', marginTop: 20 }}>Jadwal Ujian Siswa</h3>
              {jadwalUjianSiswa.length === 0 ? (
                <div className="exam-list-empty">Tidak ada jadwal ujian siswa pada rentang tanggal ini.</div>
              ) : (
                jadwalUjianSiswa.map((item, index) => (
                  <motion.div
                    key={item.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="exam-list-item"
                  >
                    <div className="exam-list-time">
                      <div className="exam-list-time-icon">
                        <Clock size={28} color="#F4A300" />
                      </div>
                      <p className="exam-list-time-info">
                        {item.tanggal} {item.jam_mulai} - {item.jam_selesai}
                      </p>
                      <span className="exam-list-time-badge">
                        {item.jenis_ujian} | {item.semester} | {item.tahun_ajaran}
                      </span>
                    </div>
                    <div className="exam-list-content">
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <div>
                          <h3 className="exam-list-content-title">{item.nama_mapel}</h3>
                          <span className="exam-list-content-badge">Siswa NIS: {item.nis}</span>
                        </div>
                      </div>
                      <div className="exam-list-content-meta">
                        <div className="exam-list-content-meta-item">
                          <div className="exam-list-content-meta-icon">
                            <Calendar size={18} color="#0F4C5C" />
                          </div>
                          <div>
                            <p className="exam-list-content-meta-title">{item.nama_guru}</p>
                            <p className="exam-list-content-meta-desc">Guru</p>
                          </div>
                        </div>
                        <div className="exam-list-content-meta-item">
                          <div className="exam-list-content-meta-icon exam-list-content-meta-icon-accent">
                            <Calendar size={18} color="#F4A300" />
                          </div>
                          <div>
                            <p className="exam-list-content-meta-title">{item.ruangan}</p>
                            <p className="exam-list-content-meta-desc">Ruangan</p>
                          </div>
                        </div>
                      </div>
                      <div className="exam-list-content-keterangan">{item.keterangan}</div>
                    </div>
                  </motion.div>
                ))
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default ExamSchedulePage
