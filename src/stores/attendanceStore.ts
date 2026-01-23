import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AttendanceRecord } from '../types'

interface AttendanceState {
  records: AttendanceRecord[]
  isLoading: boolean
  error: string | null
  selectedDate: string
  
  // Actions
  setRecords: (records: AttendanceRecord[]) => void
  addRecord: (record: AttendanceRecord) => void
  updateRecord: (id: string, data: Partial<AttendanceRecord>) => void
  deleteRecord: (id: string) => void
  setSelectedDate: (date: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  
  // Selectors
  getRecordsByDate: (date?: string) => AttendanceRecord[]
  getRecordsByStudent: (studentId: string) => AttendanceRecord[]
  getTodayAttendance: () => AttendanceRecord[]
}

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set, get) => ({
      records: [],
      isLoading: false,
      error: null,
      selectedDate: new Date().toISOString().split('T')[0],

      setRecords: (records: AttendanceRecord[]) => set({ records }),
      
      addRecord: (record: AttendanceRecord) => {
        const { records } = get()
        set({ records: [...records, record] })
      },
      
      updateRecord: (id: string, data: Partial<AttendanceRecord>) => {
        const { records } = get()
        set({
          records: records.map(record => 
            record.id === id ? { ...record, ...data } : record
          )
        })
      },
      
      deleteRecord: (id: string) => {
        const { records } = get()
        set({ records: records.filter(record => record.id !== id) })
      },
      
      setSelectedDate: (date: string) => set({ selectedDate: date }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),
      
      getRecordsByDate: (date?: string) => {
        const { records, selectedDate } = get()
        const targetDate = date || selectedDate
        return records.filter(record => 
          record.date.startsWith(targetDate)
        )
      },
      
      getRecordsByStudent: (studentId: string) => {
        const { records } = get()
        return records.filter(record => record.studentId === studentId)
      },
      
      getTodayAttendance: () => {
        const today = new Date().toISOString().split('T')[0]
        return get().getRecordsByDate(today)
      }
    }),
    {
      name: 'attendance-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        records: state.records,
        selectedDate: state.selectedDate
      })
    }
  )
)
