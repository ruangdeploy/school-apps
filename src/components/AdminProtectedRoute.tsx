import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, AlertTriangle } from 'lucide-react'
import Cookies from 'js-cookie'

interface AdminProtectedRouteProps {
  children: React.ReactNode
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAdminAccess = () => {
      try {
        const userData = localStorage.getItem('userData')
        const userType = localStorage.getItem('userType')
        const accessToken = localStorage.getItem('accessToken') || Cookies.get('accessToken')

        console.log('🔍 AdminProtectedRoute - Checking access:', {
          userType,
          hasToken: !!accessToken,
          hasUserData: !!userData,
          path: window.location.pathname
        })

        // Check if user is logged in and is admin
        if (userData && userType === 'admin' && accessToken) {
          const user = JSON.parse(userData)
          console.log('👤 User data:', user)
          
          if (user.tipe_user === 'admin' || user.role === 'Admin') {
            console.log('✅ Admin access granted')
            setIsAuthorized(true)
            return
          } else {
            console.log('❌ User is not admin:', { tipe_user: user.tipe_user, role: user.role })
          }
        } else {
          console.log('❌ Missing credentials:', { userData: !!userData, userType, accessToken: !!accessToken })
        }
        
        setIsAuthorized(false)
      } catch (error) {
        console.error('❌ Error checking admin access:', error)
        setIsAuthorized(false)
      }
    }

    checkAdminAccess()
  }, [])

  // Loading state
  if (isAuthorized === null) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgb(15, 76, 92) 0%, rgba(244, 163, 0, 0.1) 100%)'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e5e7eb',
            borderTop: '3px solid rgb(15, 76, 92)',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
            Memeriksa akses admin...
          </p>
        </motion.div>
        
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // Unauthorized access
  if (!isAuthorized) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgb(15, 76, 92) 0%, rgba(244, 163, 0, 0.1) 100%)',
        padding: '20px'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(45deg, #ef4444, #f97316)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <AlertTriangle size={40} color="white" />
          </div>
          
          <h1 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 12px 0'
          }}>
            Akses Ditolak
          </h1>
          
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            margin: '0 0 32px 0',
            lineHeight: 1.6
          }}>
            Anda tidak memiliki izin untuk mengakses halaman administrator. 
            Silakan login sebagai administrator untuk melanjutkan.
          </p>
          
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => window.location.href = '/admin/login'}
              style={{
                background: 'linear-gradient(45deg, rgb(15, 76, 92), rgb(244, 163, 0))',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(15, 76, 92, 0.3)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <Shield size={16} />
              Login Admin
            </button>
            
            <button
              onClick={() => window.location.href = '/login'}
              style={{
                background: 'transparent',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#9ca3af'
                e.currentTarget.style.color = '#374151'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#d1d5db'
                e.currentTarget.style.color = '#6b7280'
              }}
            >
              Kembali ke Login
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Authorized access
  return <>{children}</>
}

export default AdminProtectedRoute
