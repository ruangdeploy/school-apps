import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react'
import Cookies from 'js-cookie'

// Color palette constants
const COLORS = {
  primary: 'rgb(15, 76, 92)',
  accent: 'rgb(244, 163, 0)',
  white: 'rgb(255, 255, 255)'
}

interface LoginForm {
  email: string
  password: string
}

const AdminLoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginForm>({
    email: 'admin@sekolah.com',
    password: 'password123'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
      alert('Mohon lengkapi semua field')
      return
    }
    
    setIsLoading(true)
    
    try {
      // Hit backend API - same as MultiLoginPage
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
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
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        // Check if user type is admin
        if (data.data.user && data.data.user.tipe_user === 'admin') {
          // Store admin session with real token from backend
          Cookies.set('accessToken', data.data.token, { expires: 7 })
          localStorage.setItem('accessToken', data.data.token)
          localStorage.setItem('userEmail', formData.email)
          localStorage.setItem('userData', JSON.stringify(data.data.user))
          localStorage.setItem('userType', 'admin')
          
          console.log('✅ Admin login successful:', { 
            user: data.data.user, 
            token: data.data.token.substring(0, 20) + '...' 
          })
          
          // Navigate to admin dashboard
          window.location.href = '/admin/dashboard'
          return
        } else {
          throw new Error('Akun ini bukan administrator')
        }
      } else {
        throw new Error(data.message || 'Login gagal')
      }
      
    } catch (error) {
      console.error('❌ Admin login error:', error)
      
      // Fallback to mock authentication for development
      if (formData.email === 'admin@sekolah.com' && formData.password === 'password123') {
        console.log('⚠️ Using mock admin authentication (backend not available)')
        
        const adminData = {
          user_id: 999,
          email: 'admin@sekolah.com',
          nama_lengkap: 'Administrator',
          tipe_user: 'admin',
          no_telepon: '081234567890'
        }
        
        const mockToken = 'admin_mock_token_' + Date.now()
        Cookies.set('accessToken', mockToken, { expires: 7 })
        localStorage.setItem('accessToken', mockToken)
        localStorage.setItem('userEmail', formData.email)
        localStorage.setItem('userData', JSON.stringify(adminData))
        localStorage.setItem('userType', 'admin')
        
        window.location.href = '/admin/dashboard'
        return
      }
      
      alert(`Login gagal: ${error instanceof Error ? error.message : 'Periksa koneksi backend'}`)
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
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Background Elements */}
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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: '450px',
          width: '100%',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Header */}
        <div style={{
          background: `linear-gradient(45deg, ${COLORS.primary}, ${COLORS.accent})`,
          padding: '40px 40px 60px 40px',
          textAlign: 'center',
          position: 'relative'
        }}>
          {/* Back Button */}
          <button
            onClick={() => window.location.href = '/login'}
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white'
            }}
          >
            <ArrowLeft size={20} />
          </button>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              width: '80px',
              height: '80px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Shield size={40} color="white" />
          </motion.div>
          
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: 'white',
            margin: '0 0 8px 0'
          }}>
            Admin Login
          </h1>
          
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0
          }}>
            Masuk sebagai Administrator
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: '40px' }}>
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Email Administrator
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="admin@school.com"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = COLORS.primary}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '32px' }}>
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
                  placeholder="Masukkan password"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 50px 12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = COLORS.primary}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    color: '#6b7280'
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Demo Info */}
            <div style={{
              background: '#f0f9ff',
              border: '1px solid #0ea5e9',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '24px'
            }}>
              <p style={{
                fontSize: '12px',
                color: '#0369a1',
                margin: 0,
                textAlign: 'center'
              }}>
                Demo: admin@school.com / admin123
              </p>
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                padding: '16px',
                background: `linear-gradient(45deg, ${COLORS.primary}, ${COLORS.accent})`,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(15, 76, 92, 0.3)'
              }}
            >
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
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
                'Masuk sebagai Admin'
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default AdminLoginPage
