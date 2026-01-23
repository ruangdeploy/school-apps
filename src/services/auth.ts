import { apiService } from './api'
import type { LoginCredentials, AuthResponse, ApiResponse, User } from '../types'

class AuthService {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    // Mock API response for development
    if (import.meta.env.VITE_ENABLE_MOCK_API === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockUser: User = {
            id: '1',
            name: credentials.email.includes('student') ? 'John Student' : 'Jane Teacher',
            email: credentials.email,
            role: credentials.email.includes('student') ? 'student' : 'teacher',
            studentId: credentials.email.includes('student') ? 'STU001' : undefined,
            class: credentials.email.includes('student') ? 'Class 12A' : undefined,
            grade: credentials.email.includes('student') ? '12' : undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }

          const mockAuthResponse: AuthResponse = {
            user: mockUser,
            accessToken: 'mock-access-token-12345',
            refreshToken: 'mock-refresh-token-67890',
            expiresIn: 3600
          }

          resolve({
            success: true,
            data: mockAuthResponse,
            message: 'Login successful'
          })
        }, 800) // Simulate network delay
      })
    }

    // Real API call for production
    const response = await apiService.post<AuthResponse>('/auth/login', credentials)
    return response
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    // Mock API response for development
    if (import.meta.env.VITE_ENABLE_MOCK_API === 'true') {
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockUser: User = {
            id: '1',
            name: 'Mock User',
            email: 'user@school.com',
            role: 'student',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }

          const mockAuthResponse: AuthResponse = {
            user: mockUser,
            accessToken: 'new-mock-access-token-12345',
            refreshToken: 'new-mock-refresh-token-67890',
            expiresIn: 3600
          }

          resolve({
            success: true,
            data: mockAuthResponse,
            message: 'Token refreshed'
          })
        }, 500)
      })
    }

    // Real API call for production
    const response = await apiService.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    })
    return response
  }

  async logout(): Promise<void> {
    if (import.meta.env.VITE_ENABLE_MOCK_API !== 'true') {
      await apiService.post('/auth/logout')
    }
  }

  async me(): Promise<any> {
    if (import.meta.env.VITE_ENABLE_MOCK_API === 'true') {
      return {
        success: true,
        data: {
          id: '1',
          name: 'Mock User',
          email: 'user@school.com',
          role: 'student'
        }
      }
    }
    return apiService.get('/auth/me')
  }
}

export const authService = new AuthService()
