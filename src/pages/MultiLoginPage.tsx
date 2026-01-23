import React from 'react'
import muridImage from '../assets/images/murid-removebg-preview.png'
import guruImage from '../assets/images/guru-removebg-preview.png'
import orangTuaImage from '../assets/images/orang_tua-removebg-preview.png'

interface LoginForm {
  email: string
  password: string
}

type UserType = 'siswa' | 'guru' | 'orangtua'

// Color palette constants
const COLORS = {
  primary: 'rgb(15, 76, 92)',
  accent: 'rgb(244, 163, 0)',
  white: 'rgb(255, 255, 255)'
}

// Dummy accounts for easy login
const DUMMY_ACCOUNTS = {
  siswa: { email: 'siswa@school.com', password: '123456' },
  guru: { email: 'guru@school.com', password: '123456' },
  orangtua: { email: 'ortu@school.com', password: '123456' }
}

const MultiLoginPage: React.FC = () => {
  const [selectedUserType, setSelectedUserType] = React.useState<UserType>('siswa')
  const [formData, setFormData] = React.useState<LoginForm>({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth)

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const userTypeConfig = {
    siswa: {
      title: 'Siswa',
      subtitle: 'Masuk sebagai siswa',
      color: COLORS.primary,
      image: muridImage,
      illustration: (
        <div style={{
          width: '220px',
          height: '220px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <img 
            src={muridImage} 
            alt="Siswa"
            style={{
              width: '210px',
              height: '210px',
              objectFit: 'contain'
            }}
          />
        </div>
      )
    },
    guru: {
      title: 'Guru',
      subtitle: 'Masuk sebagai guru',
      color: COLORS.primary,
      image: guruImage,
      illustration: (
        <div style={{
          width: '220px',
          height: '220px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <img 
            src={guruImage} 
            alt="Guru"
            style={{
              width: '210px',
              height: '210px',
              objectFit: 'contain'
            }}
          />
        </div>
      )
    },
    orangtua: {
      title: 'Orang Tua',
      subtitle: 'Masuk sebagai orang tua',
      color: COLORS.primary,
      image: orangTuaImage,
      illustration: (
        <div style={{
          width: '220px',
          height: '220px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <img 
            src={orangTuaImage} 
            alt="Orang Tua"
            style={{
              width: '210px',
              height: '210px',
              objectFit: 'contain'
            }}
          />
        </div>
      )
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      alert('Mohon lengkapi semua field')
      return
    }
    
    setIsLoading(true)
    
    // Check dummy accounts
    const account = DUMMY_ACCOUNTS[selectedUserType]
    
    setTimeout(() => {
      setIsLoading(false)
      
      if (formData.email === account.email && formData.password === account.password) {
        alert(`Login berhasil sebagai ${userTypeConfig[selectedUserType].title}!`)
        // Here you would typically navigate to homepage
        // For now, just redirect to home
        window.location.href = '/'
      } else {
        alert(`Login gagal! Gunakan akun berikut:\nEmail: ${account.email}\nPassword: ${account.password}`)
      }
    }, 1500)
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
        maxWidth: '900px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        display: windowWidth > 768 ? 'grid' : 'block',
        gridTemplateColumns: windowWidth > 768 ? '1fr 1fr' : '1fr',
        minHeight: '600px'
      }}>
        
        {/* Left Side - Illustration */}
        {windowWidth > 768 && (
        <div style={{
          background: `linear-gradient(45deg, ${COLORS.primary}, ${COLORS.accent})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '40px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background Pattern */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}></div>
          
          <div style={{
            fontSize: '120px',
            marginBottom: '20px',
            animation: 'float 3s ease-in-out infinite',
            zIndex: 1,
            color: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {userTypeConfig[selectedUserType].illustration}
          </div>
          
          <h2 style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '10px',
            textAlign: 'center',
            zIndex: 1
          }}>
            {userTypeConfig[selectedUserType].title}
          </h2>
          
          <p style={{
            fontSize: '16px',
            opacity: 0.9,
            textAlign: 'center',
            zIndex: 1
          }}>
            {userTypeConfig[selectedUserType].subtitle}
          </p>
        </div>
        )}

        {/* Right Side - Login Form */}
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

          {/* User Type Selection */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '15px'
            }}>
              Pilih Tipe Pengguna
            </h3>
            <div style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap'
            }}>
              {(Object.keys(userTypeConfig) as UserType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedUserType(type)}
                  style={{
                    padding: '12px 20px',
                    border: selectedUserType === type 
                      ? `2px solid ${COLORS.primary}`
                      : '2px solid #e5e7eb',
                    borderRadius: '10px',
                    background: selectedUserType === type 
                      ? `${COLORS.primary}15`
                      : 'white',
                    color: selectedUserType === type 
                      ? COLORS.primary
                      : '#6b7280',
                    fontWeight: selectedUserType === type ? '600' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    flex: 1,
                    minWidth: '100px'
                  }}
                >
                  {userTypeConfig[type].title}
                </button>
              ))}
            </div>
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
                `Masuk sebagai ${userTypeConfig[selectedUserType].title}`
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

            {/* Dummy Account Info */}
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
                Akun Demo - {userTypeConfig[selectedUserType].title}
              </h4>
              <p style={{
                margin: '0',
                fontSize: '13px',
                color: '#666',
                lineHeight: '1.4'
              }}>
                <strong>Email:</strong> {DUMMY_ACCOUNTS[selectedUserType].email}<br/>
                <strong>Password:</strong> {DUMMY_ACCOUNTS[selectedUserType].password}
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
