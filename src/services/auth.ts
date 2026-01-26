import { authAPI } from './api'
import type { LoginCredentials, AuthResponse, ApiResponse, User } from '../types'

class AuthService {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await authAPI.login(credentials)
      
      // Backend response structure based on authController.js
      if (response.success && response.data) {
        const responseData = response.data as any
        const { user, token } = responseData
        
        // Store auth data
        localStorage.setItem('accessToken', token)
        localStorage.setItem('userType', user.tipe_user)
        localStorage.setItem('userData', JSON.stringify(user))
        
        // Transform backend user data to frontend format
        const frontendUser: User = {
          id: user.id.toString(),
          name: user.nama_lengkap,
          email: user.email,
          role: user.tipe_user, // siswa, guru, orang_tua, admin
          phone: user.no_telepon,
          avatar: user.foto_profil,
          createdAt: user.created_at || new Date().toISOString(),
          updatedAt: user.updated_at || new Date().toISOString(),
          // Additional fields based on user type
          ...(user.tipe_user === 'siswa' && user.siswa && {
            studentId: user.siswa.nisn,
            class: user.siswa.nama_kelas,
            grade: user.siswa.tingkat?.toString()
          }),
          ...(user.tipe_user === 'guru' && user.guru && {
            teacherId: user.guru.nip,
            subjects: user.guru.mata_pelajaran
          })
        }

        const authResponse: AuthResponse = {
          user: frontendUser,
          accessToken: token,
          refreshToken: token, // Backend might not have separate refresh token
          expiresIn: 7 * 24 * 60 * 60 // 7 days in seconds
        }

        return {
          success: true,
          data: authResponse,
          message: response.message || 'Login berhasil'
        }
      }
      
      throw new Error(response.message || 'Login gagal')
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  async logout(): Promise<void> {
    // Clear all auth data
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userType')
    localStorage.removeItem('userData')
    
    // Redirect to login
    window.location.href = '/login'
  }

  getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem('userData')
      if (userData) {
        const user = JSON.parse(userData)
        // Transform backend user to frontend format
        return {
          id: user.id?.toString() || user.user_id?.toString(),
          name: user.nama_lengkap || user.name,
          email: user.email,
          role: user.tipe_user || user.role,
          phone: user.no_telepon || user.phone,
          avatar: user.foto_profil || user.avatar,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
          // Additional fields based on user type
          ...(user.tipe_user === 'siswa' && user.siswa_data && {
            studentId: user.siswa_data.nisn,
            class: user.siswa_data.kelas_nama,
            grade: user.siswa_data.tingkat?.toString()
          }),
          ...(user.tipe_user === 'guru' && user.guru_data && {
            teacherId: user.guru_data.nip,
            subjects: user.guru_data.mata_pelajaran
          })
        }
      }
      return null
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken')
    const userData = localStorage.getItem('userData')
    return !!(token && userData)
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken')
  }

  getUserType(): string | null {
    return localStorage.getItem('userType')
  }
}

export const authService = new AuthService()
