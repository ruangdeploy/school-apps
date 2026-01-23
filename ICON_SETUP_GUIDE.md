# Cara Mengganti Icon dengan Gambar Upload

## Langkah-langkah:

1. **Simpan gambar ke folder assets:**
   - Simpan 3 gambar (teacher.png, parents.png, students.png) ke folder `src/assets/images/`

2. **Import gambar di MultiLoginPage.tsx:**
```javascript
import teacherImage from '../assets/images/teacher.png'
import parentsImage from '../assets/images/parents.png' 
import studentsImage from '../assets/images/students.png'
```

3. **Ganti ilustrasi dengan gambar:**
```javascript
const userTypeConfig = {
  siswa: {
    title: 'Siswa',
    subtitle: 'Masuk sebagai siswa',
    color: 'rgb(15, 76, 92)',
    illustration: (
      <div style={{
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
      }}>
        <img 
          src={studentsImage} 
          alt="Siswa" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>
    )
  },
  guru: {
    title: 'Guru',
    subtitle: 'Masuk sebagai guru', 
    color: 'rgb(34, 139, 34)',
    illustration: (
      <div style={{
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
      }}>
        <img 
          src={teacherImage} 
          alt="Guru" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>
    )
  },
  orangtua: {
    title: 'Orang Tua',
    subtitle: 'Masuk sebagai orang tua',
    color: 'rgb(138, 43, 226)', 
    illustration: (
      <div style={{
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
      }}>
        <img 
          src={parentsImage} 
          alt="Orang Tua" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>
    )
  }
}
```

## Catatan:
- Gambar akan otomatis berbentuk bulat dan memiliki shadow
- objectFit: 'cover' memastikan gambar tidak terdistorsi
- Pastikan nama file sesuai dengan import statement
