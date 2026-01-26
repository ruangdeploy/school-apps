import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User, LoginCredentials } from '../types'
import { authService } from '../services/auth'
import Cookies from 'js-cookie'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
  clearError: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await authService.login(credentials)
          if (!response.data) throw new Error('No data received from server')
          
          const { user, accessToken, refreshToken } = response.data
          
          // Store tokens
          Cookies.set('accessToken', accessToken, { 
            expires: 7, 
            secure: true, 
            sameSite: 'strict' 
          })
          Cookies.set('refreshToken', refreshToken, { 
            expires: 30, 
            secure: true, 
            sameSite: 'strict' 
          })
          
          set({ 
            user, 
            isAuthenticated: true, 
            isLoading: false, 
            error: null 
          })
        } catch (error: any) {
          set({ 
            error: error.message || 'Login failed', 
            isLoading: false,
            isAuthenticated: false,
            user: null
          })
          throw error
        }
      },

      logout: () => {
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null 
        })
      },

      // Note: Backend doesn't have separate refresh token endpoint
      // Token validation is done through getCurrentUser
      refreshToken: async () => {
        try {
          const accessToken = Cookies.get('accessToken')
          if (!accessToken) {
            throw new Error('No access token available')
          }

          // Validate current token by getting user data
          const user = await authService.getCurrentUser()
          if (!user) {
            throw new Error('Token validation failed')
          }
          
          // If successful, token is still valid - no need to refresh
          return
        } catch (error) {
          get().logout()
          throw error
        }
      },

      clearError: () => set({ error: null }),
      setUser: (user: User) => set({ user })
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
)
