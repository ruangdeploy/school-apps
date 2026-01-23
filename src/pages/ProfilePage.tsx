import { User, ArrowLeft } from 'lucide-react'

const ProfilePage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'rgb(15, 76, 92)',
        color: 'white',
        padding: '1rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <button
            onClick={() => window.history.back()}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              color: 'white'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
            Profil Saya
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: 'rgb(15, 76, 92)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <User size={48} color="white" />
            </div>
            <h2 style={{ 
              color: 'rgb(15, 76, 92)', 
              marginBottom: '0.5rem',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              John Doe
            </h2>
            <p style={{ 
              color: '#666', 
              margin: 0,
              fontSize: '1rem'
            }}>
              Siswa - XII IPA 1
            </p>
          </div>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{
              padding: '1rem',
              backgroundColor: '#f8fafc',
              borderRadius: '12px'
            }}>
              <label style={{ 
                fontSize: '14px', 
                color: '#666', 
                display: 'block', 
                marginBottom: '0.5rem'
              }}>
                Email
              </label>
              <p style={{ 
                color: 'rgb(15, 76, 92)', 
                fontWeight: '500', 
                margin: 0
              }}>
                murid@sekolah.com
              </p>
            </div>

            <div style={{
              padding: '1rem',
              backgroundColor: '#f8fafc',
              borderRadius: '12px'
            }}>
              <label style={{ 
                fontSize: '14px', 
                color: '#666', 
                display: 'block', 
                marginBottom: '0.5rem'
              }}>
                Telepon
              </label>
              <p style={{ 
                color: 'rgb(15, 76, 92)', 
                fontWeight: '500', 
                margin: 0
              }}>
                +62 812-3456-7890
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
