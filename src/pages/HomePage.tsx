import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Users,
  MapPin,
  Bell
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { SkeletonCard, SkeletonText } from '../components/ui/Skeleton'
import { useAuthStore } from '../stores/authStore'
import { useAttendanceStore } from '../stores/attendanceStore'
import { cn } from '../utils/cn'

interface QuickStats {
  present: number
  absent: number
  late: number
  total: number
}

const HomePage: React.FC = () => {
  const { user } = useAuthStore()
  const { getTodayAttendance, setLoading, isLoading } = useAttendanceStore()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [todayStats, setTodayStats] = useState<QuickStats | null>(null)
  const [showLocationPrompt, setShowLocationPrompt] = useState(false)

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Load today's attendance data
  useEffect(() => {
    const loadTodayData = () => {
      setLoading(true)
      
      // Simulate API delay for realistic loading
      setTimeout(() => {
        const todayRecords = getTodayAttendance()
        const stats: QuickStats = {
          present: todayRecords.filter(r => r.status === 'present').length,
          absent: todayRecords.filter(r => r.status === 'absent').length,
          late: todayRecords.filter(r => r.status === 'late').length,
          total: todayRecords.length
        }
        setTodayStats(stats)
        setLoading(false)
      }, 1200)
    }

    loadTodayData()
  }, [getTodayAttendance, setLoading])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleQuickAttendance = async () => {
    if ('geolocation' in navigator) {
      setShowLocationPrompt(true)
      
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
          })
        })
        
        console.log('Location obtained:', position.coords)
        // Here you would implement the attendance submission
        setShowLocationPrompt(false)
        
        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 50, 100])
        }
      } catch (error) {
        console.error('Location error:', error)
        setShowLocationPrompt(false)
        // Still allow attendance without precise location
      }
    }
  }

  if (isLoading || !todayStats) {
    return <HomePageLoading />
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-primary-500 to-primary-600 safe-area-top"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="px-6 pt-6 pb-8">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <motion.h1
                className="text-2xl font-bold text-white mb-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name || 'Student'}!
              </motion.h1>
              <motion.p
                className="text-primary-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {formatDate(currentTime)}
              </motion.p>
            </div>
            
            <motion.div
              className="text-right"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-2xl font-bold text-white">
                {formatTime(currentTime)}
              </div>
              <div className="text-primary-100 text-sm flex items-center">
                <Clock size={14} className="mr-1" />
                Live
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="px-6 -mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button
            variant="primary"
            size="lg"
            onClick={handleQuickAttendance}
            icon={<CheckCircle size={20} />}
            className="h-16 flex-col bg-white text-primary-600 hover:bg-primary-50 border border-primary-200 shadow-soft"
          >
            <span className="text-sm font-semibold">Mark Present</span>
            <span className="text-xs opacity-80">Quick Check-in</span>
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            icon={<Calendar size={20} />}
            className="h-16 flex-col shadow-soft"
          >
            <span className="text-sm font-semibold">View Calendar</span>
            <span className="text-xs opacity-80">Schedule & Events</span>
          </Button>
        </div>
      </motion.div>

      {/* Today's Stats */}
      <motion.div
        className="px-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Overview</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <StatsCard
            title="Present"
            value={todayStats.present}
            total={todayStats.total}
            color="success"
            icon={<CheckCircle size={18} />}
            delay={0.1}
          />
          <StatsCard
            title="Attendance Rate"
            value={Math.round((todayStats.present / todayStats.total) * 100)}
            suffix="%"
            color="primary"
            icon={<TrendingUp size={18} />}
            delay={0.2}
          />
          <StatsCard
            title="Late Arrivals"
            value={todayStats.late}
            color="warning"
            icon={<Clock size={18} />}
            delay={0.3}
          />
          <StatsCard
            title="Total Students"
            value={todayStats.total}
            color="secondary"
            icon={<Users size={18} />}
            delay={0.4}
          />
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        className="px-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        
        <div className="space-y-3">
          <ActivityItem
            type="checkin"
            time="08:30 AM"
            message="John Doe marked present"
            delay={0.1}
          />
          <ActivityItem
            type="late"
            time="08:45 AM"
            message="Sarah Smith marked late"
            delay={0.2}
          />
          <ActivityItem
            type="report"
            time="09:00 AM"
            message="Math class attendance submitted"
            delay={0.3}
          />
        </div>
      </motion.div>

      {/* Location Permission Prompt */}
      <AnimatePresence>
        {showLocationPrompt && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-sm w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="text-center">
                <MapPin className="mx-auto text-primary-500 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Enable Location Access
                </h3>
                <p className="text-gray-600 mb-6 text-sm">
                  We need your location to verify attendance and ensure you're on school premises.
                </p>
                <div className="flex space-x-3">
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => setShowLocationPrompt(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => {
                      setShowLocationPrompt(false)
                      handleQuickAttendance()
                    }}
                  >
                    Allow
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Stats Card Component
const StatsCard: React.FC<{
  title: string
  value: number
  total?: number
  suffix?: string
  color: 'success' | 'warning' | 'primary' | 'secondary'
  icon: React.ReactNode
  delay?: number
}> = ({ title, value, total, suffix, color, icon, delay = 0 }) => {
  const colorClasses = {
    success: 'bg-success-50 text-success-700 border-success-200',
    warning: 'bg-warning-50 text-warning-700 border-warning-200',
    primary: 'bg-primary-50 text-primary-700 border-primary-200',
    secondary: 'bg-gray-50 text-gray-700 border-gray-200'
  }

  return (
    <motion.div
      className={cn('p-4 rounded-xl border', colorClasses[color])}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium opacity-80">{title}</span>
        {icon}
      </div>
      <div className="flex items-baseline">
        <span className="text-2xl font-bold">
          {value}{suffix}
        </span>
        {total && (
          <span className="text-sm opacity-60 ml-1">
            /{total}
          </span>
        )}
      </div>
    </motion.div>
  )
}

// Activity Item Component
const ActivityItem: React.FC<{
  type: 'checkin' | 'late' | 'report'
  time: string
  message: string
  delay?: number
}> = ({ type, time, message, delay = 0 }) => {
  const icons = {
    checkin: <CheckCircle size={16} className="text-success-500" />,
    late: <Clock size={16} className="text-warning-500" />,
    report: <Bell size={16} className="text-primary-500" />
  }

  return (
    <motion.div
      className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-100"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <div className="flex-shrink-0">
        {icons[type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 truncate">{message}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </motion.div>
  )
}

// Loading Component
const HomePageLoading = () => (
  <div className="min-h-screen bg-gray-50 pb-24">
    <div className="bg-gradient-to-r from-primary-500 to-primary-600 safe-area-top">
      <div className="px-6 pt-6 pb-8">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="h-8 bg-white/20 rounded-lg w-48 mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-32"></div>
          </div>
          <div className="text-right">
            <div className="h-8 bg-white/20 rounded w-20 mb-1"></div>
            <div className="h-4 bg-white/20 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>
    
    <div className="px-6 -mt-4">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <SkeletonCard className="h-16" />
        <SkeletonCard className="h-16" />
      </div>
      
      <div className="mb-6">
        <SkeletonText lines={1} className="mb-4" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <SkeletonCard key={i} className="h-20" />
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <SkeletonText lines={1} className="mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }, (_, i) => (
            <SkeletonCard key={i} className="h-16" />
          ))}
        </div>
      </div>
    </div>
  </div>
)

export default HomePage
