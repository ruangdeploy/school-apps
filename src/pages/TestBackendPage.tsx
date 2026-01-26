import React, { useState } from 'react'
import { authAPI, absensiAPI } from '../services/api'

const TestBackendPage: React.FC = () => {
  const [testResults, setTestResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addTestResult = (name: string, success: boolean, data: any, error?: string) => {
    setTestResults(prev => [...prev, {
      name,
      success,
      data,
      error,
      timestamp: new Date().toLocaleTimeString()
    }])
  }

  const testBackendConnection = async () => {
    setIsLoading(true)
    setTestResults([])

    // Test 1: Basic API connection
    try {
      const response = await fetch('http://localhost:3000/')
      const data = await response.json()
      addTestResult('Basic API Connection', true, data)
    } catch (error) {
      addTestResult('Basic API Connection', false, null, error instanceof Error ? error.message : 'Unknown error')
    }

    // Test 2: Login with dummy account
    try {
      const loginResponse = await authAPI.login({
        email: 'andika.anggakusuma90@gmail.com',
        password: 'password123'
      })
      addTestResult('Login (Siswa)', loginResponse.success, loginResponse.data, loginResponse.message)
      
      // If login successful, test attendance API
      if (loginResponse.success) {
        // Test 3: Get today's attendance
        try {
          const attendanceResponse = await absensiAPI.getTodayAttendance()
          addTestResult('Get Today Attendance', attendanceResponse.success, attendanceResponse.data)
        } catch (error) {
          addTestResult('Get Today Attendance', false, null, error instanceof Error ? error.message : 'Unknown error')
        }
      }
    } catch (error) {
      addTestResult('Login (Siswa)', false, null, error instanceof Error ? error.message : 'Unknown error')
    }

    setIsLoading(false)
  }

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ color: 'rgb(15, 76, 92)', marginBottom: '2rem' }}>
        Backend Integration Test
      </h1>

      <button
        onClick={testBackendConnection}
        disabled={isLoading}
        style={{
          background: 'rgb(15, 76, 92)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 24px',
          fontSize: '16px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          marginBottom: '2rem'
        }}
      >
        {isLoading ? 'Testing...' : 'Test Backend Connection'}
      </button>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {testResults.map((result, index) => (
          <div
            key={index}
            style={{
              padding: '1rem',
              borderRadius: '8px',
              border: `2px solid ${result.success ? '#10b981' : '#ef4444'}`,
              backgroundColor: result.success ? '#f0fdf4' : '#fef2f2'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <h3 style={{
                margin: 0,
                color: result.success ? '#065f46' : '#991b1b'
              }}>
                {result.name}
              </h3>
              <span style={{
                fontSize: '12px',
                color: '#666'
              }}>
                {result.timestamp}
              </span>
            </div>
            
            <div style={{
              fontSize: '14px',
              color: result.success ? '#065f46' : '#991b1b',
              marginBottom: '0.5rem'
            }}>
              Status: {result.success ? '✅ Success' : '❌ Failed'}
            </div>

            {result.error && (
              <div style={{
                fontSize: '14px',
                color: '#991b1b',
                marginBottom: '0.5rem'
              }}>
                Error: {result.error}
              </div>
            )}

            {result.data && (
              <details style={{ marginTop: '0.5rem' }}>
                <summary style={{ cursor: 'pointer', fontSize: '14px' }}>
                  Show Response Data
                </summary>
                <pre style={{
                  background: '#f8f9fa',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '12px',
                  overflow: 'auto',
                  maxHeight: '200px',
                  marginTop: '0.5rem'
                }}>
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
        <h3>Backend Status Information:</h3>
        <ul style={{ marginLeft: '1rem' }}>
          <li>Backend URL: http://localhost:3000</li>
          <li>Expected endpoints: /api/auth/login, /api/absensi/hari-ini</li>
          <li>Test accounts available in backend</li>
        </ul>
      </div>
    </div>
  )
}

export default TestBackendPage
