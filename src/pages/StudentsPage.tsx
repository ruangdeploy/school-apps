import React from 'react'
import { motion } from 'framer-motion'
import { Users, GraduationCap, Search } from 'lucide-react'

const StudentsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <motion.div
        className="bg-white shadow-sm border-b border-gray-200 safe-area-top"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Students</h1>
          <p className="text-sm text-gray-600">Manage student information</p>
        </div>
      </motion.div>

      <motion.div
        className="text-center py-12 px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GraduationCap className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Student Management
        </h3>
        <p className="text-gray-600 mb-6">
          View and manage student profiles, track their attendance history, and more.
        </p>
        <div className="text-sm text-gray-500">
          Feature coming soon...
        </div>
      </motion.div>
    </div>
  )
}

export default StudentsPage
