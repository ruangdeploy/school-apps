import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Award,
  BookOpen,
  Calendar,
  ArrowLeft,
  Target,
  Star,
  Filter
} from 'lucide-react'

// Color palette constants
const COLORS = {
  primary: 'rgb(15, 76, 92)',
  accent: 'rgb(244, 163, 0)',
  white: 'rgb(255, 255, 255)'
}

// Mock grades data
const mockGradesData = {
  summary: {
    gpa: 3.85,
    totalPoints: 2310,
    maxPoints: 3000,
    rank: 3,
    totalStudents: 32
  },
  subjects: [
    {
      id: 1,
      name: 'Matematika',
      teacher: 'Pak Budi Santoso',
      currentGrade: 88,
      letter: 'A-',
      assignments: 12,
      tests: 4,
      participation: 95,
      trend: 'up'
    },
    {
      id: 2,
      name: 'Fisika',
      teacher: 'Pak Andi Rahman',
      currentGrade: 92,
      letter: 'A',
      assignments: 15,
      tests: 3,
      participation: 90,
      trend: 'up'
    },
    {
      id: 3,
      name: 'Kimia',
      teacher: 'Bu Maya Sari',
      currentGrade: 85,
      letter: 'B+',
      assignments: 10,
      tests: 3,
      participation: 85,
      trend: 'stable'
    },
    {
      id: 4,
      name: 'Biologi',
      teacher: 'Bu Rina Kusuma',
      currentGrade: 90,
      letter: 'A-',
      assignments: 8,
      tests: 2,
      participation: 92,
      trend: 'up'
    },
    {
      id: 5,
      name: 'Bahasa Indonesia',
      teacher: 'Bu Sari Indah',
      currentGrade: 87,
      letter: 'B+',
      assignments: 9,
      tests: 3,
      participation: 88,
      trend: 'down'
    },
    {
      id: 6,
      name: 'Bahasa Inggris',
      teacher: 'Pak Robert Smith',
      currentGrade: 91,
      letter: 'A-',
      assignments: 11,
      tests: 4,
      participation: 94,
      trend: 'up'
    }
  ]
}

const GradesPage: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState('current')

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return '#10b981'
    if (grade >= 80) return COLORS.accent
    if (grade >= 70) return '#f59e0b'
    return '#ef4444'
  }

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return '📈'
    if (trend === 'down') return '📉'
    return '➖'
  }

  const getTrendColor = (trend: string) => {
    if (trend === 'up') return '#10b981'
    if (trend === 'down') return '#ef4444'
    return '#6b7280'
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
              Nilai & Prestasi
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#666',
              margin: 0
            }}>
              Pantau perkembangan akademik Anda
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
        {/* GPA & Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}
        >
          {/* GPA Card */}
          <div style={{
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
            borderRadius: '20px',
            padding: '30px',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '150px',
              height: '150px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%'
            }} />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '15px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Award size={24} />
              </div>
              <div>
                <h3 style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  margin: '0 0 5px 0'
                }}>
                  {mockGradesData.summary.gpa}
                </h3>
                <p style={{ fontSize: '14px', margin: 0, opacity: 0.9 }}>
                  IPK Semester
                </p>
              </div>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '14px',
              opacity: 0.9
            }}>
              <span>Peringkat: #{mockGradesData.summary.rank}</span>
              <span>dari {mockGradesData.summary.totalStudents} siswa</span>
            </div>
          </div>

          {/* Progress Card */}
          <div style={{
            background: COLORS.white,
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: `${COLORS.primary}15`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Target size={24} color={COLORS.primary} />
              </div>
              <div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: COLORS.primary,
                  margin: '0 0 5px 0'
                }}>
                  Progress Semester
                </h3>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                  {mockGradesData.summary.totalPoints} / {mockGradesData.summary.maxPoints} Poin
                </p>
              </div>
            </div>
            
            <div style={{
              width: '100%',
              height: '8px',
              background: '#f3f4f6',
              borderRadius: '4px',
              overflow: 'hidden',
              marginBottom: '10px'
            }}>
              <div style={{
                width: `${(mockGradesData.summary.totalPoints / mockGradesData.summary.maxPoints) * 100}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent})`,
                transition: 'width 1s ease'
              }} />
            </div>
            
            <p style={{
              fontSize: '14px',
              color: COLORS.accent,
              fontWeight: '600',
              margin: 0,
              textAlign: 'right'
            }}>
              {((mockGradesData.summary.totalPoints / mockGradesData.summary.maxPoints) * 100).toFixed(1)}% Complete
            </p>
          </div>

          {/* Achievement Card */}
          <div style={{
            background: COLORS.white,
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '15px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: '#f59e0b15',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Star size={24} color="#f59e0b" />
              </div>
              <div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: COLORS.primary,
                  margin: '0 0 5px 0'
                }}>
                  Prestasi
                </h3>
                <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                  Pencapaian terbaik
                </p>
              </div>
            </div>
            
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <div style={{
                background: '#10b98115',
                color: '#10b981',
                padding: '8px 12px',
                borderRadius: '8px',
                fontWeight: '600',
                marginBottom: '8px'
              }}>
                🏆 Nilai Tertinggi: Fisika (92)
              </div>
              <div style={{
                background: `${COLORS.accent}15`,
                color: COLORS.accent,
                padding: '8px 12px',
                borderRadius: '8px',
                fontWeight: '600'
              }}>
                📈 Peningkatan Terbesar: Biologi (+8)
              </div>
            </div>
          </div>
        </motion.div>

        {/* Subject Selector */}
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
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: COLORS.primary,
              margin: 0
            }}>
              Detail Nilai per Mata Pelajaran
            </h2>
            <div style={{
              display: 'flex',
              gap: '10px'
            }}>
              <button
                onClick={() => setSelectedSemester('current')}
                style={{
                  background: selectedSemester === 'current' 
                    ? `linear-gradient(45deg, ${COLORS.primary}, ${COLORS.accent})` 
                    : 'transparent',
                  color: selectedSemester === 'current' ? 'white' : COLORS.primary,
                  border: selectedSemester === 'current' ? 'none' : `1px solid ${COLORS.primary}30`,
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Calendar size={14} />
                Semester Ini
              </button>
              <button
                onClick={() => setSelectedSemester('previous')}
                style={{
                  background: selectedSemester === 'previous' 
                    ? `linear-gradient(45deg, ${COLORS.primary}, ${COLORS.accent})` 
                    : 'transparent',
                  color: selectedSemester === 'previous' ? 'white' : COLORS.primary,
                  border: selectedSemester === 'previous' ? 'none' : `1px solid ${COLORS.primary}30`,
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Filter size={14} />
                Semester Lalu
              </button>
            </div>
          </div>
        </motion.div>

        {/* Subjects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '20px'
          }}
        >
          {mockGradesData.subjects.map((subject, index) => {
            const gradeColor = getGradeColor(subject.currentGrade)
            const trendColor = getTrendColor(subject.trend)

            return (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                style={{
                  background: COLORS.white,
                  borderRadius: '20px',
                  padding: '25px',
                  boxShadow: '0 5px 20px rgba(0, 0, 0, 0.08)',
                  border: `2px solid ${gradeColor}20`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '20px'
                }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: COLORS.primary,
                      margin: '0 0 5px 0'
                    }}>
                      {subject.name}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#666',
                      margin: '0 0 10px 0'
                    }}>
                      {subject.teacher}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <span style={{
                        fontSize: '12px',
                        background: `${gradeColor}15`,
                        color: gradeColor,
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontWeight: '600'
                      }}>
                        Grade {subject.letter}
                      </span>
                      <span style={{
                        fontSize: '14px',
                        color: trendColor,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        {getTrendIcon(subject.trend)}
                        {subject.trend === 'up' ? 'Meningkat' : 
                         subject.trend === 'down' ? 'Menurun' : 'Stabil'}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{
                    textAlign: 'center',
                    minWidth: '80px'
                  }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: `${gradeColor}15`,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px auto',
                      border: `3px solid ${gradeColor}`
                    }}>
                      <span style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: gradeColor
                      }}>
                        {subject.currentGrade}
                      </span>
                    </div>
                    <p style={{
                      fontSize: '12px',
                      color: '#666',
                      margin: 0
                    }}>
                      Nilai Akhir
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '15px',
                  marginBottom: '15px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: `${COLORS.primary}15`,
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px auto'
                    }}>
                      <BookOpen size={20} color={COLORS.primary} />
                    </div>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: COLORS.primary,
                      margin: '0 0 3px 0'
                    }}>
                      {subject.assignments}
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: '#666',
                      margin: 0
                    }}>
                      Tugas
                    </p>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: `${COLORS.accent}15`,
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px auto'
                    }}>
                      <BarChart3 size={20} color={COLORS.accent} />
                    </div>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: COLORS.primary,
                      margin: '0 0 3px 0'
                    }}>
                      {subject.tests}
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: '#666',
                      margin: 0
                    }}>
                      Ujian
                    </p>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: '#10b98115',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px auto'
                    }}>
                      <TrendingUp size={20} color="#10b981" />
                    </div>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: COLORS.primary,
                      margin: '0 0 3px 0'
                    }}>
                      {subject.participation}%
                    </p>
                    <p style={{
                      fontSize: '12px',
                      color: '#666',
                      margin: 0
                    }}>
                      Partisipasi
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: '#f3f4f6',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${subject.currentGrade}%`,
                    height: '100%',
                    background: gradeColor,
                    borderRadius: '3px',
                    transition: 'width 1s ease'
                  }} />
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}

export default GradesPage
