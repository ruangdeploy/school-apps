import Cookies from 'js-cookie'
import type { ApiResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// Debug: Log the API base URL being used
console.log('🔗 API Base URL:', API_BASE_URL)
console.log('🌍 Environment:', import.meta.env.MODE)
console.log('📋 All Vite Env:', import.meta.env)

class ApiService {
    async patch<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
      return this.request<T>(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
    }
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

    // Debug logging - Request
    console.group(`🌐 API Request: ${options.method || 'GET'} ${endpoint}`)
    console.log('📍 Full URL:', url)
    console.log('🔑 Token:', accessToken ? `${accessToken.substring(0, 20)}...` : 'None')
    console.log('📋 Config:', {
      method: config.method || 'GET',
      headers: config.headers,
      body: config.body ? (config.body instanceof FormData ? 'FormData' : config.body) : 'None'
    })

    try {
      const startTime = performance.now()
      const response = await fetch(url, config)
      const endTime = performance.now()
      
      console.log(`⏱️ Response time: ${(endTime - startTime).toFixed(2)}ms`)
      console.log(`📊 Status: ${response.status} ${response.statusText}`)
      
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        let errorData = null
        
        try {
          errorData = await response.json()
          errorMessage = errorData.message || errorMessage
          console.error('❌ Error Response:', errorData)
        } catch (e) {
          console.error('❌ Failed to parse error response')
        }
        
        console.groupEnd()
        
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
      
      // Debug logging - Success Response
      console.log('✅ Success Response:', {
        status: response.status,
        data: data
      })
      console.groupEnd()

      return {
        success: data.success || true,
        data: data.data || data,
        message: data.message || 'Success'
      }
    } catch (error) {
      console.error('🚨 API Error:', error)
      console.groupEnd()
      
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

    // Debug logging - FormData Request
    console.group(`🌐 API FormData Request: POST ${endpoint}`)
    console.log('📍 Full URL:', url)
    console.log('🔑 Token:', accessToken ? `${accessToken.substring(0, 20)}...` : 'None')
    console.log('📋 FormData entries:')
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`)
      } else {
        console.log(`  ${key}: ${value}`)
      }
    }

    try {
      const startTime = performance.now()
      const response = await fetch(url, config)
      const endTime = performance.now()
      
      console.log(`⏱️ Response time: ${(endTime - startTime).toFixed(2)}ms`)
      console.log(`📊 Status: ${response.status} ${response.statusText}`)
      
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        let errorData = null
        
        try {
          errorData = await response.json()
          errorMessage = errorData.message || errorMessage
          console.error('❌ Error Response:', errorData)
        } catch (e) {
          console.error('❌ Failed to parse error response')
        }
        
        console.groupEnd()
        
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
      
      // Debug logging - Success Response
      console.log('✅ Success Response:', {
        status: response.status,
        data: data
      })
      console.groupEnd()

      return {
        success: data.success || true,
        data: data.data || data,
        message: data.message || 'Success'
      }
    } catch (error) {
      console.error('🚨 FormData API Error:', error)
      console.groupEnd()
      
      console.error('FormData API request failed:', error)
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

// Orang Tua APIs - untuk absensi anak
export const orangTuaAPI = {
  // Absensi masuk anak oleh orang tua
  checkInAnak: (formData: FormData) =>
    apiService.postFormData('/absensi/orang-tua', formData),
  
  // Absensi pulang anak oleh orang tua  
  checkOutAnak: (formData: FormData) =>
    apiService.postFormData('/absensi/orang-tua/pulang', formData),
    
  // Absen masuk anak (simple POST)
  absenMasuk: () =>
    apiService.post('/absensi/orang-tua'),
    
  // Absen pulang anak (simple POST)
  absenPulang: () =>
    apiService.post('/absensi/orang-tua/pulang'),
    
  // Get daftar anak
  getDaftarAnak: () =>
    apiService.get('/siswa/anak'),
    
  // Get riwayat absensi anak
  getRiwayatAbsensiAnak: (siswa_id: number, tanggal_awal: string, tanggal_akhir: string) =>
    apiService.get(`/absensi/orang-tua/riwayat?siswa_id=${siswa_id}&tanggal_awal=${tanggal_awal}&tanggal_akhir=${tanggal_akhir}`),
    
  // Get detail absensi anak
  getDetailAbsensiAnak: (absensi_id: number) =>
    apiService.get(`/absensi/orang-tua/detail?absensi_id=${absensi_id}`),
    
  // Submit izin/sakit anak
  submitIzinAnak: (data: FormData) =>
    apiService.postFormData('/absensi/orang-tua/izin', data),
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
    
  // Get daftar kelas yang diajar guru
  getKelas: () =>
    apiService.get('/guru/kelas'),
    
  // Get daftar siswa di kelas tertentu
  getSiswaKelas: (kelas_id: number) =>
    apiService.get(`/guru/kelas/${kelas_id}/siswa`),
    
  // Update absensi siswa oleh guru
  updateAbsensiSiswa: (data: { siswa_id: number; tanggal: string; status_kehadiran: string }) =>
    apiService.patch('/absensi/guru/update', data),
    
  // Get riwayat absensi kelas
  getRiwayatAbsensiKelas: (kelas_id: number, tanggal_awal: string, tanggal_akhir: string) =>
    apiService.get(`/absensi/guru/kelas/riwayat?kelas_id=${kelas_id}&tanggal_awal=${tanggal_awal}&tanggal_akhir=${tanggal_akhir}`),
    
  // Get detail absensi siswa untuk guru
  getDetailAbsensiSiswa: (absensi_id: number) =>
    apiService.get(`/absensi/guru/detail?absensi_id=${absensi_id}`),
    
  // Old endpoints (keep for compatibility)
  getAbsensiKelas: (kelas_id: string, tanggal?: string) =>
    apiService.get(`/guru/absensi/${kelas_id}${tanggal ? `?tanggal=${tanggal}` : ''}`),
    
  getDaftarSiswa: (kelas_id?: string) =>
    apiService.get(`/guru/siswa${kelas_id ? `?kelas_id=${kelas_id}` : ''}`),
}

// Config APIs
export const configAPI = {
  getSchoolConfig: () =>
    apiService.get('/config'),
}
