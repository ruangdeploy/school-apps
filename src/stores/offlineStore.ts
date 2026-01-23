import { create } from 'zustand'
import type { OfflineAction } from '../types'

interface OfflineState {
  isOnline: boolean
  pendingActions: OfflineAction[]
  isProcessing: boolean
  
  // Actions
  setOnlineStatus: (status: boolean) => void
  addPendingAction: (action: Omit<OfflineAction, 'id' | 'timestamp' | 'retry'>) => void
  removePendingAction: (id: string) => void
  incrementRetry: (id: string) => void
  processPendingActions: () => Promise<void>
  clearPendingActions: () => void
}

export const useOfflineStore = create<OfflineState>((set, get) => ({
  isOnline: navigator.onLine,
  pendingActions: [],
  isProcessing: false,
  
  setOnlineStatus: (status: boolean) => {
    set({ isOnline: status })
    
    // Auto-process pending actions when coming online
    if (status) {
      get().processPendingActions()
    }
  },
  
  addPendingAction: (actionData) => {
    const action: OfflineAction = {
      ...actionData,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      retry: 0
    }
    
    set(state => ({
      pendingActions: [...state.pendingActions, action]
    }))
  },
  
  removePendingAction: (id: string) => {
    set(state => ({
      pendingActions: state.pendingActions.filter(action => action.id !== id)
    }))
  },
  
  incrementRetry: (id: string) => {
    set(state => ({
      pendingActions: state.pendingActions.map(action =>
        action.id === id ? { ...action, retry: action.retry + 1 } : action
      )
    }))
  },
  
  processPendingActions: async () => {
    const { isOnline, pendingActions } = get()
    if (!isOnline || pendingActions.length === 0) return
    
    set({ isProcessing: true })
    
    try {
      // Process actions in order (FIFO)
      for (const action of pendingActions) {
        if (action.retry >= 3) {
          console.warn(`Max retries reached for action ${action.id}`, action)
          get().removePendingAction(action.id)
          continue
        }
        
        try {
          // Here you would implement the actual API calls based on action type
          await processOfflineAction(action)
          get().removePendingAction(action.id)
        } catch (error) {
          console.error(`Failed to process action ${action.id}:`, error)
          get().incrementRetry(action.id)
        }
      }
    } finally {
      set({ isProcessing: false })
    }
  },
  
  clearPendingActions: () => set({ pendingActions: [] })
}))

// Helper function to process individual offline actions
async function processOfflineAction(action: OfflineAction): Promise<void> {
  // This would be implemented with your actual API service calls
  console.log('Processing offline action:', action)
  
  switch (action.entity) {
    case 'attendance':
      // await attendanceService.create/update/delete(action.data)
      break
    case 'report':
      // await reportService.create/update/delete(action.data)
      break
    case 'user':
      // await userService.update(action.data)
      break
  }
}
