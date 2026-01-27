import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Camera,
  LogIn,
  LogOut
} from 'lucide-react'

interface AttendanceDetailModalProps {
  detail: any
  isVisible: boolean
  onClose: () => void
  isLoading: boolean
}

// Color constants
const COLORS = {
  primary: 'rgb(15, 76, 92)',
  accent: 'rgb(244, 163, 0)',
  white: 'rgb(255, 255, 255)'
}

const AttendanceDetailModal: React.FC<AttendanceDetailModalProps> = ({
  detail,
  isVisible,
  onClose,
  isLoading
}) => {
  if (!isVisible) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hadir': return '#10b981'
      case 'izin': return '#f59e0b'
      case 'sakit': return '#8b5cf6'
      case 'alpa': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'hadir': return CheckCircle
      case 'izin': return AlertCircle
      case 'sakit': return XCircle
      case 'alpa': return XCircle
      default: return AlertCircle
    }
  }

  const StatusIcon = detail ? getStatusIcon(detail.status_kehadiran) : AlertCircle
  const statusColor = detail ? getStatusColor(detail.status_kehadiran) : '#6b7280'

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            zIndex: 1000,
            backdropFilter: 'blur(8px)'
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{
              background: COLORS.white,
              borderRadius: '24px',
              padding: '0',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              background: `linear-gradient(135deg, ${statusColor}, ${statusColor}CC)`,
              color: 'white',
              padding: '30px',
              position: 'relative'
            }}>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <X size={20} color="white" />
              </motion.button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)'
                }}>
                  <StatusIcon size={40} color="white" />
                </div>
                <div>
                  <h2 style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    margin: 0,
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    Detail Absensi
                  </h2>
                  {detail && (
                    <div style={{
                      fontSize: '16px',
                      opacity: 0.9,
                      marginTop: '5px'
                    }}>
                      {detail.nama_lengkap}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div style={{ 
              padding: '30px',
              maxHeight: 'calc(90vh - 200px)',
              overflow: 'auto'
            }}>
              {isLoading ? (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '40px'
                }}>
                  <div>Memuat detail...</div>
                </div>
              ) : detail ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  {/* Basic Info */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px'
                  }}>
                    <div style={{
                      background: '#f8fafc',
                      padding: '20px',
                      borderRadius: '16px',
                      border: '2px solid #e2e8f0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                        <Calendar size={20} color={COLORS.primary} />
                        <span style={{ fontWeight: '600', color: COLORS.primary }}>Tanggal</span>
                      </div>
                      <div style={{ fontSize: '14px', color: '#64748b' }}>
                        {formatDate(detail.tanggal)}
                      </div>
                    </div>

                    <div style={{
                      background: '#f8fafc',
                      padding: '20px',
                      borderRadius: '16px',
                      border: '2px solid #e2e8f0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                        <User size={20} color={COLORS.primary} />
                        <span style={{ fontWeight: '600', color: COLORS.primary }}>Kelas</span>
                      </div>
                      <div style={{ fontSize: '14px', color: '#64748b' }}>
                        {detail.nama_kelas} • {detail.jenjang}
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div style={{
                    background: `${statusColor}10`,
                    padding: '20px',
                    borderRadius: '16px',
                    border: `2px solid ${statusColor}30`,
                    textAlign: 'center'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      marginBottom: '10px'
                    }}>
                      <StatusIcon size={24} color={statusColor} />
                      <span style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: statusColor,
                        textTransform: 'capitalize'
                      }}>
                        {detail.status_kehadiran}
                      </span>
                    </div>
                    {detail.status_keterlambatan === 'telat' && (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#f59e0b20',
                        color: '#f59e0b',
                        padding: '8px 16px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}>
                        <AlertCircle size={16} />
                        Terlambat
                      </div>
                    )}
                  </div>

                  {/* Time Details */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px'
                  }}>
                    <div style={{
                      background: '#10b98110',
                      padding: '20px',
                      borderRadius: '16px',
                      border: '2px solid #10b98130'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                        <LogIn size={20} color="#10b981" />
                        <span style={{ fontWeight: '600', color: '#10b981' }}>Jam Masuk</span>
                      </div>
                      <div style={{ 
                        fontSize: '18px', 
                        fontWeight: '700', 
                        color: '#10b981'
                      }}>
                        {detail.jam_masuk || '-'}
                      </div>
                    </div>

                    <div style={{
                      background: detail.jam_pulang ? '#ef444410' : '#f1f5f910',
                      padding: '20px',
                      borderRadius: '16px',
                      border: `2px solid ${detail.jam_pulang ? '#ef444430' : '#e2e8f0'}`
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                        <LogOut size={20} color={detail.jam_pulang ? '#ef4444' : '#9ca3af'} />
                        <span style={{ 
                          fontWeight: '600', 
                          color: detail.jam_pulang ? '#ef4444' : '#9ca3af' 
                        }}>
                          Jam Pulang
                        </span>
                      </div>
                      <div style={{ 
                        fontSize: '18px', 
                        fontWeight: '700', 
                        color: detail.jam_pulang ? '#ef4444' : '#9ca3af'
                      }}>
                        {detail.jam_pulang || '-'}
                      </div>
                    </div>
                  </div>

                  {/* Photos */}
                  {(detail.foto_evidence_masuk || detail.foto_evidence_pulang) && (
                    <div>
                      <h4 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: COLORS.primary,
                        marginBottom: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <Camera size={20} />
                        Foto Evidence
                      </h4>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: detail.foto_evidence_masuk && detail.foto_evidence_pulang ? '1fr 1fr' : '1fr',
                        gap: '15px'
                      }}>
                        {detail.foto_evidence_masuk && (
                          <div>
                            <div style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#10b981',
                              marginBottom: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}>
                              <LogIn size={14} />
                              Foto Masuk
                            </div>
                            <img
                              src={`http://localhost:3000/${detail.foto_evidence_masuk}`}
                              alt="Evidence Masuk"
                              style={{
                                width: '100%',
                                height: '200px',
                                objectFit: 'cover',
                                borderRadius: '12px',
                                border: '3px solid #10b98130'
                              }}
                            />
                          </div>
                        )}
                        
                        {detail.foto_evidence_pulang && (
                          <div>
                            <div style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#ef4444',
                              marginBottom: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}>
                              <LogOut size={14} />
                              Foto Pulang
                            </div>
                            <img
                              src={`http://localhost:3000/${detail.foto_evidence_pulang}`}
                              alt="Evidence Pulang"
                              style={{
                                width: '100%',
                                height: '200px',
                                objectFit: 'cover',
                                borderRadius: '12px',
                                border: '3px solid #ef444430'
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  {detail.keterangan && (
                    <div style={{
                      background: '#f8fafc',
                      padding: '20px',
                      borderRadius: '16px',
                      border: '2px solid #e2e8f0'
                    }}>
                      <h4 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: COLORS.primary,
                        marginBottom: '10px'
                      }}>
                        Keterangan
                      </h4>
                      <div style={{ color: '#64748b' }}>
                        {detail.keterangan}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '40px',
                  color: '#64748b'
                }}>
                  Detail tidak ditemukan
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AttendanceDetailModal
