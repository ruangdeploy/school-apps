import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Clock, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Upload,
  Eye,
  Plus
} from 'lucide-react'

// Color palette constants
const COLORS = {
  primary: 'rgb(15, 76, 92)',
  accent: 'rgb(244, 163, 0)',
  white: 'rgb(255, 255, 255)'
}

// Mock assignments data
const mockAssignments = [
  {
    id: 1,
    title: 'Laporan Praktikum Fisika - Hukum Newton',
    subject: 'Fisika',
    teacher: 'Pak Andi Rahman',
    dueDate: '2024-01-25',
    dueTime: '23:59',
    status: 'pending',
    description: 'Buatlah laporan lengkap mengenai percobaan hukum Newton yang telah dilakukan di laboratorium.',
    type: 'laporan',
    points: 100,
    submitted: false
  },
  {
    id: 2,
    title: 'Essay Bahasa Indonesia - Puisi Modern',
    subject: 'Bahasa Indonesia',
    teacher: 'Bu Sari Indah',
    dueDate: '2024-01-24',
    dueTime: '15:00',
    status: 'urgent',
    description: 'Analisis puisi karya penyair Indonesia modern (minimal 1000 kata).',
    type: 'essay',
    points: 85,
    submitted: false
  },
  {
    id: 3,
    title: 'Soal Matematika - Kalkulus Integral',
    subject: 'Matematika',
    teacher: 'Pak Budi Santoso',
    dueDate: '2024-01-23',
    dueTime: '12:00',
    status: 'overdue',
    description: 'Kerjakan soal latihan kalkulus integral nomor 1-20.',
    type: 'latihan',
    points: 75,
    submitted: false
  },
  {
    id: 4,
    title: 'Presentasi Kimia - Senyawa Organik',
    subject: 'Kimia',
    teacher: 'Bu Maya Sari',
    dueDate: '2024-01-30',
    dueTime: '10:00',
    status: 'completed',
    description: 'Presentasi kelompok tentang struktur dan kegunaan senyawa organik.',
    type: 'presentasi',
    points: 95,
    submitted: true,
    submittedDate: '2024-01-20'
  }
]

const AssignmentsPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('all')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981'
      case 'pending': return COLORS.accent
      case 'urgent': return '#f59e0b'
      case 'overdue': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Selesai'
      case 'pending': return 'Pending'
      case 'urgent': return 'Mendesak'
      case 'overdue': return 'Terlambat'
      default: return 'Unknown'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'laporan': return BookOpen
      case 'essay': return BookOpen
      case 'presentasi': return BookOpen
      case 'latihan': return BookOpen
      default: return BookOpen
    }
  }

  const getDaysLeft = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const filteredAssignments = mockAssignments.filter(assignment => {
    if (selectedTab === 'all') return true
    if (selectedTab === 'pending') return assignment.status === 'pending' || assignment.status === 'urgent'
    if (selectedTab === 'completed') return assignment.status === 'completed'
    if (selectedTab === 'overdue') return assignment.status === 'overdue'
    return true
  })

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${COLORS.primary} 0%, rgba(244, 163, 0, 0.1) 100%)`,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: COLORS.white,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          height: '70px',
          gap: '15px'
        }}>
          <button
            onClick={() => window.history.back()}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ArrowLeft size={24} color={COLORS.primary} />
          </button>
          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: COLORS.primary,
              margin: 0
            }}>
              Tugas & Pekerjaan Rumah
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#666',
              margin: 0
            }}>
              Kelola dan pantau semua tugas Anda
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '30px 20px'
      }}>
        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}
        >
          {[
            {
              title: 'Total Tugas',
              value: mockAssignments.length,
              icon: BookOpen,
              color: COLORS.primary
            },
            {
              title: 'Selesai',
              value: mockAssignments.filter(a => a.status === 'completed').length,
              icon: CheckCircle,
              color: '#10b981'
            },
            {
              title: 'Mendesak',
              value: mockAssignments.filter(a => a.status === 'urgent').length,
              icon: AlertTriangle,
              color: '#f59e0b'
            },
            {
              title: 'Terlambat',
              value: mockAssignments.filter(a => a.status === 'overdue').length,
              icon: Clock,
              color: '#ef4444'
            }
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                background: COLORS.white,
                borderRadius: '15px',
                padding: '25px',
                boxShadow: '0 5px 20px rgba(0, 0, 0, 0.08)',
                border: `1px solid ${stat.color}20`
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: `${stat.color}15`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <stat.icon size={24} color={stat.color} />
                </div>
                <div>
                  <h3 style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: COLORS.primary,
                    margin: '0 0 5px 0'
                  }}>
                    {stat.value}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#666',
                    margin: 0
                  }}>
                    {stat.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            background: COLORS.white,
            borderRadius: '20px',
            padding: '25px',
            marginBottom: '25px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{
            display: 'flex',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '5px'
          }}>
            {[
              { id: 'all', label: 'Semua Tugas' },
              { id: 'pending', label: 'Belum Selesai' },
              { id: 'completed', label: 'Selesai' },
              { id: 'overdue', label: 'Terlambat' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                style={{
                  background: selectedTab === tab.id 
                    ? `linear-gradient(45deg, ${COLORS.primary}, ${COLORS.accent})` 
                    : 'transparent',
                  color: selectedTab === tab.id ? 'white' : COLORS.primary,
                  border: selectedTab === tab.id ? 'none' : `1px solid ${COLORS.primary}30`,
                  borderRadius: '25px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Assignments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
          }}
        >
          {filteredAssignments.map((assignment, index) => {
            const statusColor = getStatusColor(assignment.status)
            const TypeIcon = getTypeIcon(assignment.type)
            const daysLeft = getDaysLeft(assignment.dueDate)

            return (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                style={{
                  background: COLORS.white,
                  borderRadius: '20px',
                  padding: '25px',
                  boxShadow: assignment.status === 'urgent' || assignment.status === 'overdue'
                    ? `0 10px 30px ${statusColor}20` 
                    : '0 5px 20px rgba(0, 0, 0, 0.08)',
                  border: assignment.status === 'urgent' || assignment.status === 'overdue'
                    ? `2px solid ${statusColor}` 
                    : 'none',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px'
                }}>
                  {/* Icon */}
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: `${statusColor}15`,
                    borderRadius: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <TypeIcon size={28} color={statusColor} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      marginBottom: '15px'
                    }}>
                      <div>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: COLORS.primary,
                          margin: '0 0 8px 0'
                        }}>
                          {assignment.title}
                        </h3>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '15px',
                          flexWrap: 'wrap'
                        }}>
                          <span style={{
                            fontSize: '12px',
                            color: COLORS.primary,
                            background: `${COLORS.primary}15`,
                            padding: '4px 12px',
                            borderRadius: '15px',
                            fontWeight: '600'
                          }}>
                            {assignment.subject}
                          </span>
                          <span style={{
                            fontSize: '12px',
                            color: statusColor,
                            background: `${statusColor}15`,
                            padding: '4px 12px',
                            borderRadius: '15px',
                            fontWeight: '600'
                          }}>
                            {getStatusText(assignment.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <p style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: COLORS.accent,
                          margin: '0 0 5px 0'
                        }}>
                          {assignment.points} Poin
                        </p>
                        {assignment.status !== 'completed' && (
                          <p style={{
                            fontSize: '12px',
                            color: daysLeft < 0 ? '#ef4444' : daysLeft <= 1 ? '#f59e0b' : '#666',
                            margin: 0,
                            fontWeight: '600'
                          }}>
                            {daysLeft < 0 ? `${Math.abs(daysLeft)} hari terlambat` :
                             daysLeft === 0 ? 'Hari ini' :
                             daysLeft === 1 ? 'Besok' :
                             `${daysLeft} hari lagi`}
                          </p>
                        )}
                      </div>
                    </div>

                    <p style={{
                      fontSize: '14px',
                      color: '#666',
                      margin: '0 0 15px 0',
                      lineHeight: '1.5'
                    }}>
                      {assignment.description}
                    </p>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '15px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        fontSize: '14px',
                        color: '#666'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Calendar size={16} />
                          {new Date(assignment.dueDate).toLocaleDateString('id-ID')} - {assignment.dueTime}
                        </div>
                        <div>
                          Pengajar: {assignment.teacher}
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        {assignment.submitted ? (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            color: '#10b981',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            <CheckCircle size={16} />
                            Dikumpulkan {assignment.submittedDate ? new Date(assignment.submittedDate).toLocaleDateString('id-ID') : 'Unknown'}
                          </div>
                        ) : (
                          <div style={{
                            display: 'flex',
                            gap: '10px'
                          }}>
                            <button style={{
                              background: 'none',
                              border: `1px solid ${COLORS.primary}30`,
                              borderRadius: '8px',
                              padding: '6px 12px',
                              fontSize: '12px',
                              color: COLORS.primary,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}>
                              <Eye size={14} />
                              Detail
                            </button>
                            <button style={{
                              background: `linear-gradient(45deg, ${COLORS.primary}, ${COLORS.accent})`,
                              border: 'none',
                              borderRadius: '8px',
                              padding: '6px 12px',
                              fontSize: '12px',
                              color: 'white',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}>
                              <Upload size={14} />
                              Kumpulkan
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Floating Add Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '60px',
            height: '60px',
            background: `linear-gradient(45deg, ${COLORS.primary}, ${COLORS.accent})`,
            border: 'none',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            zIndex: 5
          }}
        >
          <Plus size={28} color="white" />
        </motion.button>
      </div>
    </div>
  )
}

export default AssignmentsPage
