import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Users, TrendingUp } from 'lucide-react'

const AttendancePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <motion.div
        className="bg-white shadow-sm border-b border-gray-200 safe-area-top"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Attendance</h1>
          <p className="text-sm text-gray-600">Track and manage attendance records</p>
        </div>
      </motion.div>

      <div className="px-6 py-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            className="bg-white p-4 rounded-xl border border-gray-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <Calendar className="text-primary-500" size={24} />
              <div>
                <p className="text-sm text-gray-600">Today's Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-4 rounded-xl border border-gray-200"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-3">
              <Clock className="text-success-500" size={24} />
              <div>
                <p className="text-sm text-gray-600">Present</p>
                <p className="text-lg font-semibold text-success-600">0/0</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Attendance Management
          </h3>
          <p className="text-gray-600 mb-6">
            Coming soon! This feature is currently under development.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default AttendancePage
