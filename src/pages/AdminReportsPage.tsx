import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  ArrowLeft,
  Download,
  Filter,
  Calendar,
  Users,
  GraduationCap,
  School,
  TrendingUp,
  TrendingDown,
  FileText
} from 'lucide-react'

// Color palette constants
const COLORS = {
  primary: 'rgb(15, 76, 92)',
  accent: 'rgb(244, 163, 0)',
  white: 'rgb(255, 255, 255)',
  success: 'rgb(34, 197, 94)',
  warning: 'rgb(251, 146, 60)',
  error: 'rgb(239, 68, 68)'
}

interface ReportData {
  periode: string
  siswaAktif: number
  guruAktif: number
  kelasAktif: number
  tingkatKehadiran: number
  rataRataNilai: number
  tugasDiserahkan: number
  totalTugas: number
}

const AdminReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024-semester-1')
  const [loading] = useState(false)

  // Mock report data
  const reportData: ReportData = {
    periode: 'Semester 1, 2024/2025',
    siswaAktif: 847,
    guruAktif: 45,
    kelasAktif: 24,
    tingkatKehadiran: 94.2,
    rataRataNilai: 82.5,
    tugasDiserahkan: 2134,
    totalTugas: 2450
  }

  const monthlyAttendance = [
    { month: 'Jan', attendance: 95.2 },
    { month: 'Feb', attendance: 93.8 },
    { month: 'Mar', attendance: 94.5 },
    { month: 'Apr', attendance: 92.1 },
    { month: 'May', attendance: 94.8 },
    { month: 'Jun', attendance: 96.3 }
  ]

  const gradeDistribution = [
    { grade: 'A', count: 234, percentage: 27.6 },
    { grade: 'B', count: 312, percentage: 36.8 },
    { grade: 'C', count: 203, percentage: 24.0 },
    { grade: 'D', count: 76, percentage: 9.0 },
    { grade: 'E', count: 22, percentage: 2.6 }
  ]

  const periodOptions = [
    { value: '2024-semester-1', label: 'Semester 1, 2024/2025' },
    { value: '2023-semester-2', label: 'Semester 2, 2023/2024' },
    { value: '2023-semester-1', label: 'Semester 1, 2023/2024' }
  ]

  const handleExportReport = () => {
    // In real app, generate and download PDF/Excel report
    alert('Laporan akan diunduh sebagai PDF')
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return COLORS.success
      case 'B': return '#10b981'
      case 'C': return COLORS.accent
      case 'D': return COLORS.warning
      case 'E': return COLORS.error
      default: return '#6b7280'
    }
  }

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
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '70px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <button
              onClick={() => window.location.href = '/admin/dashboard'}
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
                Laporan Akademik
              </h1>
              <p style={{
                fontSize: '14px',
                color: '#666',
                margin: 0
              }}>
                Analisis data dan statistik sekolah
              </p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                background: 'white'
              }}
            >
              {periodOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            
            <button
              onClick={handleExportReport}
              style={{
                background: COLORS.primary,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px'
      }}>
        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}
        >
          <div style={{
            background: COLORS.white,
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{
                background: '#dbeafe',
                padding: '12px',
                borderRadius: '12px'
              }}>
                <Users size={24} color={COLORS.primary} />
              </div>
              <TrendingUp size={20} color={COLORS.success} />
            </div>
            <h3 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: COLORS.primary,
              margin: '0 0 4px 0'
            }}>
              {reportData.siswaAktif.toLocaleString()}
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0
            }}>
              Total Siswa Aktif
            </p>
          </div>

          <div style={{
            background: COLORS.white,
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{
                background: '#fef3c7',
                padding: '12px',
                borderRadius: '12px'
              }}>
                <GraduationCap size={24} color={COLORS.accent} />
              </div>
              <TrendingUp size={20} color={COLORS.success} />
            </div>
            <h3 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: COLORS.primary,
              margin: '0 0 4px 0'
            }}>
              {reportData.guruAktif}
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0
            }}>
              Total Guru Aktif
            </p>
          </div>

          <div style={{
            background: COLORS.white,
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{
                background: '#dcfce7',
                padding: '12px',
                borderRadius: '12px'
              }}>
                <School size={24} color={COLORS.success} />
              </div>
              <TrendingUp size={20} color={COLORS.success} />
            </div>
            <h3 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: COLORS.primary,
              margin: '0 0 4px 0'
            }}>
              {reportData.kelasAktif}
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0
            }}>
              Total Kelas Aktif
            </p>
          </div>

          <div style={{
            background: COLORS.white,
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{
                background: '#f3e8ff',
                padding: '12px',
                borderRadius: '12px'
              }}>
                <BarChart3 size={24} color="#7c3aed" />
              </div>
              <TrendingDown size={20} color={COLORS.warning} />
            </div>
            <h3 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: COLORS.primary,
              margin: '0 0 4px 0'
            }}>
              {reportData.tingkatKehadiran}%
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: 0
            }}>
              Tingkat Kehadiran
            </p>
          </div>
        </motion.div>

        {/* Charts Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* Monthly Attendance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: COLORS.white,
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: COLORS.primary,
                margin: 0
              }}>
                Tingkat Kehadiran Bulanan
              </h3>
              <Calendar size={20} color="#6b7280" />
            </div>
            
            <div style={{ height: '200px', display: 'flex', alignItems: 'end', gap: '16px', padding: '0 8px' }}>
              {monthlyAttendance.map((item, index) => (
                <div key={item.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '100%',
                    height: `${(item.attendance / 100) * 150}px`,
                    background: index === monthlyAttendance.length - 1 ? COLORS.primary : '#e0e7ff',
                    borderRadius: '8px 8px 4px 4px',
                    marginBottom: '8px',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '-30px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#374151',
                      whiteSpace: 'nowrap'
                    }}>
                      {item.attendance}%
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Grade Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: COLORS.white,
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6'
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: COLORS.primary,
                margin: 0
              }}>
                Distribusi Nilai
              </h3>
              <BarChart3 size={20} color="#6b7280" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {gradeDistribution.map((item) => (
                <div key={item.grade} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: getGradeColor(item.grade),
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {item.grade}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '4px'
                    }}>
                      <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                        Grade {item.grade}
                      </span>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>
                        {item.count} siswa ({item.percentage}%)
                      </span>
                    </div>
                    
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: '#f3f4f6',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${item.percentage}%`,
                        height: '100%',
                        background: getGradeColor(item.grade),
                        borderRadius: '4px',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Academic Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: COLORS.white,
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '1px solid #f3f4f6'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: COLORS.primary,
              margin: 0
            }}>
              Performa Akademik
            </h3>
            <FileText size={20} color="#6b7280" />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              background: '#f9fafb',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <h4 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: COLORS.primary,
                margin: '0 0 8px 0'
              }}>
                {reportData.rataRataNilai}
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0
              }}>
                Rata-rata Nilai Keseluruhan
              </p>
            </div>

            <div style={{
              background: '#f9fafb',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <h4 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: COLORS.primary,
                margin: '0 0 8px 0'
              }}>
                {reportData.tugasDiserahkan}/{reportData.totalTugas}
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0
              }}>
                Tugas Diserahkan
              </p>
            </div>

            <div style={{
              background: '#f9fafb',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <h4 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: COLORS.primary,
                margin: '0 0 8px 0'
              }}>
                {Math.round((reportData.tugasDiserahkan / reportData.totalTugas) * 100)}%
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0
              }}>
                Tingkat Penyelesaian Tugas
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminReportsPage
