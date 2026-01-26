import React, { useState } from 'react'

const DebugLoginPage: React.FC = () => {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testDirectAPI = async () => {
    setLoading(true)
    setResult('Testing direct API call...')
    
    try {
      console.log('Starting direct API test')
      
      // Test direct fetch to backend
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: 'andika.anggakusuma90@gmail.com',
          password: 'password123'
        })
      })
      
      console.log('Direct fetch response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries())
      })
      
      const data = await response.json()
      console.log('Direct fetch data:', data)
      
      setResult(`Direct API Test Result:
Status: ${response.status} ${response.statusText}
OK: ${response.ok}
URL: ${response.url}

Response Data:
${JSON.stringify(data, null, 2)}`)
      
      if (data.success) {
        // Test storing data and redirect
        localStorage.setItem('accessToken', data.data.token)
        localStorage.setItem('userData', JSON.stringify(data.data.user))
        localStorage.setItem('userType', 'siswa')
        
        setResult(prev => prev + '\n\n✅ Login successful! Redirecting in 2 seconds...')
        
        setTimeout(() => {
          window.location.href = '/home'
        }, 2000)
      }
      
    } catch (error) {
      console.error('Direct API test error:', error)
      setResult(`❌ Direct API Error: 
${error instanceof Error ? error.message : 'Unknown error'}

Error details: ${JSON.stringify(error, null, 2)}`)
    } finally {
      setLoading(false)
    }
  }

  const testViaService = async () => {
    setLoading(true)
    setResult('Testing via service...')
    
    try {
      const { authAPI } = await import('../services/api')
      const response = await authAPI.login({
        email: 'andika.anggakusuma90@gmail.com',
        password: 'password123'
      })
      
      console.log('Service API response:', response)
      setResult(`Service API Test Result:\n${JSON.stringify(response, null, 2)}`)
      
    } catch (error) {
      console.error('Service API test error:', error)
      setResult(`Service API Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const clearStorage = () => {
    localStorage.clear()
    setResult('Storage cleared')
  }

  const testBackendConnectivity = async () => {
    setLoading(true)
    setResult('Testing backend connectivity...')
    
    try {
      // Test basic backend connection
      const response = await fetch('http://localhost:3000/', {
        method: 'GET',
        mode: 'cors'
      })
      
      const data = await response.json()
      
      setResult(`Backend Connectivity Test:
Status: ${response.status} ${response.statusText}
Data: ${JSON.stringify(data, null, 2)}`)
      
    } catch (error) {
      setResult(`❌ Backend Connectivity Error: 
${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>Debug Login Page</h1>
      
      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={testBackendConnectivity}
          disabled={loading}
          style={{ 
            padding: '0.5rem 1rem', 
            marginRight: '0.5rem',
            backgroundColor: '#ffc107',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Test Backend Connectivity
        </button>
        
        <button 
          onClick={testDirectAPI}
          disabled={loading}
          style={{ 
            padding: '0.5rem 1rem', 
            marginRight: '0.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Test Direct API Call
        </button>
        
        <button 
          onClick={testViaService}
          disabled={loading}
          style={{ 
            padding: '0.5rem 1rem', 
            marginRight: '0.5rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Test Via Service
        </button>
        
        <button 
          onClick={clearStorage}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear Storage
        </button>
      </div>
      
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        whiteSpace: 'pre-wrap',
        minHeight: '200px'
      }}>
        {result || 'Click a button to test...'}
      </div>
      
      <div style={{ marginTop: '1rem' }}>
        <strong>Current localStorage:</strong>
        <div style={{
          marginTop: '0.5rem',
          padding: '1rem',
          backgroundColor: '#e9ecef',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          whiteSpace: 'pre-wrap'
        }}>
          {JSON.stringify({
            accessToken: localStorage.getItem('accessToken'),
            userData: localStorage.getItem('userData'),
            userType: localStorage.getItem('userType'),
            userEmail: localStorage.getItem('userEmail')
          }, null, 2)}
        </div>
      </div>
    </div>
  )
}

export default DebugLoginPage
