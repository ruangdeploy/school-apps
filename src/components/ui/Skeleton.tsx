import React from 'react'
import { motion } from 'framer-motion'

const SkeletonLoader: React.FC<{
  className?: string
  count?: number
  animate?: boolean
}> = ({ className = '', count = 1, animate = true }) => {
  const skeletons = Array.from({ length: count }, (_, i) => i)
  
  return (
    <>
      {skeletons.map((_, index) => (
        <motion.div
          key={index}
          className={`bg-gray-200 rounded ${className}`}
          initial={animate ? { opacity: 0.6 } : {}}
          animate={animate ? { 
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.02, 1]
          } : {}}
          transition={animate ? {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.1
          } : {}}
        />
      ))}
    </>
  )
}

// Predefined skeleton components for common patterns
const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 3, 
  className = '' 
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }, (_, i) => (
      <SkeletonLoader
        key={i}
        className={`h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
      />
    ))}
  </div>
)

const SkeletonCard: React.FC<{ className?: string; children?: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => (
  <motion.div 
    className={`p-4 bg-white rounded-xl shadow-soft border border-gray-200 ${className}`}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children || (
      <>
        <div className="flex items-center space-x-3">
          <SkeletonLoader className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <SkeletonLoader className="h-4 w-3/4" />
            <SkeletonLoader className="h-3 w-1/2" />
          </div>
        </div>
        <div className="mt-4">
          <SkeletonText lines={2} />
        </div>
      </>
    )}
  </motion.div>
)

const SkeletonAttendanceCard: React.FC = () => (
  <SkeletonCard className="space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <SkeletonLoader className="w-10 h-10 rounded-full" />
        <div className="space-y-1">
          <SkeletonLoader className="h-4 w-32" />
          <SkeletonLoader className="h-3 w-24" />
        </div>
      </div>
      <SkeletonLoader className="h-6 w-16 rounded-full" />
    </div>
    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
      <SkeletonLoader className="h-3 w-20" />
      <SkeletonLoader className="h-3 w-16" />
    </div>
  </SkeletonCard>
)

const SkeletonBottomNav: React.FC = () => (
  <motion.div 
    className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom"
    initial={{ y: 100 }}
    animate={{ y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex justify-around py-2">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex flex-col items-center space-y-1 p-2">
          <SkeletonLoader className="w-6 h-6 rounded" />
          <SkeletonLoader className="w-12 h-2" />
        </div>
      ))}
    </div>
  </motion.div>
)

export {
  SkeletonLoader,
  SkeletonText,
  SkeletonCard,
  SkeletonAttendanceCard,
  SkeletonBottomNav
}
