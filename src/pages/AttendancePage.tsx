import React, { useState, useRef, useCallback, useEffect } from 'react'
// @ts-ignore
import { DateRange } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { motion } from 'framer-motion'
import { absensiAPI, orangTuaAPI } from '../services/api'
import AttendanceDetailModal from '../components/AttendanceDetailModal'
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ArrowLeft,
  MapPin,
  Camera,
  RotateCcw,
  ChevronRight
} from 'lucide-react'

// Color palette constants - same as login page
const COLORS = {
  primary: 'rgb(15, 76, 92)',
  accent: 'rgb(244, 163, 0)',
  white: 'rgb(255, 255, 255)'
}

// TODO: Koordinat sekolah perlu dikonfigurasi sesuai lokasi sekolah yang sebenarnya
// const SCHOOL_LOCATION = {
//   latitude: 0,
//   longitude: 0,
//   name: 'Nama Sekolah',
//   maxDistance: 100 // maksimal 100 meter
// }

const AttendancePage: React.FC = () => {
  const [user] = useState(() => {
    const userData = localStorage.getItem('userData')
    return userData ? JSON.parse(userData) : null
  })
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [todayCheckedIn, setTodayCheckedIn] = useState(false)
  const [todayCheckedOut, setTodayCheckedOut] = useState(false)
  const [checkInTime, setCheckInTime] = useState<string | null>(null)
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null)
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])
  const [attendanceStats, setAttendanceStats] = useState<any>({})
  const [selectedDetail, setSelectedDetail] = useState<any>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [isLoadingRecords, setIsLoadingRecords] = useState(false)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  // Calendar filter state
  const [showCalendar, setShowCalendar] = useState(false)
  // Default: 5 days back from today
  const today = new Date()
  const fiveDaysAgo = new Date()
  fiveDaysAgo.setDate(today.getDate() - 5)
  const [dateRange, setDateRange] = useState([
    {
      startDate: fiveDaysAgo,
      endDate: today,
      key: 'selection',
    },
  ])
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null)
  const [distanceToSchool, setDistanceToSchool] = useState<number | null>(null)
  const [locationStatus, setLocationStatus] = useState<'checking' | 'allowed' | 'too-far' | 'error'>('checking')
  
  // Camera and photo states
  const [showCheckInCamera, setShowCheckInCamera] = useState(false)
  const [showCheckOutCamera, setShowCheckOutCamera] = useState(false)
  const [checkInPhoto, setCheckInPhoto] = useState<string | null>(null)
  const [checkOutPhoto, setCheckOutPhoto] = useState<string | null>(null)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [tempPhoto, setTempPhoto] = useState<string | null>(null) // Foto sementara di modal
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Camera functions
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      })
      setCameraStream(stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Tidak dapat mengakses kamera. Pastikan izin kamera sudah diberikan.')
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
  }, [cameraStream])

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext('2d')
      
      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        
        const photoDataURL = canvas.toDataURL('image/jpeg', 0.8)
        
        // Simpan foto sementara dan hentikan kamera
        setTempPhoto(photoDataURL)
        stopCamera()
      }
    }
  }, [stopCamera])

  const retakePhoto = () => {
    setTempPhoto(null)
    startCamera()
  }

  const submitAbsence = async () => {
    if (!tempPhoto) return
    
    if (showCheckInCamera) {
      await confirmCheckIn()
    } else if (showCheckOutCamera) {
      await confirmCheckOut()
    }
  }

  const cancelCamera = () => {
    stopCamera()
    setShowCheckInCamera(false)
    setShowCheckOutCamera(false)
    setTempPhoto(null)
  }

  const handleCheckIn = async () => {
    try {
      console.log('🔄 Checking location before attendance...')
      const locationCheck = await checkLocationAndDistance()
      
      if (!locationCheck.allowed) {
        alert(`⚠️ Lokasi tidak sesuai!\n\nSilakan coba lagi.`)
        return
      }
      
      // Jika lokasi diizinkan, buka kamera untuk selfie
      setShowCheckInCamera(true)
      startCamera()
    } catch (error) {
      console.error('❌ Location check error:', error)
      alert(error instanceof Error ? error.message : 'Gagal mengecek lokasi. Coba lagi.')
    }
  }

  const handleCheckOut = async () => {
    try {
      console.log('🔄 Checking location before checkout...')
      const locationCheck = await checkLocationAndDistance()
      
      if (!locationCheck.allowed) {
        alert(`⚠️ Lokasi tidak sesuai!\n\nSilakan coba lagi.`)
        return
      }
      
      // Jika lokasi diizinkan, buka kamera untuk selfie
      setShowCheckOutCamera(true)
      startCamera()
    } catch (error) {
      console.error('❌ Location check error:', error)
      alert(error instanceof Error ? error.message : 'Gagal mengecek lokasi. Coba lagi.')
    }
  }

  const confirmCheckIn = async () => {
    if (!tempPhoto || !userLocation) return

    setIsCheckingIn(true)
    try {
      // Use the already checked location
      const position = userLocation
      
      // Prepare form data for API
      const formData = new FormData()
      formData.append('latitude', position.latitude.toString())
      formData.append('longitude', position.longitude.toString())
      formData.append('status_kehadiran', 'hadir')
      
      // Convert base64 to blob and append to form data
      const photoBlob = dataURLtoBlob(tempPhoto)
      formData.append('foto_evidence_masuk', photoBlob, 'checkin_photo.jpg')
      
      console.log('📤 Sending check-in data:', {
        latitude: position.latitude,
        longitude: position.longitude,
        distance: distanceToSchool ? `${distanceToSchool.toFixed(2)}m` : 'unknown'
      })
      
      // Call API - use different endpoint for orang_tua
      let response
      if (user?.tipe_user === 'orang_tua') {
        console.log('📤 Using orang tua API for check-in')
        response = await orangTuaAPI.checkInAnak(formData)
      } else {
        console.log('📤 Using regular API for check-in')
        response = await absensiAPI.checkIn(formData)
      }
      
      if (response.success) {
        setTodayCheckedIn(true)
        setCheckInPhoto(tempPhoto)
        setCheckInTime(new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit'
        }))
        
        setShowCheckInCamera(false)
        setTempPhoto(null)
        
        const successMessage = user?.tipe_user === 'orang_tua' 
          ? '✅ Absensi masuk anak berhasil dicatat!'
          : `✅ Absensi masuk berhasil!\n\nJarak dari sekolah: ${distanceToSchool ? distanceToSchool.toFixed(0) + ' meter' : 'unknown'}`
        
        alert(successMessage)
        
        // Refresh attendance records after successful check-in
        loadAttendanceRecords()
      } else {
        // Handle specific error messages from API
        if (response.message && response.message.includes('sudah melakukan absensi')) {
          alert(`ℹ️ ${response.message}\n\nData absensi sudah tercatat untuk hari ini.`)
        } else {
          throw new Error(response.message || 'Absensi gagal')
        }
      }
    } catch (error) {
      console.error('Check-in error:', error)
      alert(error instanceof Error ? error.message : 'Absensi masuk gagal. Coba lagi.')
    } finally {
      setIsCheckingIn(false)
    }
  }

  const confirmCheckOut = async () => {
    if (!tempPhoto || !userLocation) return

    setIsCheckingOut(true)
    try {
      // Use the already checked location
      const position = userLocation
      
      // Prepare form data for API
      const formData = new FormData()
      formData.append('latitude', position.latitude.toString())
      formData.append('longitude', position.longitude.toString())
      
      // Convert base64 to blob and append to form data
      const photoBlob = dataURLtoBlob(tempPhoto)
      formData.append('foto_evidence_pulang', photoBlob, 'checkout_photo.jpg')
      
      console.log('📤 Sending check-out data:', {
        latitude: position.latitude,
        longitude: position.longitude,
        distance: distanceToSchool ? `${distanceToSchool.toFixed(2)}m` : 'unknown'
      })
      
      // Call API - use different endpoint for orang_tua
      let response
      if (user?.tipe_user === 'orang_tua') {
        console.log('📤 Using orang tua API for check-out')
        response = await orangTuaAPI.checkOutAnak(formData)
      } else {
        console.log('📤 Using regular API for check-out')
        response = await absensiAPI.checkOut(formData)
      }
      
      if (response.success) {
        setTodayCheckedOut(true)
        setCheckOutPhoto(tempPhoto)
        setCheckOutTime(new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit'
        }))
        
        setShowCheckOutCamera(false)
        setTempPhoto(null)
        
        const successMessage = user?.tipe_user === 'orang_tua' 
          ? '✅ Absensi pulang anak berhasil dicatat!'
          : `✅ Absensi pulang berhasil!\n\nJarak dari sekolah: ${distanceToSchool ? distanceToSchool.toFixed(0) + ' meter' : 'unknown'}`
        
        alert(successMessage)
        
        // Refresh attendance records after successful check-out
        loadAttendanceRecords()
      } else {
        // Handle specific error messages from API
        if (response.message && response.message.includes('sudah melakukan absensi')) {
          alert(`ℹ️ ${response.message}\n\nData absensi sudah tercatat untuk hari ini.`)
        } else {
          throw new Error(response.message || 'Absensi gagal')
        }
      }
    } catch (error) {
      console.error('Check-out error:', error)
      alert(error instanceof Error ? error.message : 'Absensi pulang gagal. Coba lagi.')
    } finally {
      setIsCheckingOut(false)
    }
  }

  // Helper functions
  const dataURLtoBlob = (dataURL: string): Blob => {
    const arr = dataURL.split(',')
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  }

  // Function to calculate distance between two coordinates using Haversine formula
  // DISABLED: Distance calculation is no longer used
  // const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  //   const R = 6371e3 // Earth's radius in meters
  //   const φ1 = (lat1 * Math.PI) / 180
  //   const φ2 = (lat2 * Math.PI) / 180
  //   const Δφ = ((lat2 - lat1) * Math.PI) / 180
  //   const Δλ = ((lon2 - lon1) * Math.PI) / 180

  //   const a =
  //     Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
  //     Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  //   return R * c // Distance in meters
  // }

  // Function to check location and distance to school
  // Different rules for different user types
  const checkLocationAndDistance = async (): Promise<{latitude: number, longitude: number, distance: number, allowed: boolean}> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation tidak didukung browser ini'))
        return
      }

      setLocationStatus('checking')
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude
          const userLon = position.coords.longitude
          const distance = 0 // Distance calculation disabled
          
          console.log('📍 User location:', { lat: userLat, lon: userLon })
          console.log('👤 User type:', user?.tipe_user)
          
          setUserLocation({ latitude: userLat, longitude: userLon })
          setDistanceToSchool(distance)
          
          // Location rules based on user type:
          // - orang_tua: Can attend from anywhere (no location restriction)
          // - guru: Can attend from anywhere (flexible for teachers)
          // - siswa: Location verification disabled for now
          let allowed = true
          
          if (user?.tipe_user === 'orang_tua') {
            console.log('👨‍👩‍👧‍👦 Orang tua can attend from anywhere')
            allowed = true
          } else if (user?.tipe_user === 'guru') {
            console.log('👨‍🏫 Guru can attend with flexible location')
            allowed = true
          } else {
            console.log('👨‍🎓 Siswa attendance - location check disabled')
            allowed = true
          }
          
          setLocationStatus(allowed ? 'allowed' : 'too-far')
          
          resolve({
            latitude: userLat,
            longitude: userLon,
            distance,
            allowed
          })
        },
        (_error: GeolocationPositionError) => {
          setLocationStatus('error')
          reject(new Error('Tidak dapat mengakses lokasi. Pastikan GPS aktif dan izin lokasi diberikan.'))
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 30000
        }
      )
    })
  }

  // Load attendance records with date range
  const loadAttendanceRecords = async (start?: Date, end?: Date) => {
    try {
      setIsLoadingRecords(true)
      console.log('🔄 Loading attendance records...')
      const startDate = start || dateRange[0].startDate
      let endDate = end || dateRange[0].endDate
      // Set endDate to end of day to ensure inclusion
      endDate = new Date(endDate)
      endDate.setHours(23, 59, 59, 999)
      const response = await absensiAPI.getAttendanceHistory(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      )
      
      if (response.success && response.data) {
        const data = response.data as any
        if (Array.isArray(data.riwayat)) {
          setAttendanceRecords(data.riwayat)
        } else {
          setAttendanceRecords([])
        }
        setAttendanceStats(data.statistik || {})
      } else {
        setAttendanceRecords([])
        setAttendanceStats({})
      }
    } catch (error) {
      setAttendanceRecords([])
    } finally {
      setIsLoadingRecords(false)
    }
  }

  // Load today's attendance status on component mount
  useEffect(() => {
    const loadTodayAttendance = async () => {
      try {
        const response = await absensiAPI.getTodayAttendance()
        if (response.success && response.data) {
          const todayData = (response.data as any).absensi
          if (todayData && todayData.jam_masuk) {
            setTodayCheckedIn(true)
            setCheckInTime(todayData.jam_masuk)
          } else {
            setTodayCheckedIn(false)
            setCheckInTime(null)
          }
          if (todayData && todayData.jam_pulang) {
            setTodayCheckedOut(true)
            setCheckOutTime(todayData.jam_pulang)
          } else {
            setTodayCheckedOut(false)
            setCheckOutTime(null)
          }
        }
      } catch (error) {}
    }
    loadTodayAttendance()
    loadAttendanceRecords()
    checkLocationAndDistance().catch(() => {})
  }, [])

  // Reload attendance records when dateRange changes
  useEffect(() => {
    loadAttendanceRecords()
  }, [dateRange])

  // Load detailed attendance record
  const loadAttendanceDetail = async (absensiId: number) => {
    try {
      setIsLoadingDetail(true)
      console.log('🔄 Loading attendance detail for ID:', absensiId)
      
      const response = await absensiAPI.getAttendanceDetail(absensiId.toString())
      
      if (response.success && response.data) {
        setSelectedDetail(response.data)
        setShowDetailModal(true)
      } else {
        alert('❌ Gagal memuat detail absensi')
      }
    } catch (error) {
      console.error('❌ Error loading attendance detail:', error)
      alert('❌ Terjadi kesalahan saat memuat detail')
    } finally {
      setIsLoadingDetail(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return '#10b981'
      case 'late': return COLORS.accent
      case 'absent': return '#ef4444'
      case 'sick': return '#8b5cf6'
      case 'permission': return '#06b6d4'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return CheckCircle
      case 'late': return AlertCircle
      case 'absent': return XCircle
      case 'sick': return AlertCircle
      case 'permission': return Clock
      default: return Clock
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present': return 'Hadir'
      case 'late': return 'Terlambat'
      case 'absent': return 'Alpha'
      case 'sick': return 'Sakit'
      case 'permission': return 'Izin'
      default: return 'Unknown'
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
              {user?.tipe_user === 'orang_tua' 
                ? 'Absensi Anak'
                : user?.tipe_user === 'guru'
                ? 'Kelola Absensi'
                : 'Absensi'
              }
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#666',
              margin: 0
            }}>
              {user?.tipe_user === 'orang_tua' 
                ? 'Lakukan absensi untuk anak dari mana saja'
                : user?.tipe_user === 'guru'
                ? 'Kelola kehadiran siswa di kelas Anda'
                : 'Kelola kehadiran harian Anda'
              }
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
        {/* Check-in Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: COLORS.white,
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div style={{
            textAlign: 'center',
            marginBottom: '30px'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent})`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
            }}>
              <Clock size={48} color="white" />
            </div>

            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: COLORS.primary,
              margin: '0 0 10px 0'
            }}>
              {user?.tipe_user === 'orang_tua' 
                ? 'Absensi Anak Hari Ini'
                : user?.tipe_user === 'guru'
                ? 'Absensi Guru Hari Ini'
                : 'Absensi Hari Ini'
              }
            </h2>

            <p style={{
              fontSize: '16px',
              color: '#666',
              margin: '0 0 25px 0'
            }}>
              {user?.tipe_user === 'orang_tua' 
                ? 'Catat kehadiran anak Anda dengan mudah dari lokasi manapun'
                : user?.tipe_user === 'guru'
                ? 'Catat kehadiran Anda sebagai guru dan kelola absensi siswa'
                : 'Catat waktu masuk dan keluar sekolah Anda'
              }
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              fontSize: '14px',
              color: '#888',
              marginBottom: '25px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={16} />
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} />
                {new Date().toLocaleTimeString('id-ID', { 
                  hour: '2-digit', 
                  minute: '2-digit'
                })}
              </div>
            </div>

            {/* Location Status Display */}
            {distanceToSchool !== null && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '15px',
                borderRadius: '12px',
                marginBottom: '25px',
                background: locationStatus === 'allowed' ? '#10b98115' : 
                          locationStatus === 'too-far' ? '#ef444415' : 
                          locationStatus === 'error' ? '#ef444415' : '#f3f4f6',
                border: `2px solid ${locationStatus === 'allowed' ? '#10b981' : 
                                    locationStatus === 'too-far' ? '#ef4444' : 
                                    locationStatus === 'error' ? '#ef4444' : '#e5e7eb'}`
              }}>
                <MapPin size={18} color={
                  locationStatus === 'allowed' ? '#10b981' : 
                  locationStatus === 'too-far' ? '#ef4444' : 
                  locationStatus === 'error' ? '#ef4444' : '#666'
                } />
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: locationStatus === 'allowed' ? '#10b981' : 
                        locationStatus === 'too-far' ? '#ef4444' : 
                        locationStatus === 'error' ? '#ef4444' : '#666'
                }}>
                  {locationStatus === 'checking' ? 'Mengecek lokasi...' :
                   locationStatus === 'allowed' ? `✅ Lokasi terverifikasi` :
                   locationStatus === 'too-far' ? `⚠️ Lokasi tidak sesuai` :
                   '❌ Gagal mengakses lokasi'}
                </div>
              </div>
            )}
          </div>

          {/* Attendance Status */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {/* Check In Status */}
            <div style={{
              padding: '20px',
              borderRadius: '15px',
              background: todayCheckedIn ? '#10b98115' : '#f3f4f6',
              border: `2px solid ${todayCheckedIn ? '#10b981' : '#e5e7eb'}`,
              textAlign: 'center'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: todayCheckedIn ? '#10b981' : '#9ca3af',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px auto'
              }}>
                <CheckCircle size={24} color="white" />
              </div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: COLORS.primary,
                margin: '0 0 5px 0'
              }}>
                Absen Masuk
              </h4>
              <p style={{
                fontSize: '14px',
                color: todayCheckedIn ? '#10b981' : '#666',
                margin: 0,
                fontWeight: '500'
              }}>
                {todayCheckedIn ? `Tercatat: ${checkInTime}` : 'Belum absen'}
              </p>
            </div>

            {/* Check Out Status */}
            <div style={{
              padding: '20px',
              borderRadius: '15px',
              background: todayCheckedOut ? '#10b98115' : '#f3f4f6',
              border: `2px solid ${todayCheckedOut ? '#10b981' : '#e5e7eb'}`,
              textAlign: 'center'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: todayCheckedOut ? '#10b981' : '#9ca3af',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px auto'
              }}>
                <CheckCircle size={24} color="white" />
              </div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: COLORS.primary,
                margin: '0 0 5px 0'
              }}>
                Absen Keluar
              </h4>
              <p style={{
                fontSize: '14px',
                color: todayCheckedOut ? '#10b981' : '#666',
                margin: 0,
                fontWeight: '500'
              }}>
                {todayCheckedOut ? `Tercatat: ${checkOutTime}` : 'Belum absen'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px'
          }}>
            {/* Check In Button */}
            <button
              onClick={handleCheckIn}
              disabled={isCheckingIn || todayCheckedIn || locationStatus === 'too-far' || locationStatus === 'error'}
              style={{
                background: (isCheckingIn || todayCheckedIn || locationStatus === 'too-far' || locationStatus === 'error')
                  ? '#9ca3af' 
                  : `linear-gradient(45deg, ${COLORS.primary}, #1e40af)`,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '15px 20px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: (isCheckingIn || todayCheckedIn || locationStatus === 'too-far' || locationStatus === 'error') ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isCheckingIn ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Memproses...
                </>
              ) : todayCheckedIn ? (
                <>
                  <CheckCircle size={20} />
                  Sudah Absen Masuk
                </>
              ) : locationStatus === 'too-far' ? (
                <>
                  <MapPin size={20} />
                  Terlalu Jauh dari Sekolah
                </>
              ) : locationStatus === 'error' ? (
                <>
                  <XCircle size={20} />
                  Gagal Akses Lokasi
                </>
              ) : locationStatus === 'checking' ? (
                <>
                  <Clock size={20} />
                  Mengecek Lokasi...
                </>
              ) : (
                <>
                  <Camera size={20} />
                  Absen Masuk
                </>
              )}
            </button>

            {/* Check Out Button */}
            <button
              onClick={handleCheckOut}
              disabled={isCheckingOut || todayCheckedOut || !todayCheckedIn || locationStatus === 'too-far' || locationStatus === 'error'}
              style={{
                background: (isCheckingOut || todayCheckedOut || !todayCheckedIn || locationStatus === 'too-far' || locationStatus === 'error')
                  ? '#9ca3af' 
                  : `linear-gradient(45deg, ${COLORS.accent}, #d97706)`,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '15px 20px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: (isCheckingOut || todayCheckedOut || !todayCheckedIn || locationStatus === 'too-far' || locationStatus === 'error') ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isCheckingOut ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Memproses...
                </>
              ) : todayCheckedOut ? (
                <>
                  <CheckCircle size={20} />
                  Sudah Absen Keluar
                </>
              ) : !todayCheckedIn ? (
                <>
                  <XCircle size={20} />
                  Absen Masuk Dulu
                </>
              ) : locationStatus === 'too-far' ? (
                <>
                  <MapPin size={20} />
                  Terlalu Jauh dari Sekolah
                </>
              ) : locationStatus === 'error' ? (
                <>
                  <XCircle size={20} />
                  Gagal Akses Lokasi
                </>
              ) : locationStatus === 'checking' ? (
                <>
                  <Clock size={20} />
                  Mengecek Lokasi...
                </>
              ) : (
                <>
                  <Camera size={20} />
                  Absen Keluar
                </>
              )}
            </button>
          </div>

          {/* Completed Photos Display - Only show after attendance is done */}
          {(checkInPhoto || checkOutPhoto) && (
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              marginTop: '30px',
              paddingTop: '30px',
              borderTop: '2px solid #f3f4f6'
            }}>
              {checkInPhoto && (
                <div style={{
                  textAlign: 'center'
                }}>
                  <h5 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: COLORS.primary,
                    margin: '0 0 10px 0'
                  }}>
                    Foto Absen Masuk
                  </h5>
                  <img 
                    src={checkInPhoto} 
                    alt="Completed check-in selfie"
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      border: '2px solid #10b981'
                    }}
                  />
                  <p style={{
                    fontSize: '12px',
                    color: '#10b981',
                    margin: '8px 0 0 0',
                    fontWeight: '500'
                  }}>
                    ✓ Tersimpan
                  </p>
                </div>
              )}
              
              {checkOutPhoto && (
                <div style={{
                  textAlign: 'center'
                }}>
                  <h5 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: COLORS.primary,
                    margin: '0 0 10px 0'
                  }}>
                    Foto Absen Keluar
                  </h5>
                  <img 
                    src={checkOutPhoto} 
                    alt="Completed check-out selfie"
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      border: '2px solid #10b981'
                    }}
                  />
                  <p style={{
                    fontSize: '12px',
                    color: '#10b981',
                    margin: '8px 0 0 0',
                    fontWeight: '500'
                  }}>
                    ✓ Tersimpan
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Info Text */}
          <div style={{
            marginTop: '20px',
            textAlign: 'center',
            fontSize: '14px',
            color: '#666',
            fontStyle: 'italic'
          }}>
            {locationStatus === 'checking' ? 
              '📍 Sedang mengecek lokasi Anda...' :
              locationStatus === 'too-far' ?
              `⚠️ Lokasi Anda tidak sesuai. Silakan coba lagi.` :
              locationStatus === 'error' ?
              '❌ Tidak dapat mengakses lokasi. Pastikan GPS aktif dan izin lokasi diberikan.' :
              !todayCheckedIn ? 
              user?.tipe_user === 'orang_tua' 
                ? `✅ Anda dapat melakukan absensi anak dari lokasi manapun. Klik "Absen Masuk" untuk mengambil foto dan melakukan absensi.`
                : user?.tipe_user === 'guru'
                ? `✅ Lokasi terverifikasi. Klik "Absen Masuk" untuk mengambil foto dan melakukan absensi guru.`
                : `✅ Lokasi terverifikasi. Klik "Absen Masuk" untuk mengambil foto selfie dan melakukan absensi.` :
              !todayCheckedOut ?
              user?.tipe_user === 'orang_tua' 
                ? `✅ Klik "Absen Keluar" untuk mengambil foto dan melakukan absensi keluar anak.`
                : `✅ Klik "Absen Keluar" untuk mengambil foto selfie dan melakukan absensi keluar.` :
              user?.tipe_user === 'orang_tua'
                ? '🎉 Absensi anak hari ini telah lengkap. Terima kasih!'
                : '🎉 Absensi hari ini telah lengkap dengan foto selfie dan verifikasi lokasi. Terima kasih!'
            }
          </div>
        </motion.div>

        {/* Recent Records */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            background: COLORS.white,
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: COLORS.primary,
              margin: 0
            }}>
              Riwayat Absensi
            </h3>
            <motion.button
              onClick={() => setShowCalendar((v) => !v)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: showCalendar 
                  ? `linear-gradient(135deg, ${COLORS.accent}, #e67e22)` 
                  : `linear-gradient(135deg, ${COLORS.primary}, #1e40af)`,
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 16px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: showCalendar 
                  ? '0 4px 20px rgba(244, 163, 0, 0.3)' 
                  : '0 4px 20px rgba(15, 76, 92, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              <Calendar size={18} />
              {showCalendar ? 'Tutup Filter' : 'Filter Tanggal'}
            </motion.button>
          </div>
          
          {/* Statistics - More Compact */}
          {attendanceStats && Object.keys(attendanceStats).length > 0 && (
            <div className="statistics-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <div className="stat-card" style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: '10px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div className="stat-number" style={{ fontSize: '18px', fontWeight: '700' }}>{attendanceStats.hadir || 0}</div>
                <div className="stat-label" style={{ fontSize: '10px', opacity: 0.9 }}>Hadir</div>
              </div>
              <div className="stat-card" style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                padding: '10px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div className="stat-number" style={{ fontSize: '18px', fontWeight: '700' }}>{attendanceStats.izin || 0}</div>
                <div className="stat-label" style={{ fontSize: '10px', opacity: 0.9 }}>Izin</div>
              </div>
              <div className="stat-card" style={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                color: 'white',
                padding: '10px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div className="stat-number" style={{ fontSize: '18px', fontWeight: '700' }}>{attendanceStats.sakit || 0}</div>
                <div className="stat-label" style={{ fontSize: '10px', opacity: 0.9 }}>Sakit</div>
              </div>
              <div className="stat-card" style={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white',
                padding: '10px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div className="stat-number" style={{ fontSize: '18px', fontWeight: '700' }}>{attendanceStats.alpa || 0}</div>
                <div className="stat-label" style={{ fontSize: '10px', opacity: 0.9 }}>Alpa</div>
              </div>
              <div className="stat-card" style={{
                background: `linear-gradient(135deg, ${COLORS.primary}, #1e40af)`,
                color: 'white',
                padding: '10px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div className="stat-number" style={{ fontSize: '18px', fontWeight: '700' }}>{attendanceStats.persentase_kehadiran || 0}%</div>
                <div className="stat-label" style={{ fontSize: '10px', opacity: 0.9 }}>Kehadiran</div>
              </div>
            </div>
          )}
          {showCalendar && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ 
                marginBottom: 20,
                width: '100%'
              }}
            >
              <div style={{
                background: COLORS.white,
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                padding: '16px',
                border: `1px solid #e5e7eb`,
                width: '100%'
              }}>
                <DateRange
                  editableDateInputs={true}
                  onChange={(rangesByKey: any) => setDateRange([rangesByKey.selection])}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                  maxDate={today}
                  locale={undefined}
                />
              </div>
            </motion.div>
          )}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {isLoadingRecords ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px',
                color: '#666'
              }}>
                <div>Memuat riwayat absensi...</div>
              </div>
            ) : attendanceRecords.length > 0 ? (
              attendanceRecords.slice(0, 10).map((record, index) => {
                // Update status logic based on actual API response
                let status = 'unknown'
                if (record.status_kehadiran === 'hadir') {
                  status = record.status_keterlambatan === 'telat' ? 'late' : 'present'
                } else if (record.status_kehadiran === 'alpa') {
                  status = 'absent'
                } else if (record.status_kehadiran === 'sakit') {
                  status = 'sick'
                } else if (record.status_kehadiran === 'izin') {
                  status = 'permission'
                }
                
                const StatusIcon = getStatusIcon(status)
                const statusColor = getStatusColor(status)
                const timeIn = record.jam_masuk || '-'
                const timeOut = record.jam_pulang || '-'
                const formattedDate = new Date(record.tanggal).toLocaleDateString('id-ID', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short'
                })
                return (
                  <motion.div
                    key={record.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => loadAttendanceDetail(record.id)}
                    className="attendance-record"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '15px',
                      background: COLORS.white,
                      borderRadius: '12px',
                      border: `1px solid ${statusColor}30`,
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Status Icon - Smaller */}
                    <div className="attendance-icon" style={{
                      width: '40px',
                      height: '40px',
                      background: statusColor,
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <StatusIcon size={20} color="white" />
                    </div>

                    {/* Main Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '4px'
                      }}>
                        <h4 style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: COLORS.primary,
                          margin: 0
                        }}>
                          {getStatusText(status)}
                        </h4>
                        <span style={{
                          fontSize: '12px',
                          color: '#666',
                          fontWeight: '500'
                        }}>
                          {formattedDate}
                        </span>
                      </div>
                      
                      {/* Simple Time Display */}
                      <div className="attendance-time" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '12px',
                        color: '#666'
                      }}>
                        <span>Masuk: <strong>{timeIn}</strong></span>
                        <span>•</span>
                        <span>Pulang: <strong>{timeOut}</strong></span>
                        {record.status_keterlambatan === 'telat' && (
                          <>
                            <span>•</span>
                            <span style={{ color: COLORS.accent, fontWeight: '600' }}>Terlambat</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    <div style={{
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <ChevronRight size={16} color="#999" />
                    </div>
                  </motion.div>
                )
              })
            ) : (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px',
                color: '#666'
              }}>
                <div>Belum ada riwayat absensi</div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Camera Modal */}
      {(showCheckInCamera || showCheckOutCamera) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: COLORS.white,
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            textAlign: 'center',
            position: 'relative'
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: COLORS.primary,
              margin: '0 0 20px 0'
            }}>
              Ambil Foto Selfie
            </h3>
            
            <p style={{
              fontSize: '16px',
              color: '#666',
              margin: '0 0 20px 0'
            }}>
              Pastikan wajah Anda terlihat jelas dalam frame
            </p>

            <div style={{
              position: 'relative',
              marginBottom: '20px'
            }}>
              {tempPhoto ? (
                // Tampilkan foto yang sudah diambil
                <img
                  src={tempPhoto}
                  alt="Captured selfie"
                  style={{
                    width: '300px',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '15px',
                    border: '3px solid ' + COLORS.primary
                  }}
                />
              ) : (
                // Tampilkan live camera
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={{
                    width: '300px',
                    height: '300px',
                    objectFit: 'cover',
                    borderRadius: '15px',
                    border: '3px solid ' + COLORS.primary
                  }}
                />
              )}
              <canvas
                ref={canvasRef}
                style={{ display: 'none' }}
              />
            </div>

            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center'
            }}>
              <button
                onClick={cancelCamera}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <XCircle size={20} />
                Batal
              </button>
              
              {tempPhoto ? (
                // Jika foto sudah diambil, tampilkan tombol Retake dan Submit
                <>
                  <button
                    onClick={() => retakePhoto()}
                    style={{
                      background: COLORS.accent,
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px 20px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <RotateCcw size={20} />
                    Ambil Ulang
                  </button>
                  
                  <button
                    onClick={submitAbsence}
                    style={{
                      background: `linear-gradient(45deg, #10b981, #059669)`,
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px 20px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <CheckCircle size={20} />
                    Submit Absen
                  </button>
                </>
              ) : (
                // Jika belum ada foto, tampilkan tombol Ambil Foto
                <button
                  onClick={() => capturePhoto()}
                  style={{
                    background: `linear-gradient(45deg, ${COLORS.primary}, ${COLORS.accent})`,
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Camera size={20} />
                  Ambil Foto
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations & Custom Styling */}
      <style>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes slideInDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        /* Custom Calendar Styling - Simple & Clean */
        .rdrCalendarWrapper {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
          box-shadow: none !important;
          border: none !important;
          background: transparent !important;
          width: 100% !important;
        }
        
        .rdrDateRangeWrapper {
          background: transparent !important;
          width: 100% !important;
        }
        
        .rdrMonth {
          background: transparent !important;
          width: 100% !important;
        }
        
        .rdrMonthAndYearWrapper {
          background-color: #f8fafc !important;
          border-bottom: 1px solid #e2e8f0 !important;
          padding: 12px !important;
        }
        
        .rdrMonthAndYearPickers {
          font-weight: 600 !important;
          color: #334155 !important;
        }
        
        .rdrNextPrevButton {
          background-color: #f1f5f9 !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 6px !important;
        }
        
        .rdrNextPrevButton:hover {
          background-color: #e2e8f0 !important;
        }
        
        .rdrWeekDay {
          color: #64748b !important;
          font-weight: 500 !important;
          font-size: 13px !important;
        }
        
        .rdrDay {
          border-radius: 6px !important;
        }
        
        .rdrDayNumber span {
          color: #334155 !important;
          font-weight: 400 !important;
        }
        
        .rdrDayToday .rdrDayNumber span {
          background-color: #3b82f6 !important;
          color: white !important;
          font-weight: 600 !important;
        }
        
        .rdrDayActive .rdrDayNumber span {
          background-color: #1e40af !important;
          color: white !important;
        }
        
        .rdrInRange {
          background-color: #dbeafe !important;
        }
        
        .rdrStartEdge, .rdrEndEdge {
          background-color: #3b82f6 !important;
        }
        
        .rdrStartEdge .rdrDayNumber span, .rdrEndEdge .rdrDayNumber span {
          background-color: transparent !important;
          color: white !important;
        }
        
        .rdrDayHovered .rdrDayNumber span {
          background-color: #f1f5f9 !important;
          color: #1e40af !important;
        }
        
        .rdrDayDisabled .rdrDayNumber span {
          color: #cbd5e1 !important;
        }
        
        .rdrInputRanges {
          display: none !important;
        }
        
        .rdrStaticRanges {
          display: none !important;
        }
        
        /* Simple responsive styling */
        @media (max-width: 768px) {
          .attendance-record {
            padding: 12px !important;
            gap: 12px !important;
          }
          
          .attendance-icon {
            width: 32px !important;
            height: 32px !important;
          }
          
          .statistics-grid {
            grid-template-columns: repeat(auto-fit, minmax(60px, 1fr)) !important;
            gap: 6px !important;
          }
          
          .stat-card {
            padding: 8px !important;
          }
          
          .stat-number {
            font-size: 16px !important;
          }
          
          .stat-label {
            font-size: 9px !important;
          }
        }
        
        @media (max-width: 480px) {
          .rdrCalendarWrapper {
            width: 100% !important;
          }
          
          .attendance-record {
            padding: 10px !important;
            gap: 10px !important;
          }
          
          .attendance-time {
            font-size: 11px !important;
          }
        }
      `}</style>
      
      {/* Detail Modal */}
      <AttendanceDetailModal
        detail={selectedDetail}
        isVisible={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        isLoading={isLoadingDetail}
      />
    </div>
  )
}

export default AttendancePage
