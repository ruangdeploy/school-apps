import Cookies from 'js-cookie'
import type { ApiResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

class ApiService {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const accessToken = localStorage.getItem('accessToken') || Cookies.get('accessToken')

    const config: RequestInit = {
      mode: 'cors', // Explicitly set CORS mode
      credentials: 'omit', // Don't send cookies for now
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      console.log('Making API request:', { url, config: { ...config, headers: config.headers } })
      const response = await fetch(url, config)
      console.log('Raw fetch response:', { 
        status: response.status, 
        statusText: response.statusText,
        ok: response.ok,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries())
      })
      
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          // If can't parse JSON, use status text
        }
        
        console.error('API Error:', errorMessage)
        
        // Handle specific error responses from backend
        if (response.status === 401) {
          // Token expired or invalid, clear auth data
          localStorage.removeItem('accessToken')
          localStorage.removeItem('userType')
          localStorage.removeItem('userData')
          Cookies.remove('accessToken')
          // Don't redirect on login page
          if (!window.location.pathname.includes('login')) {
            window.location.href = '/login'
          }
        }
        throw new Error(errorMessage)
      }
      
      const data = await response.json()
      console.log('Parsed response data:', data)

      const apiResponse = {
        success: data.success || true,
        data: data.data || data,
        message: data.message || 'Success'
      }
      console.log('Final API response:', apiResponse)
      
      return apiResponse
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // Special method for FormData uploads
  async postFormData<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const accessToken = localStorage.getItem('accessToken') || Cookies.get('accessToken')
    
    const config: RequestInit = {
      method: 'POST',
      headers: {
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        // Don't set Content-Type for FormData - browser will set it automatically
      },
      body: formData,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('userType')
          localStorage.removeItem('userData')
          Cookies.remove('accessToken')
          window.location.href = '/login'
        }
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return {
        success: data.success || true,
        data: data.data || data,
        message: data.message || 'Success'
      }
    } catch (error) {
      console.error('API FormData request failed:', error)
      throw error
    }
  }
}

export const apiService = new ApiService(API_BASE_URL)

// Auth APIs - Updated to match backend endpoints
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    apiService.post('/auth/login', credentials),
  
  getProfile: () =>
    apiService.get('/auth/profile'),
}

// Absensi APIs - Updated to match backend endpoints
export const absensiAPI = {
  // Absensi masuk dengan foto
  checkIn: (formData: FormData) =>
    apiService.postFormData('/absensi', formData),
  
  // Absensi pulang dengan foto
  checkOut: (formData: FormData) =>
    apiService.postFormData('/absensi/pulang', formData),
  
  // Check absensi hari ini
  getTodayAttendance: () =>
    apiService.get('/absensi/hari-ini'),
  
  // History absensi dengan filter tanggal
  getAttendanceHistory: (tanggal_awal: string, tanggal_akhir: string) =>
    apiService.get(`/absensi/riwayat?tanggal_awal=${tanggal_awal}&tanggal_akhir=${tanggal_akhir}`),
  
  // Detail absensi by ID
  getAttendanceDetail: (absensi_id: string) =>
    apiService.get(`/absensi/siswa/detail?absensi_id=${absensi_id}`),
}

// Siswa APIs
export const siswaAPI = {
  getProfile: () =>
    apiService.get('/siswa/profile'),
  
  getNilai: () =>
    apiService.get('/siswa/nilai'),
    
  getJadwal: () =>
    apiService.get('/siswa/jadwal'),
}

// Guru APIs  
export const guruAPI = {
  getProfile: () =>
    apiService.get('/guru/profile'),
    
  getKelas: () =>
    apiService.get('/guru/kelas'),
    
  getAbsensiKelas: (kelas_id: string, tanggal?: string) =>
    apiService.get(`/guru/absensi/${kelas_id}${tanggal ? `?tanggal=${tanggal}` : ''}`),
}

// Config APIs
export const configAPI = {
  getSchoolConfig: () =>
    apiService.get('/config'),
}
