import React, { Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AnimatePresence } from 'framer-motion'

// Stores
import { useAuthStore } from './stores/authStore'
import { useOfflineStore } from './stores/offlineStore'

// Layout Components
import { BottomNavigation } from './components/layout/BottomNavigation'

// Pages (Lazy loaded for code splitting)
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'

// Lazy load pages for better performance
const AttendancePage = React.lazy(() => import('./pages/AttendancePage'))
const StudentsPage = React.lazy(() => import('./pages/StudentsPage'))
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'))

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        if (error?.status === 404 || error?.status === 403) return false
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
})

// Auth Guard Component
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore()
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

// Main Layout Component
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = React.useState('home')
  
  useEffect(() => {
    // Set active tab based on current path
    const path = window.location.pathname
    if (path.includes('attendance')) setActiveTab('attendance')
    else if (path.includes('students')) setActiveTab('students')
    else if (path.includes('profile')) setActiveTab('profile')
    else setActiveTab('home')
  }, [])
  
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    
    // Navigate to corresponding route
    const routes = {
      home: '/',
      attendance: '/attendance',
      students: '/students',
      profile: '/profile'
    }
    
    const route = routes[tabId as keyof typeof routes]
    if (route) {
      window.history.pushState(null, '', route)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-20">
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>
      
      <BottomNavigation 
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  )
}

// Offline Status Component
const OfflineStatus: React.FC = () => {
  const { isOnline, pendingActions } = useOfflineStore()
  
  if (isOnline) return null
  
  return (
    <div className="fixed top-0 left-0 right-0 bg-warning-500 text-white px-4 py-2 text-sm font-medium text-center z-50 safe-area-top">
      <div className="flex items-center justify-center space-x-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span>You're offline</span>
        {pendingActions.length > 0 && (
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
            {pendingActions.length} pending
          </span>
        )}
      </div>
    </div>
  )
}

// Loading Fallback Component
const PageLoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
)

// Main App Component
const App: React.FC = () => {
  const { isAuthenticated } = useAuthStore()
  const { setOnlineStatus } = useOfflineStore()
  
  // Setup offline/online detection
  useEffect(() => {
    const handleOnlineStatus = () => setOnlineStatus(navigator.onLine)
    
    window.addEventListener('online', handleOnlineStatus)
    window.addEventListener('offline', handleOnlineStatus)
    
    // Set initial status
    setOnlineStatus(navigator.onLine)
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus)
      window.removeEventListener('offline', handleOnlineStatus)
    }
  }, [setOnlineStatus])
  
  // PWA Install prompt handling
  useEffect(() => {
    let deferredPrompt: any
    
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      deferredPrompt = e
      
      // Show custom install button after some time
      setTimeout(() => {
        if (deferredPrompt && !window.matchMedia('(display-mode: standalone)').matches) {
          // You could show a custom install banner here
          console.log('PWA install prompt available')
        }
      }, 10000) // Show after 10 seconds
    }
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])
  
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="app">
          <OfflineStatus />
          
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
              } 
            />
            
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <AuthGuard>
                  <AppLayout>
                    <HomePage />
                  </AppLayout>
                </AuthGuard>
              }
            />
            
            <Route
              path="/attendance"
              element={
                <AuthGuard>
                  <AppLayout>
                    <Suspense fallback={<PageLoadingFallback />}>
                      <AttendancePage />
                    </Suspense>
                  </AppLayout>
                </AuthGuard>
              }
            />
            
            <Route
              path="/students"
              element={
                <AuthGuard>
                  <AppLayout>
                    <Suspense fallback={<PageLoadingFallback />}>
                      <StudentsPage />
                    </Suspense>
                  </AppLayout>
                </AuthGuard>
              }
            />
            
            <Route
              path="/profile"
              element={
                <AuthGuard>
                  <AppLayout>
                    <Suspense fallback={<PageLoadingFallback />}>
                      <ProfilePage />
                    </Suspense>
                  </AppLayout>
                </AuthGuard>
              }
            />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
      
      {/* Development tools */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}

export default App
