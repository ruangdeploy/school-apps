import React from 'react'
import Cookies from 'js-cookie'

interface LoginForm {
  email: string
  password: string
}

// Color palette constants
const COLORS = {
  primary: 'rgb(15, 76, 92)',
  accent: 'rgb(244, 163, 0)',
  white: 'rgb(255, 255, 255)'
}

// Demo accounts for testing
const DEMO_ACCOUNTS = {
  siswa: { email: 'andika.anggakusuma90@gmail.com', password: 'password123' },
  guru: { email: 'anca.gimbal@gmail.com', password: 'password123' },
  orangtua: { email: 'facebabybabyface@gmail.com', password: 'password123' }
}

const MultiLoginPage: React.FC = () => {
  const [formData, setFormData] = React.useState<LoginForm>({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      console.log('Mohon lengkapi semua field')
      return
    }
    
    setIsLoading(true)
    
    try {
      // Call backend API
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
      const directResponse = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })
      
      const directData = await directResponse.json()
      
      // Jika login berhasil
      if (directResponse.ok && directData.success) {
        // Store tokens and user info
        Cookies.set('accessToken', directData.data.token, { expires: 7 })
        localStorage.setItem('accessToken', directData.data.token)
        localStorage.setItem('userEmail', formData.email)
        localStorage.setItem('userData', JSON.stringify(directData.data.user))
        
        // Navigate to homepage
        window.location.href = '/home'
        return
      } else {
        throw new Error(directData.message || 'Login gagal')
      }
      
    } catch (error) {
      console.error('Login error:', error)
      alert('Login gagal: ' + (error instanceof Error ? error.message : 'Terjadi kesalahan'))
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${COLORS.primary} 0%, rgba(244, 163, 0, 0.9) 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      transition: 'background 0.3s ease'
    }}>
      {/* Background Animation Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '100px',
        height: '100px',
        background: `rgba(244, 163, 0, 0.2)`,
        borderRadius: '50%',
        animation: 'float 4s ease-in-out infinite'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '15%',
        width: '150px',
        height: '150px',
        background: `rgba(255, 255, 255, 0.1)`,
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite reverse'
      }}></div>

      {/* Main Login Container */}
      <div style={{
        maxWidth: '500px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        minHeight: '600px'
      }}>
        
        {/* Login Form */}
        <div style={{
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          {/* Logo Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '30px',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: `linear-gradient(45deg, ${COLORS.primary}, ${COLORS.accent})`,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              marginRight: '15px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: COLORS.primary,
              margin: 0
            }}>
              LoginPage
            </h1>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Masukkan email Anda"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = COLORS.primary
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb'
                }}
              />
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Masukkan password Anda"
                  style={{
                    width: '100%',
                    padding: '14px 50px 14px 16px',
                    fontSize: '16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = COLORS.primary
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb'
                  }}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={{
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#6b7280',
                    padding: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6'
                    e.currentTarget.style.color = COLORS.primary
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#6b7280'
                  }}
                >
                  {showPassword ? (
                    // Eye Open Icon (SVG)
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  ) : (
                    // Eye Closed Icon (SVG)
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '16px',
                background: isLoading 
                  ? '#9ca3af' 
                  : `linear-gradient(45deg, ${COLORS.primary}, ${COLORS.accent})`,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                marginBottom: '20px'
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)'
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'
                }
              }}
            >
              {isLoading ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Memproses...
                </div>
              ) : (
                `Masuk ke Sistem`
              )}
            </button>

            {/* Forgot Password Link */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <a
                href="#"
                style={{
                  color: COLORS.primary,
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.textDecoration = 'underline'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.textDecoration = 'none'
                }}
              >
                Lupa password?
              </a>
            </div>

            {/* Demo Account Info */}
            <div style={{
              background: `${COLORS.accent}20`,
              padding: '15px',
              borderRadius: '10px',
              border: `1px solid ${COLORS.accent}40`
            }}>
              <h4 style={{
                margin: '0 0 10px 0',
                fontSize: '14px',
                color: COLORS.primary,
                fontWeight: '600'
              }}>
                Akun Demo - Untuk Testing
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '10px',
                fontSize: '12px',
                color: '#666'
              }}>
                <div>
                  <strong>Siswa:</strong><br/>
                  {DEMO_ACCOUNTS.siswa.email}
                </div>
                <div>
                  <strong>Guru:</strong><br/>
                  {DEMO_ACCOUNTS.guru.email}
                </div>
                <div>
                  <strong>Orang Tua:</strong><br/>
                  {DEMO_ACCOUNTS.orangtua.email}
                </div>
              </div>
              <p style={{
                margin: '8px 0 0 0',
                fontSize: '11px',
                color: '#888',
                fontStyle: 'italic'
              }}>
                Password untuk semua akun: password123
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

export default MultiLoginPage
