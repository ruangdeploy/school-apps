import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// LoginPage Component
const LoginPageComponent: React.FC = () => {
  const [nisValue, setNisValue] = React.useState('')
  const [passwordValue, setPasswordValue] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [agreedToTerms, setAgreedToTerms] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreedToTerms) {
      alert('Silakan setujui syarat dan ketentuan terlebih dahulu')
      return
    }
    
    setIsLoading(true)
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false)
      console.log('Login attempt:', { nisValue, passwordValue })
      alert(`Login berhasil dengan username: ${nisValue}`)
    }, 2000)
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, rgb(15, 76, 92) 0%, rgb(26, 111, 122) 50%, rgb(255, 255, 255) 100%)',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '300px',
        height: '300px',
        background: 'rgba(244, 163, 0, 0.1)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '-150px',
        left: '-100px',
        width: '400px',
        height: '400px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '50%',
        animation: 'float 8s ease-in-out infinite reverse'
      }}></div>

      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '60px',
        height: '60px',
        background: 'rgba(244, 163, 0, 0.2)',
        borderRadius: '50%',
        animation: 'pulse 4s ease-in-out infinite'
      }}></div>

      {/* Back Arrow */}
      <div style={{
        position: 'absolute',
        top: '60px',
        left: '24px',
        zIndex: 30,
        cursor: 'pointer'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease'
        }}>
          <span style={{ color: '#ffffff', fontSize: '18px', fontWeight: 'bold' }}>←</span>
        </div>
      </div>

      {/* LoginPage Logo */}
      <div style={{
        position: 'absolute',
        top: '60px',
        right: '24px',
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          background: 'linear-gradient(135deg, rgb(244, 163, 0) 0%, rgb(255, 255, 255) 100%)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ color: 'rgb(15, 76, 92)', fontSize: '16px', fontWeight: 'bold' }}>L</span>
        </div>
        <span style={{
          color: '#ffffff',
          fontSize: '20px',
          fontWeight: 'bold',
          letterSpacing: '0.5px'
        }}>
          LoginPage
        </span>
      </div>

      {/* Main Content Container */}
      <div 
        className="mobile-stack"
        style={{
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          paddingTop: '120px',
          gap: '60px'
        }}
      >
        {/* Left Side - Illustration */}
        <div 
          className="mobile-hide"
          style={{
            flex: 1,
            maxWidth: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Student Illustration Circle */}
          <div style={{
            width: '320px',
            height: '320px',
            background: 'linear-gradient(135deg, rgba(244, 163, 0, 0.2) 0%, rgba(255, 255, 255, 0.3) 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            animation: 'gentleFloat 4s ease-in-out infinite'
          }}>
            {/* Students Illustration */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px'
            }}>
              {/* Female Student */}
              <div style={{
                position: 'relative',
                animation: 'slideIn 1s ease-out 0.3s both'
              }}>
                <div style={{
                  width: '80px',
                  height: '100px',
                  background: '#ffffff',
                  borderRadius: '40px 40px 20px 20px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  paddingTop: '15px'
                }}>
                  {/* Head */}
                  <div style={{
                    width: '35px',
                    height: '35px',
                    background: '#fdbcb4',
                    borderRadius: '50%',
                    marginBottom: '5px'
                  }}></div>
                  
                  {/* Hair */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    width: '40px',
                    height: '30px',
                    background: '#8b4513',
                    borderRadius: '20px 20px 5px 5px'
                  }}></div>
                  
                  {/* Body */}
                  <div style={{
                    width: '45px',
                    height: '35px',
                    background: 'rgb(15, 76, 92)',
                    borderRadius: '10px',
                    marginTop: '5px'
                  }}></div>
                  
                  {/* Book */}
                  <div style={{
                    position: 'absolute',
                    right: '-10px',
                    top: '45px',
                    width: '15px',
                    height: '20px',
                    background: 'rgb(244, 163, 0)',
                    borderRadius: '2px',
                    transform: 'rotate(-10deg)'
                  }}></div>
                </div>
              </div>

              {/* Male Student */}
              <div style={{
                position: 'relative',
                animation: 'slideIn 1s ease-out 0.6s both'
              }}>
                <div style={{
                  width: '80px',
                  height: '100px',
                  background: '#ffffff',
                  borderRadius: '40px 40px 20px 20px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  paddingTop: '15px'
                }}>
                  {/* Head */}
                  <div style={{
                    width: '35px',
                    height: '35px',
                    background: '#fdbcb4',
                    borderRadius: '50%',
                    marginBottom: '5px'
                  }}></div>
                  
                  {/* Hair */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    width: '35px',
                    height: '25px',
                    background: '#2c1810',
                    borderRadius: '15px 15px 5px 5px'
                  }}></div>
                  
                  {/* Body */}
                  <div style={{
                    width: '45px',
                    height: '35px',
                    background: 'rgb(15, 76, 92)',
                    borderRadius: '10px',
                    marginTop: '5px'
                  }}></div>
                  
                  {/* Backpack */}
                  <div style={{
                    position: 'absolute',
                    left: '-8px',
                    top: '35px',
                    width: '20px',
                    height: '25px',
                    background: 'rgb(26, 111, 122)',
                    borderRadius: '5px'
                  }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div 
          className="mobile-form"
          style={{
            flex: 1,
            maxWidth: '420px',
            width: '100%'
          }}
        >
          <div 
            className="mobile-form-container"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '24px',
              padding: '40px',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 20px 40px rgba(15, 76, 92, 0.1)',
              animation: 'slideUp 1s ease-out'
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '700',
                color: 'rgb(15, 76, 92)',
                margin: '0 0 24px 0',
                letterSpacing: '-0.5px'
              }}>
                Login Siswa
              </h1>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Username Input */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '16px',
                    color: '#9ca3af',
                    fontSize: '16px',
                    zIndex: 2
                  }}>👤</span>
                  <input
                    type="text"
                    value={nisValue}
                    onChange={(e) => setNisValue(e.target.value)}
                    placeholder="Username / No Handphone"
                    style={{
                      width: '100%',
                      padding: '16px 16px 16px 48px',
                      backgroundColor: '#f8fafc',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      color: '#374151'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgb(244, 163, 0)';
                      e.target.style.backgroundColor = '#ffffff';
                      e.target.style.boxShadow = '0 0 0 3px rgba(244, 163, 0, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.backgroundColor = '#f8fafc';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{
                    position: 'absolute',
                    left: '16px',
                    color: '#9ca3af',
                    fontSize: '16px',
                    zIndex: 2
                  }}>🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordValue}
                    onChange={(e) => setPasswordValue(e.target.value)}
                    placeholder="Password"
                    style={{
                      width: '100%',
                      padding: '16px 48px 16px 48px',
                      backgroundColor: '#f8fafc',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      color: '#374151'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgb(244, 163, 0)';
                      e.target.style.backgroundColor = '#ffffff';
                      e.target.style.boxShadow = '0 0 0 3px rgba(244, 163, 0, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.backgroundColor = '#f8fafc';
                      e.target.style.boxShadow = 'none';
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '16px',
                      color: '#9ca3af',
                      padding: '4px',
                      borderRadius: '6px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'rgb(244, 163, 0)';
                      e.currentTarget.style.backgroundColor = 'rgba(244, 163, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#9ca3af';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    👁️
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div style={{ textAlign: 'left' }}>
                <button
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgb(244, 163, 0)',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#d97706';
                    e.currentTarget.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgb(244, 163, 0)';
                    e.currentTarget.style.textDecoration = 'none';
                  }}
                >
                  Lupa Password?
                </button>
              </div>

              {/* Terms Checkbox */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginTop: '8px' }}>
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  style={{
                    marginTop: '4px',
                    accentColor: 'rgb(244, 163, 0)',
                    width: '16px',
                    height: '16px',
                    cursor: 'pointer'
                  }}
                />
                <label htmlFor="terms" style={{
                  fontSize: '13px',
                  color: '#6b7280',
                  lineHeight: '1.4',
                  cursor: 'pointer'
                }}>
                  Dengan login menggunakan nomor atau metode lain, saya setuju dengan{' '}
                  <span style={{ color: 'rgb(244, 163, 0)', fontWeight: '500', textDecoration: 'underline' }}>
                    Ketentuan Pengguna & Kebijakan Privasi
                  </span>
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading || !agreedToTerms || !nisValue || !passwordValue}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: (isLoading || !agreedToTerms || !nisValue || !passwordValue)
                    ? '#e5e7eb'
                    : 'linear-gradient(135deg, rgb(244, 163, 0) 0%, #d97706 100%)',
                  color: (isLoading || !agreedToTerms || !nisValue || !passwordValue) ? '#9ca3af' : '#ffffff',
                  fontSize: '16px',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: (isLoading || !agreedToTerms || !nisValue || !passwordValue) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: (isLoading || !agreedToTerms || !nisValue || !passwordValue) 
                    ? 'none' 
                    : '0 4px 12px rgba(244, 163, 0, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && agreedToTerms && nisValue && passwordValue) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(244, 163, 0, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading && agreedToTerms && nisValue && passwordValue) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(244, 163, 0, 0.3)';
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  'LOGIN'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Minimal App Component
const LoginPageApp: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPageComponent />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default LoginPageApp
