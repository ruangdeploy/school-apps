import React from 'react'
import { motion } from 'framer-motion'
import { User, Settings, LogOut, Bell, Shield } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { Button } from '../components/ui/Button'

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <motion.div
        className="bg-white shadow-sm border-b border-gray-200 safe-area-top"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-600">Manage your account settings</p>
        </div>
      </motion.div>

      <div className="px-6 py-6">
        {/* Profile Header */}
        <motion.div
          className="bg-white rounded-xl p-6 mb-6 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="text-primary-600" size={32} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.name || 'User'}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full font-medium">
                {user?.role || 'Student'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MenuItem icon={<Settings size={20} />} title="Settings" subtitle="App preferences" />
          <MenuItem icon={<Bell size={20} />} title="Notifications" subtitle="Manage notifications" />
          <MenuItem icon={<Shield size={20} />} title="Privacy" subtitle="Privacy settings" />
        </motion.div>

        {/* Logout */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="danger"
            size="lg"
            fullWidth
            icon={<LogOut size={18} />}
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

const MenuItem: React.FC<{
  icon: React.ReactNode
  title: string
  subtitle: string
}> = ({ icon, title, subtitle }) => (
  <motion.button
    className="w-full bg-white rounded-xl p-4 border border-gray-200 flex items-center space-x-3 text-left hover:bg-gray-50 transition-colors"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="text-gray-500">{icon}</div>
    <div className="flex-1">
      <h3 className="font-medium text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{subtitle}</p>
    </div>
  </motion.button>
)

export default ProfilePage
