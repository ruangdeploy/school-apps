export interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'teacher' | 'admin'
  studentId?: string
  class?: string
  grade?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface AttendanceRecord {
  id: string
  studentId: string
  studentName: string
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  checkInTime?: string
  checkOutTime?: string
  location?: {
    latitude: number
    longitude: number
    address: string
  }
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface AttendanceReport {
  id: string
  studentId: string
  date: string
  subject?: string
  period?: number
  status: 'present' | 'absent' | 'late' | 'excused'
  submittedBy: string
  notes?: string
  createdAt: string
}

export interface Class {
  id: string
  name: string
  grade: string
  teacher: string
  studentCount: number
  schedule?: ClassSchedule[]
}

export interface ClassSchedule {
  id: string
  classId: string
  subject: string
  teacher: string
  dayOfWeek: number // 0 = Sunday, 1 = Monday, etc.
  startTime: string
  endTime: string
  room?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface OfflineAction {
  id: string
  type: 'CREATE' | 'UPDATE' | 'DELETE'
  entity: 'attendance' | 'report' | 'user'
  data: any
  timestamp: number
  retry: number
}
