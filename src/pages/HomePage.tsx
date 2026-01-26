import React, { useState, useEffect } from 'react'
import { Clock, BookOpen } from 'lucide-react'

// Color palette constants - same as login page
const COLORS = {
  primary: 'rgb(15, 76, 92)',
  accent: 'rgb(244, 163, 0)',
  white: 'rgb(255, 255, 255)'
}

const HomePage: React.FC = () => {
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('userData')
    return userData ? JSON.parse(userData) : null
  })

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem('userData')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = '/login'
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <div style={{
        backgroundColor: COLORS.primary,
        color: COLORS.white,
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>School Apps</h1>
          <p style={{ margin: '0.25rem 0 0 0', opacity: 0.8 }}>
            Selamat datang, {user?.nama_lengkap || 'User'}
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: COLORS.white,
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '1rem' }}>
        <div style={{
          background: COLORS.white,
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '1rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: COLORS.primary, marginTop: 0 }}>Dashboard</h2>
          <p>Login berhasil! Backend terintegrasi dengan frontend.</p>
          
          {user && (
            <div style={{
              background: '#f8f9fa',
              padding: '1rem',
              borderRadius: '0.5rem',
              marginTop: '1rem'
            }}>
              <h3 style={{ marginTop: 0, color: COLORS.primary }}>Informasi User</h3>
              <p><strong>Nama:</strong> {user.nama_lengkap}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.tipe_user}</p>
              <p><strong>Telepon:</strong> {user.no_telepon}</p>
              
              {user.siswa && (
                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{ color: COLORS.primary }}>Data Siswa</h4>
                  <p><strong>NIS:</strong> {user.siswa.nis}</p>
                  <p><strong>NISN:</strong> {user.siswa.nisn}</p>
                  <p><strong>Kelas:</strong> {user.siswa.nama_kelas}</p>
                  <p><strong>Tingkat:</strong> {user.siswa.tingkat}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            background: COLORS.white,
            borderRadius: '1rem',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            cursor: 'pointer'
          }}
          onClick={() => window.location.href = '/attendance'}>
            <Clock size={48} color={COLORS.primary} style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: COLORS.primary, margin: '0 0 0.5rem 0' }}>Absensi</h3>
            <p style={{ margin: 0, color: '#666' }}>Absen masuk dan pulang</p>
          </div>

          <div style={{
            background: COLORS.white,
            borderRadius: '1rem',
            padding: '1.5rem',
            textAlign: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            cursor: 'pointer'
          }}
          onClick={() => window.location.href = '/test-backend'}>
            <BookOpen size={48} color={COLORS.accent} style={{ marginBottom: '1rem' }} />
            <h3 style={{ color: COLORS.primary, margin: '0 0 0.5rem 0' }}>Test Backend</h3>
            <p style={{ margin: 0, color: '#666' }}>Test konektivitas backend</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage