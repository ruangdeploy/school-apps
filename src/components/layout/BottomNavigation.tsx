import React from 'react'
import { motion } from 'framer-motion'
import { Home, FileText, Users, User } from 'lucide-react'
import { cn } from '../../utils/cn'

interface TabItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
  count?: number
}

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

const defaultTabs: TabItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: <Home size={20} />,
    href: '/'
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: <FileText size={20} />,
    href: '/attendance'
  },
  {
    id: 'students',
    label: 'Students', 
    icon: <Users size={20} />,
    href: '/students'
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: <User size={20} />,
    href: '/profile'
  }
]

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  className
}) => {
  const [pressedTab, setPressedTab] = React.useState<string | null>(null)

  const handleTabPress = (tabId: string) => {
    setPressedTab(tabId)
    // Add haptic feedback simulation
    if ('vibrate' in navigator) {
      navigator.vibrate(50)
    }
    onTabChange(tabId)
    
    setTimeout(() => setPressedTab(null), 150)
  }

  return (
    <motion.nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'bg-white/95 backdrop-blur-ios border-t border-gray-200',
        'safe-area-bottom',
        className
      )}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
    >
      <div className="flex justify-around items-center py-2">
        {defaultTabs.map((tab) => {
          const isActive = activeTab === tab.id
          const isPressed = pressedTab === tab.id
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => handleTabPress(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center p-2 min-w-0 flex-1',
                'transition-colors duration-200 touch-manipulation',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg',
                isActive ? 'text-primary-500' : 'text-gray-400'
              )}
              whileTap={{ scale: 0.95 }}
              animate={{
                scale: isPressed ? 0.9 : 1,
                y: isActive ? -2 : 0
              }}
              transition={{ 
                duration: 0.1,
                type: "spring",
                stiffness: 300
              }}
            >
              {/* Icon Container */}
              <motion.div
                className={cn(
                  'relative flex items-center justify-center w-6 h-6 mb-1',
                  isActive && 'text-primary-500'
                )}
                animate={{
                  scale: isActive ? 1.1 : 1
                }}
                transition={{ duration: 0.2 }}
              >
                {tab.icon}
                
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-2 h-2 bg-primary-500 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      delay: 0.1
                    }}
                  />
                )}
                
                {/* Badge/Count */}
                {tab.count && tab.count > 0 && (
                  <motion.div
                    className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center px-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300
                    }}
                  >
                    {tab.count > 99 ? '99+' : tab.count}
                  </motion.div>
                )}
              </motion.div>
              
              {/* Label */}
              <motion.span
                className={cn(
                  'text-xs font-medium truncate max-w-full',
                  isActive ? 'text-primary-500 font-semibold' : 'text-gray-500'
                )}
                animate={{
                  scale: isActive ? 1.05 : 1,
                  opacity: isActive ? 1 : 0.8
                }}
                transition={{ duration: 0.2 }}
              >
                {tab.label}
              </motion.span>
              
              {/* Ripple Effect */}
              {isPressed && (
                <motion.div
                  className="absolute inset-0 rounded-lg bg-primary-500/10"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>
      
      {/* iOS-style home indicator */}
      <motion.div
        className="mx-auto w-32 h-1 bg-gray-300 rounded-full mb-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />
    </motion.nav>
  )
}

export type { TabItem, BottomNavigationProps }
